/* ══════════════════════════════════════════════════════════════════════
   HIS — Unified Clinical Storage & Interoperability Bus
   Client-Side Session Persistence, Cross-Module Handover & Output Generator
   ══════════════════════════════════════════════════════════════════════ */

(function (window) {
  'use strict';

  var HIS = window.HIS = window.HIS || {};

  var KEYS = {
    PATIENTS: 'his_patients_v1',
    OB_PREFIX: 'HIS_OB_GYNE_',
    NEO_PREFIX: 'HIS_NEONATE_',
    ORDERS_DRAFT: 'his_doctors_orders_draft',
    OB_DRAFT_PREFIX: 'his_obgyne_draft_',
    NEO_DRAFT_PREFIX: 'his_neonate_draft_',
    HANDOVERS: 'his_delivery_handovers_v1',
    MONITORING: 'his_chart_monitoring_v1'
  };

  function safeParse(str, fallback) {
    if (!str) return fallback;
    try {
      var parsed = JSON.parse(str);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeStringify(data) {
    try {
      return JSON.stringify(data);
    } catch (e) {
      console.warn('HIS StorageBus stringify error:', e);
      return '{}';
    }
  }

  // In-Memory cache to prevent synchronous parse loops
  var _memCache = {};

  function getLocalItem(key, fallback) {
    if (_memCache.hasOwnProperty(key)) {
      return _memCache[key];
    }
    var raw = localStorage.getItem(key);
    var val = safeParse(raw, fallback);
    _memCache[key] = val;
    return val;
  }

  function setLocalItem(key, val) {
    _memCache[key] = val;
    try {
      localStorage.setItem(key, safeStringify(val));
    } catch (e) {
      console.error('HIS StorageBus write error for key ' + key, e);
    }
    // Broadcast cross-module event within current tab
    if (typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('his:storage-update', { detail: { key: key, value: val } }));
      } catch (evtErr) {}
    }
  }

  // Cross-tab synchronization
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('storage', function (e) {
      if (e && e.key) {
        delete _memCache[e.key];
        if (typeof window.dispatchEvent === 'function') {
          try {
            window.dispatchEvent(new CustomEvent('his:storage-sync', { detail: { key: e.key, newValue: e.newValue } }));
          } catch (evtErr) {}
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────────────
     1. MASTER PATIENT REGISTRY ACCESSORS
     ────────────────────────────────────────────────────────────────────── */
  function getPatientList() {
    if (typeof window.getPatients === 'function' && window.getPatients !== getPatientList) {
      return window.getPatients();
    }
    return getLocalItem(KEYS.PATIENTS, []);
  }

  function savePatientList(records) {
    if (typeof window.savePatients === 'function') {
      window.savePatients(records);
      return;
    }
    setLocalItem(KEYS.PATIENTS, records);
  }

  function getPatientById(patientId) {
    var list = getPatientList();
    if (!Array.isArray(list)) return null;
    return list.find(function (p) { return p.id === patientId; }) || null;
  }

  /* ──────────────────────────────────────────────────────────────────────
     2. DRAFT & TEMPORARY SESSION PERSISTENCE
     ────────────────────────────────────────────────────────────────────── */
  function saveDraft(draftType, patientId, payload) {
    var key = draftType + '_' + (patientId || 'default');
    var envelope = {
      patientId: patientId,
      draftType: draftType,
      updatedAt: new Date().toISOString(),
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      data: payload
    };
    setLocalItem(key, envelope);
    return envelope;
  }

  function getDraft(draftType, patientId) {
    var key = draftType + '_' + (patientId || 'default');
    return getLocalItem(key, null);
  }

  function clearDraft(draftType, patientId) {
    var key = draftType + '_' + (patientId || 'default');
    delete _memCache[key];
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  /* ──────────────────────────────────────────────────────────────────────
     3. MATERNAL-TO-NEONATE DELIVERY INTEROPERABILITY
     Enables a delivery event in maternal care to auto-stage the newborn record
     and update the mother's obstetric history and parity live.
     ────────────────────────────────────────────────────────────────────── */
  function handoverMaternalDelivery(motherPatientId, options) {
    var mId = motherPatientId || 'patient_ob_maria';
    var opts = options || {};

    var motherRec = getPatientById(mId);
    var mData = (motherRec && motherRec.data) || {};

    // 1. Fetch current OB-Gyne state
    var obKey = KEYS.OB_PREFIX + mId;
    var obState = getLocalItem(obKey, null);
    if (!obState) {
      if (typeof window.loadObStateForPatient === 'function') {
        obState = window.loadObStateForPatient(mId);
      } else {
        obState = { pregnancies: [], lmpHistory: [] };
      }
    }

    var deliveryDate = opts.deliveryDate || new Date().toISOString().split('T')[0];
    var deliveryTime = opts.deliveryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    var deliveryMode = opts.mode || 'Normal Spontaneous Delivery (NSD)';
    var babySex = (opts.sex || 'boy').toLowerCase();
    var babyGenderStr = babySex.startsWith('m') || babySex === 'boy' ? 'Boy' : 'Girl';
    var birthWeight = opts.weight || '3100 g';
    var birthLength = opts.length || '50 cm';
    var headCirc = opts.headCirc || '34 cm';
    var apgar1 = Number(opts.apgar1) || 8;
    var apgar5 = Number(opts.apgar5) || 9;
    var attendant = opts.attendant || (mData.attending_physician && mData.attending_physician.name) || 'Liza Garcia, MD';
    var complications = opts.complications || 'None / Uncomplicated maternal intrapartum course.';

    var motherLastName = (mData.last_name || 'SANTOS').toUpperCase();
    var motherFirstName = (mData.first_name || 'MARIA CLARA').toUpperCase();
    var babyHrn = opts.babyHrn || ('000000' + (Math.floor(1900 + Math.random() * 8000)));
    var babyId = opts.babyId || ('patient_nb_' + motherLastName.toLowerCase() + '_' + Date.now().toString().slice(-6));
    var babyCaseNo = 'NB-' + deliveryDate.replace(/-/g, '') + '-0001';

    // 2. Register Newborn into Master Patient Index (his_patients_v1)
    var patientList = getPatientList();
    var existingBabyIndex = patientList.findIndex(function (p) { return p.id === babyId; });

    var babyRecord = {
      id: babyId,
      seedVersion: 1,
      createdAt: deliveryDate + 'T' + deliveryTime + ':00+08:00',
      updatedAt: new Date().toISOString(),
      data: {
        hrn: babyHrn,
        philhealth_no: 'Pending Newborn (Dependent of ' + (mData.philhealth_no || 'Mother') + ')',
        phic_member_category: 'Newborn Care Package (NCP) Eligible',
        attending_physician: { name: 'Andrea Reyes, MD', prc_no: '0102938', s2_no: 'S2-0102938-2026' },
        last_name: motherLastName,
        first_name: 'BABY ' + babyGenderStr.toUpperCase(),
        middle_name: motherLastName,
        birthdate: deliveryDate,
        birth_time: deliveryTime,
        gender: babyGenderStr === 'Boy' ? 'Male' : 'Female',
        age: '0 days (Neonate)',
        civil_status: 'Child',
        address: mData.address || 'Brgy. San Jose, Medical District',
        ward_room: 'Neonatal Care Unit / Room-In',
        ward_area: 'Newborn',
        case_no: babyCaseNo,
        encounter_no: babyCaseNo,
        case_type: 'Inpatient (Neonate)',
        registration_type: 'Live Birth (Hospital Delivery)',
        chief_complaint: 'Routine immediate newborn care and post-delivery assessment',
        mother_patient_id: mId,
        mother_hrn: mData.hrn || '0000001925',
        mother_name: motherFirstName + ' ' + motherLastName,
        mother_blood_type: opts.motherBloodType || 'O+',
        maternal_age: mData.age || 28,
        delivery_mode: deliveryMode,
        birth_weight: birthWeight,
        birth_length: birthLength,
        apgar_1min: apgar1,
        apgar_5min: apgar5,
        encounters: [
          {
            case_no: babyCaseNo,
            encounter_no: babyCaseNo,
            date: deliveryDate,
            time: deliveryTime,
            service: 'Neonatology / Newborn Care',
            physician: 'Andrea Reyes, MD',
            status_tag: 'Initial Newborn Evaluation',
            is_initial: true,
            is_current: true,
            diagnosis: 'Single Live Born Infant, Delivered Hospital (ICD-10 Z38.00)'
          }
        ]
      }
    };

    if (existingBabyIndex >= 0) {
      patientList[existingBabyIndex] = babyRecord;
    } else {
      patientList.push(babyRecord);
    }
    savePatientList(patientList);

    // 3. Populate Neonate Structured Workspace State (HIS_NEONATE_<babyId>)
    var neoState = {
      patientId: babyId,
      motherPatientId: mId,
      deliveryDateTime: deliveryDate + 'T' + deliveryTime,
      maternal: {
        motherName: motherLastName + ', ' + motherFirstName,
        motherAddress: mData.address || 'Brgy. San Jose, Medical District',
        motherAge: mData.age || 28,
        motherBloodType: opts.motherBloodType || 'O+',
        motherStatus: mData.civil_status || 'Married',
        edc: opts.edc || '2026-10-15',
        lmp: opts.lmp || '2026-01-08',
        aogWeeks: opts.aog || '39 0/7',
        gravida: obState.pregnancies ? obState.pregnancies.length + 1 : 3,
        para: obState.pregnancies ? obState.pregnancies.length + 1 : 3,
        presentation: opts.presentation || 'Cephalic',
        classification: 'Term Infant',
        ruptureDateTime: deliveryDate + 'T' + deliveryTime,
        colorOfAmnioticFluid: 'Clear',
        modeOfDelivery: deliveryMode,
        laborHours: opts.laborHours || '6',
        complications: complications
      },
      maternalRiskFactors: {
        selected: ['Maternal Tetanus Toxoid / Immunization Complete'],
        othersText: ''
      },
      measurements: {
        birthWeight: birthWeight,
        birthLength: birthLength,
        headCircumference: headCirc,
        chestCircumference: '33 cm',
        abdominalCircumference: '32 cm',
        sex: babySex
      },
      apgar: {
        oneMinute: { score: apgar1, heartRate: 2, respEffort: 2, muscleTone: 1, reflexIrritability: 1, color: 2 },
        fiveMinute: { score: apgar5, heartRate: 2, respEffort: 2, muscleTone: 2, reflexIrritability: 2, color: 1 }
      },
      ballard: {
        calculatedWeeks: 39,
        calculatedMaturity: 'Full Term',
        scoreTotal: 36
      },
      newbornCare: {
        eincImmediateSkinToSkin: true,
        eincProperCordClamping: true,
        eincNonSeparation: true,
        eincBreastfeedingInitiated: true,
        vitKGiven: true,
        eyeProphylaxisGiven: true,
        hepBGiven: true,
        bcgGiven: true,
        enbsScheduled: true,
        hearingScreeningScheduled: true
      },
      savedAt: new Date().toISOString()
    };

    setLocalItem(KEYS.NEO_PREFIX + babyId, neoState);

    // 4. Update Mother's Obstetric Parity & Past Pregnancies in HIS_OB_GYNE_<motherId>
    var currentYear = new Date(deliveryDate).getFullYear();
    var newPregnancyEntry = {
      seq: 'P' + ((obState.pregnancies ? obState.pregnancies.length : 0) + 1),
      year: String(currentYear),
      outcome: 'Full Term Live Birth (' + babyGenderStr + ')',
      mode: deliveryMode,
      ga: opts.aog || '39 wks',
      sex: babyGenderStr,
      weight: birthWeight,
      place: 'Regional Medical Center & Hospital',
      attendant: attendant,
      maternalComp: complications,
      babyHrn: babyHrn,
      babyId: babyId
    };

    obState.pregnancies = obState.pregnancies || [];
    obState.pregnancies.unshift(newPregnancyEntry); // newest first

    // Deactivate present pregnancy (as delivered)
    if (obState.presentPregnancy) {
      obState.presentPregnancy.active = false;
      obState.presentPregnancy.deliveredAt = deliveryDate;
    }

    setLocalItem(obKey, obState);

    // 5. Record Delivery Handover Log
    var handovers = getLocalItem(KEYS.HANDOVERS, []);
    var handoverRecord = {
      id: 'HO-' + Date.now(),
      timestamp: new Date().toISOString(),
      motherId: mId,
      motherHrn: mData.hrn,
      motherName: motherLastName + ', ' + motherFirstName,
      babyId: babyId,
      babyHrn: babyHrn,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      mode: deliveryMode,
      weight: birthWeight,
      apgar: apgar1 + ' / ' + apgar5,
      attendant: attendant
    };
    handovers.unshift(handoverRecord);
    setLocalItem(KEYS.HANDOVERS, handovers);

    return {
      success: true,
      handoverId: handoverRecord.id,
      motherId: mId,
      babyId: babyId,
      babyHrn: babyHrn,
      babyModuleUrl: 'Neonate_Clinical_Module.html?patient=' + encodeURIComponent(babyId),
      motherModuleUrl: 'OB_Gyne_Clinical_Module.html?patient=' + encodeURIComponent(mId),
      handoverRecord: handoverRecord
    };
  }

  /* ──────────────────────────────────────────────────────────────────────
     4. COMPLETE CLINICAL CHART SNAPSHOT EXPORT & IMPORT (ZERO-DB PORTABILITY)
     Allows clinicians to export any patient chart as JSON and restore it.
     ────────────────────────────────────────────────────────────────────── */
  function exportPatientChartBundle(patientId) {
    var pid = patientId || 'patient_ob_maria';
    var patientRec = getPatientById(pid);
    var obData = getLocalItem(KEYS.OB_PREFIX + pid, null);
    var neoData = getLocalItem(KEYS.NEO_PREFIX + pid, null);
    var ordersDraft = getLocalItem(KEYS.ORDERS_DRAFT, null);

    var bundle = {
      schema: 'HIS_CLINICAL_CHART_BUNDLE_V1',
      exportedAt: new Date().toISOString(),
      patientId: pid,
      patientRecord: patientRec,
      obstetricHistory: obData,
      neonatalRecord: neoData,
      draftOrders: ordersDraft,
      systemMetadata: {
        facility: 'Regional Medical Center & Hospital',
        eclaimsVersion: 'PhilHealth CF4 / eClaims Compliant',
        dohCategory: 'Tertiary Clinical Teaching Facility'
      }
    };

    var jsonStr = JSON.stringify(bundle, null, 2);
    var blob = new Blob([jsonStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'HIS_Patient_' + (patientRec && patientRec.data && patientRec.data.hrn ? patientRec.data.hrn : pid) + '_Chart_Export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return bundle;
  }

  function importPatientChartBundle(bundleData) {
    var data = typeof bundleData === 'string' ? safeParse(bundleData, null) : bundleData;
    if (!data || !data.patientId) {
      throw new Error('Invalid Clinical Chart Bundle: Missing patient ID or invalid JSON.');
    }

    var pid = data.patientId;

    if (data.patientRecord) {
      var list = getPatientList();
      var idx = list.findIndex(function (p) { return p.id === pid; });
      if (idx >= 0) list[idx] = data.patientRecord;
      else list.push(data.patientRecord);
      savePatientList(list);
    }

    if (data.obstetricHistory) {
      setLocalItem(KEYS.OB_PREFIX + pid, data.obstetricHistory);
    }
    if (data.neonatalRecord) {
      setLocalItem(KEYS.NEO_PREFIX + pid, data.neonatalRecord);
    }
    if (data.draftOrders) {
      setLocalItem(KEYS.ORDERS_DRAFT, data.draftOrders);
    }

    // Invalidate caches
    _memCache = {};
    if (typeof window.invalidatePatientsCache === 'function') {
      window.invalidatePatientsCache();
    }

    return { success: true, patientId: pid };
  }

  /* ──────────────────────────────────────────────────────────────────────
     5. ACTUAL PRINTABLE DELIVERY & HANDOVER SUMMARY GENERATOR
     ────────────────────────────────────────────────────────────────────── */
  function openDeliveryHandoverPrintSummary(motherId, babyId) {
    var mRec = getPatientById(motherId || 'patient_ob_maria');
    var bRec = getPatientById(babyId) || (function () {
      var list = getPatientList();
      return list.find(function (p) { return p.data && p.data.mother_patient_id === (motherId || 'patient_ob_maria'); });
    })();

    var mData = (mRec && mRec.data) || {};
    var bData = (bRec && bRec.data) || {};
    var neoState = getLocalItem(KEYS.NEO_PREFIX + (bRec ? bRec.id : ''), null) || {};

    var mNeo = neoState.maternal || {};
    var mMeas = neoState.measurements || {};
    var mApg = neoState.apgar || {};

    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Maternal-Neonate Delivery & Handover Record</title>' +
      '<style>' +
      'body { font-family: "Times New Roman", Times, serif; margin: 20px; color: #111; line-height: 1.4; font-size: 11pt; }' +
      '.header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; }' +
      '.header h2 { margin: 0; font-size: 15pt; text-transform: uppercase; }' +
      '.header p { margin: 2px 0; font-size: 10pt; }' +
      '.section-title { font-weight: bold; background: #e2e8f0; padding: 4px 8px; margin: 12px 0 6px; font-size: 11pt; text-transform: uppercase; border-left: 4px solid #1e293b; }' +
      '.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 10.5pt; }' +
      '.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px 14px; font-size: 10.5pt; }' +
      '.field { display: flex; justify-content: space-between; border-bottom: 1px dotted #999; padding: 2px 0; }' +
      '.field span.label { font-weight: bold; color: #333; }' +
      '.field span.val { font-weight: normal; }' +
      '.signatures { margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center; }' +
      '.sig-line { border-top: 1px solid #000; padding-top: 4px; font-weight: bold; font-size: 10pt; }' +
      '@media print { body { margin: 0; } .no-print { display: none; } }' +
      '</style></head><body>' +
      '<div class="no-print" style="margin-bottom:12px; display:flex; gap:10px;">' +
      '<button onclick="window.print()" style="padding:8px 16px; background:#1b4d3e; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Print Delivery Handover Sheet</button>' +
      '<button onclick="window.close()" style="padding:8px 16px; background:#64748b; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Close</button>' +
      '</div>' +
      '<div class="header">' +
      '<p>Republic of the Philippines • Department of Health</p>' +
      '<h2>REGIONAL MEDICAL CENTER & HOSPITAL</h2>' +
      '<p>OBSTETRIC LABOR & DELIVERY SUITE • NEONATAL TRANSITION RECORD</p>' +
      '<p>PhilHealth CF4 / Maternal & Newborn Care Package (MCP / NCP) Compliant</p>' +
      '</div>' +

      '<div class="section-title">1. Maternal Clinical Information</div>' +
      '<div class="grid">' +
      '<div class="field"><span class="label">Mother Name:</span><span class="val">' + (mData.last_name || '') + ', ' + (mData.first_name || '') + '</span></div>' +
      '<div class="field"><span class="label">Maternal HRN:</span><span class="val">' + (mData.hrn || '—') + '</span></div>' +
      '<div class="field"><span class="label">Maternal Age / Blood Type:</span><span class="val">' + (mData.age || 28) + ' y/o • ' + (bData.mother_blood_type || 'O+') + '</span></div>' +
      '<div class="field"><span class="label">Obstetric Parity:</span><span class="val">' + (mNeo.gravida ? 'G' + mNeo.gravida + 'P' + mNeo.para : 'G3P3') + '</span></div>' +
      '<div class="field"><span class="label">LMP / EDC:</span><span class="val">' + (mNeo.lmp || '—') + ' / ' + (mNeo.edc || '—') + '</span></div>' +
      '<div class="field"><span class="label">Age of Gestation (AOG):</span><span class="val">' + (mNeo.aogWeeks || '39 wks') + '</span></div>' +
      '</div>' +

      '<div class="section-title">2. Intrapartum & Delivery Event</div>' +
      '<div class="grid">' +
      '<div class="field"><span class="label">Delivery Date & Time:</span><span class="val">' + (bData.birthdate || new Date().toISOString().split('T')[0]) + ' ' + (bData.birth_time || '—') + '</span></div>' +
      '<div class="field"><span class="label">Mode of Delivery:</span><span class="val">' + (bData.delivery_mode || mNeo.modeOfDelivery || 'Normal Spontaneous Delivery (NSD)') + '</span></div>' +
      '<div class="field"><span class="label">Presentation:</span><span class="val">' + (mNeo.presentation || 'Cephalic') + '</span></div>' +
      '<div class="field"><span class="label">Amniotic Fluid:</span><span class="val">' + (mNeo.colorOfAmnioticFluid || 'Clear') + '</span></div>' +
      '<div class="field"><span class="label">Attending Obstetrician:</span><span class="val">' + (mData.attending_physician && mData.attending_physician.name ? mData.attending_physician.name : 'Liza Garcia, MD') + '</span></div>' +
      '<div class="field"><span class="label">Maternal Complications:</span><span class="val">' + (mNeo.complications || 'None / Uncomplicated') + '</span></div>' +
      '</div>' +

      '<div class="section-title">3. Newborn Assessment & Immediate Transition</div>' +
      '<div class="grid-3">' +
      '<div class="field"><span class="label">Newborn HRN:</span><span class="val">' + (bData.hrn || '—') + '</span></div>' +
      '<div class="field"><span class="label">Sex / Registry:</span><span class="val">' + (bData.gender || 'Male') + '</span></div>' +
      '<div class="field"><span class="label">Encounter No:</span><span class="val">' + (bData.encounter_no || '—') + '</span></div>' +
      '<div class="field"><span class="label">Birth Weight:</span><span class="val">' + (bData.birth_weight || mMeas.birthWeight || '3100 g') + '</span></div>' +
      '<div class="field"><span class="label">Birth Length:</span><span class="val">' + (bData.birth_length || mMeas.birthLength || '50 cm') + '</span></div>' +
      '<div class="field"><span class="label">Head Circumference:</span><span class="val">' + (mMeas.headCircumference || '34 cm') + '</span></div>' +
      '<div class="field"><span class="label">APGAR Score (1 min):</span><span class="val"><strong>' + (bData.apgar_1min || (mApg.oneMinute ? mApg.oneMinute.score : 8)) + ' / 10</strong></span></div>' +
      '<div class="field"><span class="label">APGAR Score (5 min):</span><span class="val"><strong>' + (bData.apgar_5min || (mApg.fiveMinute ? mApg.fiveMinute.score : 9)) + ' / 10</strong></span></div>' +
      '<div class="field"><span class="label">Ballard Maturity:</span><span class="val">Full Term (39 wks)</span></div>' +
      '</div>' +

      '<div class="section-title">4. Essential Intrapartum & Newborn Care (EINC Protocol - Unang Yakap)</div>' +
      '<div class="grid">' +
      '<div class="field"><span class="label">Immediate Skin-to-Skin:</span><span class="val">COMPLETED (Within 1st minute)</span></div>' +
      '<div class="field"><span class="label">Properly Timed Cord Clamping:</span><span class="val">COMPLETED (After pulsations stopped)</span></div>' +
      '<div class="field"><span class="label">Non-Separation / Rooming-In:</span><span class="val">COMPLETED</span></div>' +
      '<div class="field"><span class="label">Early Breastfeeding Initiation:</span><span class="val">COMPLETED</span></div>' +
      '<div class="field"><span class="label">Vitamin K & Eye Prophylaxis:</span><span class="val">ADMINISTERED</span></div>' +
      '<div class="field"><span class="label">Hepatitis B & BCG Vaccines:</span><span class="val">ADMINISTERED</span></div>' +
      '</div>' +

      '<div class="signatures">' +
      '<div><div class="sig-line">LIZA GARCIA, MD<br><span style="font-weight:normal; font-size:9pt;">Attending Obstetrician • PRC Lic. No. 0091234</span></div></div>' +
      '<div><div class="sig-line">ANDREA REYES, MD<br><span style="font-weight:normal; font-size:9pt;">Attending Pediatrician / Neonatologist • PRC Lic. No. 0102938</span></div></div>' +
      '</div>' +

      '</body></html>';

    var printWin = window.open('', '_blank', 'width=880,height=960,resizable=yes,scrollbars=yes');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
    } else {
      alert('Pop-up was blocked. Please allow pop-ups for this hospital workstation to view the print report.');
    }
  }

  // Export module API to window.HIS.storageBus
  HIS.storageBus = {
    KEYS: KEYS,
    getLocalItem: getLocalItem,
    setLocalItem: setLocalItem,
    getPatientList: getPatientList,
    savePatientList: savePatientList,
    getPatientById: getPatientById,
    saveDraft: saveDraft,
    getDraft: getDraft,
    clearDraft: clearDraft,
    handoverMaternalDelivery: handoverMaternalDelivery,
    exportPatientChartBundle: exportPatientChartBundle,
    importPatientChartBundle: importPatientChartBundle,
    openDeliveryHandoverPrintSummary: openDeliveryHandoverPrintSummary
  };

  // Safe global bridge
  window.HIS_StorageBus = HIS.storageBus;

})(typeof window !== 'undefined' ? window : this);
