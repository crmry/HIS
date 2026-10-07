/* ═══════════════════════════════════════════════════════════════
   CLMMRH SegHIS — Clinical Patient Registry & Baseline Records
   Hospital Master Patient Index (EMPI) Clinical Baseline Records
   ═══════════════════════════════════════════════════════════════ */

var STORAGE_KEY = 'clmmrh_patients_v1';
var SEED_PATIENT_ID = 'patient_op_carmela';
var OP_PATIENT_ID = 'patient_op_carmela';
var ER_PATIENT_ID = 'patient_er_juan';
var LEGACY_OP_PATIENT_ID = 'patient_op_juan';
var BLANK_PATIENT_ID = 'patient_new_blank_1790299677880';

if (typeof window !== 'undefined') {
  window.ER_PATIENT_ID = ER_PATIENT_ID;
  window.OP_PATIENT_ID = OP_PATIENT_ID;
  window.SEED_PATIENT_ID = SEED_PATIENT_ID;
  window.BLANK_PATIENT_ID = BLANK_PATIENT_ID;
}

function safeParse(v, fb) {
  try {
    var p = JSON.parse(v);
    return p != null ? p : fb;
  } catch (e) {
    return fb;
  }
}

var _cachedPatients = null;

function invalidatePatientsCache() {
  _cachedPatients = null;
}

function getPatients() {
  if (_cachedPatients && Array.isArray(_cachedPatients)) return _cachedPatients;
  var r = safeParse(localStorage.getItem(STORAGE_KEY), []);
  _cachedPatients = Array.isArray(r) ? r : [];
  return _cachedPatients;
}

function savePatients(records) {
  _cachedPatients = Array.isArray(records) ? records : null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) invalidatePatientsCache();
  });
}

// Hospital Staff & Physicians Directory for CPOE Pairing / Co-Signature Workflow
if (typeof window !== 'undefined') {
  window.HOSPITAL_PHYSICIANS_DIRECTORY = [
    { id: 'NONE', name: 'NONE', title: 'NONE', specialty: 'No Co-Signature (Standard Single Physician)', department: 'No Co-Signature', prc_no: '', s2_no: '', is_none: true },
    { id: 'santos_maria', legacy_id: 'doc-maria-santos', name: 'Maria Santos, MD', title: 'Dr. Maria Santos', last_name: 'Santos', first_name: 'Maria', middle_initial: 'A.', specialty: 'Internal Medicine', department: 'Internal Medicine', prc_no: '0095512', s2_no: 'S2-095512-2026' },
    { id: 'cruz_paolo', legacy_id: 'doc-paolo-cruz', name: 'Paolo Cruz, MD', title: 'Dr. Paolo Cruz', last_name: 'Cruz', first_name: 'Paolo', middle_initial: 'M.', specialty: 'Orthopedic Surgery', department: 'Orthopedic Surgery', prc_no: '0087654', s2_no: 'S2-087654-2026' },
    { id: 'reyes_andrea', legacy_id: 'doc-andrea-reyes', name: 'Andrea Reyes, MD', title: 'Dr. Andrea Reyes', last_name: 'Reyes', first_name: 'Andrea', middle_initial: 'L.', specialty: 'Pediatrics', department: 'Pediatrics', prc_no: '0102938', s2_no: 'S2-0102938-2026' },
    { id: 'garcia_liza', legacy_id: 'doc-liza-garcia', name: 'Liza Garcia, MD', title: 'Dr. Liza Garcia', last_name: 'Garcia', first_name: 'Liza', middle_initial: 'T.', specialty: 'Obstetrics and Gynecology', department: 'Obstetrics and Gynecology', prc_no: '0091234', s2_no: 'S2-0091234-2026' },
    { id: 'lim_roberto', legacy_id: 'doc-roberto-lim', name: 'Roberto Lim, MD', title: 'Dr. Roberto Lim', last_name: 'Lim', first_name: 'Roberto', middle_initial: 'S.', specialty: 'Emergency Medicine', department: 'Emergency Medicine', prc_no: '0076543', s2_no: 'S2-076543-2026' },
    { id: 'santos_miguel', legacy_id: 'doc-miguel-santos', name: 'Miguel Santos, MD', title: 'Dr. Miguel Santos', last_name: 'Santos', first_name: 'Miguel', middle_initial: 'C.', specialty: 'General Medicine', department: 'General Medicine', prc_no: '0094821', s2_no: 'S2-094821-2026' },
    { id: 'mahinay_arthur', legacy_id: 'doc-arthur-mahinay', name: 'Arthur Mahinay, MD', title: 'Dr. Arthur Mahinay', last_name: 'Mahinay', first_name: 'Arthur', middle_initial: 'G.', specialty: 'Pulmonary Medicine', department: 'Pulmonary Medicine', prc_no: '0081249', s2_no: 'S2-081249-2026' },
    { id: 'mahinay_elena', legacy_id: 'doc-elena-mahinay', name: 'Elena Mahinay, MD', title: 'Dr. Elena Mahinay', last_name: 'Mahinay', first_name: 'Elena', middle_initial: 'R.', specialty: 'Cardiology', department: 'Cardiology', prc_no: '0079314', s2_no: 'S2-079314-2026' }
  ];

  window.formatDoctorNameLastFirst = function(d) {
    if (!d) return '';
    if (d.is_none || d.id === 'NONE') return 'NONE (No pairing / Standard single-physician order)';
    var last = d.last_name || '';
    var first = d.first_name || '';
    var mi = d.middle_initial || '';
    if (!last || !first) {
      var clean = (d.name || '').replace(/,\s*MD$/i, '').replace(/^Dr\.?\s+/i, '').trim();
      var parts = clean.split(/\s+/);
      if (parts.length >= 2) {
        last = parts[parts.length - 1];
        first = parts.slice(0, parts.length - 1).join(' ');
      } else {
        last = clean;
        first = '';
      }
    }
    var res = last + (first ? ', ' + first : '');
    if (mi) res += ' ' + mi;
    return res;
  };

  window.getEligibleCoSigningDoctors = function(excludeDoctorName) {
    var list = window.HOSPITAL_PHYSICIANS_DIRECTORY || [];
    return list;
  };
}

    function seedPatientRecord() {
      return opPatientRecord();
    }

    var OP_PATIENT_ID = 'patient_op_carmela';
    var ER_PATIENT_ID = 'patient_er_juan';
    var LEGACY_OP_PATIENT_ID = 'patient_op_juan';

    function opPatientRecord() {
      return {
        id: OP_PATIENT_ID,
        seedVersion: 67,
        createdAt: '2026-03-14T08:45:00+08:00',
        updatedAt: '2026-09-26T09:30:00+08:00',
        data: {
          hrn: '0000001890',
          philhealth_no: '06-018274910-3',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Miguel Santos, MD', prc_no: '0094821', s2_no: 'S2-094821-2026' },
          last_name: 'DEL ROSARIO',
          first_name: 'CARMELA',
          middle_name: 'BAUTISTA',
          birthdate: '1978-03-22',
          gender: 'Female',
          address: 'Brgy. Bata, Bacolod City, Negros Occidental',
          ward_room: 'OPD - Room 104',
          ward_area: 'General Medicine',
          case_no: 'OP-2026-0926-0042',
          encounter_no: 'OP-2026-0926-0042',
          case_type: 'OP Patient',
          chief_complaint: 'Routine follow-up for chronic disease management',
          hx_present: 'Patient presents for scheduled outpatient surveillance of Type 2 Diabetes Mellitus and Essential Hypertension. Compliant with prescribed oral maintenance therapy. Reports stable energy levels without polyuria, polydipsia, blurred vision, or interval chest discomfort.',
          hx_surgical: 'No previous surgical procedures.',
          hx_past: 'Type 2 Diabetes Mellitus diagnosed 2020; Essential Hypertension Stage 1 diagnosed 2020; Mild Primary Osteoarthritis, Right Knee diagnosed 2025. Hospitalized at CLMMRH Medical Ward (June 12-14, 2026) for Community-Acquired Pneumonia, moderate risk, resolved with IV antibiotics.',
          hx_family: 'Mother with Type 2 Diabetes Mellitus; Father with Hypertension.',
          hx_social: 'Non-smoker, non-alcoholic beverage drinker. Works as an office clerk.',
          hx_allergy: 'No known food or drug allergies (NKFDA).',
          pertinent_signs: ['Fatigue'],
          pertinent_signs_information: 'Occasional mild afternoon fatigue; denies dizziness, palpitations, or pedal swelling.',
          pe_general: 'Conscious, coherent, ambulatory, in no acute cardiopulmonary distress.',
          pe_heent: 'Anicteric sclerae, pink palpebral conjunctivae, moist oral mucosa, no tonsillopharyngeal congestion.',
          pe_chest_lungs: 'Symmetric chest expansion, clear breath sounds bilaterally, no crackles or wheezes.',
          pe_cardiovascular: 'Adynamic precordium, normal rate, regular rhythm, distinct S1/S2, no murmurs or gallops.',
          pe_abdomen: 'Flat, soft, non-tender, no organomegaly, normoactive bowel sounds.',
          pe_extremities: 'Warm extremities, brisk capillary refill (< 2 seconds), pulses full and equal, no pretibial edema.',
          pe_neurologic: 'Grossly intact neurological examination, cranial nerves II-XII intact, no motor or sensory deficits.',
          pe_skin: 'Warm, smooth, normal turgor, no rashes, petechiae, or non-healing ulcers.',
          pe_other: '',
          other_forms: [],
          other_forms_notes: '',
          neonate: {
            classification: { inborn: 'singleton-in hospital', outborn: '', readmission: false, birthLocation: 'Delivery Room' },
            maternal: {
              motherName: 'DEL ROSARIO, CARMELA BAUTISTA',
              motherAddress: 'Brgy. Bata, Bacolod City, Negros Occidental',
              motherAge: 32,
              motherBloodType: 'O+',
              status: 'Married',
              edc: '2026-09-28',
              lmp: '2025-12-21',
              aogWeeks: '38 4/7',
              gravida: 3,
              para: 2,
              presentation: 'Cephalic',
              position: 'LOA',
              classification: 'Normal',
              deliveryType: 'NSD',
              deliveryTime: '08:30',
              bow: 'Ruptured',
              rupturedTime: '06:15',
              stage1: '8 hours',
              stage2: '25 mins',
              csIndication: '',
              complications: 'Uncomplicated prenatal course. Complete maternal immunizations.',
              steroids: { dose1: '', dose2: '', dose3: '', dose4: '' }
            },
            maternalRiskFactors: { selected: ['Vaccination'], othersText: '' },
            apgar: {
              scores: {
                m1: { hr: '2', rr: '1', tone: '1', reflex: '2', color: '1' },
                m5: { hr: '2', rr: '2', tone: '2', reflex: '2', color: '1' },
                m10: { hr: '2', rr: '2', tone: '2', reflex: '2', color: '2' }
              },
              exceeding: ''
            },
            measurements: {
              weight: '3.15',
              headCirc: '34.0',
              length: '49.5',
              chestCirc: '33.0',
              abdCirc: '31.5',
              temp: '36.7',
              cardiacRate: '138',
              respRate: '46',
              babyBloodType: 'O+',
              cordCondition: 'Intact, 3 vessels (2 arteries, 1 vein), no omphalocele'
            },
            einc: {
              status: 'Complete',
              timeStart: '08:30',
              timeEnd: '10:00',
              interventions: ['Thorough Drying', 'Skin to skin', 'Properly timed cord clamping', 'Non-separation of newborn and mother for breastfeeding'],
              reason: '',
              provider: 'Dr. Maria Santos, Pediatrician / Staff Midwife'
            },
            ballard: {
              scores: {
                posture: '3', square_window: '3', arm_recoil: '3', popliteal_angle: '3', scarf_sign: '3', heel_to_ear: '3',
                skin: '3', lanugo: '3', plantar_surface: '3', breast: '3', eye_ear: '3', genitals_male: '3', genitals_female: '3'
              }
            },
            physicalExam: {
              general: 'Active, vigorous cry, pinkish body and extremities, good suck effort',
              color: 'Pink, well-perfused, no central cyanosis',
              head: 'Normocephalic, fontanelles soft and flat, sutures patent',
              eent: 'Red reflex positive bilaterally, patent nares, intact palate',
              neck: 'Supple, no masses or webbing',
              heart: 'Normal rate and rhythm, distinct S1/S2, no audible murmurs',
              chestLungs: 'Clear breath sounds bilaterally, symmetric chest expansion, no retractions',
              abdomen: 'Soft, non-distended, normoactive bowel sounds, cord stump clean',
              genitalia: 'Female: Labia majora covers clitoris and minora completely',
              anus: 'Patent anus, passed meconium within 6 hours',
              skin: 'Smooth, warm, fair skin elasticity, minimal vernix caseosa',
              extremities: 'Grossly normal, symmetrical 10 fingers/toes, full passive range of motion',
              otherFindings: 'Barlow/Ortolani negative. Grasp and Moro reflexes fully elicited.',
              sex: 'Female',
              nicuReason: '',
              nicuOthers: ''
            },
            aftercare: {
              vitk: { date: '2026-09-26', remarks: '1 mg Phytomenadione IM right anterolateral thigh' },
              eye: { date: '2026-09-26', remarks: 'Erythromycin 0.5% ophthalmic ointment both eyes' },
              bcg: { date: '2026-09-26', remarks: 'BCG 0.05 mL ID right deltoid given' },
              hepab: { date: '2026-09-26', remarks: 'Hepatitis B vaccine 0.5 mL IM left anterolateral thigh' },
              hbig: { date: '', remarks: '' },
              nurse: 'E. Cruz, RN / Dr. M. Santos'
            },
            screening: {
              ror: { date: '2026-09-26', findings: '+/normal', abnormal: '', refDate: '' },
              rop: { applicable: 'No', schedule: '', init: { date: '', findings: '', remarks: '' }, second: { date: '', findings: '', remarks: '' }, third: { date: '', findings: '', remarks: '' } },
              enbs: { date: '2026-09-27', remarks: 'Done in CL', sticker: 'NBS-2026-0926-8812', repeatReason: '', repeatSched: '', others: '' },
              hearing: { date: '2026-09-27', remarks: 'Pass', repeatDate: '', findings: 'OAE bilateral pass', outside: 'No' },
              cranialUtz: { applicable: 'No', date: '', findings: '', remarks: '' },
              cchd: {
                date: '2026-09-27', remarks: 'Pass', retestDone: '',
                init: { hand: '98', foot: '99', diff: '1' },
                retest: { hand: '', foot: '', diff: '' },
                notDone: '', others: '', screener: 'R. Alcantara, RN'
              }
            },
            diagnosis: {
              biliClass: 'None', biliOther: '', biliLevel: '',
              respStatus: 'Normal', respSupport: '',
              sepsisStatus: 'None', sepsisCulture: '',
              asphyxia: 'No', congenital: 'None'
            },
            kmc: {
              enrollDate: '2026-09-26',
              dischargeKmc: 'Continuous (KMC ward or >20 hours)',
              dischargeStatus: 'Discharged',
              feedMode: 'Direct Breastfeeding',
              feedType: 'Exclusive Breastmilk',
              donorMilk: 'No',
              surfactant: 'Not Applicable',
              weightDischarge: '3.20',
              futility: ''
            }
          },
          vs_bp: '120/80', vs_hr: '74', vs_rr: '18', vs_temp: '36.6', vs_spo2: '99', vs_weight: '70', vs_height: '168', vs_date_time: '2026-09-26T09:30:00+08:00',
          vital_signs: [
            { dateTime: '2026-09-26T09:30:00+08:00', bp: '120/80', hr: '74', rr: '18', temp: '36.6', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' }
          ],
          ivFluids: [
            { id: 'ivf-1', bottle: 'Bottle #1', solution: 'Plain Normal Saline Solution (PNSS) 1 L', rate: '80 mL/hr', started: '2026-09-25T08:00:00+08:00', ended: '2026-09-25T16:00:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'Elena M. Ramos, RN', remarks: 'Medical Ward baseline hydration; peripheral line R cephalic vein' },
            { id: 'ivf-2', bottle: 'Bottle #2', solution: 'D5 0.3% NaCl 1 L + 20 mEq KCl', rate: '100 mL/hr', started: '2026-09-25T16:00:00+08:00', ended: '2026-09-26T02:00:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'M. Cruz, RN', remarks: 'Infused completely; oral hydration adequate prior to discharge' }
          ],
          transfusions: [
            { id: 'trans-1', serial: 'B26-08914', component: 'Packed Red Blood Cells (PRBC)', bloodType: 'O Rh Positive', volume: '250 mL', expiration: '2026-10-15', started: '2026-09-25T09:00:00+08:00', ended: '2026-09-25T12:00:00+08:00', vitals: 'Pre: 104/65, HR 115, T 37.5°C, SpO2 92% | Post: 110/70, HR 88, T 37.2°C, SpO2 96%', reaction: 'None / Uneventful', nurse: 'Elena M. Ramos, RN / Checked: Miguel Santos, MD', crossmatch: 'Crossmatched & Compatible (CLMMRH Blood Bank BB-2026-X0412)' }
          ],
          admitting_diagnosis: '',
          final_diagnosis: '', // Blank for current active consultation; finalized on historical encounters
          progress_notes_subjective: '',
          progress_notes_objective: '',
          progress_notes_assessment: '',
          progress_notes: '',
          encounters: [
            {
              date: '2026-09-26',
              time: '09:30 AM',
              registry: 'OP',
              service: 'General Medicine',
              physician: 'Miguel Santos, MD',
              prc_license: '0087654',
              is_current: true,
              status_tag: 'Consultation',
              diagnosis: '',
              patient_record: '',
              results: '',
              vital_signs: [
                { dateTime: '2026-09-26T09:30:00+08:00', bp: '120/80', hr: '74', rr: '18', temp: '36.6', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' }
              ],
              cbgs: [
                { dateTime: '2026-09-26T08:30:00+08:00', timing: 'Fasting Blood Sugar (FBS)', reading: 124, action: 'Target Met (80-130 mg/dL)', notes: 'Morning fasting check prior to OPD consultation; compliant with Empagliflozin 10 mg OD and Metformin 500 mg BID', nurse: 'Elena M. Ramos, RN' }
              ],
              ivFluids: [
                { id: 'ivf-1', bottle: 'Bottle #1', solution: 'Plain Normal Saline Solution (PNSS) 1 L', rate: '80 mL/hr', started: '2026-09-25T08:00:00+08:00', ended: '2026-09-25T16:00:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'Elena M. Ramos, RN', remarks: 'Medical Ward baseline hydration; peripheral line R cephalic vein' },
                { id: 'ivf-2', bottle: 'Bottle #2', solution: 'D5 0.3% NaCl 1 L + 20 mEq KCl', rate: '100 mL/hr', started: '2026-09-25T16:00:00+08:00', ended: '2026-09-26T02:00:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'M. Cruz, RN', remarks: 'Infused completely; oral hydration adequate prior to discharge' }
              ],
              transfusions: [
                { id: 'trans-1', serial: 'B26-08914', component: 'Packed Red Blood Cells (PRBC)', bloodType: 'O Rh Positive', volume: '250 mL', expiration: '2026-10-15', started: '2026-09-25T09:00:00+08:00', ended: '2026-09-25T12:00:00+08:00', vitals: 'Pre: 104/65, HR 115, T 37.5°C, SpO2 92% | Post: 110/70, HR 88, T 37.2°C, SpO2 96%', reaction: 'None / Uneventful', nurse: 'Elena M. Ramos, RN / Checked: Miguel Santos, MD', crossmatch: 'Crossmatched & Compatible (CLMMRH Blood Bank BB-2026-X0412)' }
              ],
              medications: [
                { id: 'med-op-0926-1', name: 'Empagliflozin 10 mg tablet', route: 'Oral Once Daily (OD) in the morning', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-20T10:00:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0926-2', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0926-3', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              progress_notes_subjective: '',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: '',
              orders: [],
              clinical_record: {
                chief_complaint: 'Routine follow-up for chronic disease management',
                history: 'Patient presents for scheduled outpatient surveillance of Type 2 Diabetes Mellitus and Essential Hypertension. Compliant with prescribed oral maintenance therapy. Reports stable energy levels without polyuria, polydipsia, blurred vision, or interval chest discomfort.',
                final_diagnosis: ''
              },
              examinations: []
            },
            {
              date: '2026-06-20',
              time: '10:00 AM',
              registry: 'OP',
              service: 'General Medicine',
              physician: 'Miguel Santos, MD',
              prc_license: '0087654',
              is_current: false,
              status_tag: 'Follow-up',
              diagnosis: 'E11.9 - Type 2 Diabetes Mellitus; I10 - Essential Hypertension',
              patient_record: 'Semi-annual comprehensive outpatient review and lab orders',
              results: 'SGLT2 inhibitor initiated; BP controlled',
              disposition: 'Treated and Discharged (Outpatient)',
              follow_up: { date: '2026-09-26', clinic: 'General Medicine', reason: 'Quarterly review of glycemic control and HbA1c response after Empagliflozin addition.' },
              vital_signs: [
                { dateTime: '2026-06-20 10:00 AM', bp: '134/84', hr: '76', rr: '18', temp: '36.6', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '98', o2: '98' }
              ],
              cbgs: [
                { dateTime: '2026-06-20 08:30 AM', timing: 'Fasting Blood Sugar (FBS)', reading: 132, action: 'HbA1c 7.2% - Add Empagliflozin 10 mg OD', notes: 'Suboptimal glycemic control on Metformin monotherapy', nurse: 'Miguel Santos, MD' }
              ],
              medications: [
                { id: 'med-op-0620-1', name: 'Empagliflozin 10 mg tablet', route: 'Oral Once Daily (OD) in the morning', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-20T10:00:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0620-2', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0620-3', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Semi-annual comprehensive outpatient review and lab orders',
                history: 'Scheduled semi-annual review. Reports occasional mild afternoon fatigue; denies polyuria, polydipsia, numbness, chest tightness, or dyspnea. Compliant with Metformin 500 mg BID and Losartan 50 mg OD. Home BP ranges 130-138/80-86 mmHg.',
                final_diagnosis: 'Type 2 Diabetes Mellitus, suboptimally controlled; Essential Hypertension'
              },
              prescriptions: [
                { drug: 'Empagliflozin 10 mg tablet', sig: '1 tablet orally once daily in the morning', qty: '90 tablets' },
                { drug: 'Metformin 500 mg tablet', sig: '1 tablet orally twice daily with meals', qty: '180 tablets' },
                { drug: 'Losartan 50 mg tablet', sig: '1 tablet orally once daily', qty: '90 tablets' }
              ],
              clinicalRequests: {
                laboratory: ['Fasting Blood Sugar (FBS)', 'Glycated Hemoglobin (HbA1c)', 'Serum Creatinine', 'Estimated Glomerular Filtration Rate (eGFR)'],
                radiology: [],
                respiratory: [],
                heart: [],
                eeg: []
              },
              pertinent_signs: ['Fatigue'],
              pertinent_signs_information: 'Reports occasional mild afternoon fatigue; denies polyuria, polydipsia, numbness, chest tightness, or dyspnea.',
              physical_exam: 'Alert, oriented, in no acute distress. Lungs: Clear to auscultation bilaterally. Heart: Regular rate and rhythm, no murmurs. Extremities: No edema, dorsalis pedis pulses palpable.',
              progress_notes_subjective: 'Scheduled semi-annual review. Compliant with Metformin 500 mg BID and Losartan 50 mg OD.',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: 'Scheduled semi-annual review. Compliant with Metformin 500 mg BID and Losartan 50 mg OD.',
              orders: [
                { text: 'Start Empagliflozin 10 mg tablet once daily in the morning.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:15 AM nurse' },
                { text: 'Continue Metformin 500 mg tablet twice daily with meals.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:18 AM nurse' },
                { text: 'Reinforce diabetic meal plan and 30 minutes daily walking.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:25 AM nurse' },
                { text: 'Follow-up after 3 months with repeat HbA1c and renal panel.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' }
              ]
            },
            {
              date: '2026-06-12',
              discharge_date: '2026-06-14',
              admission_date: '2026-06-12',
              time: '12:30 PM',
              admission_time: '12:30 PM',
              discharge_time: '09:00 AM',
              los: '2 Days',
              registry: 'IP',
              case_no: 'IP-2026-0612-0088',
              encounter_no: 'IP-2026-0612-0088',
              service: 'General Medicine',
              ward_room: 'Medical Ward - Bed 302-A',
              physician: 'Miguel Santos, MD',
              prc_license: '0078312',
              is_current: false,
              status_tag: 'Inpatient Admission',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, resolved; I10 - Essential Hypertension, controlled',
              patient_record: 'Inpatient Admission — Medical Ward (Bed 302-A)',
              results: 'Discharged clinically stable',
              disposition: 'Discharged',
              follow_up: { date: '2026-06-20', clinic: 'General Medicine', reason: 'Post-discharge 1-week pulmonary and metabolic review.' },
              vital_signs: [
                { dateTime: '2026-06-14 09:00 AM', bp: '118/74', hr: '72', rr: '16', temp: '36.5', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' },
                { dateTime: '2026-06-13 04:30 PM', bp: '118/76', hr: '74', rr: '16', temp: '36.6', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' },
                { dateTime: '2026-06-13 10:15 AM', bp: '120/80', hr: '78', rr: '18', temp: '36.8', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '98', o2: '98' }
              ],
              medications: [
                { id: 'med-ip-0614-1', name: 'Co-amoxiclav 625 mg tablet', route: 'Oral Three Times Daily (TID)', indication: 'Step-down therapy for pneumonia', started: '2026-06-14T09:00:00+08:00', doses24h: '3 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0614-2', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0614-3', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID)', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Hospitalization for Community-Acquired Pneumonia, Moderate Risk',
                history: '48-year-old female admitted from ER on June 12, 2026 for CAP-MR and Essential Hypertension. Treated with targeted IV Ceftriaxone and Azithromycin. Clinically resolved and discharged on June 14, 2026 in stable condition.',
                final_diagnosis: 'Community-Acquired Pneumonia, resolved; Essential Hypertension Stage 1, controlled'
              },
              progress_notes_subjective: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear.',
              progress_notes_objective: 'Vital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.',
              progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, resolved. Shift to home oral antibiotics.',
              progress_notes: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear.\nVital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.\nDiagnosis: Community-Acquired Pneumonia, resolved. Shift to home oral antibiotics.',
              orders: [
                { text: 'Discharge patient today. Follow-up at Adult Medicine Outpatient Clinic after 1 week.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:30 AM nurse' },
                { text: 'Shift to oral Co-amoxiclav 625 mg tablet TID to complete 7-day course.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:35 AM nurse' },
                { text: 'Resume oral Metformin 500 mg tablet BID and Losartan 50 mg tablet OD.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:40 AM nurse' },
                { text: 'Discontinue IVF line. Issue discharge clearance.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C', 'D'], timeSignature: 'C - 9:45 AM nurse\nD - 9:50 AM nurse' }
              ],
              rounds: [
                {
                  date: '2026-06-13',
                  time: '10:15 AM',
                  status_tag: 'Morning Rounds',
                  diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk, resolving',
                  progress_notes_subjective: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved.',
                  progress_notes_objective: 'Vital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air\nChest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.',
                  progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics',
                  progress_notes: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved.\nVital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air\nChest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics',
                  orders: [
                    { text: 'Wean off nasal cannula oxygen; maintain SpO2 >= 95% on room air.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' },
                    { text: 'Continue IV Ceftriaxone 2 g OD (Day 2 of 7).', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:35 AM nurse\nA - 11:00 AM nurse' },
                    { text: 'Shift Azithromycin to oral 500 mg tablet once daily after meals.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:40 AM nurse\nA - 11:05 AM nurse' },
                    { text: 'Repeat Complete Blood Count (CBC) and serum creatinine tomorrow 6:00 AM.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['R'], timeSignature: 'R - 10:45 AM physician' },
                    { text: 'May ambulate inside room as tolerated. Regular diet.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:00 AM nurse' }
                  ]
                },
                {
                  date: '2026-06-13',
                  time: '04:30 PM',
                  status_tag: 'Ward Round (PM)',
                  diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk, resolving',
                  progress_notes_subjective: 'Hospital Day 2 (PM Rounds). Resting comfortably in bed, afebrile, breathing easily on room air.',
                  progress_notes_objective: 'Vital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99% on room air.\nChest: Clear breath sounds bilaterally, minimal crackles at right base.',
                  progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, moderate risk, resolving. Stable; continue current management.',
                  progress_notes: 'Hospital Day 2 (PM Rounds). Resting comfortably in bed, afebrile, breathing easily on room air.\nVital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99% on room air.\nChest: Clear breath sounds bilaterally, minimal crackles at right base.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving. Stable; continue current management.',
                  orders: [
                    { text: 'Continue current ward management and vital signs monitoring every 4 hours.', dateTime: '2026-06-13T16:30:00+08:00', cared: ['C'], timeSignature: 'C - 4:45 PM nurse' }
                  ]
                },
                {
                  date: '2026-06-14',
                  time: '09:00 AM',
                  status_tag: 'Discharge Planning',
                  diagnosis: 'J18.9 - Community-Acquired Pneumonia, resolved; I10 - Essential Hypertension, controlled',
                  progress_notes_subjective: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear.',
                  progress_notes_objective: 'Vital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.',
                  progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, resolved. Shift to home oral antibiotics.',
                  progress_notes: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear.\nVital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.\nDiagnosis: Community-Acquired Pneumonia, resolved. Shift to home oral antibiotics.',
                  orders: [
                    { text: 'Discharge patient today. Follow-up at Adult Medicine Outpatient Clinic after 1 week.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:30 AM nurse' },
                    { text: 'Shift to oral Co-amoxiclav 625 mg tablet TID to complete 7-day course.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:35 AM nurse' },
                    { text: 'Resume oral Metformin 500 mg tablet BID and Losartan 50 mg tablet OD.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:40 AM nurse' },
                    { text: 'Discontinue IVF line. Issue discharge clearance.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C', 'D'], timeSignature: 'C - 9:45 AM nurse\nD - 9:50 AM nurse' }
                  ]
                }
              ]
            },
            {
              date: '2026-06-12',
              time: '08:30 AM',
              registry: 'ER',
              case_no: 'ER-2026-0612-0051',
              encounter_no: 'ER-2026-0612-0051',
              service: 'Emergency Medicine',
              physician: 'Roberto Lim, MD',
              prc_license: '0089241',
              is_current: false,
              status_tag: 'Emergency Department',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk; I10 - Essential Hypertension Stage 1',
              patient_record: 'Initial assessment and emergency stabilization',
              results: 'Admitted to Medical Ward - Bed 302-A',
              disposition: 'Admitted to Medical Ward',
              vital_signs: [
                { dateTime: '2026-06-12 08:30 AM', bp: '138/86', hr: '102', rr: '24', temp: '38.2', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '93', o2: '93' }
              ],
              clinical_record: {
                chief_complaint: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.',
                history: 'High-grade fever, productive cough with yellowish sputum, and progressive shortness of breath x 3 days. Known diabetic and hypertensive. BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93% on room air. Crackles over right lower lung field, tachypneic.',
                final_diagnosis: 'Community-Acquired Pneumonia, moderate risk; Essential Hypertension Stage 1'
              },
              progress_notes_subjective: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.',
              progress_notes_objective: 'Vital signs: BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93%\nPhysical exam: Crackles over right lower lung field, tachypneic.',
              progress_notes_assessment: 'Diagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension',
              progress_notes: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.\nVital signs: BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93%\nPhysical exam: Crackles over right lower lung field, tachypneic.\nDiagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension',
              orders: [
                { text: 'Admit to Medical Ward under General Medicine service.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:30 PM nurse' },
                { text: 'Monitor vital signs every four hours and record intake and output.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:32 PM nurse' },
                { text: 'Low-salt diet, soft consistency as tolerated.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:35 PM nurse' },
                { text: 'PNSS 1 L at 80 mL/hour.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['A'], timeSignature: 'A - 12:45 PM nurse' },
                { text: 'Ceftriaxone 2 g IV once daily after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A', 'E'], timeSignature: 'C - 12:40 PM nurse\nA - 1:00 PM nurse\nE - 1:20 PM nurse' },
                { text: 'Azithromycin 500 mg tablet once daily.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse\nA - 1:05 PM nurse' },
                { text: 'Paracetamol 500 mg tablet every six hours as needed for fever >= 38.0°C.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:45 PM nurse\nA - 1:10 PM nurse' },
                { text: 'Oxygen at 2 L/minute via nasal cannula; maintain SpO2 at 95% or higher.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:50 PM nurse' }
              ]
            },
            {
              date: '2026-03-14',
              time: '08:45 AM',
              registry: 'OP',
              service: 'General Medicine',
              physician: 'Miguel Santos, MD',
              prc_license: '0087654',
              is_current: false,
              status_tag: 'Follow-up Visit',
              diagnosis: 'E11.9 - Type 2 Diabetes Mellitus; I10 - Essential Hypertension',
              patient_record: 'First outpatient consultation at CLMMRH OPD',
              results: 'Transferred maintenance care to CLMMRH Outpatient Service',
              disposition: 'Treated and Discharged (Outpatient)',
              follow_up: { date: '2026-06-20', clinic: 'General Medicine', reason: 'Semi-annual comprehensive diabetes and hypertension follow-up.' },
              vital_signs: [
                { dateTime: '2026-03-14 08:45 AM', bp: '128/80', hr: '74', rr: '16', temp: '36.6', wt: '71', ht: '168', weight: '71', height: '168', bmi: '25.2', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-op-0314-1', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0314-2', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Initial outpatient registration and care transfer to CLMMRH Chronic Disease Management Program.',
                history: 'Known diabetic and hypertensive for 6 years, transferring routine management to CLMMRH Outpatient Service. Denies acute complaints. Compliant with oral maintenance therapy.',
                final_diagnosis: 'Type 2 Diabetes Mellitus; Essential Hypertension Stage 1'
              },
              prescriptions: [
                { drug: 'Metformin 500 mg tablet', sig: '1 tablet orally twice daily with meals', qty: '90 tablets' },
                { drug: 'Losartan 50 mg tablet', sig: '1 tablet orally once daily', qty: '90 tablets' }
              ],
              clinicalRequests: {
                laboratory: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar (FBS)', 'HbA1c', 'BUN', 'Creatinine', 'Lipid Profile', 'Routine Urinalysis'],
                radiology: [],
                respiratory: [],
                heart: [],
                eeg: []
              },
              pertinent_signs: ['No acute complaints'],
              pertinent_signs_information: 'Denies acute complaints, polyuria, polydipsia, blurring of vision, chest discomfort, or dizziness.',
              physical_exam: 'Conscious, coherent, ambulatory, non-toxic. HEENT: Anicteric sclerae, pink conjunctivae. Chest/Lungs: Clear breath sounds. Heart: Regular rate and rhythm. Extremities: No pedal edema.',
              progress_notes_subjective: 'Known diabetic and hypertensive for 6 years, transferring routine management to CLMMRH Outpatient Service. Compliant with oral maintenance therapy.',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: 'Known diabetic and hypertensive for 6 years, transferring routine management to CLMMRH Outpatient Service. Compliant with oral maintenance therapy.',
              orders: [
                { text: 'Register in CLMMRH Chronic Disease Management OPD Program.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['C'], timeSignature: 'C - 9:00 AM nurse' },
                { text: 'Complete Blood Count (CBC)', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Fasting Blood Sugar (FBS)', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'HbA1c', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Blood Urea Nitrogen (BUN)', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Serum Creatinine', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Lipid Profile', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Routine Urinalysis', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
                { text: 'Continue Metformin 500 mg tablet BID and Losartan 50 mg tablet OD.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['C'], timeSignature: 'C - 9:10 AM nurse' },
                { text: 'Follow-up with laboratory results after 1 week.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['C'], timeSignature: 'C - 9:15 AM nurse' }
              ]
            },
            {
              date: '2025-12-05',
              time: '11:15 AM',
              registry: 'OP',
              service: 'Orthopedics',
              physician: 'Paolo Cruz, MD',
              prc_license: '0091245',
              is_current: false,
              status_tag: 'Follow-up',
              diagnosis: 'M17.11 - Unilateral Primary Osteoarthritis, Right Knee, resolving pain',
              patient_record: 'Orthopedic outpatient follow-up for right knee osteoarthritis; mobility evaluation',
              results: 'Knee range of motion preserved; pain improved from 6/10 to 2/10',
              disposition: 'Treated and Discharged (Outpatient)',
              follow_up: { date: '2026-06-05', clinic: 'Orthopedics', reason: 'Semi-annual right knee osteoarthritis surveillance.' },
              vital_signs: [
                { dateTime: '2025-12-05 11:15 AM', bp: '122/78', hr: '74', rr: '16', temp: '36.5', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-ortho-1205-1', name: 'Celecoxib 200 mg capsule', route: 'Oral PRN for knee pain flare-ups', indication: 'Right Knee Osteoarthritis', started: '2025-09-18T14:30:00+08:00', doses24h: 'PRN', status: 'Active / PRN', nurse: 'Paolo Cruz, MD' }
              ],
              prescriptions: [
                { drug: 'Celecoxib 200 mg capsule', sig: '1 capsule orally once daily as needed for pain flare-ups', qty: '30 capsules' }
              ],
              clinicalRequests: {
                laboratory: [],
                radiology: ['Digital Knee Radiograph (Right AP/Lateral)'],
                respiratory: [],
                heart: [],
                eeg: []
              },
              pertinent_signs: ['Resolving right knee pain (2/10)'],
              pertinent_signs_information: 'No morning joint stiffness > 30 minutes, no joint locking, giving way, swelling, or redness.',
              physical_exam: 'Gait normal without antalgic limp. Right knee: No joint effusion, no local warmth or erythema. Range of motion: Full flexion to 135° and full extension to 0°. Mild non-tender medial joint line crepitus. Anterior/posterior drawer and McMurray tests negative.',
              clinical_record: {
                chief_complaint: 'Follow-up right knee pain and mobility assessment',
                history: 'Scheduled 3-month orthopedic follow-up for mild primary osteoarthritis of the right knee. Demonstrates good symptom improvement on physical therapy and home quadriceps rehabilitation.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, clinically stable'
              },
              progress_notes_subjective: 'Patient reports significant improvement in right knee pain after physical therapy and home quadriceps strengthening exercises.',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: 'Patient reports significant improvement in right knee pain after physical therapy and home quadriceps strengthening exercises.',
              orders: [
                { text: 'Shift Celecoxib 200 mg capsule to strictly PRN for right knee pain flare-ups.', dateTime: '2025-12-05T11:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:35 AM nurse' },
                { text: 'Continue home quadriceps and hamstring isometric strengthening exercise program.', dateTime: '2025-12-05T11:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:40 AM nurse' },
                { text: 'Weight management counseling reinforced to minimize joint compressive stress.', dateTime: '2025-12-05T11:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:45 AM nurse' },
                { text: 'Follow-up at Orthopedics Outpatient Clinic after 6 months or PRN acute pain.', dateTime: '2025-12-05T11:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:50 AM nurse' }
              ]
            },
            {
              date: '2025-09-18',
              time: '02:30 PM',
              registry: 'OP',
              service: 'Orthopedics',
              physician: 'Paolo Cruz, MD',
              prc_license: '0091245',
              is_current: false,
              is_initial: true,
              status_tag: 'Initial Visit',
              diagnosis: 'M17.11 - Unilateral Primary Osteoarthritis, Right Knee, mild',
              patient_record: 'Initial orthopedic evaluation for progressive right knee joint pain',
              results: 'Digital Knee X-ray AP/Lateral: mild medial joint space narrowing; no fracture',
              disposition: 'Treated and Discharged (Outpatient)',
              follow_up: { date: '2025-12-05', clinic: 'Orthopedics', reason: 'Post-PT 12-week clinical review and range of motion assessment.' },
              vital_signs: [
                { dateTime: '2025-09-18 02:30 PM', bp: '126/80', hr: '78', rr: '18', temp: '36.7', wt: '70', ht: '168', weight: '70', height: '168', bmi: '24.8', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-ortho-0918-1', name: 'Celecoxib 200 mg capsule', route: 'Oral Once Daily after meals for 14 days', indication: 'Right Knee Osteoarthritis', started: '2025-09-18T14:30:00+08:00', doses24h: '1 dose', status: 'Completed', nurse: 'Paolo Cruz, MD' },
                { id: 'med-ortho-0918-2', name: 'Paracetamol 500 mg tablet', route: 'Oral Every 6 hours PRN for breakthrough pain', indication: 'Breakthrough knee pain', started: '2025-09-18T14:30:00+08:00', doses24h: 'PRN', status: 'Active / PRN', nurse: 'Paolo Cruz, MD' }
              ],
              prescriptions: [
                { drug: 'Celecoxib 200 mg capsule', sig: '1 capsule orally once daily after meals for 14 days', qty: '14 capsules' },
                { drug: 'Paracetamol 500 mg tablet', sig: '1 tablet every 6 hours PRN for breakthrough pain', qty: '20 tablets' }
              ],
              clinicalRequests: {
                laboratory: [],
                radiology: ['Digital Knee Radiograph (AP and Lateral Weight-Bearing Views)'],
                respiratory: [],
                heart: [],
                eeg: []
              },
              pertinent_signs: ['Right knee pain on walking', 'Crepitus'],
              pertinent_signs_information: 'Denies knee locking, giving way, joint instability, morning stiffness, or joint erythema.',
              physical_exam: 'Right knee: Mild medial joint line tenderness and crepitus on passive flexion. No joint effusion, local warmth, or erythema. Active ROM 0° to 125°. Ligamentous testing negative.',
              clinical_record: {
                chief_complaint: 'Right knee joint aching pain on walking and climbing stairs x 2 months',
                history: 'Progressive right knee pain on walking and climbing stairs x 2 months without prior trauma.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, Grade II'
              },
              progress_notes: 'Progressive right knee pain on walking and climbing stairs x 2 months without prior trauma.',
              orders: [
                { text: 'Digital Knee Radiograph (AP and Lateral Weight-Bearing Views) completed: Mild medial joint space narrowing.', dateTime: '2025-09-18T14:30:00+08:00', cared: ['C'], timeSignature: 'C - 2:45 PM nurse' },
                { text: 'Celecoxib 200 mg capsule once daily after meals for 14 days.', dateTime: '2025-09-18T14:30:00+08:00', cared: ['C'], timeSignature: 'C - 2:50 PM nurse' },
                { text: 'Paracetamol 500 mg tablet every 6 hours PRN for breakthrough knee pain.', dateTime: '2025-09-18T14:30:00+08:00', cared: ['C'], timeSignature: 'C - 2:52 PM nurse' },
                { text: 'Refer to Physical Medicine and Rehabilitation for 6 sessions of knee physical therapy.', dateTime: '2025-09-18T14:30:00+08:00', cared: ['R'], timeSignature: 'R - 2:55 PM physician' },
                { text: 'Follow-up at Orthopedics Outpatient Clinic after 3 months.', dateTime: '2025-09-18T14:30:00+08:00', cared: ['C'], timeSignature: 'C - 3:00 PM nurse' }
              ],
              examinations: [
                {
                  id: 'EXAM-20250918-01',
                  category: 'Diagnostic Radiology',
                  name: 'Digital Radiography: Right Knee (AP & Lateral Weight-Bearing Views)',
                  performed_at: '2025-09-18 02:45 PM',
                  status: 'Completed',
                  performed_by: 'J. Ramos, RT(R) / Reading by Dr. Roberto Lim, Radiologist',
                  findings: 'Mild narrowing of the medial femorotibial joint space with mild subchondral sclerosis. Minimal marginal osteophyte formation at the medial tibial spine. Patellofemoral joint space preserved. No joint effusion, periosteal reaction, or acute bone fracture.',
                  impression: 'Mild Right Knee Osteoarthritis (Kellgren-Lawrence Grade II).'
                }
              ]
            }
          ],
          orders: {
            plans: [],
            diet: [],
            iv: [],
            medications: [],
            special: [],
            procedures: [],
            clinicalRequests: {
              laboratory: [],
              radiology: [],
              respiratory: [],
              heart: [],
              eeg: []
            },
            prescriptions: {
              items: []
            }
          },
          referrals: [],
          disposition: '',
          follow_up_needed: 'No',
          follow_up_date: '',
          follow_up_reason: ''
        }
      };
    }

    function erPatientRecord() {
      return {
        id: ER_PATIENT_ID,
        seedVersion: 71,
        createdAt: '2026-06-12T08:30:00+08:00',
        updatedAt: '2026-06-14T09:30:00+08:00',
        data: {
          hrn: '0000001925',
          philhealth_no: '06-024918274-1',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Miguel Santos, MD', prc_no: '0094821', s2_no: 'S2-094821-2026' },
          last_name: 'MAKILING',
          first_name: 'JUAN',
          middle_name: 'DELA CRUZ',
          birthdate: '1976-08-15',
          gender: 'Male',
          address: 'Brgy. Mansilingan, Bacolod City, Negros Occidental',
          ward_room: 'Medical Ward - Bed 302-A',
          er_bed: 'ER - Acute Care Bed 04',
          ward_area: 'General Medicine',
          case_no: 'IP-2026-0612-0088',
          encounter_no: 'IP-2026-0612-0088',
          case_type: 'ER & Inpatient',
          admitted_at: '06/12/2026 08:30 AM',
          admission_date: '06/12/2026 12:30 PM',
          chief_complaint: 'High-grade fever, productive cough, and progressive shortness of breath',
          hx_present: '50-year-old male presenting with a 3-day history of high-grade fever, productive cough with yellowish purulent sputum, and progressive shortness of breath on exertion. Initially arrived at the Emergency Department on June 12, 2026 in moderate respiratory distress (SpO2 93%, RR 24/min, Temp 38.2 °C) with right lower lung crackles. Admitted to the Medical Ward for targeted parenteral antimicrobial therapy and respiratory support. Following 48 hours of IV Ceftriaxone and Azithromycin, fever has lysed, dyspnea has completely resolved, and the patient is clinically stable for step-down oral therapy.',
          hx_surgical: 'No previous surgical operations.',
          hx_past: 'Essential Hypertension Stage 1 (diagnosed 2021); Type 2 Diabetes Mellitus (diagnosed 2022). No prior adverse drug events.',
          hx_family: 'Father with history of cerebrovascular disease; Mother living with hypertension.',
          hx_social: 'Non-smoker, denies alcohol intake. Logistics coordinator.',
          hx_allergy: 'No known drug or food allergies (NKDA).',
          pertinent_signs: ['Productive cough', 'Fever', 'Dyspnea'],
          pertinent_signs_information: 'Resolved following inpatient antimicrobial therapy; no current chest pain or dyspnea.',
          pe_general: 'Conscious, coherent, ambulatory, afebrile, in no respiratory distress.',
          pe_heent: 'Anicteric sclerae, pink conjunctivae, moist oral mucosa, no neck vein engorgement.',
          pe_chest_lungs: 'Symmetric chest excursion, clear breath sounds bilaterally, resolving bibasilar adventitious sounds.',
          pe_cardiovascular: 'Regular rhythm, normal heart sounds (S1, S2), no murmurs or thrills.',
          pe_abdomen: 'Soft, non-tender, flat, no organomegaly, active bowel sounds.',
          pe_extremities: 'Warm extremities, brisk capillary refill (<2s), no peripheral edema, pulses full and equal.',
          pe_neurologic: 'Alert, oriented x 3, cranial nerves II-XII intact, motor strength 5/5 in all extremities.',
          pe_skin: 'Warm, dry, good turgor, no rashes or petechiae.',
          pe_other: '',
          other_forms: [],
          other_forms_notes: '',
          neonate: null,
          pediatric_growth: null,
          vital_signs: [
            { dateTime: '2026-06-14 09:00 AM', bp: '118/74', hr: '72', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
            { dateTime: '2026-06-14 06:00 AM', bp: '116/74', hr: '70', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
            { dateTime: '2026-06-13 10:00 PM', bp: '118/74', hr: '72', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
            { dateTime: '2026-06-13 04:30 PM', bp: '118/76', hr: '74', rr: '16', temp: '36.6', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
            { dateTime: '2026-06-13 10:15 AM', bp: '120/80', hr: '78', rr: '18', temp: '36.8', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '98', o2: '98' },
            { dateTime: '2026-06-13 06:00 AM', bp: '120/80', hr: '80', rr: '18', temp: '37.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '97', o2: '97' },
            { dateTime: '2026-06-12 10:00 PM', bp: '122/80', hr: '82', rr: '18', temp: '37.1', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '97', o2: '97' },
            { dateTime: '2026-06-12 04:30 PM', bp: '126/80', hr: '86', rr: '20', temp: '37.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '96', o2: '96' },
            { dateTime: '2026-06-12 12:30 PM', bp: '130/82', hr: '92', rr: '22', temp: '38.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '95', o2: '95' },
            { dateTime: '2026-06-12 08:30 AM', bp: '138/86', hr: '102', rr: '24', temp: '38.2', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '93', o2: '93' }
          ],
          encounters: [
            {
              date: '2026-06-14',
              time: '09:00 AM',
              registry: 'IP',
              case_no: 'IP-2026-0612-0088',
              encounter_no: 'IP-2026-0612-0088',
              service: 'General Medicine',
              ward_room: 'Medical Ward - Bed 302-A',
              physician: 'Miguel Santos, MD',
              prc_license: '0078312',
              is_current: true,
              status_tag: 'Inpatient Admission',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, resolved; I10 - Essential Hypertension, controlled',
              patient_record: 'Inpatient Admission — Medical Ward (Bed 302-A)',
              results: 'Discharged clinically stable',
              disposition: 'Discharged',
              follow_up: { date: '2026-06-21', clinic: 'General Medicine', reason: 'Post-discharge 1-week pulmonary and metabolic review.' },
              vital_signs: [
                { dateTime: '2026-06-14 09:00 AM', bp: '118/74', hr: '72', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
                { dateTime: '2026-06-14 06:00 AM', bp: '116/74', hr: '70', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
                { dateTime: '2026-06-13 10:00 PM', bp: '118/74', hr: '72', rr: '16', temp: '36.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
                { dateTime: '2026-06-13 04:30 PM', bp: '118/76', hr: '74', rr: '16', temp: '36.6', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '99', o2: '99' },
                { dateTime: '2026-06-13 10:15 AM', bp: '120/80', hr: '78', rr: '18', temp: '36.8', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '98', o2: '98' },
                { dateTime: '2026-06-13 06:00 AM', bp: '120/80', hr: '80', rr: '18', temp: '37.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '97', o2: '97' },
                { dateTime: '2026-06-12 10:00 PM', bp: '122/80', hr: '82', rr: '18', temp: '37.1', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '97', o2: '97' },
                { dateTime: '2026-06-12 04:30 PM', bp: '126/80', hr: '86', rr: '20', temp: '37.5', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '96', o2: '96' },
                { dateTime: '2026-06-12 12:30 PM', bp: '130/82', hr: '92', rr: '22', temp: '38.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '95', o2: '95' }
              ],
              medications: [
                { id: 'med-ip-0614-1', name: 'Co-amoxiclav 625 mg tablet', route: 'Oral Three Times Daily (TID)', indication: 'Step-down therapy for pneumonia', started: '2026-06-14T09:00:00+08:00', doses24h: '3 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0614-2', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-06-12T08:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0614-3', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID)', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-12T08:30:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Hospitalization for Community-Acquired Pneumonia, Moderate Risk',
                history: '50-year-old male admitted from ER on June 12, 2026 for CAP-MR and Essential Hypertension. Treated with targeted IV Ceftriaxone and Azithromycin. Clinically resolved and discharged on June 14, 2026 in stable condition.',
                final_diagnosis: 'Community-Acquired Pneumonia, resolved; Essential Hypertension Stage 1, controlled'
              },
              progress_notes_subjective: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear, no cough or dyspnea.',
              progress_notes_objective: 'Vital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.\nLungs clear bilaterally, good air entry.',
              progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, resolved. Essential Hypertension Stage 1, controlled. Ready for home discharge on oral maintenance.',
              progress_notes: 'Hospital Day 3. Patient clinically well, completely afebrile x 48 hours. Lungs clear, no cough or dyspnea.\nVital signs: BP 118/74 mmHg, HR 72 bpm, RR 16/min, Temp 36.5 °C, SpO2 99% on room air.\nDiagnosis: Community-Acquired Pneumonia, resolved. Shift to home oral antibiotics.',
              orders: [
                { text: 'Discharge patient today. Follow-up at Adult Medicine Outpatient Clinic after 1 week.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:30 AM nurse' },
                { text: 'Shift to oral Co-amoxiclav 625 mg tablet TID to complete 7-day course.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:35 AM nurse' },
                { text: 'Resume oral Metformin 500 mg tablet BID and Losartan 50 mg tablet OD.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C'], timeSignature: 'C - 9:40 AM nurse' },
                { text: 'Discontinue IVF line. Issue discharge clearance.', dateTime: '2026-06-14T09:00:00+08:00', cared: ['C', 'D'], timeSignature: 'C - 9:45 AM nurse\nD - 9:50 AM nurse' }
              ],
              rounds: [
                {
                  date: '2026-06-13',
                  time: '10:15 AM',
                  status_tag: 'Morning Rounds',
                  diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk, resolving',
                  progress_notes_subjective: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved.',
                  progress_notes_objective: 'Vital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air\nChest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.',
                  progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics',
                  progress_notes: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved.\nVital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air\nChest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics',
                  orders: [
                    { text: 'Wean off nasal cannula oxygen; maintain SpO2 >= 95% on room air.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' },
                    { text: 'Continue IV Ceftriaxone 2 g OD (Day 2 of 7).', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:35 AM nurse\nA - 11:00 AM nurse' },
                    { text: 'Shift Azithromycin to oral 500 mg tablet once daily after meals.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:40 AM nurse\nA - 11:05 AM nurse' },
                    { text: 'Repeat Complete Blood Count (CBC) and serum creatinine tomorrow 6:00 AM.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['R'], timeSignature: 'R - 10:45 AM physician' },
                    { text: 'May ambulate inside room as tolerated. Regular diet.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:00 AM nurse' }
                  ]
                },
                {
                  date: '2026-06-13',
                  time: '04:30 PM',
                  status_tag: 'Afternoon Rounds',
                  diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk, stable',
                  progress_notes_subjective: 'Hospital Day 2 (Afternoon Rounds). Patient comfortably resting in bed. Tolerating oral diet well.',
                  progress_notes_objective: 'Vital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99% room air\nChest auscultation: Clear breath sounds bilateral upper zones, minimal crackles right base.',
                  progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, moderate risk, clinically stable. Continue current regimen.',
                  progress_notes: 'Hospital Day 2 (Afternoon Rounds). Patient comfortably resting in bed. Tolerating oral diet well.\nVital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99% room air\nChest auscultation: Clear breath sounds bilateral upper zones, minimal crackles right base.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, clinically stable. Continue current regimen.',
                  orders: [
                    { text: 'Continue current ward management and vital signs monitoring every 4 hours.', dateTime: '2026-06-13T16:30:00+08:00', cared: ['C'], timeSignature: 'C - 4:45 PM nurse' }
                  ]
                }
              ],
              intakeOutput: [
                { id: 'io-ip-1', shift: '7-3', date: '2026-06-12', inOral: 450, inIvf: 560, inBloodMeds: 50, outUrine: 650, outDrain: 0, outStool: 0, nurse: 'M. Santos, RN', remarks: 'Clear amber urine; PNSS 1L infusing at 80 mL/hr; tolerating oral fluids' },
                { id: 'io-ip-2', shift: '3-11', date: '2026-06-12', inOral: 600, inIvf: 640, inBloodMeds: 50, outUrine: 750, outDrain: 0, outStool: 150, nurse: 'R. Alcantara, RN', remarks: 'Stable vitals; soft formed stool x1; adequate hydration' },
                { id: 'io-ip-3', shift: '11-7', date: '2026-06-12', inOral: 200, inIvf: 640, inBloodMeds: 0, outUrine: 550, outDrain: 0, outStool: 0, nurse: 'E. Cruz, RN', remarks: 'Overnight balance positive; sleeping comfortably; no dysuria' },
                { id: 'io-ip-4', shift: '7-3', date: '2026-06-13', inOral: 750, inIvf: 640, inBloodMeds: 50, outUrine: 850, outDrain: 0, outStool: 200, nurse: 'M. Santos, RN', remarks: 'Oral low-salt diet well tolerated; diuresing well; afebrile' },
                { id: 'io-ip-5', shift: '3-11', date: '2026-06-13', inOral: 700, inIvf: 320, inBloodMeds: 0, outUrine: 750, outDrain: 0, outStool: 0, nurse: 'R. Alcantara, RN', remarks: 'IVF completed and stopped; good oral fluid intake maintained' }
              ]
            },
            {
              date: '2026-06-12',
              time: '08:30 AM',
              registry: 'ER',
              case_no: 'ER-2026-0612-0051',
              encounter_no: 'ER-2026-0612-0051',
              service: 'Emergency Medicine',
              ward_room: 'ER - Acute Care Bed 04',
              physician: 'Roberto Lim, MD',
              prc_license: '0089241',
              is_current: false,
              status_tag: 'Emergency Department',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk; I10 - Essential Hypertension Stage 1',
              patient_record: 'Initial assessment and emergency stabilization',
              results: 'Admitted to Medical Ward - Bed 302-A',
              disposition: 'Admitted to Medical Ward',
              vital_signs: [
                { dateTime: '2026-06-12 12:00 PM', bp: '132/84', hr: '96', rr: '22', temp: '38.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '95', o2: '95' },
                { dateTime: '2026-06-12 10:30 AM', bp: '136/84', hr: '98', rr: '22', temp: '38.1', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '94', o2: '94' },
                { dateTime: '2026-06-12 08:30 AM', bp: '138/86', hr: '102', rr: '24', temp: '38.2', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '93', o2: '93' }
              ],
              clinical_record: {
                chief_complaint: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.',
                history: 'High-grade fever, productive cough with yellowish sputum, and progressive shortness of breath x 3 days. Known diabetic and hypertensive. BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93% on room air. Crackles over right lower lung field, tachypneic.',
                final_diagnosis: 'Community-Acquired Pneumonia, moderate risk; Essential Hypertension Stage 1'
              },
              progress_notes_subjective: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.',
              progress_notes_objective: 'Vital signs: BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93%\nPhysical exam: Crackles over right lower lung field, tachypneic.',
              progress_notes_assessment: 'Diagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension',
              progress_notes: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.\nVital signs: BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93%\nPhysical exam: Crackles over right lower lung field, tachypneic.\nDiagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension',
              orders: [
                { text: 'Admit to Medical Ward under General Medicine service.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:30 PM nurse' },
                { text: 'Monitor vital signs every four hours and record intake and output.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:32 PM nurse' },
                { text: 'Low-salt diet, soft consistency as tolerated.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:35 PM nurse' },
                { text: 'PNSS 1 L at 80 mL/hour.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['A'], timeSignature: 'A - 12:45 PM nurse' },
                { text: 'Ceftriaxone 2 g IV once daily after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A', 'E'], timeSignature: 'C - 12:40 PM nurse\nA - 1:00 PM nurse\nE - 1:20 PM nurse' },
                { text: 'Azithromycin 500 mg tablet once daily.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse\nA - 1:05 PM nurse' },
                { text: 'Paracetamol 500 mg tablet every six hours as needed for fever >= 38.0°C.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:45 PM nurse\nA - 1:10 PM nurse' },
                { text: 'Oxygen at 2 L/minute via nasal cannula; maintain SpO2 at 95% or higher.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:50 PM nurse' }
              ],
              intakeOutput: [
                { id: 'io-er-1', shift: '7-3', date: '2026-06-12', inOral: 450, inIvf: 560, inBloodMeds: 50, outUrine: 650, outDrain: 0, outStool: 0, nurse: 'M. Santos, RN', remarks: 'Clear amber urine; PNSS 1L infusing at 80 mL/hr; tolerating oral fluids' }
              ]
            }
          ],
          orders: {
            plans: [
              { text: 'Discharge patient today. Follow-up at Adult Medicine Outpatient Clinic after 1 week.' },
              { text: 'Resume oral maintenance medications for hypertension and diabetes.' }
            ],
            diet: [
              { text: 'Low-salt, diabetic meal plan.' }
            ],
            iv: [
              { text: 'Discontinue IVF line prior to discharge.' }
            ],
            medications: [
              { name: 'Co-amoxiclav', dose: '625 mg', route: 'Oral', freq: 'Three Times Daily (TID)', duration: '7 days', remarks: 'Complete full 7-day course' },
              { name: 'Losartan', dose: '50 mg', route: 'Oral', freq: 'Once Daily (OD)', duration: 'Maintenance', remarks: 'Hypertension maintenance' },
              { name: 'Metformin', dose: '500 mg', route: 'Oral', freq: 'Twice Daily (BID)', duration: 'Maintenance', remarks: 'Take with meals' }
            ],
            special: [],
            procedures: [],
            clinicalRequests: {
              laboratory: [],
              radiology: [],
              respiratory: [],
              heart: [],
              eeg: []
            },
            prescriptions: {
              items: [
                { drug: 'Co-amoxiclav 625 mg tablet', sig: 'Take 1 tablet by mouth three times daily for 7 days', qty: '21 tablets' },
                { drug: 'Losartan 50 mg tablet', sig: 'Take 1 tablet by mouth once daily in the morning', qty: '30 tablets' },
                { drug: 'Metformin 500 mg tablet', sig: 'Take 1 tablet by mouth twice daily with meals', qty: '60 tablets' }
              ]
            }
          },
          referrals: [],
          disposition: 'Discharged',
          follow_up_needed: 'Yes',
          follow_up_date: '2026-06-21',
          follow_up_reason: 'Post-discharge 1-week pulmonary and metabolic review.'
        }
      };
    }

    function blankPatientRecord() {
      return {
        id: BLANK_PATIENT_ID,
        seedVersion: 43,
        createdAt: '2026-09-25T10:30:00+08:00',
        updatedAt: '2026-09-25T10:30:00+08:00',
        data: {
          hrn: '0000001678',
          philhealth_no: '',
          phic_member_category: '',
          attending_physician: { name: '', prc_no: '', s2_no: '' },
          last_name: 'NEW PATIENT',
          first_name: 'SAMPLE',
          middle_name: '',
          birthdate: '2000-01-15',
          gender: 'Male',
          address: '',
          case_no: 'NEW-2026-0001',
          case_type: 'New Patient',
          hx_allergy: '',
          neonate: null,
          encounters: [],
          orders: { plans: [], diet: [], iv: [], medications: [], special: [], procedures: [], clinicalRequests: { laboratory: [], radiology: [], respiratory: [], heart: [], eeg: [] }, prescriptions: { items: [] } },
          referrals: []
        }
      };
    }

    var erChartMonitoringData = {
      ivFluids: [
        { id: 'ivf-er-1', bottle: 'Bottle #1', solution: 'Plain Normal Saline Solution (PNSS) 1 L', rate: '80 mL/hr', started: '2026-06-12T12:45:00+08:00', ended: '2026-06-13T01:15:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'M. Santos, RN', remarks: 'ER to Medical Ward baseline hydration; IV cannula 20G left cephalic vein' },
        { id: 'ivf-er-2', bottle: 'Bottle #2', solution: 'D5 0.3% NaCl 1 L + 20 mEq KCl', rate: '80 mL/hr', started: '2026-06-13T01:30:00+08:00', ended: '2026-06-13T14:00:00+08:00', volume: '1000 mL (Consumed)', status: 'Consumed', nurse: 'R. Alcantara, RN', remarks: 'Hospital Day 2 maintenance hydration and electrolyte replacement' },
        { id: 'ivf-er-3', bottle: 'Bottle #3', solution: 'Plain Normal Saline Solution (PNSS) 500 mL', rate: '20 mL/hr (KVO)', started: '2026-06-13T14:15:00+08:00', ended: '2026-06-14T09:00:00+08:00', volume: '500 mL (Consumed)', status: 'Consumed', nurse: 'E. Cruz, RN', remarks: 'Keep vein open for parenteral antibiotics; discontinued prior to discharge' }
      ],
      transfusions: [],
      cbgs: [
        { id: 'cbg-er-1', dateTime: '2026-06-12T12:30:00+08:00', timing: 'Admission Random Blood Sugar (RBS)', reading: 168, action: 'Stress hyperglycemia from acute CAP; regular diabetic diet', notes: 'Checked on transfer from ED to Medical Ward', nurse: 'M. Santos, RN' },
        { id: 'cbg-er-2', dateTime: '2026-06-13T06:00:00+08:00', timing: 'Fasting Blood Sugar (FBS)', reading: 128, action: 'Target met (<140 mg/dL); continue Metformin 500 mg BID', notes: 'Hospital Day 2 morning fasting check', nurse: 'R. Alcantara, RN' },
        { id: 'cbg-er-3', dateTime: '2026-06-13T17:00:00+08:00', timing: 'Pre-dinner CBG', reading: 134, action: 'Acceptable glycemic control', notes: 'Hospital Day 2 afternoon check prior to dinner', nurse: 'R. Alcantara, RN' },
        { id: 'cbg-er-4', dateTime: '2026-06-14T06:00:00+08:00', timing: 'Fasting Blood Sugar (FBS)', reading: 118, action: 'Optimal fasting control (80-130 mg/dL)', notes: 'Hospital Day 3 pre-discharge fasting check; cleared on home Metformin', nurse: 'E. Cruz, RN' }
      ],
      medications: [
        { id: 'med-er-1', name: 'Ceftriaxone 2 g IV vial', route: 'IV Once Daily (OD) ANST (-)', indication: 'Community-Acquired Pneumonia (Moderate Risk)', started: '2026-06-12T13:00:00+08:00', lastDose: '2026-06-13T13:00:00+08:00', nextDose: 'Shifted to oral step-down', doses24h: '2 doses', status: 'Completed / Shifted', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-2', name: 'Azithromycin 500 mg tablet', route: 'Oral Once Daily (OD) after meals', indication: 'Atypical coverage for CAP', started: '2026-06-12T13:05:00+08:00', lastDose: '2026-06-13T13:05:00+08:00', nextDose: 'Completed 3-day course', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-3', name: 'Co-amoxiclav 625 mg tablet', route: 'Oral Three Times Daily (TID)', indication: 'Discharge step-down therapy for pneumonia', started: '2026-06-14T09:00:00+08:00', lastDose: '2026-06-14T09:00:00+08:00', nextDose: '2026-06-14T17:00:00+08:00', doses24h: '3 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-4', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension Stage 1', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-14T08:00:00+08:00', nextDose: '2026-06-15T08:00:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-5', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-14T08:00:00+08:00', nextDose: '2026-06-14T18:00:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-6', name: 'Paracetamol 500 mg tablet', route: 'Oral Every 6 Hours PRN for Temp >= 38.0°C', indication: 'Fever / Headache', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-12T20:00:00+08:00', nextDose: 'PRN (Afebrile)', doses24h: '0 doses', status: 'Active / PRN', nurse: 'Miguel Santos, MD' }
      ],
      intakeOutput: [
        { id: 'io-er-1', shift: '7-3', date: '2026-06-12', inOral: 450, inIvf: 560, inBloodMeds: 50, outUrine: 650, outDrain: 0, outStool: 0, nurse: 'M. Santos, RN', remarks: 'Clear amber urine; PNSS 1L infusing at 80 mL/hr; tolerating oral fluids' },
        { id: 'io-er-2', shift: '3-11', date: '2026-06-12', inOral: 600, inIvf: 640, inBloodMeds: 50, outUrine: 750, outDrain: 0, outStool: 150, nurse: 'R. Alcantara, RN', remarks: 'Stable vitals; soft formed stool x1; adequate hydration' },
        { id: 'io-er-3', shift: '11-7', date: '2026-06-12', inOral: 200, inIvf: 640, inBloodMeds: 0, outUrine: 550, outDrain: 0, outStool: 0, nurse: 'E. Cruz, RN', remarks: 'Overnight balance positive; sleeping comfortably; no dysuria' },
        { id: 'io-er-4', shift: '7-3', date: '2026-06-13', inOral: 750, inIvf: 640, inBloodMeds: 50, outUrine: 850, outDrain: 0, outStool: 200, nurse: 'M. Santos, RN', remarks: 'Oral low-salt diet well tolerated; diuresing well; afebrile' },
        { id: 'io-er-5', shift: '3-11', date: '2026-06-13', inOral: 700, inIvf: 320, inBloodMeds: 0, outUrine: 750, outDrain: 0, outStool: 0, nurse: 'R. Alcantara, RN', remarks: 'IVF completed and stopped; good oral fluid intake maintained' }
      ]
    };

    function ensureSeedPatient() {
      var records = getPatients();

      // Explicitly purge legacy Dela Cruz seed record (patient_1790299677879 / HRN 0000001677) to prevent registry confusion
      var hadLegacy = records.some(function (r) {
        return r && (r.id === 'patient_1790299677879' || (r.data && r.data.hrn === '0000001677'));
      });
      if (hadLegacy) {
        records = records.filter(function (record) {
          return record && record.id !== 'patient_1790299677879' && (!record.data || record.data.hrn !== '0000001677');
        });
        try {
          var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
          if (store && store['patient_1790299677879']) {
            delete store['patient_1790299677879'];
            localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      // Explicitly purge or migrate legacy patient_op_juan record
      var hadLegacyOp = records.some(function (r) {
        return r && (r.id === 'patient_op_juan');
      });
      if (hadLegacyOp) {
        records = records.filter(function (record) {
          return record && record.id !== 'patient_op_juan';
        });
        try {
          var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
          if (store && store['patient_op_juan']) {
            delete store['patient_op_juan'];
            localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      var opIndex = records.findIndex(function (record) { return record.id === OP_PATIENT_ID; });
      if (opIndex < 0) {
        records.unshift(opPatientRecord());
      } else if (Number(records[opIndex].seedVersion || 0) < 68) {
        records[opIndex] = opPatientRecord();
        try {
          var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
          if (store) {
            delete store[OP_PATIENT_ID];
            delete store[SEED_PATIENT_ID];
            delete store['patient_op_juan'];
            localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      var erIndex = records.findIndex(function (record) { return record.id === ER_PATIENT_ID; });
      if (erIndex < 0) {
        records.splice(1, 0, erPatientRecord());
      } else if (Number(records[erIndex].seedVersion || 0) < 71) {
        records[erIndex] = erPatientRecord();
      }
      try {
        var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
        if (store) {
          store[ER_PATIENT_ID] = erChartMonitoringData;
          localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
        }
      } catch (e) {}

      // Explicitly purge blank sample patient record (patient_new_blank_1790299677880 / HRN 0000001678)
      var hadBlankPatient = records.some(function (r) {
        return r && (r.id === BLANK_PATIENT_ID || r.id === 'patient_new_blank_1790299677880' || (r.data && r.data.hrn === '0000001678'));
      });
      if (hadBlankPatient) {
        records = records.filter(function (record) {
          return record && record.id !== BLANK_PATIENT_ID && record.id !== 'patient_new_blank_1790299677880' && (!record.data || record.data.hrn !== '0000001678');
        });
        try {
          var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
          if (store && store[BLANK_PATIENT_ID]) {
            delete store[BLANK_PATIENT_ID];
            localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      savePatients(records);
    }

    if (typeof window !== 'undefined') {
      window.ensureSeedPatient = ensureSeedPatient;
      window.erPatientRecord = erPatientRecord;
      window.erChartMonitoring = erChartMonitoringData;
      window.opPatientRecord = opPatientRecord;
      window.blankPatientRecord = blankPatientRecord;
      window.seedPatientRecord = seedPatientRecord;
      window.getPatients = getPatients;
      window.savePatients = savePatients;
      window.invalidatePatientsCache = invalidatePatientsCache;
      window.ER_PATIENT_ID = ER_PATIENT_ID;
      window.OP_PATIENT_ID = OP_PATIENT_ID;
      window.SEED_PATIENT_ID = SEED_PATIENT_ID;
      window.BLANK_PATIENT_ID = BLANK_PATIENT_ID;
      try {
        ensureSeedPatient();
      } catch (e) {
        console.warn('ensureSeedPatient auto-execution warning:', e);
      }
    }
