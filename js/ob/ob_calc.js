/*
 * Obstetric calculation engine: LMP / ultrasound dating, dynamic gestational age,
 * legacy record normalization and canonical GP(TPAL) derivation.
 * Pure functions. Date-only (calendar day) arithmetic; no local-time or UTC parsing drift.
 */
(function (root) {
  'use strict';

  var DAY_MS = 86400000;
  var TERM_DAYS = 259;      // 37w0d
  var VIABLE_DAYS = 140;    // 20w0d
  var FULL_DAYS = 280;      // 40w0d

  /* ISO yyyy-mm-dd -> integer day number; null when not a real calendar date */
  function dayNumber(iso) {
    if (iso instanceof Date) {
      return Math.round(Date.UTC(iso.getFullYear(), iso.getMonth(), iso.getDate()) / DAY_MS);
    }
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var t = Date.UTC(y, mo - 1, d);
    var chk = new Date(t);
    if (chk.getUTCFullYear() !== y || chk.getUTCMonth() !== mo - 1 || chk.getUTCDate() !== d) return null;
    return Math.round(t / DAY_MS);
  }

  function isoFromDayNumber(n) {
    if (n === null || n === undefined) return null;
    var d = new Date(n * DAY_MS);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function todayNumber() { return dayNumber(new Date()); }

  function resolveAsOf(asOf) {
    if (asOf === undefined || asOf === null) return todayNumber();
    var n = dayNumber(asOf);
    return n;
  }

  function splitGA(totalDays) {
    if (totalDays === null || totalDays === undefined) return null;
    return { weeks: Math.floor(totalDays / 7), days: totalDays % 7, totalDays: totalDays };
  }

  function formatGA(ga) {
    if (!ga) return '\u2014';
    return ga.weeks + ' week' + (ga.weeks === 1 ? '' : 's') + ' ' + ga.days + ' day' + (ga.days === 1 ? '' : 's');
  }

  /* LMP-based dating. LMP end never influences EDD or GA. */
  function lmpDating(lmpStartIso, lmpEndIso, asOf) {
    var issues = [];
    var start = dayNumber(lmpStartIso);
    if (start === null) return { valid: false, issues: [lmpStartIso ? 'LMP start is not a valid date' : 'LMP start is required'], edd: null, ga: null };
    if (lmpEndIso) {
      var end = dayNumber(lmpEndIso);
      if (end === null) issues.push('LMP end is not a valid date');
      else if (end < start) issues.push('LMP end cannot be earlier than LMP start');
    }
    var now = resolveAsOf(asOf);
    var elapsed = now - start;
    var ga = null;
    if (elapsed < 0) issues.push('LMP start is in the future');
    else ga = splitGA(elapsed);
    return { valid: issues.length === 0, issues: issues, edd: isoFromDayNumber(start + FULL_DAYS), eddDay: start + FULL_DAYS, ga: ga };
  }

  /* Ultrasound-based dating from the GA recorded on the scan date. */
  function ultrasoundDating(scanIso, gaWeeks, gaDays, asOf) {
    var issues = [];
    var scan = dayNumber(scanIso);
    if (scan === null) return { valid: false, issues: [scanIso ? 'Ultrasound date is not a valid date' : 'Ultrasound date is required'], edd: null, ga: null };
    var w = gaWeeks, d = gaDays;
    if (w === '' || w === null || w === undefined || isNaN(+w) || +w < 0 || Math.floor(+w) !== +w) issues.push('Ultrasound GA weeks must be a whole number of 0 or more');
    if (d === '' || d === null || d === undefined || isNaN(+d) || +d < 0 || +d > 6 || Math.floor(+d) !== +d) issues.push('Ultrasound GA days must be 0 to 6');
    if (issues.length) return { valid: false, issues: issues, edd: null, ga: null };
    var scanGA = (+w) * 7 + (+d);
    var now = resolveAsOf(asOf);
    var elapsed = now - scan;
    var ga = null;
    if (elapsed < 0) issues.push('Ultrasound date is after the as-of date');
    else ga = splitGA(scanGA + elapsed);
    return { valid: issues.length === 0, issues: issues, edd: isoFromDayNumber(scan + (FULL_DAYS - scanGA)), eddDay: scan + (FULL_DAYS - scanGA), ga: ga, scanGADays: scanGA };
  }

  /* Difference in days between ultrasound EDD and LMP EDD (informational only). */
  function eddDifferenceDays(lmpRes, usRes) {
    if (!lmpRes || !usRes || lmpRes.eddDay === undefined || usRes.eddDay === undefined) return null;
    return usRes.eddDay - lmpRes.eddDay;
  }

  /* ---------- Legacy normalization (read-time only; never rewrites stored data) ---------- */

  function legacyType(p) {
    if (p.type) return p.type;
    var o = String(p.outcome || '');
    if (/ectopic/i.test(o)) return 'ectopic';
    if (/molar/i.test(o)) return 'molar';
    if (/miscarriage|abortion/i.test(o)) return 'miscarriage';
    var mult = String(p.multiple || '');
    if (mult && !/^no\b/i.test(mult) && !/singleton/i.test(mult)) return 'multiple';
    if (/live birth|stillbirth|iufd|delivery/i.test(o)) return 'singleton';
    return null;
  }

  function parseGaDays(p) {
    if (p.gaWeeks !== undefined && p.gaWeeks !== null && p.gaWeeks !== '' && !isNaN(+p.gaWeeks)) {
      var dd = (p.gaDays !== undefined && p.gaDays !== null && p.gaDays !== '' && !isNaN(+p.gaDays)) ? +p.gaDays : 0;
      return (+p.gaWeeks) * 7 + dd;
    }
    var txt = String(p.ga || '');
    var m = /(\d+)\s*(?:weeks?|wks?|w)\b(?:\s*(?:and\s*)?(\d+)\s*(?:days?|d)\b)?/i.exec(txt);
    if (m) return (+m[1]) * 7 + (m[2] ? +m[2] : 0);
    return null;
  }

  function normalizePregnancy(p, index) {
    var type = legacyType(p);
    var gaTotal = parseGaDays(p);
    var babies = null;
    if (Array.isArray(p.babies)) babies = p.babies;
    return {
      id: p.id || ('legacy-' + (index === undefined ? 0 : index)),
      type: type,
      gaDays: gaTotal,
      babies: babies,
      legacyLiving: (p.living === undefined || p.living === null || p.living === '') ? null : (Number(p.living) || 0),
      status: p.status || 'completed',
      raw: p
    };
  }

  var LOSS_TYPES = { miscarriage: 1, ectopic: 1, molar: 1 };

  /*
   * Canonical GP(TPAL) summary.
   * records: array of stored pregnancy records (legacy or enhanced)
   * opts.hasPresent: true when an ongoing present pregnancy exists (counts toward G only)
   */
  function calculateObstetricSummary(records, opts) {
    opts = opts || {};
    var list = (records || []).map(normalizePregnancy);
    var G = list.length + (opts.hasPresent ? 1 : 0);
    var P = 0, FT = 0, Pr = 0, Ab = 0, LB = 0;
    var issues = [];

    list.forEach(function (n) {
      var label = n.raw.seq || n.id;
      if (n.status === 'ongoing') return;
      if (n.status !== 'completed') { issues.push(label + ': pregnancy completion status unknown'); return; }
      if (!n.type) { issues.push(label + ': pregnancy type needs review'); }

      if (n.gaDays === null) {
        issues.push(label + ': gestational age needs review');
      } else if (LOSS_TYPES[n.type]) {
        if (n.gaDays < VIABLE_DAYS) Ab += 1;
        else issues.push(label + ': loss recorded at 20 weeks or later needs clinical review');
      } else if (n.gaDays >= TERM_DAYS) {
        P += 1; FT += 1;
      } else if (n.gaDays >= VIABLE_DAYS) {
        P += 1; Pr += 1;
      } else if (n.type === 'singleton' || n.type === 'multiple') {
        issues.push(label + ': delivery recorded before 20 weeks needs clinical review');
      } else if (/abortion|miscarriage/i.test(String(n.raw.outcome || '')) || String(n.raw.term || '') === 'Abortion') {
        Ab += 1;
      } else {
        issues.push(label + ': outcome and gestational age are inconsistent');
      }

      if (LOSS_TYPES[n.type]) return;
      if (n.babies) {
        n.babies.forEach(function (b, bi) {
          var s = String(b.status || '').toLowerCase();
          if (s === 'living') LB += 1;
          else if (s !== 'deceased') issues.push(label + ' baby ' + (bi + 1) + ': current status unknown');
        });
      } else if (n.legacyLiving !== null) {
        LB += n.legacyLiving;
      } else if (!LOSS_TYPES[n.type]) {
        issues.push(label + ': living status unknown');
      }
    });

    return { G: G, P: P, FT: FT, Pr: Pr, Ab: Ab, LB: LB, issues: issues, isComplete: issues.length === 0 };
  }

  /* Chronological ordering key: year, month (0 when unknown), then original index. */
  function chronologyKey(p, index) {
    var y = parseInt(p.deliveryYear || p.year, 10);
    var m = parseInt(p.deliveryMonth, 10);
    return [isNaN(y) ? 0 : y, isNaN(m) ? 0 : m, index];
  }

  function chronologicalOrder(records) {
    return records.map(function (p, i) { return { p: p, i: i, k: chronologyKey(p, i) }; })
      .sort(function (a, b) { return a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.k[2] - b.k[2]; });
  }

  var api = {
    TERM_DAYS: TERM_DAYS, VIABLE_DAYS: VIABLE_DAYS, FULL_DAYS: FULL_DAYS,
    dayNumber: dayNumber, isoFromDayNumber: isoFromDayNumber, splitGA: splitGA, formatGA: formatGA,
    lmpDating: lmpDating, ultrasoundDating: ultrasoundDating, eddDifferenceDays: eddDifferenceDays,
    normalizePregnancy: normalizePregnancy, calculateObstetricSummary: calculateObstetricSummary,
    chronologicalOrder: chronologicalOrder
  };

  root.HIS = root.HIS || {};
  root.HIS.obCalc = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
