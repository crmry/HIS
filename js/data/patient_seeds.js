/* ═══════════════════════════════════════════════════════════════
   CLMMRH SegHIS — Clinical Patient Registry & Baseline Records
   Hospital Master Patient Index (EMPI) Clinical Baseline Records
   ═══════════════════════════════════════════════════════════════ */

var STORAGE_KEY = 'clmmrh_patients_v1';
var SEED_PATIENT_ID = 'patient_op_juan';
var OP_PATIENT_ID = 'patient_op_juan';
var BLANK_PATIENT_ID = 'patient_new_blank_1790299677880';

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

    function seedPatientRecord() {
      return opPatientRecord();
    }

    var OP_PATIENT_ID = 'patient_op_juan';

    function opPatientRecord() {
      return {
        id: OP_PATIENT_ID,
        seedVersion: 52,
        createdAt: '2026-03-14T08:45:00+08:00',
        updatedAt: '2026-09-26T09:30:00+08:00',
        data: {
          hrn: '0000001890',
          philhealth_no: '06-018274910-3',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Miguel Santos, MD', prc_no: '0094821', s2_no: 'S2-094821-2026' },
          last_name: 'DEL ROSARIO',
          first_name: 'JOAN',
          middle_name: 'BAUTISTA',
          birthdate: '1978-03-22',
          gender: 'Female',
          address: 'Brgy. Bata, Bacolod City, Negros Occidental',
          ward_room: 'OPD - Room 104',
          ward_area: 'General Medicine',
          case_no: 'OP-2026-0926-0042',
          encounter_no: 'OP-2026-0926-0042',
          case_type: 'OP Patient',
          chief_complaint: '',
          hx_present: '',
          hx_surgical: 'No previous surgical procedures.',
          hx_past: 'Type 2 Diabetes Mellitus diagnosed 2020; Essential Hypertension Stage 1 diagnosed 2020. No previous hospitalizations.',
          hx_family: 'Mother with Type 2 Diabetes Mellitus; Father with Hypertension.',
          hx_social: 'Non-smoker, non-alcoholic beverage drinker. Works as an office clerk.',
          hx_allergy: 'No known food or drug allergies (NKFDA).',
          pertinent_signs: [],
          pertinent_signs_information: '',
          pe_general: '',
          pe_heent: '',
          pe_chest_lungs: '',
          pe_cardiovascular: '',
          pe_abdomen: '',
          pe_extremities: '',
          pe_neurologic: '',
          pe_skin: '',
          pe_other: '',
          other_forms: [],
          other_forms_notes: '',
          neonate: {
            classification: { inborn: 'singleton-in hospital', outborn: '', readmission: false, birthLocation: 'Delivery Room' },
            maternal: {
              motherName: 'DEL ROSARIO, JOAN BAUTISTA',
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
          vs_bp: '', vs_hr: '', vs_rr: '', vs_temp: '', vs_spo2: '', vs_weight: '', vs_height: '', vs_date_time: '',
          vital_signs: [],
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
              vital_signs: [],
              cbgs: [],
              medications: [],
              progress_notes_subjective: '',
              progress_notes_objective: '',
              progress_notes_assessment: '',
              progress_notes: '',
              orders: [],
              clinical_record: {
                chief_complaint: '',
                history: '',
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
                history: 'Patient is a 48-year-old female presenting for scheduled semi-annual review. Reports occasional mild afternoon fatigue; denies polyuria, polydipsia, numbness, chest tightness, or dyspnea. Compliant with Metformin 500 mg BID and Losartan 50 mg OD. Home BP ranges 130-138/80-86 mmHg.\n\nPhysical Examination: General: Alert, oriented, in no acute distress. Lungs: Clear to auscultation bilaterally. Heart: Regular rate and rhythm, no murmurs. Extremities: No edema, dorsalis pedis pulses palpable.',
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
              progress_notes_subjective: 'Outpatient Follow-up (General Medicine). Semi-annual comprehensive review.',
              progress_notes_objective: 'Blood pressure mildly elevated at 134/84 mmHg. Fasting blood sugar 132 mg/dL, HbA1c 7.2%.\nWeight: 70 kg, BMI: 24.8. Physical examination unremarkable.',
              progress_notes_assessment: 'Type 2 Diabetes Mellitus, suboptimally controlled; Essential Hypertension.\nPlan: Add Empagliflozin 10 mg OD for cardioprotective glycemic control. Continue Metformin and Losartan. Dietary counseling.',
              progress_notes: 'Outpatient Follow-up (General Medicine). Semi-annual comprehensive review.\nBlood pressure mildly elevated at 134/84 mmHg. Fasting blood sugar 132 mg/dL, HbA1c 7.2%.\nWeight: 70 kg, BMI: 24.8. Physical examination unremarkable.\nDiagnosis: Type 2 Diabetes Mellitus, suboptimally controlled; Essential Hypertension.\nPlan: Add Empagliflozin 10 mg OD for cardioprotective glycemic control. Continue Metformin and Losartan. Dietary counseling.',
              orders: [
                { text: 'Start Empagliflozin 10 mg tablet once daily in the morning.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:15 AM nurse' },
                { text: 'Continue Metformin 500 mg tablet twice daily with meals.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:18 AM nurse' },
                { text: 'Reinforce diabetic meal plan and 30 minutes daily walking.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:25 AM nurse' },
                { text: 'Follow-up after 3 months with repeat HbA1c and renal panel.', dateTime: '2026-06-20T10:00:00+08:00', cared: ['C'], timeSignature: 'C - 10:30 AM nurse' }
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
              progress_notes_subjective: 'Initial Outpatient Consultation (General Medicine). Patient transferred maintenance care to CLMMRH OPD.\nReviewed previous clinic records.',
              progress_notes_objective: 'Vital signs: BP 128/80 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C.',
              progress_notes_assessment: 'Type 2 Diabetes Mellitus; Essential Hypertension Stage 1.\nPlan: Continue Metformin 500 mg BID and Losartan 50 mg OD. Baseline labs ordered.',
              progress_notes: 'Initial Outpatient Consultation (General Medicine). Patient transferred maintenance care to CLMMRH OPD.\nReviewed previous clinic records. Vital signs: BP 128/80 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C.\nDiagnosis: Type 2 Diabetes Mellitus; Essential Hypertension Stage 1.\nPlan: Continue Metformin 500 mg BID and Losartan 50 mg OD. Baseline labs ordered.',
              orders: [
                { text: 'Register in CLMMRH Chronic Disease Management OPD Program.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['C'], timeSignature: 'C - 9:00 AM nurse' },
                { text: 'CBC, FBS, HbA1c, BUN, Creatinine, Lipid Profile, Urinalysis.', dateTime: '2026-03-14T08:45:00+08:00', cared: ['R'], timeSignature: 'R - 9:05 AM physician' },
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
              clinical_record: {
                chief_complaint: 'Follow-up right knee pain and mobility assessment',
                history: 'Patient is a 47-year-old female with diagnosed mild primary osteoarthritis of the right knee returning for scheduled 3-month orthopedic follow-up. Demonstrates good symptom improvement on physical therapy and home quadriceps rehabilitation.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, clinically stable'
              },
              progress_notes_subjective: 'Patient reports significant improvement in right knee pain after physical therapy and home quadriceps strengthening exercises. No morning joint stiffness > 30 minutes, no joint locking or giving way.',
              progress_notes_objective: 'Gait normal without antalgic limp. Right knee: No joint effusion, no local warmth or erythema. Range of motion: Full flexion to 135° and full extension to 0°. Mild non-tender medial joint line crepitus. Anterior/posterior drawer and McMurray tests negative.',
              progress_notes_assessment: 'Unilateral Primary Osteoarthritis, Right Knee (M17.11), clinically improved with low disease activity.\nPlan: Shift Celecoxib to strictly PRN for pain flare-ups. Continue low-impact physical exercise (swimming, cycling, walking on flat ground). Avoid deep squats and kneeling. Return for annual orthopedic surveillance or if joint swelling occurs.',
              progress_notes: 'Outpatient Follow-up (Orthopedics). Right knee joint review.\nSubjective: Patient reports significant improvement in right knee pain after physical therapy and home quadriceps strengthening exercises. No morning joint stiffness > 30 minutes, no joint locking or giving way.\nObjective: Gait normal without antalgic limp. Right knee: No joint effusion, no local warmth or erythema. Range of motion: Full flexion to 135° and full extension to 0°. Mild non-tender medial joint line crepitus. Anterior/posterior drawer and McMurray tests negative.\nAssessment: Unilateral Primary Osteoarthritis, Right Knee (M17.11), clinically improved with low disease activity.\nPlan: Shift Celecoxib to strictly PRN for pain flare-ups. Continue low-impact physical exercise (swimming, cycling, walking on flat ground). Avoid deep squats and kneeling. Return for annual orthopedic surveillance or if joint swelling occurs.',
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
              clinical_record: {
                chief_complaint: 'Right knee joint aching pain on walking and climbing stairs x 2 months',
                history: 'Patient is a 47-year-old female presenting with a 2-month history of right knee pain without prior trauma. Denies knee locking, giving way, or redness. Digital knee radiograph confirms mild primary osteoarthritis.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, Grade II'
              },
              progress_notes: '',
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

      var opIndex = records.findIndex(function (record) { return record.id === OP_PATIENT_ID; });
      if (opIndex < 0) {
        records.unshift(opPatientRecord());
      } else if (Number(records[opIndex].seedVersion || 0) < 52) {
        records[opIndex] = opPatientRecord();
        try {
          var store = safeParse(localStorage.getItem('clmmrh_chart_monitoring_data_v1'), {});
          if (store && store[OP_PATIENT_ID]) {
            delete store[OP_PATIENT_ID];
            localStorage.setItem('clmmrh_chart_monitoring_data_v1', JSON.stringify(store));
          }
        } catch (e) {}
      }

      var blankIndex = records.findIndex(function (record) { return record.id === BLANK_PATIENT_ID; });
      if (blankIndex < 0) records.push(blankPatientRecord());
      else if (Number(records[blankIndex].seedVersion || 0) < 43) records[blankIndex] = blankPatientRecord();
      savePatients(records);
    }
