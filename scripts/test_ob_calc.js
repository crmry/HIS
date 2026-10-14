'use strict';
const assert = require('assert');
const c = require('../js/ob/ob_calc.js');
const cs = require('../js/ob/cs_indications.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('PASS', name); }
  catch (e) { fail++; console.log('FAIL', name, '-', e.message); }
}

/* Dating */
t('LMP 2026-06-01 -> EDD 2027-03-08', () => assert.strictEqual(c.lmpDating('2026-06-01', null, '2026-06-01').edd, '2027-03-08'));
t('LMP end does not alter GA/EDD', () => {
  const a = c.lmpDating('2026-06-01', null, '2026-08-24');
  const b = c.lmpDating('2026-06-01', '2026-06-03', '2026-08-24');
  assert.deepStrictEqual([a.edd, a.ga], [b.edd, b.ga]);
});
t('LMP GA 12w1d on 2026-08-24', () => {
  const r = c.lmpDating('2026-06-01', null, '2026-08-25');
  assert.strictEqual(r.ga.weeks, 12); assert.strictEqual(r.ga.days, 1);
});
t('Ultrasound 2026-08-14 @ 11w1d -> EDD 2027-03-04', () => assert.strictEqual(c.ultrasoundDating('2026-08-14', 11, 1, '2026-08-14').edd, '2027-03-04'));
t('Ultrasound current GA = scan GA + elapsed', () => {
  const r = c.ultrasoundDating('2026-08-14', 11, 1, '2026-08-24');
  assert.deepStrictEqual([r.ga.weeks, r.ga.days], [12, 4]);
});
t('Leap day and year rollover', () => {
  assert.strictEqual(c.lmpDating('2027-12-01', null, '2027-12-01').edd, '2028-09-06');
  assert.strictEqual(c.lmpDating('2027-06-01', null, '2027-06-01').edd, '2028-03-07');
});
t('Invalid inputs produce issues, no output', () => {
  assert.strictEqual(c.lmpDating('', null, '2026-01-01').valid, false);
  assert.strictEqual(c.lmpDating('2026-02-30', null, '2026-03-01').valid, false);
  assert.ok(c.lmpDating('2026-06-01', '2026-05-01', '2026-07-01').issues.length);
  assert.strictEqual(c.lmpDating('2026-06-01', null, '2026-05-01').ga, null);
  assert.ok(c.ultrasoundDating('2026-08-14', 11, 7, '2026-08-20').issues.length);
  assert.ok(c.ultrasoundDating('2026-08-14', 11, 1, '2026-08-01').issues.length);
  assert.ok(c.ultrasoundDating('2026-08-14', '', 1, '2026-08-20').issues.length);
});

/* GP(TPAL) */
const del = (ga, status, type) => ({ id: 'x' + Math.random(), type: type || 'singleton', status: 'completed', gaWeeks: Math.floor(ga / 7), gaDays: ga % 7, babies: [{ status }] });
const W = (w, d) => w * 7 + (d || 0);
const loss = (ga, type) => ({ id: 'l' + Math.random(), type: type || 'miscarriage', status: 'completed', gaWeeks: Math.floor(ga / 7), gaDays: ga % 7 });
const tw = (ga, s1, s2) => ({ id: 'tw' + Math.random(), type: 'multiple', status: 'completed', gaWeeks: Math.floor(ga / 7), gaDays: ga % 7, babies: [{ status: s1 }, { status: s2 }] });
const sum = (r, o) => { const s = c.calculateObstetricSummary(r, o); return [s.G, s.P, s.FT, s.Pr, s.Ab, s.LB].join(','); };

t('First pregnancy ongoing', () => assert.strictEqual(sum([], { hasPresent: true }), '1,0,0,0,0,0'));
t('Prior 40w + present', () => assert.strictEqual(sum([del(W(40), 'living')], { hasPresent: true }), '2,1,1,0,0,1'));
t('10w loss + 40w + present', () => assert.strictEqual(sum([loss(W(10)), del(W(40), 'living')], { hasPresent: true }), '3,1,1,0,1,1'));
t('38w twins living', () => assert.strictEqual(sum([tw(W(38), 'living', 'living')]), '1,1,1,0,0,2'));
t('35w twins one deceased', () => assert.strictEqual(sum([tw(W(35), 'living', 'deceased')]), '1,1,0,1,0,1'));
t('8w ectopic', () => assert.strictEqual(sum([loss(W(8), 'ectopic')]), '1,0,0,0,1,0'));
t('12w molar', () => assert.strictEqual(sum([loss(W(12), 'molar')]), '1,0,0,0,1,0'));
t('10w loss + 38w twins + present', () => assert.strictEqual(sum([loss(W(10)), tw(W(38), 'living', 'living')], { hasPresent: true }), '3,1,1,0,1,2'));
t('38w delivery child deceased', () => assert.strictEqual(sum([del(W(38), 'deceased')]), '1,1,1,0,0,0'));
t('35w stillbirth', () => assert.strictEqual(sum([del(W(35), 'deceased')]), '1,1,0,1,0,0'));
t('Boundaries 19w6d / 20w0d / 36w6d / 37w0d / 40w0d', () => {
  assert.strictEqual(sum([loss(W(19, 6))]), '1,0,0,0,1,0');
  assert.strictEqual(sum([del(W(20), 'living')]), '1,1,0,1,0,1');
  assert.strictEqual(sum([del(W(36, 6), 'living')]), '1,1,0,1,0,1');
  assert.strictEqual(sum([del(W(37), 'living')]), '1,1,1,0,0,1');
  assert.strictEqual(sum([del(W(40), 'living')]), '1,1,1,0,0,1');
});
t('Unknown GA is flagged, not counted as Ab', () => {
  const s = c.calculateObstetricSummary([{ id: 'u', type: 'singleton', status: 'completed', babies: [{ status: 'living' }] }]);
  assert.strictEqual(s.Ab, 0); assert.strictEqual(s.isComplete, false);
});
t('Inconsistent types flagged', () => {
  assert.strictEqual(c.calculateObstetricSummary([loss(W(22))]).isComplete, false);
  assert.strictEqual(c.calculateObstetricSummary([del(W(18), 'living')]).isComplete, false);
});
t('Unknown baby status preserved as issue', () => {
  const s = c.calculateObstetricSummary([del(W(38), '')]);
  assert.strictEqual(s.LB, 0); assert.strictEqual(s.isComplete, false);
});
t('Legacy seed records (outcome strings, living count)', () => {
  const legacy = [
    { seq: 'P1', year: '2021', outcome: 'Full Term Live Birth', gaWeeks: 39, ga: '39 weeks', living: 1, multiple: 'No (Singleton)' },
    { seq: 'P2', year: '2023', outcome: 'Full Term Live Birth', gaWeeks: 38, ga: '38 weeks', living: 1, multiple: 'No (Singleton)' },
    { seq: 'P3', year: '2025', outcome: 'Spontaneous Abortion / Miscarriage', gaWeeks: 10, ga: '10 weeks', living: 0, term: 'Abortion', multiple: 'No (Singleton)' }
  ];
  assert.strictEqual(sum(legacy), '3,2,2,0,1,2');
  assert.strictEqual(c.calculateObstetricSummary(legacy).isComplete, true);
  // Physician reference scenario: 3 past pregnancies + 1 ongoing present pregnancy -> G4P2(2012)
  const withPresent = c.calculateObstetricSummary(legacy, { hasPresent: true });
  assert.strictEqual([withPresent.G, withPresent.P, withPresent.FT, withPresent.Pr, withPresent.Ab, withPresent.LB].join(','), '4,2,2,0,1,2');
  assert.strictEqual(`G${withPresent.G}P${withPresent.P}(${withPresent.FT}${withPresent.Pr}${withPresent.Ab}${withPresent.LB})`, 'G4P2(2012)');
});
t('Chronological order with month/year', () => {
  const o = c.chronologicalOrder([{ deliveryYear: 2024, deliveryMonth: 5 }, { year: '2020' }, { deliveryYear: 2024, deliveryMonth: 1 }]);
  assert.deepStrictEqual(o.map(x => x.i), [1, 2, 0]);
});

/* CS catalog */
t('CS catalog stable unique ids and classes', () => {
  const ids = cs.list.map(x => x.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  assert.ok(cs.list.every(x => x.cls === 'Planned (Elective)' || x.cls === 'Emergency'));
  assert.ok(cs.byId('OTHER'));
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
