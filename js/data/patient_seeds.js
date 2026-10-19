/* ═══════════════════════════════════════════════════════════════
   HIS — Clinical Patient Registry & Baseline Records
   Hospital Master Patient Index (EMPI) Clinical Baseline Records
   ═══════════════════════════════════════════════════════════════ */

var STORAGE_KEY = 'his_patients_v1';
var SEED_PATIENT_ID = 'patient_op_carmela';
var OP_PATIENT_ID = 'patient_op_carmela';
var ER_PATIENT_ID = 'patient_er_juan';
var OB_PATIENT_ID = 'patient_ob_maria';
var NEO_PATIENT_ID = 'patient_neo_santos';
var LEGACY_OP_PATIENT_ID = 'patient_op_juan';
var BLANK_PATIENT_ID = 'patient_new_blank_1790299677880';

if (typeof window !== 'undefined') {
  window.ER_PATIENT_ID = ER_PATIENT_ID;
  window.OP_PATIENT_ID = OP_PATIENT_ID;
  window.OB_PATIENT_ID = OB_PATIENT_ID;
  window.NEO_PATIENT_ID = NEO_PATIENT_ID;
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
    var OB_PATIENT_ID = 'patient_ob_maria';
    var NEO_PATIENT_ID = 'patient_neo_santos';
    var LEGACY_OP_PATIENT_ID = 'patient_op_juan';

    function opPatientRecord() {
      return {
        id: OP_PATIENT_ID,
        seedVersion: 70,
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
          address: 'Brgy. Central, Metro City',
          ward_room: 'OPD - Room 104',
          ward_area: 'General Medicine',
          case_no: 'OP-2026-0926-0042',
          encounter_no: 'OP-2026-0926-0042',
          case_type: 'OP Patient',
          chief_complaint: 'Routine follow-up for chronic disease management',
          hx_present: 'Patient presents for scheduled outpatient surveillance of Type 2 Diabetes Mellitus and Essential Hypertension. Compliant with prescribed oral maintenance therapy. Reports stable energy levels without polyuria, polydipsia, blurred vision, or interval chest discomfort.',
          hx_surgical: 'No previous surgical procedures.',
          hx_past: 'Type 2 Diabetes Mellitus diagnosed 2020; Essential Hypertension Stage 1 diagnosed 2020; Mild Primary Osteoarthritis, Right Knee diagnosed 2025. Hospitalized at Regional Medical Ward (June 12-14, 2026) for Community-Acquired Pneumonia, moderate risk, resolved with IV antibiotics.',
          hx_family: 'Mother with Type 2 Diabetes Mellitus; Father with Hypertension.',
          hx_social: '[Home]: Lives with parents and family in suburban residential home.\n[Education/Employment]: Works as an office clerk, regular daytime schedule.\n[Activities]: Sedentary office work, light walking on weekends.\n[Drugs/Substance]: Non-smoker, non-alcoholic beverage drinker, denies illicit drug use.\n[Sexuality]: Denies history of sexually transmitted infections.\n[Suicide/Mood]: Euthymic, denies depression, anxiety, or suicidal ideation.',
          hx_social_home: 'Lives with parents and family in suburban residential home.',
          hx_social_education_employment: 'Works as an office clerk, regular daytime schedule.',
          hx_social_activities: 'Sedentary office work, light walking on weekends.',
          hx_social_drugs: 'Non-smoker, non-alcoholic beverage drinker, denies illicit drug use.',
          hx_social_sexuality: 'Denies history of sexually transmitted infections.',
          hx_social_suicide_mood: 'Euthymic, denies depression, anxiety, or suicidal ideation.',
          hx_allergy: 'No known food or drug allergies (NKFDA).',
          interview_medications: [
            {
              id: 'im-carmela-1',
              name: 'Losartan potassium 50 mg tablet',
              quantity: '30 tablets',
              dosage: '50 mg',
              frequency: 'Once daily (OD)',
              timing: 'Morning',
              period: 'Maintenance / Ongoing',
              duration: 'Ongoing',
              started: '2024-03-15',
              doctor: 'Miguel Santos, MD',
              remarks: 'Reported on Intake Interview (Hypertension maintenance)',
              status: 'Active / Home Med'
            },
            {
              id: 'im-carmela-2',
              name: 'Metformin hydrochloride 500 mg tablet',
              quantity: '60 tablets',
              dosage: '500 mg',
              frequency: 'Twice daily (BID)',
              timing: 'With meals',
              period: 'Maintenance / Ongoing',
              duration: 'Ongoing',
              started: '2024-03-15',
              doctor: 'Miguel Santos, MD',
              remarks: 'Reported on Intake Interview (T2DM maintenance)',
              status: 'Active / Home Med'
            }
          ],
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
              motherAddress: 'Brgy. Central, Metro City',
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
              asphyxia: 'No', congenital: 'None',
              encodedBy: 'Miguel Santos, MD | PRC No. 0094821 | 2026-09-26'
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
              futility: '',
              encodedBy: 'Elena M. Ramos, RN | PRC No. 0084321 | 2026-09-26'
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
            { id: 'trans-1', serial: 'B26-08914', component: 'Packed Red Blood Cells (PRBC)', bloodType: 'O Rh Positive', volume: '250 mL', expiration: '2026-10-15', started: '2026-09-25T09:00:00+08:00', ended: '2026-09-25T12:00:00+08:00', vitals: 'Pre: 104/65, HR 115, T 37.5°C, SpO2 92% | Post: 110/70, HR 88, T 37.2°C, SpO2 96%', reaction: 'None / Uneventful', nurse: 'Elena M. Ramos, RN / Checked: Miguel Santos, MD', crossmatch: 'Crossmatched & Compatible (Hospital Blood Bank BB-2026-X0412)' }
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
                { id: 'trans-1', serial: 'B26-08914', component: 'Packed Red Blood Cells (PRBC)', bloodType: 'O Rh Positive', volume: '250 mL', expiration: '2026-10-15', started: '2026-09-25T09:00:00+08:00', ended: '2026-09-25T12:00:00+08:00', vitals: 'Pre: 104/65, HR 115, T 37.5°C, SpO2 92% | Post: 110/70, HR 88, T 37.2°C, SpO2 96%', reaction: 'None / Uneventful', nurse: 'Elena M. Ramos, RN / Checked: Miguel Santos, MD', crossmatch: 'Crossmatched & Compatible (Hospital Blood Bank BB-2026-X0412)' }
              ],
              medications: [
                { id: 'med-op-0926-1', name: 'Empagliflozin 10 mg tablet', quantity: '30 tabs', dosage: '10 mg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD) in the morning', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-20T10:00:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0926-2', name: 'Metformin 500 mg tablet', quantity: '60 tabs', dosage: '500 mg', frequency: 'Twice daily (BID)', timing: 'With meals', period: 'Days', duration: '30 days', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0926-3', name: 'Losartan 50 mg tablet', quantity: '30 tabs', dosage: '50 mg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' }
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
                { id: 'med-op-0620-1', name: 'Empagliflozin 10 mg tablet', quantity: '30 tabs', dosage: '10 mg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD) in the morning', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-20T10:00:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0620-2', name: 'Metformin 500 mg tablet', quantity: '60 tabs', dosage: '500 mg', frequency: 'Twice daily (BID)', timing: 'With meals', period: 'Days', duration: '30 days', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-03-14T08:45:00+08:00', doses24h: '2 doses', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
                { id: 'med-op-0620-3', name: 'Losartan 50 mg tablet', quantity: '30 tabs', dosage: '50 mg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-03-14T08:45:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' }
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
              results: 'Admitted to Floor 1 ward 1',
              disposition: 'Admitted to Floor 1 ward 1',
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
                { text: 'Admit to Floor 1 ward 1 under the service of Dr. Miguel Santos.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:30 PM nurse' },
                { text: 'Low-salt diet, soft consistency as tolerated.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:35 PM nurse' },
                { text: 'PNSS 1 L at 80 mL/hour.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['A'], timeSignature: 'A - 12:45 PM nurse' },
                { text: 'Ceftriaxone 2 g IV once daily after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A', 'E'], timeSignature: 'C - 12:40 PM nurse\nA - 1:00 PM nurse\nE - 1:20 PM nurse' },
                { text: 'Azithromycin 500 mg tablet once daily.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse\nA - 1:05 PM nurse' },
                { text: 'Paracetamol 500 mg tablet every six hours as needed for fever >= 38.0°C.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:45 PM nurse\nA - 1:10 PM nurse' },
                { text: 'Monitor vital signs every four hours and record intake and output.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:32 PM nurse' },
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
              patient_record: 'First outpatient consultation at Hospital OPD',
              results: 'Transferred maintenance care to Hospital Outpatient Service',
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
                chief_complaint: 'Initial outpatient registration and care transfer to Hospital Chronic Disease Management Program.',
                history: 'Known diabetic and hypertensive for 6 years, transferring routine management to Hospital Outpatient Service. Denies acute complaints. Compliant with oral maintenance therapy.',
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
              progress_notes_subjective: 'Known diabetic and hypertensive for 6 years, transferring routine management to Hospital Outpatient Service. Compliant with oral maintenance therapy.',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: 'Known diabetic and hypertensive for 6 years, transferring routine management to Hospital Outpatient Service. Compliant with oral maintenance therapy.',
              orders: [
                { text: 'Register in Hospital Chronic Disease Management OPD Program.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['C'], timeSignature: 'C - 9:00 AM nurse' },
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
              diagnosis: 'M17.11 - Unilateral Primary Osteoarthritis, Right Knee, Grade II',
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
        seedVersion: 80,
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
          address: 'Brgy. San Jose, Medical District',
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
          hx_social: '[Home]: Resides in two-storey residential home with spouse.\n[Education/Employment]: Logistics coordinator; active warehouse supervisor.\n[Activities]: Moderate physical activity at work.\n[Drugs/Substance]: Non-smoker, denies alcohol intake, denies illicit drug use.\n[Sexuality]: Married, long-term monogamous relationship.\n[Suicide/Mood]: Denies mood disturbances, anxiety, or suicidal ideation.',
          hx_social_home: 'Resides in two-storey residential home with spouse.',
          hx_social_education_employment: 'Logistics coordinator; active warehouse supervisor.',
          hx_social_activities: 'Moderate physical activity at work.',
          hx_social_drugs: 'Non-smoker, denies alcohol intake, denies illicit drug use.',
          hx_social_sexuality: 'Married, long-term monogamous relationship.',
          hx_social_suicide_mood: 'Denies mood disturbances, anxiety, or suicidal ideation.',
          hx_allergy: 'No known drug or food allergies (NKDA).',
          interview_medications: [
            {
              id: 'im-juan-1',
              name: 'Amlodipine besylate 5 mg tablet',
              quantity: '30 tablets',
              dosage: '5 mg',
              frequency: 'Once daily (OD)',
              timing: 'Morning',
              period: 'Maintenance / Ongoing',
              duration: 'Ongoing',
              started: '2025-08-20',
              doctor: 'Miguel Santos, MD',
              remarks: 'Reported on Intake Interview (Antihypertensive maintenance)',
              status: 'Active / Home Med'
            }
          ],
          pertinent_signs: ['Cough', 'Fever', 'Dyspnea', 'Others'],
          pertinent_signs_information: 'Resolved following inpatient antimicrobial therapy; no current chest pain or dyspnea.',
          pe_general: 'Conscious, coherent, ambulatory, afebrile, in no respiratory distress.',
          pe_general_survey: 'Awake and Alert',
          pe_general_survey_other: 'Conscious, coherent, ambulatory, afebrile, in no respiratory distress.',
          pe_heent: ['Essentially Normal'],
          pe_heent_other: 'Anicteric sclerae, pink conjunctivae, moist oral mucosa, no neck vein engorgement.',
          pe_chest_lungs: ['Essentially normal'],
          pe_chest_lungs_other: 'Symmetric chest excursion, clear breath sounds bilaterally, resolving bibasilar adventitious sounds.',
          pe_cardiovascular: ['Essentially normal'],
          pe_cvs: ['Essentially normal'],
          pe_cvs_other: 'Regular rhythm, normal heart sounds (S1, S2), no murmurs or thrills.',
          pe_abdomen: ['Essentially normal'],
          pe_abdomen_other: 'Soft, non-tender, flat, no organomegaly, active bowel sounds.',
          pe_extremities: 'Warm extremities, brisk capillary refill (<2s), no peripheral edema, pulses full and equal.',
          pe_skin: 'Warm, dry, good turgor, no rashes or petechiae.',
          pe_skin_extremities: ['Essentially normal'],
          pe_skin_extremities_other: 'Warm extremities, brisk capillary refill (<2s), pulses full and equal; Warm, dry, good turgor, no rashes or petechiae.',
          pe_neurologic: 'Alert, oriented x 3, cranial nerves II-XII intact, motor strength 5/5 in all extremities.',
          pe_neuro_exam: ['Essentially normal'],
          pe_neuro_exam_other: 'Alert, oriented x 3, cranial nerves II-XII intact, motor strength 5/5 in all extremities.',
          pe_rectal: ['Essentially normal'],
          pe_rectal_other: '',
          pe_gu_ie: ['Essentially normal'],
          pe_gu_ie_other: '',
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
              date: '2026-06-13',
              time: '10:15 AM',
              registry: 'IP',
              case_no: 'IP-2026-0612-0088',
              encounter_no: 'IP-2026-0612-0088-02',
              service: 'General Medicine',
              ward_room: 'Medical Ward - Bed 302-A',
              physician: 'Miguel Santos, MD',
              prc_license: '0078312',
              is_current: false,
              status_tag: 'Morning Rounds',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk, resolving; I10 - Essential Hypertension',
              patient_record: 'Hospital Day 2 — Morning Ward Rounds (Bed 302-A)',
              results: 'Afebrile x 24 hours; weaned to room air; responding to IV Ceftriaxone',
              disposition: 'Continue Inpatient Management',
              follow_up: null,
              vital_signs: [
                { dateTime: '2026-06-13 10:15 AM', bp: '120/80', hr: '78', rr: '18', temp: '36.8', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '98', o2: '98' },
                { dateTime: '2026-06-13 06:00 AM', bp: '120/80', hr: '80', rr: '18', temp: '37.0', wt: '72', ht: '170', weight: '72', height: '170', bmi: '24.9', spo2: '97', o2: '97' }
              ],
              medications: [
                { id: 'med-ip-0613-1', name: 'Ceftriaxone 2 g vial', route: 'IV Once Daily (OD) (Day 2 of 7)', indication: 'Targeted antimicrobial therapy for CAP-MR', started: '2026-06-12T12:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0613-2', name: 'Azithromycin 500 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Atypical coverage for CAP', started: '2026-06-12T12:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0613-3', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-06-12T08:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ip-0613-4', name: 'Metformin 500 mg tablet', route: 'Oral Twice Daily (BID)', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-12T08:30:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Hospital Day 2: Morning Rounds for CAP-MR and Essential Hypertension',
                history: 'Hospital Day 2. Patient was admitted to Medical Ward from Emergency Department on June 12, 2026. Received IV Ceftriaxone 2 g OD (Day 2 of 7) and Azithromycin 500 mg OD. Temperature has normalized (afebrile at 36.8 °C for the past 24 hours). Dyspnea significantly resolved, ambulating comfortably in room. Productive cough is looser and less frequent with clearing sputum.',
                final_diagnosis: 'Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics'
              },
              progress_notes_subjective: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved. Afebrile x 24 hours.',
              progress_notes_objective: 'Vital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air.\nLungs: Decreased crackles over right lower lung field, good air entry.',
              progress_notes_assessment: 'Diagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics. Hemodynamically stable.',
              progress_notes: 'Hospital Day 2 (Morning Rounds). Productive cough decreasing, dyspnea significantly resolved. Afebrile x 24 hours.\nVital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% on room air.\nLungs: Decreased crackles over right lower lung field, good air entry.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted IV antibiotics.',
              orders: [
                { text: 'Wean off nasal cannula oxygen; maintain SpO2 >= 95% on room air.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' },
                { text: 'Regular diet as tolerated; encourage oral fluid intake.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' },
                { text: 'Continue D5 0.9 NaCl 1L to run at 80 cc/hr.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:35 AM nurse\nA - 11:00 AM nurse' },
                { text: 'Repeat Complete Blood Count (CBC) and serum creatinine tomorrow 6:00 AM.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['R'], timeSignature: 'R - 10:45 AM physician' },
                { text: 'Continue IV Ceftriaxone 2 g OD (Day 2 of 7).', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:35 AM nurse\nA - 11:00 AM nurse' },
                { text: 'Shift Azithromycin to oral 500 mg tablet once daily after meals.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:40 AM nurse\nA - 11:05 AM nurse' },
                { text: 'Paracetamol 500 mg tablet q4h PRN for fever >= 38.0°C.', dateTime: '2026-06-13T10:15:00+08:00', cared: ['C'], timeSignature: 'C - 11:00 AM nurse' }
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
              disposition: 'Admitted to Medical Ward (Disposition: For Admission)',
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
              progress_notes_assessment: 'Diagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension. Disposition: For Admission.',
              progress_notes: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.\nVital signs: BP 138/86 mmHg, HR 102 bpm, RR 24/min, Temp 38.2 °C, SpO2 93%\nPhysical exam: Crackles over right lower lung field, tachypneic.\nDiagnosis: Community-acquired pneumonia, moderate risk; Essential hypertension. Disposition: For Admission.',
              orders: [
                { text: 'For Admission', dateTime: '2026-06-12T12:30:00+08:00', cared: ['C', 'E'], timeSignature: 'C - 12:30 PM nurse\nE - 12:30 PM nurse' },
                { text: 'Admit to Floor 1 Ward 1 under the service of Dr. Miguel Santos.', dateTime: '2026-06-12T12:30:00+08:00', cared: ['C', 'E'], timeSignature: 'C - 12:30 PM nurse\nE - 12:30 PM nurse' },
                { text: 'Low-salt diet, soft consistency as tolerated.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:35 PM nurse' },
                { text: 'PNSS 1 L at 80 mL/hour.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['A'], timeSignature: 'A - 12:45 PM nurse' },
                { text: 'Ceftriaxone 2 g IV once daily after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A', 'E'], timeSignature: 'C - 12:40 PM nurse\nA - 1:00 PM nurse\nE - 1:20 PM nurse' },
                { text: 'Azithromycin 500 mg tablet once daily.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse\nA - 1:05 PM nurse' },
                { text: 'Paracetamol 500 mg tablet every six hours as needed for fever >= 38.0°C.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:45 PM nurse\nA - 1:10 PM nurse' },
                { text: 'Monitor vital signs every four hours and record intake and output.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:32 PM nurse' },
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

    function obPatientRecord() {
      return {
        id: OB_PATIENT_ID,
        seedVersion: 3,
        createdAt: '2026-08-15T08:30:00+08:00',
        updatedAt: '2026-10-11T09:15:00+08:00',
        data: {
          hrn: '0000001925',
          philhealth_no: '06-029384712-4',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Liza Garcia, MD', prc_no: '0091234', s2_no: 'S2-0091234-2026' },
          last_name: 'SANTOS',
          first_name: 'MARIA CLARA',
          middle_name: 'ESPINOSA',
          birthdate: '1998-05-14',
          gender: 'Female',
          age: 28,
          civil_status: 'Married',
          address: 'Brgy. San Jose, Medical District',
          ward_room: 'OB-Gyne OPD - Room 203',
          ward_area: 'Obstetrics and Gynecology',
          case_no: 'OB-2026-1011-0018',
          encounter_no: 'OB-2026-1011-0018',
          case_type: 'OP Patient',
          registration_type: 'OB-Gyne Outpatient Consultation',
          chief_complaint: 'Routine prenatal surveillance and obstetric history review',
          hx_present: 'Patient is a 28-year-old Gravida 3 Para 2 (2-0-1-2) at 32 weeks age of gestation who presents for routine third-trimester prenatal follow-up. Reports regular fetal movements, no vaginal bleeding, no watery discharge, and no contractions or danger signs of preeclampsia.',
          hx_surgical: 'Low Segment Cesarean Section (LSCS) 2021 (Regional Medical Center); Dilatation and Curettage (D&C) 2025 (Regional Medical Center).',
          hx_past: 'Uncomplicated medical history. No bronchial asthma, cardiac disease, chronic hypertension, or diabetes mellitus.',
          hx_family: 'Mother with hypertension. Denies family history of preeclampsia, diabetes mellitus, or multiple gestations.',
          hx_social: '[Home]: Cohabiting with husband in concrete single-family home.\n[Education/Employment]: High school teacher, active classroom schedule.\n[Activities]: Light daily activities, walking.\n[Drugs/Substance]: Non-smoker, non-alcoholic drinker, no recreational drug exposure.\n[Sexuality]: Sexually active with husband, planned pregnancy.\n[Suicide/Mood]: Stable mood, excited for delivery, denies depression or anxiety.',
          hx_social_home: 'Cohabiting with husband in concrete single-family home.',
          hx_social_education_employment: 'High school teacher, active classroom schedule.',
          hx_social_activities: 'Light daily activities, walking.',
          hx_social_drugs: 'Non-smoker, non-alcoholic drinker, no recreational drug exposure.',
          hx_social_sexuality: 'Sexually active with husband, planned pregnancy.',
          hx_social_suicide_mood: 'Stable mood, excited for delivery, denies depression or anxiety.',
          hx_allergy: 'No known food or drug allergies (NKFDA).',
          interview_medications: [
            {
              id: 'im-maria-1',
              name: 'Ferrous Sulfate + Folic Acid 60mg/400mcg tablet',
              quantity: '30 tablets',
              dosage: '1 tablet',
              frequency: 'Once daily (OD)',
              timing: 'Morning after meals',
              period: 'Months',
              duration: 'Prenatal course',
              started: '2026-06-01',
              doctor: 'Liza Garcia, MD',
              remarks: 'Reported on Intake Interview (Routine prenatal supplementation)',
              status: 'Active / Home Med'
            },
            {
              id: 'im-maria-2',
              name: 'Calcium Carbonate 500 mg tablet',
              quantity: '30 tablets',
              dosage: '500 mg',
              frequency: 'Once daily (OD)',
              timing: 'With lunch',
              period: 'Months',
              duration: 'Prenatal course',
              started: '2026-06-01',
              doctor: 'Liza Garcia, MD',
              remarks: 'Reported on Intake Interview (Prenatal calcium supplement)',
              status: 'Active / Home Med'
            }
          ],
          pertinent_signs: ['Normal fetal movement'],
          pertinent_signs_information: 'Good fetal movement; no vaginal bleeding or fluid leakage.',
          pe_general: 'Conscious, coherent, ambulatory, normotensive, well-nourished, in no acute cardiopulmonary or labor distress.',
          pe_heent: 'Anicteric sclerae, pink palpebral conjunctivae, moist oral mucosa, no tonsillopharyngeal congestion, no neck vein distension.',
          pe_chest_lungs: 'Symmetric chest expansion, clear breath sounds in all lung fields, no crackles or wheezes.',
          pe_cardiovascular: 'Adynamic precordium, normal rate, regular rhythm, distinct S1/S2, no murmurs.',
          pe_abdomen: 'Gravid abdomen consistent with 32 weeks AOG; fundic height 30 cm; fetal heart tone 144 bpm, regular in right lower quadrant; cephalic presentation; normoactive bowel sounds; well-healed Pfannenstiel scar from prior CS.',
          pe_extremities: 'Warm extremities, brisk capillary refill (< 2 seconds), pulses full and equal, no pretibial edema.',
          pe_neurologic: 'Grossly intact neurological examination, physiological deep tendon reflexes (2+ bilaterally).',
          pe_skin: 'Warm, good turgor, linea nigra and striae gravidarum noted, no rashes or petechiae.',
          pe_other: '',
          other_forms: [],
          other_forms_notes: '',
          vs_bp: '110/70',
          vs_hr: '78',
          vs_rr: '18',
          vs_temp: '36.6',
          vs_spo2: '99',
          vs_weight: '58',
          vs_height: '158',
          vs_date_time: '2026-10-11T09:15:00+08:00',
          vital_signs: [
            { dateTime: '2026-10-11T09:15:00+08:00', bp: '110/70', hr: '78', rr: '18', temp: '36.6', wt: '58', ht: '158', weight: '58', height: '158', bmi: '23.2', spo2: '99', o2: '99' },
            { dateTime: '2026-09-12T10:00:00+08:00', bp: '110/72', hr: '76', rr: '18', temp: '36.5', wt: '56', ht: '158', weight: '56', height: '158', bmi: '22.4', spo2: '99', o2: '99' },
            { dateTime: '2026-08-15T08:30:00+08:00', bp: '112/70', hr: '74', rr: '16', temp: '36.7', wt: '54', ht: '158', weight: '54', height: '158', bmi: '21.6', spo2: '99', o2: '99' }
          ],
          ivFluids: [],
          transfusions: [],
          admitting_diagnosis: 'Z34.8 - Supervision of other normal pregnancy, third trimester',
          final_diagnosis: '',
          progress_notes_subjective: '32 weeks AOG; feels active fetal movements; no contractions, no bleeding or fluid leakage.',
          progress_notes_objective: 'BP 110/70, HR 78, RR 18, T 36.6°C. Fundic height 30 cm, FHT 144 bpm regular. Cephalic. No edema.',
          progress_notes_assessment: 'Gravida 3 Para 2 (2-0-1-2) Pregnancy Uterine 32 weeks AOG, cephalic, uncomplicated; Previous CS (2021) and prior VBAC (2023).',
          progress_notes: 'Gravida 3 Para 2 (2-0-1-2) Pregnancy Uterine 32 weeks AOG, cephalic, uncomplicated; Previous CS (2021) and prior VBAC (2023). Continue prenatal vitamins; repeat CBC and urinalysis; scheduled next prenatal visit in 2 weeks.',
          encounters: [
            {
              date: '2026-10-11',
              time: '09:15 AM',
              registry: 'OP',
              service: 'Obstetrics and Gynecology',
              physician: 'Liza Garcia, MD',
              prc_license: '0091234',
              is_current: true,
              status_tag: 'Consultation',
              diagnosis: 'Z34.8 - Supervision of other normal pregnancy, third trimester',
              patient_record: 'Supervision of pregnancy, third trimester',
              results: 'CBC and Urinalysis pending; Obstetric ultrasound confirms single live intrauterine pregnancy in cephalic presentation.',
              vital_signs: [
                { dateTime: '2026-10-11T09:15:00+08:00', bp: '110/70', hr: '78', rr: '18', temp: '36.6', wt: '58', ht: '158', weight: '58', height: '158', bmi: '23.2', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-ob-1011-1', name: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet', quantity: '30 tabs', dosage: '600 mg / 400 mcg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD) in the morning', indication: 'Prenatal iron and folate supplementation', started: '2026-08-15T08:30:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Liza Garcia, MD', nurse: 'Liza Garcia, MD' },
                { id: 'med-ob-1011-2', name: 'Calcium Carbonate 500 mg tablet', quantity: '30 tabs', dosage: '500 mg', frequency: 'Once daily (OD)', timing: 'With meals', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD) with meals', indication: 'Maternal calcium supplementation', started: '2026-08-15T08:30:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Liza Garcia, MD', nurse: 'Liza Garcia, MD' }
              ],
              orders: [],
              clinical_record: {
                chief_complaint: 'Routine prenatal surveillance and obstetric history review',
                history: 'Patient is a 28-year-old Gravida 3 Para 2 (2-0-1-2) at 32 weeks age of gestation who presents for routine third-trimester prenatal follow-up.',
                final_diagnosis: 'Z34.8 - Supervision of other normal pregnancy, third trimester'
              },
              examinations: []
            },
            {
              date: '2026-09-12',
              time: '10:00 AM',
              registry: 'OP',
              service: 'Obstetrics and Gynecology',
              physician: 'Liza Garcia, MD',
              prc_license: '0091234',
              is_current: false,
              status_tag: 'Consultation',
              diagnosis: 'Z34.8 - Supervision of normal pregnancy, second trimester (28 weeks AOG)',
              patient_record: 'Supervision of normal pregnancy, 28 weeks AOG',
              results: '75g Oral Glucose Tolerance Test (OGTT): Fasting 82 mg/dL, 1-hr 128 mg/dL, 2-hr 110 mg/dL (Normal, Gestational Diabetes Mellitus ruled out).',
              vital_signs: [
                { dateTime: '2026-09-12T10:00:00+08:00', bp: '110/72', hr: '76', rr: '18', temp: '36.5', wt: '56', ht: '158', weight: '56', height: '158', bmi: '22.4', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-ob-0912-1', name: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet', quantity: '30 tabs', dosage: '600 mg / 400 mcg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD)', indication: 'Prenatal supplementation', started: '2026-08-15T08:30:00+08:00', doses24h: '1 dose', status: 'Active / Ongoing', doctor: 'Liza Garcia, MD', nurse: 'Liza Garcia, MD' }
              ],
              orders: [],
              clinical_record: {
                chief_complaint: 'Prenatal follow-up 28 weeks AOG',
                history: 'Routine surveillance at 28 weeks AOG.',
                final_diagnosis: 'Z34.8 - Supervision of normal pregnancy'
              },
              examinations: []
            },
            {
              date: '2026-08-15',
              time: '08:30 AM',
              registry: 'OP',
              service: 'Obstetrics and Gynecology',
              physician: 'Liza Garcia, MD',
              prc_license: '0091234',
              is_current: false,
              status_tag: 'Consultation',
              diagnosis: 'Z34.8 - Supervision of normal pregnancy, second trimester (24 weeks AOG)',
              patient_record: 'Initial obstetric OPD enrollment for current pregnancy',
              results: 'Targeted Congenital Anomaly Scan (CAS): Single live fetus, normal anatomical survey, placenta posterior grade I.',
              vital_signs: [
                { dateTime: '2026-08-15T08:30:00+08:00', bp: '112/70', hr: '74', rr: '16', temp: '36.7', wt: '54', ht: '158', weight: '54', height: '158', bmi: '21.6', spo2: '99', o2: '99' }
              ],
              medications: [],
              orders: [
                { text: 'Regular prenatal diet, high-fiber, adequate hydration (8-10 glasses of water daily).', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:15 AM' },
                { text: 'Oral hydration adequate; maintain daily oral fluid intake; no IV line indicated.', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:15 AM' },
                { text: 'Laboratory Request: Complete Blood Count (CBC) with Platelet Count — Routine', dateTime: '2026-10-11T09:15:00+08:00', cared: ['R'], timeSignature: 'R - 09:15 AM doctor' },
                { text: 'Laboratory Request: Routine Urinalysis (midstream clean catch) — Routine', dateTime: '2026-10-11T09:15:00+08:00', cared: ['R'], timeSignature: 'R - 09:15 AM doctor' },
                { text: 'Diagnostics Request: Obstetric Ultrasound for Biophysical Profile (BPP) and Fetal Biometry — Routine', dateTime: '2026-10-11T09:15:00+08:00', cared: ['R'], timeSignature: 'R - 09:15 AM doctor' },
                { text: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet - 1 tablet - Oral (PO) - Once daily (OD) - Morning - Remarks: Take on empty stomach or with citrus juice', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:20 AM' },
                { text: 'Calcium Carbonate 500 mg tablet - 1 tablet - Oral (PO) - Once daily (OD) - With meals - Remarks: Take 2 hours apart from iron supplement', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:20 AM' },
                { text: 'Advise on danger signs of pregnancy (severe headache, epigastric pain, visual blurring, vaginal bleeding, leaking fluid, decreased fetal movements). Report to ER immediately if noted.', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:15 AM' },
                { text: 'Daily fetal movement counting (kick charts); return to clinic in 2 weeks for follow-up prenatal visit.', dateTime: '2026-10-11T09:15:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:15 AM' }
              ],
              clinical_record: {
                chief_complaint: 'Initial prenatal visit at Hospital OB-Gyne OPD',
                history: 'Transferred prenatal care to Regional Medical Center for hospital delivery planning.',
                final_diagnosis: 'Z34.8 - Supervision of normal pregnancy'
              },
              examinations: []
            }
          ],
          orders: {
            plans: [
              { text: 'Continue routine prenatal surveillance; monitor maternal blood pressure and weight gain.' },
              { text: 'Daily fetal movement counting (kick chart); advise on danger signs of pregnancy.' },
              { text: 'Next prenatal follow-up in 2 weeks (October 25, 2026) with ultrasound BPP and laboratory results.' }
            ],
            diet: [
              { text: 'Regular prenatal diet, high-fiber, adequate hydration (8-10 glasses of water daily).' }
            ],
            iv: [
              { text: 'Oral hydration adequate; maintain daily oral fluid intake; no IV line indicated.' }
            ],
            medications: [
              { drug: 'Ferrous Sulfate + Folic Acid', name: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet', dose: '1 tablet', unit: 'tablet', route: 'Oral (PO)', frequency: 'Once daily (OD)', instructions: 'Take in the morning on an empty stomach' },
              { drug: 'Calcium Carbonate', name: 'Calcium Carbonate 500 mg tablet', dose: '1 tablet', unit: 'tablet', route: 'Oral (PO)', frequency: 'Once daily (OD)', instructions: 'Take with meals (separate by 2 hours from iron)' }
            ],
            special: [
              { text: 'Advise on danger signs of pregnancy: severe headache, visual disturbance, epigastric pain, vaginal bleeding, fluid loss, decreased fetal movement.' },
              { text: 'Instruct patient to report immediately to Obstetrics Emergency Triage if danger signs occur.' }
            ],
            procedures: [
              { text: 'Fundic height measurement and fetal heart tone auscultation.' }
            ],
            clinicalRequests: {
              laboratory: [
                { description: 'Complete Blood Count (CBC) with Platelets', code: 'LAB0001', priority: 'Routine', remarks: 'Mid-trimester routine repeat' },
                { description: 'Routine Urinalysis', code: 'LAB0002', priority: 'Routine', remarks: 'Screen for asymptomatic bacteriuria / proteinuria' }
              ],
              radiology: [
                { description: 'Obstetric Ultrasound (Biophysical Profile & Fetal Biometry)', code: 'RAD-OB-BPP', priority: 'Routine', remarks: 'Assess fetal growth, amniotic fluid, and fetal well-being' }
              ],
              respiratory: [],
              heart: [],
              eeg: []
            },
            prescriptions: {
              items: [
                { drug: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet', sig: 'Take 1 tablet by mouth once daily in the morning', qty: '30 tablets' },
                { drug: 'Calcium Carbonate 500 mg tablet', sig: 'Take 1 tablet by mouth once daily with meals', qty: '30 tablets' }
              ]
            }
          },
          savedOrders: [
            {
              id: 'ord-ob-1',
              type: 'diet',
              text: 'Regular prenatal diet, high fiber, adequate oral fluid intake',
              physician: 'Liza Garcia, MD',
              datetime: '2026-10-11T09:15:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-ob-2',
              type: 'medication',
              text: 'Ferrous Sulfate + Folic Acid 600 mg / 400 mcg tablet 1 tab PO OD in the morning',
              physician: 'Liza Garcia, MD',
              datetime: '2026-10-11T09:15:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-ob-3',
              type: 'medication',
              text: 'Calcium Carbonate 500 mg tablet 1 tab PO OD with meals',
              physician: 'Liza Garcia, MD',
              datetime: '2026-10-11T09:15:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-ob-4',
              type: 'laboratory',
              text: 'Complete Blood Count (CBC) with Platelet Count; Routine Urinalysis (midstream clean catch)',
              physician: 'Liza Garcia, MD',
              datetime: '2026-10-11T09:15:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-ob-5',
              type: 'diagnostic',
              text: 'Obstetric Ultrasound for Biophysical Profile (BPP) and Fetal Biometry',
              physician: 'Liza Garcia, MD',
              datetime: '2026-10-11T09:15:00+08:00',
              status: 'Active'
            }
          ],
          chart_monitoring: {
            medications: [
              { id: 'cm-ob-1', name: 'Ferrous Sulfate + Folic Acid 600mg/400mcg tab', route: 'Oral OD (Morning)', indication: 'Prenatal iron-folate prophylaxis', started: '2026-08-15' },
              { id: 'cm-ob-2', name: 'Calcium Carbonate 500mg tab', route: 'Oral OD (With meals)', indication: 'Prenatal calcium supplementation', started: '2026-08-15' }
            ],
            vital_signs: [
              { dateTime: '2026-10-11T09:15:00+08:00', bp: '110/70', hr: '78', rr: '18', temp: '36.6', wt: '58', ht: '158', weight: '58', height: '158', bmi: '23.2', spo2: '99', o2: '99' }
            ],
            ivFluids: [],
            transfusions: []
          },
          referrals: [],
          disposition: 'Outpatient Follow-up',
          follow_up_needed: 'Yes',
          follow_up_date: '2026-10-25',
          follow_up_reason: 'Routine 2-week prenatal checkup at 34 weeks AOG.',
          neonate: neoSeedData
        }
      };
    }

    var neoSeedData = {
      classification: {
        inborn: 'singleton-in hospital',
        outborn: '',
        readmission: false,
        birthLocation: 'Delivery Room'
      },
      maternal: {
        motherName: 'SANTOS, MARIA CLARA ESPINOSA',
        motherAddress: 'Brgy. San Jose, Medical District',
        motherAge: 28,
        motherBloodType: 'O+',
        status: 'Married',
        edc: '2026-10-11',
        lmp: '2026-02-05',
        aogWeeks: '39 0/7',
        gravida: 3,
        para: 2,
        presentation: 'Cephalic',
        position: 'LOA',
        classification: 'Normal',
        deliveryType: 'NSD',
        deliveryTime: '08:30',
        bow: 'Ruptured',
        rupturedTime: '06:15',
        stage1: '7 hours 30 mins',
        stage2: '20 mins',
        csIndication: '',
        complications: 'None / Uncomplicated spontaneous vaginal delivery.',
        steroids: { dose1: '', dose2: '', dose3: '', dose4: '' }
      },
      maternalRiskFactors: {
        selected: ['Vaccination'],
        othersText: ''
      },
      apgar: {
        scores: {
          m1: { hr: '2', rr: '2', tone: '1', reflex: '2', color: '1' },
          m5: { hr: '2', rr: '2', tone: '2', reflex: '2', color: '1' },
          m10: { hr: '2', rr: '2', tone: '2', reflex: '2', color: '2' }
        },
        exceeding: ''
      },
      measurements: {
        weight: 3.15,
        headCirc: 34.5,
        length: 50,
        chestCirc: 33.0,
        abdCirc: 31.0,
        temp: 36.6,
        cardiacRate: 144,
        respRate: 46,
        babyBloodType: 'O+',
        cordCondition: 'Clean, 3 vessels (2 arteries, 1 vein), clamped'
      },
      einc: {
        status: 'Complete',
        timeStart: '08:30',
        timeEnd: '10:00',
        interventions: [
          'Immediate and thorough drying',
          'Early skin-to-skin contact',
          'Properly timed cord clamping',
          'Non-separation / Initiation of breastfeeding'
        ],
        reason: '',
        provider: 'Andrea Reyes, MD'
      },
      ballard: {
        scores: {
          neuro_posture: '4',
          neuro_square: '4',
          neuro_arm: '3',
          neuro_popliteal: '3',
          neuro_scarf: '3',
          neuro_heel: '3',
          phys_skin: '3',
          phys_lanugo: '3',
          phys_plantar: '4',
          phys_breast: '3',
          phys_eye_ear: '3',
          phys_genitals: '3'
        },
        totalScore: 38,
        weeks: 39,
        maturity: 'Full Term'
      },
      physicalExam: {
        general: 'Alert',
        generalOthers: '',
        color: 'Pink',
        head: 'Normal / Normocephalic, no caput or cephalohematoma',
        eent: 'Intact palate, bilaterally reactive pupils, red reflex present',
        neck: 'Supple, no masses or webbed neck',
        heart: 'Normal rate and regular rhythm, no murmurs',
        chestLungs: 'Clear breath sounds throughout, symmetric expansion',
        abdomen: 'Soft, non-distended, normoactive bowel sounds',
        genitalia: 'Ambiguous genitalia: atypical phallic structure, gonads not palpable in labioscrotal folds',
        anus: 'Patent, passed meconium within 12 hours',
        skin: 'Pink, warm, good turgor, mild vernix caseosa',
        extremities: 'Intact, normal range of motion, symmetrical movement',
        otherFindings: 'Active neonatal reflexes (Moro, sucking, rooting, grasp positive)',
        sex: 'Undetermined',
        nicuReason: '',
        nicuOthers: ''
      },
      aftercare: {
        vitk: { date: '2026-10-11', remarks: '1 mg IM Right vastus lateralis given' },
        eye: { date: '2026-10-11', remarks: 'Erythromycin 0.5% ointment OU applied' },
        bcg: { date: '2026-10-11', remarks: '0.05 mL ID Right deltoid given' },
        hepab: { date: '2026-10-11', remarks: '0.5 mL IM Left vastus lateralis given' },
        hbig: { date: '', remarks: '' },
        nurse: 'Andrea Reyes, MD'
      },
      screening: {
        ror: { date: '2026-10-11', findings: '+/normal', abnormal: '', refDate: '', physician: 'Andrea Reyes, MD' },
        rop: { date: '', findings: '', abnormal: '', refDate: '', physician: '' },
        hearing: { date: '2026-10-12', findings: 'Pass', abnormal: '', refDate: '', physician: 'Andrea Reyes, MD' },
        cchd: { date: '2026-10-12', findings: 'Negative', abnormal: '', refDate: '', physician: 'Andrea Reyes, MD' },
        enbs: { date: '2026-10-13', filterCardNo: 'ENBS-2026-88491', status: 'Collected / Sent to NIH Newborn Screening Center', physician: 'Andrea Reyes, MD' }
      }
    };

    function neoPatientRecord() {
      return {
        id: NEO_PATIENT_ID,
        seedVersion: 9,
        createdAt: '2026-10-11T08:30:00+08:00',
        updatedAt: '2026-10-19T13:30:00+08:00',
        data: {
          hrn: '0000001926',
          philhealth_no: '06-029384712-4-01',
          phic_member_category: 'Newborn Care Package (NCP) Eligible / Dependent',
          attending_physician: { name: 'Andrea Reyes, MD', prc_no: '0102938', s2_no: 'S2-0102938-2026' },
          last_name: 'SANTOS',
          first_name: 'BABY BOY',
          middle_name: 'ESPINOSA',
          birthdate: '2026-10-11',
          birth_time: '08:30',
          gender: 'Male',
          age: '2 days (Neonate)',
          civil_status: 'Child',
          mother_patient_id: 'patient_ob_maria',
          mother_name: 'MARIA CLARA ESPINOSA SANTOS',
          mother_hrn: '0000001925',
          mother_philhealth_no: '06-029384712-4',
          father_name: 'JUAN CRISOSTOMO IBARRA SANTOS',
          address: 'Brgy. San Jose, Medical District',
          ward_room: 'Nursery / Rooming-in — Bassinet 03',
          ward_area: 'Nursery / Neonatal Care',
          case_no: 'NB-2026-1011-0001',
          encounter_no: 'NB-2026-1011-0001',
          case_type: 'Inpatient',
          registration_type: 'Newborn Care / Rooming-in',
          chief_complaint: 'Routine newborn post-delivery clinical care and rooming-in surveillance',
          hx_present: 'Male infant delivered at 39 weeks AOG via uncomplicated spontaneous vaginal delivery to a 28-year-old Gravida 3 Para 2 mother. Cried vigorously immediately at delivery with APGAR scores of 8 at 1 min, 9 at 5 mins, and 10 at 10 mins. Placed skin-to-skin with mother and initiated on exclusive breastfeeding. Transferred to Rooming-in Nursery for ongoing neonatal clinical surveillance.',
          hx_surgical: 'No previous surgical procedures.',
          hx_past: 'Birth Weight: 3.15 kg (3,150 g), Length: 50 cm, Head Circumference: 34.5 cm. Ballard Score 38 corresponding to 39 weeks gestational maturity (Full Term, AGA). Uncomplicated immediate neonatal adaptation.',
          hx_family: 'Mother with well-managed prenatal course (Blood Type O+); Father in good health. No known congenital disorders or hereditary metabolic anomalies.',
          hx_social: '[Home]: Cohabiting with mother in Rooming-in Nursery under exclusive breastfeeding care.\n[Education/Employment]: Inapplicable (Neonate / newborn inpatient).\n[Activities]: Active neonatal reflexes, resting calmly between feeds.\n[Drugs/Substance]: No maternal substance exposure or prenatal toxic exposure.\n[Sexuality]: Inapplicable (Neonate / newborn inpatient).\n[Suicide/Mood]: Normal neonatal behavioral adaptation, responsive to comfort.',
          hx_social_home: 'Cohabiting with mother in Rooming-in Nursery under exclusive breastfeeding care.',
          hx_social_education_employment: 'Inapplicable (Neonate / newborn inpatient).',
          hx_social_activities: 'Active neonatal reflexes, resting calmly between feeds.',
          hx_social_drugs: 'No maternal substance exposure or prenatal toxic exposure.',
          hx_social_sexuality: 'Inapplicable (Neonate / newborn inpatient).',
          hx_social_suicide_mood: 'Normal neonatal behavioral adaptation, responsive to comfort.',
          hx_allergy: 'No known drug or environmental allergies.',
          interview_medications: [],
          pertinent_signs: ['Others'],
          pertinent_signs_information: 'Active cry, good suck and latch; pink skin and mucous membranes; normal neonatal reflexes (robust Moro, symmetric grasp, intact sucking and rooting); spontaneous movement in room air, afebrile, no cyanosis or respiratory distress.',
          pe_general: 'Active, alert, vigorous neonate in no cardiopulmonary distress. Pink skin, good neonatal tone and spontaneous symmetric movements.',
          pe_general_survey: 'Awake and Alert',
          pe_general_survey_other: 'Active, alert, vigorous neonate in no cardiopulmonary distress. Pink skin, good neonatal tone and spontaneous symmetric movements.',
          pe_heent: ['Essentially Normal'],
          pe_heent_other: 'Normocephalic, fontanelles soft and flat (anterior fontanelle 2 x 2 cm), no caput succedaneum or cephalohematoma. Red reflex present bilaterally. Palate intact, strong rooting and sucking reflex.',
          pe_chest_lungs: ['Essentially normal'],
          pe_chest_lungs_other: 'Symmetric chest excursions, clear breath sounds throughout both lung fields, no retractions, stridor, or grunting. Respiratory rate 44 cpm.',
          pe_cardiovascular: ['Essentially normal'],
          pe_cvs: ['Essentially normal'],
          pe_cvs_other: 'Normodynamic precordium, normal heart sounds S1/S2, regular rate (140 bpm), no murmurs. Equal peripheral and femoral pulses bilaterally.',
          pe_abdomen: ['Essentially normal'],
          pe_abdomen_other: 'Soft, non-distended, no organomegaly. Umbilical cord clamped with 3 vessels noted, clean and dry with no bleeding or discharge.',
          pe_genitalia: 'Normal male external genitalia, bilateral testes descended in scrotal sac, well-formed rugae, urethral meatus at penile tip. Anus patent, passed dark meconium within 12 hours of life.',
          pe_extremities: 'Five intact digits per extremity, full range of motion, normal palmar and plantar creases, Ortolani and Barlow negative (no hip dysplasia).',
          pe_skin: 'Warm, pink, good skin turgor, mild vernix caseosa, no jaundice, no petechiae or rashes.',
          pe_skin_extremities: ['Essentially normal'],
          pe_skin_extremities_other: 'Five intact digits per extremity, full range of motion, normal palmar and plantar creases, Ortolani and Barlow negative; Warm, pink, good skin turgor, mild vernix caseosa.',
          pe_neurologic: 'Age-appropriate neonatal reflexes: robust Moro, symmetric palmar/plantar grasp, intact sucking and rooting.',
          pe_neuro_exam: ['Essentially normal'],
          pe_neuro_exam_other: 'Age-appropriate neonatal reflexes: robust Moro, symmetric palmar/plantar grasp, intact sucking and rooting.',
          pe_rectal: ['Essentially normal'],
          pe_rectal_other: 'Anus patent, passed meconium within 12 hours.',
          pe_gu_ie: ['Essentially normal'],
          pe_gu_ie_other: 'Normal male external genitalia, bilateral testes descended in scrotal sac.',
          pe_other: '',
          other_forms: [],
          other_forms_notes: '',
          vs_bp: '68/42',
          vs_hr: '140',
          vs_rr: '44',
          vs_temp: '36.8',
          vs_spo2: '99',
          vs_weight: '3.15',
          vs_height: '50',
          vs_date_time: '2026-10-13T08:00:00+08:00',
          vital_signs: [
            { dateTime: '2026-10-13T08:00:00+08:00', bp: '68/42', hr: '140', rr: '44', temp: '36.8', wt: '3.08', ht: '50', weight: '3.08', height: '50', spo2: '99', o2: '99' },
            { dateTime: '2026-10-12T08:00:00+08:00', bp: '66/40', hr: '138', rr: '42', temp: '36.8', wt: '3.10', ht: '50', weight: '3.10', height: '50', spo2: '99', o2: '99' },
            { dateTime: '2026-10-11T08:30:00+08:00', bp: '68/44', hr: '144', rr: '46', temp: '36.6', wt: '3.15', ht: '50', weight: '3.15', height: '50', spo2: '98', o2: '98' }
          ],
          ivFluids: [],
          transfusions: [],
          admitting_diagnosis: 'Z38.0 - Single liveborn infant, born in hospital (vaginal delivery)',
          final_diagnosis: 'Z38.0 - Single liveborn infant, born in hospital, term, appropriate for gestational age (AGA)',
          progress_notes_subjective: 'Day 2 of life; breastfeeding well every 2-3 hours on demand with good latch; passed meconium x 3 and voided clear urine x 4; no fever, no vomiting, no lethargy.',
          progress_notes_objective: 'Temp 36.8°C, HR 140 bpm, RR 44 cpm, SpO2 99% in room air. Weight 3.08 kg (physiological 2.2% weight loss, normal). Anicteric sclerae, pink skin. Umbilicus clean and dry. Normal neonatal reflexes.',
          progress_notes_assessment: 'Day 2 of Life Male Neonate; Term (39 weeks AOG) Appropriate for Gestational Age (AGA); Stable Rooming-In Course on Exclusive Breastfeeding. Anatomical male phenotype confirmed.',
          progress_notes: 'Day 2 of Life Male Neonate; Term (39 weeks AOG) AGA; Stable Rooming-In Course on Exclusive Breastfeeding. [Diagnostic Confirmation]: External genitalia examination confirms normal male phenotype (bilateral descended testes within rugated scrotum, normal penile dimensions, orthotopic urethral meatus). Initial delivery ambiguous/unconfirmed notation resolved to confirmed Male (Boy). For pediatric growth charts, WHO Boys standards apply; Tanner staging evaluated via Male Protocol (Genitalia & Pubic Hair). Continue rooming-in with exclusive breastfeeding on demand; maintain dry umbilical cord care; complete ENBS at 48 hours; routine discharge home upon pediatrician clearance.',
          encounters: [
            {
              date: '2026-10-13',
              time: '08:00 AM',
              registry: 'IP',
              service: 'Newborn',
              physician: 'Andrea Reyes, MD',
              prc_license: '0102938',
              is_current: true,
              status_tag: 'Inpatient Rounding',
              diagnosis: 'Z38.0 - Single liveborn infant, term, AGA • Confirmed Male infant',
              patient_record: 'Day 2 neonatal surveillance and rooming-in progress evaluation. Diagnostic confirmation of male phenotype.',
              results: 'Diagnostic Confirmation: Male external genitalia verified with descended bilateral testes. Newborn Hearing Screening Test: Pass bilaterally; CCHD Pulse Oximetry: Pass (pre-ductal 99%, post-ductal 98%); ENBS filter paper scheduled.',
              vital_signs: [
                { dateTime: '2026-10-13T08:00:00+08:00', bp: '68/42', hr: '140', rr: '44', temp: '36.8', wt: '3.08', ht: '50', weight: '3.08', height: '50', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-neo-1', name: 'Phytomenadione (Vitamin K1) 1 mg / 0.5 mL ampule', quantity: '1 ampule', dosage: '1 mg', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Intramuscular (IM) Right vastus lateralis', indication: 'Hemorrhagic disease of the newborn prophylaxis', started: '2026-10-11T08:35:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' },
                { id: 'med-neo-2', name: 'Erythromycin 0.5% ophthalmic ointment', quantity: '1 tube', dosage: '1 cm ribbon per eye', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Ophthalmic (OU) both eyes', indication: 'Neonatal ophthalmia prophylaxis', started: '2026-10-11T08:40:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' },
                { id: 'med-neo-3', name: 'Hepatitis B Vaccine (Recombinant) 10 mcg / 0.5 mL', quantity: '1 dose', dosage: '0.5 mL', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Intramuscular (IM) Left vastus lateralis', indication: 'Newborn immunization birth dose', started: '2026-10-11T09:00:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' },
                { id: 'med-neo-4', name: 'BCG Vaccine (Bacille Calmette-Guérin) 0.05 mL', quantity: '1 dose', dosage: '0.05 mL', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Intradermal (ID) Right deltoid', indication: 'Newborn tuberculosis immunization', started: '2026-10-11T09:00:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' }
              ],
              orders: [
                { text: 'Rooming-in with mother; continue exclusive breastfeeding on demand every 2-3 hours; maintain warm chain and thermal protection.', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' },
                { text: 'Exclusive breastfeeding on demand (every 2-3 hours); strictly no water, glucose water, or formula supplementation.', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' },
                { text: 'No IV fluids required (Enteral feeding well established on breast milk).', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' },
                { text: 'Laboratory Request: Expanded Newborn Screening (ENBS) via heel prick at 24-48 hours of life prior to discharge — Routine', dateTime: '2026-10-11T08:35:00+08:00', cared: ['R'], timeSignature: 'R - 08:35 AM doctor' },
                { text: 'Diagnostics Request: Newborn Hearing Screening Test (Automated ABR / OAE) and CCHD pulse oximetry screening — Routine', dateTime: '2026-10-11T08:35:00+08:00', cared: ['R'], timeSignature: 'R - 08:35 AM doctor' },
                { text: 'Phytomenadione (Vitamin K1) 1 mg / 0.5 mL ampule - 1 mg - Intramuscular (IM) Right vastus lateralis - Single dose - At birth - Remarks: Hemorrhagic disease of the newborn prophylaxis', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C', 'A'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:40 AM' },
                { text: 'Erythromycin 0.5% ophthalmic ointment - 1 cm ribbon per eye - Ophthalmic (OU) both eyes - Single dose - At birth - Remarks: Neonatal ophthalmia prophylaxis within 1 hour of birth', dateTime: '2026-10-11T08:40:00+08:00', cared: ['C', 'A'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:45 AM' },
                { text: 'Hepatitis B Vaccine (Recombinant) 10 mcg / 0.5 mL - 0.5 mL - Intramuscular (IM) Left vastus lateralis - Single dose - At birth - Remarks: Newborn immunization birth dose', dateTime: '2026-10-11T09:00:00+08:00', cared: ['C', 'A'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:05 AM' },
                { text: 'BCG Vaccine (Bacille Calmette-Guérin) 0.05 mL - 0.05 mL - Intradermal (ID) Right deltoid - Single dose - At birth - Remarks: Newborn tuberculosis immunization', dateTime: '2026-10-11T09:00:00+08:00', cared: ['C', 'A'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 09:10 AM' },
                { text: 'Essential Intrapartum and Newborn Care (EINC) protocol completion; uninterrupted skin-to-skin contact; dry umbilical cord care (keep clean and exposed to air without applying antiseptics/bandages).', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' },
                { text: 'Newborn clinical anthropometrics and physical maturity assessment (Ballard Score 38, AGA).', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' }
              ],
              clinical_record: {
                chief_complaint: 'Routine newborn clinical care and rooming-in surveillance',
                history: 'Male infant delivered at 39 weeks AOG via uncomplicated vaginal delivery to Maria Clara Santos.',
                final_diagnosis: 'Z38.0 - Single liveborn infant, born in hospital, term, AGA'
              },
              examinations: []
            },
            {
              date: '2026-10-11',
              time: '08:30 AM',
              registry: 'IP',
              service: 'Delivery Room / Nursery',
              physician: 'Andrea Reyes, MD',
              prc_license: '0102938',
              is_current: false,
              status_tag: 'Delivery / Immediate Newborn Care',
              diagnosis: 'Z38.0 - Single liveborn infant, born in hospital • Initial unconfirmed phenotype (transient marked perineal edema)',
              patient_record: 'Immediate newborn care following vaginal delivery. Initial delivery room staging notation: external genitalia obscured by transient marked physiological perineal edema; sex unconfirmed at birth pending resolution and pediatric re-evaluation.',
              results: 'APGAR Scores: 8 at 1 min, 9 at 5 mins, 10 at 10 mins. Ballard Score: 38 (39 weeks AOG, AGA). Initial external genitalia evaluation deferred pending resolution of tissue edema.',
              vital_signs: [
                { dateTime: '2026-10-11T08:30:00+08:00', bp: '65/40', hr: '144', rr: '46', temp: '36.7', wt: '3.15', ht: '50', weight: '3.15', height: '50', spo2: '98', o2: '98' }
              ],
              medications: [
                { id: 'med-neo-del-1', name: 'Phytomenadione (Vitamin K1) 1 mg / 0.5 mL ampule', quantity: '1 ampule', dosage: '1 mg', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Intramuscular (IM) Right vastus lateralis', indication: 'Hemorrhagic disease of the newborn prophylaxis', started: '2026-10-11T08:35:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' },
                { id: 'med-neo-del-2', name: 'Erythromycin 0.5% ophthalmic ointment', quantity: '1 tube', dosage: '1 cm ribbon per eye', frequency: 'Single dose', timing: 'At birth', period: 'Dose', duration: '1 dose', route: 'Ophthalmic (OU) both eyes', indication: 'Neonatal ophthalmia prophylaxis', started: '2026-10-11T08:40:00+08:00', doses24h: '1 dose', status: 'Completed / Given', doctor: 'Andrea Reyes, MD', nurse: 'Andrea Reyes, MD' }
              ],
              orders: [
                { text: 'Immediate newborn care: initiate EINC protocol, dry thoroughly, provide warmth, promote early latching.', dateTime: '2026-10-11T08:30:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:30 AM' },
                { text: 'Transfer mother and baby to Rooming-in Nursery for ongoing surveillance; re-evaluate external genitalia once perineal edema resolves.', dateTime: '2026-10-11T08:35:00+08:00', cared: ['C'], timeSignature: 'Elena M. Ramos, RN\nPRC Lic. No.: 0084512\n10/11/2026 08:35 AM' }
              ],
              clinical_record: {
                chief_complaint: 'Immediate newborn delivery care and neonatal stabilization',
                history: 'Infant delivered at 39 weeks AOG via uncomplicated spontaneous vaginal delivery to Maria Clara Santos.',
                final_diagnosis: 'Z38.0 - Single liveborn infant, born in hospital'
              },
              examinations: []
            }
          ],
          orders: {
            plans: [
              { text: 'Rooming-in with mother; continue exclusive breastfeeding on demand every 2-3 hours; maintain warm chain and thermal protection.' },
              { text: 'Schedule routine discharge home with mother upon pediatrician clearance and completion of 48-hour ENBS.' }
            ],
            diet: [
              { text: 'Exclusive breastfeeding on demand (every 2-3 hours); strictly no water, glucose water, or formula supplementation.' }
            ],
            iv: [
              { text: 'No IV fluids required (Enteral feeding well established on breast milk).' }
            ],
            medications: [
              { drug: 'Phytomenadione (Vitamin K1)', name: 'Phytomenadione (Vitamin K1)', dose: '1 mg', unit: 'mg', route: 'Intramuscular (IM) Right vastus lateralis', frequency: 'Single dose', instructions: 'Hemorrhagic disease of the newborn prophylaxis at birth' },
              { drug: 'Erythromycin 0.5% ophthalmic ointment', name: 'Erythromycin 0.5% ophthalmic ointment', dose: '1 cm ribbon per eye', unit: 'ribbon', route: 'Ophthalmic (OU) both eyes', frequency: 'Single dose', instructions: 'Neonatal ophthalmia prophylaxis within 1 hour of birth' },
              { drug: 'Hepatitis B Vaccine (Recombinant)', name: 'Hepatitis B Vaccine (Recombinant)', dose: '0.5 mL', unit: 'mL', route: 'Intramuscular (IM) Left vastus lateralis', frequency: 'Single dose', instructions: 'Newborn immunization birth dose' },
              { drug: 'BCG Vaccine (Bacille Calmette-Guérin)', name: 'BCG Vaccine (Bacille Calmette-Guérin)', dose: '0.05 mL', unit: 'mL', route: 'Intradermal (ID) Right deltoid', frequency: 'Single dose', instructions: 'Newborn tuberculosis immunization' }
            ],
            special: [
              { text: 'Essential Intrapartum and Newborn Care (EINC) completion; uninterrupted skin-to-skin contact with mother; rooming-in.' },
              { text: 'Dry umbilical cord care: keep clean, dry, and exposed to air; do not apply alcohol, povidone-iodine, or binder.' },
              { text: 'Monitor neonatal temperature, feeding vigor, and urine/stool output every shift.' }
            ],
            procedures: [
              { text: 'Perform Essential Intrapartum and Newborn Care (EINC) steps.' },
              { text: 'Newborn clinical anthropometrics and physical maturity assessment (Ballard Score).' }
            ],
            clinicalRequests: {
              laboratory: [
                { description: 'Expanded Newborn Screening (ENBS)', code: 'LAB-ENBS', priority: 'Routine', remarks: 'Filter paper blood spot collection at 24-48 hours of life prior to discharge' }
              ],
              radiology: [],
              respiratory: [
                { description: 'Critical Congenital Heart Disease (CCHD) Screening', code: 'RT-CCHD', priority: 'Routine', remarks: 'Pre-ductal and post-ductal pulse oximetry protocol' }
              ],
              heart: [
                { description: 'Newborn Hearing Screening Test (NHST)', code: 'HC-NHST', priority: 'Routine', remarks: 'Automated ABR / OAE screening before discharge' }
              ],
              eeg: []
            },
            prescriptions: {
              items: []
            }
          },
          savedOrders: [
            {
              id: 'ord-neo-1',
              type: 'diet',
              text: 'Exclusive breastfeeding on demand (every 2-3 hours); strictly no water, glucose water, or formula supplementation',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-2',
              type: 'nursing',
              text: 'Essential Intrapartum and Newborn Care (EINC) completion; uninterrupted skin-to-skin contact with mother Maria Clara; rooming-in',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-3',
              type: 'medication',
              text: 'Phytomenadione (Vitamin K1) 1 mg IM stat at birth (Right anterolateral thigh / vastus lateralis)',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-4',
              type: 'medication',
              text: 'Erythromycin 0.5% ophthalmic ointment apply both eyes (OU) within 1 hour of birth',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-5',
              type: 'medication',
              text: 'Hepatitis B Vaccine 0.5 mL IM birth dose (Left anterolateral thigh / vastus lateralis)',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-6',
              type: 'medication',
              text: 'BCG Vaccine 0.05 mL ID birth dose (Right deltoid)',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-7',
              type: 'diagnostic',
              text: 'Perform Expanded Newborn Screening (ENBS) via heel prick at 24-48 hours of life prior to discharge',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            },
            {
              id: 'ord-neo-8',
              type: 'diagnostic',
              text: 'Newborn Hearing Screening Test (Automated Auditory Brainstem Response / OAE) and CCHD pulse oximetry screening',
              physician: 'Andrea Reyes, MD',
              datetime: '2026-10-11T08:35:00+08:00',
              status: 'Active'
            }
          ],
          chart_monitoring: {
            medications: [
              { id: 'cm-neo-1', name: 'Phytomenadione (Vitamin K1) 1 mg IM', route: 'IM Right Vastus Lateralis', indication: 'Newborn prophylaxis', started: '2026-10-11' },
              { id: 'cm-neo-2', name: 'Erythromycin 0.5% eye ointment OU', route: 'Topical Ophthalmic', indication: 'Eye prophylaxis', started: '2026-10-11' },
              { id: 'cm-neo-3', name: 'Hepatitis B Vaccine 0.5 mL IM', route: 'IM Left Vastus Lateralis', indication: 'Birth immunization', started: '2026-10-11' },
              { id: 'cm-neo-4', name: 'BCG Vaccine 0.05 mL ID', route: 'ID Right Deltoid', indication: 'Birth immunization', started: '2026-10-11' }
            ],
            vital_signs: [
              { dateTime: '2026-10-13T08:00:00+08:00', bp: '68/42', hr: '140', rr: '44', temp: '36.8', wt: '3.08', ht: '50', weight: '3.08', height: '50', spo2: '99', o2: '99' },
              { dateTime: '2026-10-12T08:00:00+08:00', bp: '66/40', hr: '138', rr: '42', temp: '36.8', wt: '3.10', ht: '50', weight: '3.10', height: '50', spo2: '99', o2: '99' },
              { dateTime: '2026-10-11T08:30:00+08:00', bp: '68/44', hr: '144', rr: '46', temp: '36.6', wt: '3.15', ht: '50', weight: '3.15', height: '50', spo2: '98', o2: '98' }
            ],
            ivFluids: [],
            transfusions: []
          },
          referrals: [],
          disposition: 'Rooming-in with Mother',
          follow_up_needed: 'Yes',
          follow_up_date: '2026-10-18',
          follow_up_reason: '1-week post-discharge newborn well-baby checkup, weight check, and ENBS results follow-up.',
          neonate: neoSeedData
        }
      };
    }

    function blankPatientRecord() {
      return {
        id: BLANK_PATIENT_ID,
        seedVersion: 44,
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
          interview_medications: [],
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
        { id: 'med-er-1', name: 'Ceftriaxone 2 g IV vial', quantity: '2 vials', dosage: '2 g', frequency: 'Once daily (OD)', timing: 'ANST (-)', period: 'Days', duration: '2 days', route: 'IV Once Daily (OD) ANST (-)', indication: 'Community-Acquired Pneumonia (Moderate Risk)', started: '2026-06-12T13:00:00+08:00', lastDose: '2026-06-13T13:00:00+08:00', nextDose: 'Shifted to oral step-down', doses24h: '2 doses', status: 'Completed / Shifted', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-2', name: 'Azithromycin 500 mg tablet', quantity: '3 tabs', dosage: '500 mg', frequency: 'Once daily (OD)', timing: 'After meals', period: 'Days', duration: '3 days', route: 'Oral Once Daily (OD) after meals', indication: 'Atypical coverage for CAP', started: '2026-06-12T13:05:00+08:00', lastDose: '2026-06-13T13:05:00+08:00', nextDose: 'Completed 3-day course', doses24h: '1 dose', status: 'Active', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-3', name: 'Co-amoxiclav 625 mg tablet', quantity: '21 tabs', dosage: '625 mg', frequency: 'Every 8 hours (TID)', timing: 'With meals', period: 'Days', duration: '7 days', route: 'Oral Three Times Daily (TID)', indication: 'Discharge step-down therapy for pneumonia', started: '2026-06-14T09:00:00+08:00', lastDose: '2026-06-14T09:00:00+08:00', nextDose: '2026-06-14T17:00:00+08:00', doses24h: '3 doses', status: 'Active', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-4', name: 'Losartan 50 mg tablet', quantity: '30 tabs', dosage: '50 mg', frequency: 'Once daily (OD)', timing: 'Morning', period: 'Days', duration: '30 days', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension Stage 1', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-14T08:00:00+08:00', nextDose: '2026-06-15T08:00:00+08:00', doses24h: '1 dose', status: 'Active', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-5', name: 'Metformin 500 mg tablet', quantity: '60 tabs', dosage: '500 mg', frequency: 'Twice daily (BID)', timing: 'With meals', period: 'Days', duration: '30 days', route: 'Oral Twice Daily (BID) with meals', indication: 'Type 2 Diabetes Mellitus', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-14T08:00:00+08:00', nextDose: '2026-06-14T18:00:00+08:00', doses24h: '2 doses', status: 'Active', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' },
        { id: 'med-er-6', name: 'Paracetamol 500 mg tablet', quantity: '10 tabs', dosage: '500 mg', frequency: 'Every 6 hours PRN', timing: 'Temp >= 38.0°C', period: 'Days', duration: '3 days', route: 'Oral Every 6 Hours PRN for Temp >= 38.0°C', indication: 'Fever / Headache', started: '2026-06-12T08:30:00+08:00', lastDose: '2026-06-12T20:00:00+08:00', nextDose: 'PRN (Afebrile)', doses24h: '0 doses', status: 'Active / PRN', doctor: 'Miguel Santos, MD', nurse: 'Miguel Santos, MD' }
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
          var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
          if (store && store['patient_1790299677879']) {
            delete store['patient_1790299677879'];
            localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
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
          var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
          if (store && store['patient_op_juan']) {
            delete store['patient_op_juan'];
            localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      var opIndex = records.findIndex(function (record) { return record.id === OP_PATIENT_ID; });
      if (opIndex < 0) {
        records.unshift(opPatientRecord());
      } else if (Number(records[opIndex].seedVersion || 0) < 70) {
        records[opIndex] = opPatientRecord();
        try {
          var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
          if (store) {
            delete store[OP_PATIENT_ID];
            delete store[SEED_PATIENT_ID];
            delete store['patient_op_juan'];
            localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      var erIndex = records.findIndex(function (record) { return record.id === ER_PATIENT_ID; });
      if (erIndex < 0) {
        records.splice(1, 0, erPatientRecord());
      } else if (Number(records[erIndex].seedVersion || 0) < 78) {
        records[erIndex] = erPatientRecord();
        try {
          var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
          if (store && store[ER_PATIENT_ID]) {
            delete store[ER_PATIENT_ID];
            localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }
      try {
        var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
        if (store) {
          store[ER_PATIENT_ID] = erChartMonitoringData;
          localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
        }
      } catch (e) {}

      var obIndex = records.findIndex(function (record) { return record.id === OB_PATIENT_ID; });
      if (obIndex < 0) {
        records.splice(2, 0, obPatientRecord());
      } else if (Number(records[obIndex].seedVersion || 0) < 3) {
        records[obIndex] = obPatientRecord();
      }

      var neoIndex = records.findIndex(function (record) { return record.id === NEO_PATIENT_ID; });
      if (neoIndex < 0) {
        records.splice(3, 0, neoPatientRecord());
      } else if (Number(records[neoIndex].seedVersion || 0) < 9 || !records[neoIndex].data.hx_social_home) {
        records[neoIndex] = neoPatientRecord();
      }
      try {
        var neoStorageKey = 'HIS_NEONATE_' + NEO_PATIENT_ID;
        var existingNeo = safeParse(localStorage.getItem(neoStorageKey), null);
        if (!existingNeo || !existingNeo.measurements || !existingNeo.physicalExam || existingNeo.physicalExam.sex !== 'Undetermined') {
          localStorage.setItem(neoStorageKey, JSON.stringify(neoSeedData));
        }
      } catch (e) {}
      try {
        var obStorageKey = 'HIS_OB_GYNE_' + OB_PATIENT_ID;
        var existingOb = safeParse(localStorage.getItem(obStorageKey), null);
        if (!existingOb || !existingOb.pregnancies || existingOb.pregnancies.length === 0) {
          var obSeedData = {
            pregnancies: [
              {
                seq: 'P1',
                year: '2021',
                outcome: 'Full Term Live Birth',
                mode: 'Low Segment Cesarean Section (LSCS) — Primary',
                term: 'Term',
                ga: '39 weeks',
                gaWeeks: 39,
                sex: 'Female',
                weight: '3.10 kg (3,100 g)',
                place: 'Tertiary Hospital (Government / Public)',
                attendant: 'OB-Gyne Specialist / Physician',
                maternalComp: 'None / Uncomplicated',
                fetalOutcome: 'Living & Well (APGAR 9, 10)',
                multiple: 'No (Singleton)',
                living: 1,
                remarks: 'Primary CS due to Cephalopelvic Disproportion (CPD)'
              },
              {
                seq: 'P2',
                year: '2023',
                outcome: 'Full Term Live Birth',
                mode: 'Normal Spontaneous Vaginal Delivery (SVD)',
                term: 'Term',
                ga: '38 weeks',
                gaWeeks: 38,
                sex: 'Male',
                weight: '3.00 kg (3,000 g)',
                place: 'Tertiary Hospital (Government / Public)',
                attendant: 'Resident Physician / Medical Officer',
                maternalComp: 'Perineal Laceration (2nd Degree, repaired)',
                fetalOutcome: 'Living & Well (APGAR 8, 9)',
                multiple: 'No (Singleton)',
                living: 1,
                remarks: 'Successful Vaginal Birth After Cesarean (VBAC)'
              },
              {
                seq: 'P3',
                year: '2025',
                outcome: 'Spontaneous Abortion / Miscarriage',
                mode: 'Dilatation & Curettage (D&C / Raspa)',
                term: 'Abortion',
                ga: '10 weeks',
                gaWeeks: 10,
                sex: 'N/A',
                weight: 'N/A',
                place: 'Tertiary Hospital (Government / Public)',
                attendant: 'OB-Gyne Specialist / Physician',
                maternalComp: 'Incomplete abortion with moderate bleeding; well tolerated post-D&C',
                fetalOutcome: 'Stillbirth / Non-viable',
                multiple: 'No (Singleton)',
                living: 0,
                remarks: 'Histopathology: Products of conception, benign'
              }
            ],
            lmpHistory: [
              {
                id: 'lmp-1',
                date: '2026-02-28',
                pmpDate: '2026-01-31',
                cycleDays: 28,
                isRegular: true,
                isCurrent: true,
                certainty: 'Sure / Definite',
                recordedAt: '2026-08-15T08:30:00+08:00',
                recordedBy: 'Liza Garcia, MD',
                notes: 'Baseline LMP established at 24 weeks gestation; regular 28-day intervals'
              }
            ],
            procedures: [
              { id: 'proc-1', name: 'Low Segment Cesarean Section (LSCS)', date: '2021-06-18', indication: 'Cephalopelvic Disproportion (CPD)', surgeon: 'OB-GYN Clinical Team', facility: 'Regional Medical Center', findings: 'Low transverse uterine incision, viable female neonate 3.10 kg, intact closure' },
              { id: 'proc-2', name: 'Dilatation & Curettage (D&C / Raspa)', date: '2025-03-10', indication: 'Incomplete Spontaneous Abortion at 10 weeks', surgeon: 'Liza Garcia, MD', facility: 'Regional Medical Center', findings: 'Endometrial cavity evacuated, minimal blood loss, benign POC' }
            ],
            gynecologicHistory: {
              menarcheAge: '12',
              interval: 'Regular (28-30 days)',
              duration: '4-5 days',
              flow: 'Moderate (3-4 pads/day, no clots)',
              dysmenorrhea: 'Mild (denies functional limitation)',
              menopauseStatus: 'Pre-menopausal (Regular ovulatory cycles)',
              menopauseAge: '',
              pmb: 'No (Asymptomatic)',
              climacteric: 'None',
              coitarche: '22',
              sexualActivity: 'Sexually Active',
              infections: 'None reported / Denies history of STIs',
              infectionTreatment: '',
              contraceptiveCurrent: 'None / Natural Family Planning',
              contraceptiveDuration: '',
              contraceptivePast: 'Barrier (Condoms)',
              screeningModality: 'Conventional Pap Smear',
              lastPapDate: '2025-04-10',
              lastPap: 'Negative for Intraepithelial Lesion or Malignancy (NILM)',
              hpvVaccine: 'Unvaccinated / None',
              diagnoses: 'None',
              surgeries: 'LSCS (2021), D&C (2025)',
              remarks: 'Obstetric and Gynecologic baseline documented at Hospital OB-Gyne OPD.'
            },
            presentPregnancy: {
              active: true,
              gravida: 4,
              para: 2,
              tpal: '2012',
              lmpStart: '2026-02-28',
              lmp: '2026-02-28',
              edd: '2026-12-05',
              aog: '32 weeks',
              presentation: 'Cephalic',
              fht: '144 bpm',
              fundicHeight: '30 cm',
              bloodType: 'O Rh Positive',
              riskLevel: 'Moderate (Previous CS / VBAC)',
              prenatalVisits: 5
            }
          };
          localStorage.setItem(obStorageKey, JSON.stringify(obSeedData));
        } else if (existingOb && existingOb.presentPregnancy) {
          var obNeedsUpdate = false;
          if (existingOb.presentPregnancy.active === undefined) {
            existingOb.presentPregnancy.active = true;
            obNeedsUpdate = true;
          }
          if (!existingOb.presentPregnancy.lmpStart && existingOb.presentPregnancy.lmp) {
            existingOb.presentPregnancy.lmpStart = existingOb.presentPregnancy.lmp;
            obNeedsUpdate = true;
          }
          if (Array.isArray(existingOb.pregnancies)) {
            var origPregLen = existingOb.pregnancies.length;
            existingOb.pregnancies = existingOb.pregnancies.filter(function (p) {
              var r = String(p.remarks || '').trim().toLowerCase();
              if (r === 'test' || r === 'test record' || r === 'dummy') return false;
              if (p.babies && p.babies.some(function (b) { return String(b.remarks || '').trim().toLowerCase() === 'healthy' && (r === 'test' || !r); })) return false;
              return true;
            });
            if (existingOb.pregnancies.length !== origPregLen) {
              obNeedsUpdate = true;
            }
          }
          if (obNeedsUpdate) {
            localStorage.setItem(obStorageKey, JSON.stringify(existingOb));
          }
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
          var store = safeParse(localStorage.getItem('his_chart_monitoring_data_v1'), {});
          if (store && store[BLANK_PATIENT_ID]) {
            delete store[BLANK_PATIENT_ID];
            localStorage.setItem('his_chart_monitoring_data_v1', JSON.stringify(store));
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
      window.obPatientRecord = obPatientRecord;
      window.neoPatientRecord = neoPatientRecord;
      window.blankPatientRecord = blankPatientRecord;
      window.seedPatientRecord = seedPatientRecord;
      window.getPatients = getPatients;
      window.savePatients = savePatients;
      window.invalidatePatientsCache = invalidatePatientsCache;
      window.ER_PATIENT_ID = ER_PATIENT_ID;
      window.OP_PATIENT_ID = OP_PATIENT_ID;
      window.OB_PATIENT_ID = OB_PATIENT_ID;
      window.NEO_PATIENT_ID = NEO_PATIENT_ID;
      window.SEED_PATIENT_ID = SEED_PATIENT_ID;
      window.BLANK_PATIENT_ID = BLANK_PATIENT_ID;
      try {
        ensureSeedPatient();
      } catch (e) {
        console.warn('ensureSeedPatient auto-execution warning:', e);
      }
    }
