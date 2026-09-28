/* ═══════════════════════════════════════════════════════════════
   CLMMRH SegHIS — Clinical Patient Registry & Baseline Records
   Hospital Master Patient Index (EMPI) Clinical Baseline Records
   ═══════════════════════════════════════════════════════════════ */

var STORAGE_KEY = 'clmmrh_patients_v1';
var SEED_PATIENT_ID = 'patient_1790299677879';
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
      return {
        id: SEED_PATIENT_ID,
        seedVersion: 43,
        createdAt: '2026-06-12T08:15:00+08:00',
        updatedAt: '2026-06-13T16:30:00+08:00',
        data: {
          hrn: '0000001677',
          philhealth_no: '06-025198234-1',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Miguel Santos, MD', prc_no: '0094821', s2_no: 'S2-094821-2026' },
          last_name: 'DELA CRUZ',
          first_name: 'MARIA',
          middle_name: 'SANTOS',
          birthdate: '1986-09-10',
          gender: 'Female',
          address: 'Brgy. Mansilingan, Bacolod City',
          ward_room: 'OPD - Room 102',
          ward_area: 'General Medicine',
          case_no: '001101',
          encounter_no: '001101',
          case_type: 'OP Patient',
          chief_complaint: 'Three-day history of high-grade fever, productive cough with yellowish sputum, and progressive shortness of breath.',
          hx_present: 'Three-day history of fever with yellowish sputum and increasing dyspnea. No chest trauma.',
          hx_surgical: 'No significant surgical history.',
          hx_past: 'Known hypertensive for five years; maintained on amlodipine. No previous tuberculosis treatment.',
          hx_family: 'Father has hypertension and type 2 diabetes mellitus.',
          hx_social: 'Non-smoker; occasional alcohol intake.',
          hx_allergy: 'No known drug allergies (NKDA). Mild allergic rhinitis to dust mites.',
          pertinent_signs: ['Fever', 'Cough', 'Difficulty breathing', 'Others'],
          pertinent_signs_information: 'Febrile with tachypnea and oxygen saturation of 93% on room air. Productive cough with yellowish sputum.',
          pe_general: 'Awake, coherent, mildly dyspneic',
          pe_heent: 'Pink conjunctivae; anicteric sclerae',
          pe_chest_lungs: 'Crackles over the right lower lung field',
          pe_cardiovascular: 'Tachycardic, regular rhythm, no murmur',
          pe_abdomen: 'Soft, non-tender, normoactive bowel sounds',
          pe_extremities: 'No edema; pulses full and equal',
          pe_neurologic: 'GCS 15; no focal neurologic deficit',
          pe_skin: 'Warm; no rash or cyanosis',
          pe_other: '',
          other_forms: ['Trauma Sheet'],
          other_forms_notes: 'No additional specialty form required at present.',
          vs_bp: '104/65', vs_hr: '115', vs_rr: '22', vs_temp: '37.5', vs_spo2: '92', vs_weight: '61', vs_height: '158', vs_date_time: '2026-09-25T12:30:00+08:00',
          vital_signs: [
            { dateTime: '2026-09-25T12:30:00+08:00', bp: '104/65', hr: '115', rr: '22', temp: '37.5', wt: '61', ht: '158', weight: '61', height: '158', bmi: '24.4', spo2: '92', o2: '92' }
          ],
          admitting_diagnosis: 'Community-acquired pneumonia, moderate risk; hypertension.',
          final_diagnosis: '', // Blank for current active consultation; finalized on historical encounters
          progress_notes: 'Productive cough and dyspnea, improved after initial treatment.\nBP 104/65, HR 115, RR 22, Temp 37.5 C, SpO2 92%.\nCommunity-acquired pneumonia, moderate risk; hypertension.',
          encounters: [
            {
              date: '2026-06-13',
              time: '10:15 AM',
              registry: 'OP',
              service: 'General Medicine',
              physician: 'Miguel Santos, MD',
              is_current: true,
              status_tag: 'Follow-up',
              diagnosis: '',
              patient_record: 'Outpatient progress review and clinical monitoring',
              results: 'Clinically stable',
              progress_notes: 'Outpatient Follow-up. Resting comfortably, afebrile, breathing easily on room air. No chest discomfort or dyspnea.\nVital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99% on room air.\nChest: Clear breath sounds bilaterally, minimal crackles at right base.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving. Stable; continue current outpatient management.',
              orders: []
            },
            {
              date: '2026-06-06',
              time: '09:30 AM',
              registry: 'OP',
              service: 'General Medicine',
              physician: 'Miguel Santos, MD',
              is_current: false,
              status_tag: 'Consultation',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia, moderate risk; I10 - Essential Hypertension',
              patient_record: 'Outpatient consultation and prescription review',
              results: 'Clinically improving',
              vital_signs: [
                { dateTime: '2026-06-06 09:30 AM', bp: '120/80', hr: '78', rr: '18', temp: '36.8', wt: '52', ht: '154', weight: '52', height: '154', bmi: '21.9', spo2: '98', o2: '98' }
              ],
              medications: [
                { id: 'med-ms-1', name: 'Co-amoxiclav 625 mg tablet', route: 'Oral Twice Daily (BID) to complete 7 days', indication: 'Community-Acquired Pneumonia', started: '2026-06-06T09:30:00+08:00', doses24h: '2 doses', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ms-2', name: 'Azithromycin 500 mg tablet', route: 'Oral Once Daily (OD) Day 4 of 5', indication: 'Community-Acquired Pneumonia', started: '2026-06-06T09:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ms-3', name: 'Losartan 50 mg tablet', route: 'Oral Once Daily (OD)', indication: 'Essential Hypertension', started: '2026-06-06T09:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Miguel Santos, MD' },
                { id: 'med-ms-4', name: 'Paracetamol 500 mg tablet', route: 'Oral Q4H PRN for fever >= 38.0 C or headache', indication: 'Antipyretic / Analgesic', started: '2026-06-06T09:30:00+08:00', doses24h: 'PRN', status: 'Active / PRN', nurse: 'Miguel Santos, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Outpatient consultation and prescription review; follow-up of productive cough and low-grade fever.',
                history: 'Outpatient Consultation. Productive cough decreasing, dyspnea significantly resolved. Chest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.',
                final_diagnosis: 'Community-Acquired Pneumonia, moderate risk, resolving on targeted oral antibiotics; Essential Hypertension (ICD-10: J18.9, I10)'
              },
              progress_notes: 'Outpatient Consultation. Productive cough decreasing, dyspnea significantly resolved.\nVital signs: BP 120/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.8 °C, SpO2 98% room air\nChest auscultation: Decreased crackles right lower lung zone, good bilateral air entry.\nDiagnosis: Community-Acquired Pneumonia, moderate risk, resolving on targeted oral antibiotics',
              orders: [
                { text: 'Maintain SpO2 >= 95% on room air.', dateTime: '2026-06-06T09:30:00+08:00', cared: ['C'], timeSignature: 'C - 09:45 AM nurse' },
                { text: 'Continue Azithromycin 500 mg tablet once daily after meals.', dateTime: '2026-06-06T09:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 10:00 AM nurse\nA - 10:15 AM nurse' },
                { text: 'Repeat Complete Blood Count (CBC) and serum creatinine after 3 days.', dateTime: '2026-06-06T09:30:00+08:00', cared: ['R'], timeSignature: 'R - 10:05 AM physician' },
                { text: 'May ambulate as tolerated. Regular diet.', dateTime: '2026-06-06T09:30:00+08:00', cared: ['C'], timeSignature: 'C - 10:10 AM nurse' }
              ],
              clinical_record: {
                chief_complaint: 'Decreasing cough and improved breathing; afebrile x 18 hours',
                history: 'Hospital Day 2. Patient was admitted to Medical Ward under General Medicine. Received IV Ceftriaxone 2 g OD (Day 2) and PO Azithromycin 500 mg OD. Temperature normalized (afebrile at 36.8°C for the past 18 hours). Dyspnea has significantly resolved, patient ambulating comfortably in room. Productive cough is looser and less frequent with clearing sputum.\n\nInterval History: Tolerating low-salt diet well, adequate oral fluid intake. No chest pain, palpitations, or drug adverse events noted. Vital signs stable with SpO2 98% on 2 L/min nasal cannula.\n\nPhysical Examination on Rounds: Chest auscultation shows decreased coarse crackles over the right base with improved bilateral breath sounds. Abdomen soft, non-tender.',
                final_diagnosis: 'Community-Acquired Pneumonia, resolving on targeted IV antimicrobial therapy; Essential Hypertension, controlled'
              },
              examinations: [
                {
                  id: 'EXAM-20260613-01',
                  category: 'Laboratory - Hematology',
                  name: 'Follow-up Complete Blood Count (CBC)',
                  performed_at: '2026-06-13 06:30 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Marked hematologic response to antimicrobial therapy: white blood cell count decreased into normal reference range; neutrophilia resolving.',
                  analytes: [
                    { test: 'White Blood Cells (WBC)', value: '9.8', unit: 'x10^9/L', reference: '4.5 - 11.0', flag: 'Normal' },
                    { test: 'Neutrophils / Segmenters', value: '68', unit: '%', reference: '50 - 70', flag: 'Normal' },
                    { test: 'Lymphocytes', value: '25', unit: '%', reference: '20 - 40', flag: 'Normal' },
                    { test: 'Hemoglobin', value: '130', unit: 'g/L', reference: '120 - 160', flag: 'Normal' },
                    { test: 'Platelet Count', value: '258', unit: 'x10^9/L', reference: '150 - 450', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260613-02A',
                  category: 'Laboratory - Clinical Chemistry',
                  name: 'Serum Creatinine',
                  performed_at: '2026-06-13 06:35 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Serum creatinine within normal limits during intravenous antibiotic therapy.',
                  analytes: [
                    { test: 'Serum Creatinine', value: '0.85', unit: 'mg/dL', reference: '0.50 - 1.10', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260613-02B',
                  category: 'Laboratory - Clinical Chemistry',
                  name: 'Blood Urea Nitrogen (BUN)',
                  performed_at: '2026-06-13 06:35 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Blood urea nitrogen within normal limits; no azotemia.',
                  analytes: [
                    { test: 'Blood Urea Nitrogen (BUN)', value: '14.0', unit: 'mg/dL', reference: '7.0 - 20.0', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260613-02C',
                  category: 'Laboratory - Clinical Chemistry',
                  name: 'Estimated Glomerular Filtration Rate (eGFR)',
                  performed_at: '2026-06-13 06:35 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'eGFR within normal range; renal function preserved.',
                  analytes: [
                    { test: 'Estimated GFR (CKD-EPI)', value: '88', unit: 'mL/min/1.73m²', reference: '> 60', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260613-03',
                  category: 'Laboratory - Bedside Point of Care',
                  name: 'Random Blood Glucose (RBG)',
                  performed_at: '2026-06-13 07:00 AM',
                  status: 'Completed',
                  performed_by: 'E. Dela Cruz, RN',
                  impression: 'Normoglycemic fasting bedside profile.',
                  analytes: [
                    { test: 'Capillary Blood Glucose', value: '108', unit: 'mg/dL', reference: '70 - 140', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260613-04',
                  category: 'Pulmonology / Respiratory Therapy',
                  name: 'Pulse Oximetry & Room Air Weaning Challenge',
                  performed_at: '2026-06-13 10:15 AM',
                  status: 'Completed',
                  performed_by: 'K. Villar, RRT',
                  findings: 'Baseline SpO2 on Nasal Cannula (2 L/min): 98%. Patient subjected to 15-minute room air trial: SpO2 maintained at 96% with resting respiratory rate of 16-18/min. Patient reported no dyspnea or chest tightness.',
                  impression: 'Successful room air trial. Cleared to discontinue nasal cannula oxygen as tolerated.'
                }
              ]
            },
            {
              date: '2026-06-12',
              time: '08:30 AM',
              registry: 'ER',
              service: 'Emergency Medicine',
              physician: 'Roberto Lim, MD',
              is_current: false,
              status_tag: 'Initial Visit (ER)',
              diagnosis: 'J18.9 - Community-Acquired Pneumonia (CAP) - Moderate Risk; Essential Hypertension Stage 2',
              patient_record: 'Initial assessment and stabilization',
              results: 'Admitted to Medical Ward',
              vital_signs: [
                { dateTime: '2026-06-12 08:30 AM', bp: '140/90', hr: '104', rr: '24', temp: '38.6', wt: '52', ht: '154', weight: '52', height: '154', bmi: '21.9', spo2: '93', o2: '93' }
              ],
              medications: [
                { id: 'med-er-1', name: 'Ceftriaxone 2 g vial', route: 'Intravenous Push (IVP) OD after skin test', indication: 'Community-Acquired Pneumonia', started: '2026-06-12T08:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Roberto Lim, MD' },
                { id: 'med-er-2', name: 'Azithromycin 500 mg tablet', route: 'Oral Once Daily (OD) with food', indication: 'Community-Acquired Pneumonia', started: '2026-06-12T08:30:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Roberto Lim, MD' },
                { id: 'med-er-3', name: 'Paracetamol 500 mg tablet', route: 'Oral Every 6 hours PRN for fever >= 37.8 C', indication: 'Antipyretic', started: '2026-06-12T08:30:00+08:00', doses24h: 'PRN', status: 'Active / PRN', nurse: 'Roberto Lim, MD' },
                { id: 'med-er-4', name: 'Norepinephrine Drip (4 mg in 100 mL D5W)', route: 'Continuous IV Infusion 15 mL/hr via central line', indication: 'Maintain MAP >= 65 mmHg', started: '2026-06-12T08:30:00+08:00', doses24h: 'Continuous', status: 'Active', nurse: 'Roberto Lim, MD' }
              ],
              orders: [
                { text: 'Admit to Medical Ward under General Medicine service.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:30 PM nurse' },
                { text: 'Ceftriaxone 2 g IV once daily after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:40 PM nurse' },
                { text: 'Azithromycin 500 mg tablet once daily with food.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse' },
                { text: 'Paracetamol 500 mg tablet PO q6h PRN for fever >= 37.8 C.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:45 PM nurse' },
                { text: 'Oxygen at 2 L/min via nasal cannula; maintain SpO2 >= 95%.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:50 PM nurse' }
              ],
              clinical_record: {
                chief_complaint: 'Difficulty of breathing and high-grade fever x 3 days',
                history: 'Patient is a 40-year-old female who presented to the Emergency Room with a 3-day history of productive cough with yellowish sputum, progressive dyspnea, and undocumented high-grade fever with chills. No hemoptysis, chest trauma, or orthopnea. Denies recent travel or known COVID-19 contact.\n\nPast Medical History: Known hypertensive for 5 years maintained on Amlodipine 5 mg once daily with fair compliance. No prior asthma, diabetes, or pulmonary tuberculosis.\n\nPersonal / Social History: Non-smoker, occasional social alcoholic beverage drinker, works as an accountant.\n\nFamily History: Father (+) Hypertension and Type 2 Diabetes; Mother (+) Bronchial Asthma.',
                final_diagnosis: 'Community-Acquired Pneumonia (CAP) - Moderate Risk; Essential Hypertension Stage 2'
              },
              examinations: [
                {
                  id: 'EXAM-20260612-01',
                  category: 'Laboratory - Hematology',
                  name: 'Complete Blood Count (CBC) with Platelet Count',
                  performed_at: '2026-06-12 08:50 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Leukocytosis with marked neutrophilic shift indicative of acute bacterial infection.',
                  analytes: [
                    { test: 'White Blood Cells (WBC)', value: '14.2', unit: 'x10^9/L', reference: '4.5 - 11.0', flag: 'High' },
                    { test: 'Neutrophils / Segmenters', value: '82', unit: '%', reference: '50 - 70', flag: 'High' },
                    { test: 'Lymphocytes', value: '14', unit: '%', reference: '20 - 40', flag: 'Low' },
                    { test: 'Hemoglobin', value: '132', unit: 'g/L', reference: '120 - 160', flag: 'Normal' },
                    { test: 'Hematocrit', value: '0.40', unit: 'L/L', reference: '0.37 - 0.48', flag: 'Normal' },
                    { test: 'Platelet Count', value: '265', unit: 'x10^9/L', reference: '150 - 450', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260612-02',
                  category: 'Laboratory - Clinical Chemistry',
                  name: 'Serum Electrolytes (Sodium, Potassium, Chloride)',
                  performed_at: '2026-06-12 08:55 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Serum electrolytes are within normal physiological limits.',
                  analytes: [
                    { test: 'Sodium (Na+)', value: '137', unit: 'mmol/L', reference: '135 - 145', flag: 'Normal' },
                    { test: 'Potassium (K+)', value: '4.1', unit: 'mmol/L', reference: '3.5 - 5.0', flag: 'Normal' },
                    { test: 'Chloride (Cl-)', value: '101', unit: 'mmol/L', reference: '96 - 106', flag: 'Normal' }
                  ]
                },
                {
                  id: 'EXAM-20260612-03',
                  category: 'Laboratory - Arterial Blood Gas',
                  name: 'Arterial Blood Gas (ABG) - Room Air',
                  performed_at: '2026-06-12 09:10 AM',
                  status: 'Completed',
                  performed_by: 'K. Villar, RRT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Mild uncompensated respiratory alkalosis secondary to hyperventilation with mild hypoxemia on room air.',
                  analytes: [
                    { test: 'pH', value: '7.44', unit: '', reference: '7.35 - 7.45', flag: 'Normal' },
                    { test: 'pCO2', value: '33', unit: 'mmHg', reference: '35 - 45', flag: 'Low' },
                    { test: 'pO2', value: '68', unit: 'mmHg', reference: '80 - 100', flag: 'Low' },
                    { test: 'HCO3', value: '22', unit: 'mmol/L', reference: '22 - 26', flag: 'Normal' },
                    { test: 'SaO2', value: '93', unit: '%', reference: '95 - 100', flag: 'Low' }
                  ]
                },
                {
                  id: 'EXAM-20260612-04',
                  category: 'Diagnostic Radiology',
                  name: 'Chest X-Ray PA View (Digital Radiography)',
                  performed_at: '2026-06-12 09:30 AM',
                  status: 'Completed',
                  performed_by: 'J. Ramos, RT(R) / Official Reading by Dr. Roberto Lim, Radiologist',
                  findings: 'Patches of alveolar consolidation with bronchovascular markings noted in the right lower lung field (RLL). Costophrenic sulci and hemidiaphragms are intact. Cardiothoracic ratio is normal (<0.50). Trachea is midline. Bony thorax and soft tissues show no significant lesions.',
                  impression: 'Acute pneumonia, right lower lobe.'
                },
                {
                  id: 'EXAM-20260612-05',
                  category: 'Heart Station / ECG',
                  name: '12-Lead Electrocardiogram (ECG)',
                  performed_at: '2026-06-12 09:45 AM',
                  status: 'Completed',
                  performed_by: 'C. David, ECG Tech / Official Reading by Dr. Andrea Reyes, Cardiologist',
                  findings: 'Sinus tachycardia at 104 bpm. Normal PR interval (0.16s), normal QRS complex duration (0.08s). Normal axis. No acute ST segment elevation, depression, or T-wave inversion.',
                  impression: 'Sinus tachycardia, otherwise normal 12-lead ECG tracing.'
                }
              ]
            },
            {
              date: '2026-05-20',
              time: '02:15 PM',
              registry: 'OP',
              service: 'Pulmonary & Adult Medicine',
              physician: 'Ramon Valencia, MD',
              is_current: false,
              status_tag: 'Follow-up',
              diagnosis: 'J45.909 - Bronchial Asthma, in clinical remission; Essential Hypertension Stage 1',
              patient_record: 'Routine adult pulmonary checkup and maintenance medication titration',
              results: 'Spirometry normal; maintenance therapy continued',
              vital_signs: [
                { dateTime: '2026-05-20 02:15 PM', bp: '124/80', hr: '76', rr: '16', temp: '36.5', wt: '52', ht: '154', weight: '52', height: '154', bmi: '21.9', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-asthma-1', name: 'Budesonide / Formoterol 160/4.5 mcg inhaler', route: '1 puff Twice Daily (BID)', indication: 'Bronchial Asthma Maintenance', started: '2026-05-20T14:15:00+08:00', doses24h: '2 puffs', status: 'Active', nurse: 'Ramon Valencia, MD' },
                { id: 'med-asthma-2', name: 'Amlodipine 5 mg tablet', route: 'Oral Once Daily (OD) in the morning', indication: 'Essential Hypertension', started: '2026-05-20T14:15:00+08:00', doses24h: '1 dose', status: 'Active', nurse: 'Ramon Valencia, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Routine follow-up consultation for asthma maintenance refill and blood pressure check',
                history: 'Patient presented to the Adult Pulmonary Outpatient Clinic for routine evaluation. Denies acute shortness of breath, nocturnal cough, or wheezing over the preceding month. Compliant with maintenance Budesonide/Formoterol inhaler and Amlodipine 5 mg OD. BP 124/80 mmHg, HR 76 bpm, RR 16/min, SpO2 99% on ambient air. Chest auscultation revealed clear and symmetric breath sounds throughout all lung zones.',
                final_diagnosis: 'Bronchial Asthma, Well-Controlled; Essential Hypertension Stage 1 (Controlled)'
              },
              progress_notes: 'Outpatient pulmonary routine follow-up. No dyspnea, no wheezing, good inhaler adherence.\nVital signs: BP 124/80 mmHg, HR 76 bpm, RR 16/min, Temp 36.5 °C, SpO2 99%\nChest: Clear and symmetric breath sounds throughout all lung zones.\nDiagnosis: Bronchial Asthma, Well-Controlled; Essential Hypertension Stage 1 (Controlled)',
              orders: [
                { text: 'Continue Budesonide/Formoterol 160/4.5 mcg inhaler, 1 puff BID.', dateTime: '2026-05-20T14:15:00+08:00', cared: ['C'], timeSignature: 'C - 2:45 PM nurse' },
                { text: 'Continue Amlodipine 5 mg tablet once daily in the morning.', dateTime: '2026-05-20T14:15:00+08:00', cared: ['C'], timeSignature: 'C - 2:50 PM nurse' },
                { text: 'Follow-up at Adult Pulmonary Outpatient Clinic after 3 months.', dateTime: '2026-05-20T14:15:00+08:00', cared: ['C'], timeSignature: 'C - 3:00 PM nurse' }
              ],
              examinations: [
                {
                  id: 'EXAM-20260520-01',
                  category: 'Pulmonology / Pulmonary Function Test',
                  name: 'Spirometry (Pre- and Post-Bronchodilator)',
                  performed_at: '2026-05-20 02:40 PM',
                  status: 'Completed',
                  performed_by: 'K. Villar, RRT / Reading by Dr. Ramon Valencia, Pulmonologist',
                  findings: 'FVC: 3.42 L (96% of predicted)\nFEV1: 2.78 L (94% of predicted)\nFEV1/FVC: 81.3% (Normal > 70%)\nPost-bronchodilator change in FEV1: +4% and 110 mL (negative for active acute reversibility).',
                  impression: 'Normal baseline spirometry without active ventilatory defect.'
                },
                {
                  id: 'EXAM-20260520-02',
                  category: 'Laboratory - Clinical Microscopy',
                  name: 'Routine Urinalysis (Automated & Microscopic)',
                  performed_at: '2026-05-20 03:00 PM',
                  status: 'Completed',
                  performed_by: 'J. Ramos, RMT',
                  impression: 'Routine urinalysis within normal physiological parameters.',
                  analytes: [
                    { test: 'Color / Clarity', value: 'Light Yellow / Clear', unit: '', reference: 'Straw/Yellow, Clear', flag: 'Normal' },
                    { test: 'Specific Gravity', value: '1.018', unit: '', reference: '1.005 - 1.030', flag: 'Normal' },
                    { test: 'pH', value: '6.0', unit: '', reference: '5.0 - 7.5', flag: 'Normal' },
                    { test: 'Protein', value: 'Negative', unit: '', reference: 'Negative', flag: 'Normal' },
                    { test: 'Glucose', value: 'Negative', unit: '', reference: 'Negative', flag: 'Normal' },
                    { test: 'RBC / WBC (Microscopic)', value: '0-1 / 1-2', unit: '/hpf', reference: '0-2 / 0-5', flag: 'Normal' }
                  ]
                }
              ]
            },
            {
              date: '2026-04-10',
              time: '10:30 AM',
              registry: 'IP',
              service: 'General Surgery',
              physician: 'Andrea Reyes, MD',
              is_current: false,
              status_tag: 'Previous Admission',
              diagnosis: 'K35.80 - Acute Appendicitis, uncomplicated; S/P Laparoscopic Appendectomy',
              patient_record: 'Post-operative surgical ward care and wound healing review',
              results: 'Discharged clinically stable; surgical port sites healed',
              vital_signs: [
                { dateTime: '2026-04-10 10:30 AM', bp: '118/76', hr: '74', rr: '16', temp: '36.6', wt: '52', ht: '154', weight: '52', height: '154', bmi: '21.9', spo2: '99', o2: '99' }
              ],
              medications: [
                { id: 'med-surg-1', name: 'Cefuroxime 750 mg vial', route: 'IVTT Every 8 hours (Q8H)', indication: 'Post-Operative Antibiotic Prophylaxis', started: '2026-04-10T10:30:00+08:00', doses24h: '3 doses', status: 'Active', nurse: 'Andrea Reyes, MD' },
                { id: 'med-surg-2', name: 'Ketorolac 30 mg ampule', route: 'IVTT Every 8 hours PRN for wound pain', indication: 'Post-Operative Analgesia', started: '2026-04-10T10:30:00+08:00', doses24h: 'PRN', status: 'Active / PRN', nurse: 'Andrea Reyes, MD' }
              ],
              clinical_record: {
                chief_complaint: 'Severe right lower quadrant (RLQ) abdominal pain with nausea x 2 days',
                history: 'Patient was admitted through the ER due to a 2-day history of periumbilical pain migrating to the right lower quadrant, accompanied by low-grade fever and anorexia. Physical exam demonstrated marked tenderness at McBurney\'s point with rebound tenderness. Emergency ultrasound confirmed acute appendicitis (non-perforated). Patient underwent an uncomplicated laparoscopic appendectomy under general endotracheal anesthesia on 04/10/2026. Post-operative course was smooth; surgical port sites dry and intact, bowel sounds normoactive on Post-Op Day 1, afebrile, and pain well controlled on oral analgesics.',
                final_diagnosis: 'Acute Appendicitis, Non-perforated; Status Post Laparoscopic Appendectomy (ICD-10: K35.80)'
              },
              progress_notes: 'Post-Operative Day 1. S/P Laparoscopic Appendectomy. Tolerating clear liquids, afebrile.\nVital signs: BP 118/76 mmHg, HR 74 bpm, RR 16/min, Temp 36.6 °C, SpO2 99%\nAbdomen: Soft, mild peri-incisional tenderness, surgical port sites clean, dry, and intact.\nDiagnosis: Acute Appendicitis, Non-perforated; Status Post Laparoscopic Appendectomy (K35.80)',
              orders: [
                { text: 'NPO temporarily until fully awake, then may start clear liquids as tolerated.', dateTime: '2026-04-10T10:30:00+08:00', cared: ['C'], timeSignature: 'C - 10:45 AM nurse' },
                { text: 'PNSS 1 L at 100 mL/hour.', dateTime: '2026-04-10T10:30:00+08:00', cared: ['A'], timeSignature: 'A - 11:00 AM nurse' },
                { text: 'Cefuroxime 750 mg IV every 8 hours (Post-Op Day 1).', dateTime: '2026-04-10T10:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 11:15 AM nurse\nA - 12:00 PM nurse' },
                { text: 'Ketorolac 30 mg IV every 8 hours PRN for moderate to severe wound pain.', dateTime: '2026-04-10T10:30:00+08:00', cared: ['C'], timeSignature: 'C - 11:20 AM nurse' },
                { text: 'Monitor surgical dressing for bleeding or discharge; keep clean and dry.', dateTime: '2026-04-10T10:30:00+08:00', cared: ['C'], timeSignature: 'C - 11:30 AM nurse' }
              ],
              examinations: [
                {
                  id: 'EXAM-20260410-01',
                  category: 'Diagnostic Ultrasound',
                  name: 'Targeted Abdominal Ultrasound (Appendix & Right Lower Quadrant)',
                  performed_at: '2026-04-10 09:15 AM',
                  status: 'Completed',
                  performed_by: 'Dr. Roberto Lim, Radiologist',
                  findings: 'Blind-ending, non-compressible aperistaltic tubular structure identified at the right iliac fossa. Maximal outer diameter measures 8.2 mm with target sign on transverse view. Mild surrounding hyperechoic mesenteric fat stranding. No pericecal abscess or free peritoneal fluid.',
                  impression: 'Sonographic findings compatible with Acute Non-Perforated Appendicitis.'
                },
                {
                  id: 'EXAM-20260411-02',
                  category: 'Surgical Pathology / Histopathology',
                  name: 'Biopsy / Histopathology: Appendix Tissue Specimen',
                  performed_at: '2026-04-11 02:00 PM',
                  status: 'Completed',
                  performed_by: 'Dr. E. Gomez, Pathologist',
                  findings: 'Gross: Vermiform appendix measuring 7.5 cm in length and 0.8 cm in diameter with hyperemic serosa and focal fibrinous exudates.\n\nMicroscopic: Cross sections reveal mucosal ulceration, dense transmural infiltration of neutrophils into the muscularis propria, and vascular congestion throughout the appendiceal wall. Serosal surface shows acute inflammatory exudate. No evidence of dysplasia or malignancy.',
                  impression: 'Acute Suppurative Appendicitis with Early Periappendicitis.'
                },
                {
                  id: 'EXAM-20260412-03',
                  category: 'Laboratory - Hematology',
                  name: 'Post-Operative Complete Blood Count (CBC)',
                  performed_at: '2026-04-12 06:45 AM',
                  status: 'Completed',
                  performed_by: 'M. Tan, RMT / Validated by Dr. E. Gomez, Pathologist',
                  impression: 'Normal post-operative hematologic profile; leukocytosis resolved.',
                  analytes: [
                    { test: 'White Blood Cells (WBC)', value: '7.8', unit: 'x10^9/L', reference: '4.5 - 11.0', flag: 'Normal' },
                    { test: 'Neutrophils / Segmenters', value: '60', unit: '%', reference: '50 - 70', flag: 'Normal' },
                    { test: 'Lymphocytes', value: '32', unit: '%', reference: '20 - 40', flag: 'Normal' },
                    { test: 'Hemoglobin', value: '128', unit: 'g/L', reference: '120 - 160', flag: 'Normal' },
                    { test: 'Platelet Count', value: '272', unit: 'x10^9/L', reference: '150 - 450', flag: 'Normal' }
                  ]
                }
              ]
            }
          ],
          orders: {
            plans: [
              { text: 'Admit to Medical Ward under General Medicine service.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:30 PM nurse' },
              { text: 'Monitor vital signs every four hours and record intake and output.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:32 PM nurse' }
            ],
            diet: [{ text: 'Low-salt diet as tolerated.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:35 PM nurse' }],
            iv: [{ text: 'PNSS 1 L at 80 mL/hour.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['A'], timeSignature: 'A - 12:45 PM nurse' }],
            medications: [
              { orderType: 'scheduled', genericName: 'Ceftriaxone', dose: '2', doseUnit: 'g', route: 'Intravenous Push (IVP)', frequency: 'Once daily (OD)', duration: '7 days', precautions: 'Administer after negative skin test.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A', 'E'], timeSignature: 'C - 12:40 PM nurse\nA - 1:00 PM nurse\nE - 1:20 PM nurse' },
              { orderType: 'scheduled', genericName: 'Azithromycin', dose: '500', doseUnit: 'mg', route: 'Oral (PO)', frequency: 'Once daily (OD)', duration: '5 days', precautions: 'Take with food.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:42 PM nurse\nA - 1:05 PM nurse' },
              { orderType: 'scheduled', genericName: 'Paracetamol', dose: '500', doseUnit: 'mg', route: 'Oral (PO)', frequency: 'Every 6 hours (Q6H)', duration: '3 days', precautions: 'PRN for fever (T >= 37.8 C). Hold if afebrile.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C', 'A'], timeSignature: 'C - 12:45 PM nurse\nA - 1:10 PM nurse' },
              { orderType: 'continuous', solution: '0.9% Sodium Chloride (PNSS) 100 mL', additiveDrug: 'Norepinephrine 4 mg', finalConcentration: '40 mcg/mL (4 mg in 100 mL)', prescribedDose: '0.05 - 0.2', doseExpression: 'mcg/kg/min', infusionRate: '15', precautions: 'Titrate to maintain MAP >= 65 mmHg. Central line only.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:48 PM nurse' },
              { orderType: 'oxygen', deliveryMethod: 'Nasal Cannula', oxygenParameters: '2 L/min', oxygenTarget: 'Maintain SpO2 ≥ 95%', oxygenDuration: 'Continuous', precautions: 'Continuous pulse oximetry monitoring. Check skin integrity around nares.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:50 PM nurse' }
            ],
            prescriptions: {
              licenseNo: 'S2-09876543-A',
              prescriptionDate: '2026-06-12T08:35:00+08:00',
              clinicalImpression: 'Community-acquired pneumonia, moderate risk; Essential hypertension.',
              specialInstructions: 'Take medications with plenty of water. Complete full course of antibiotics even if feeling well.',
              saveTemplate: false,
              templateName: '',
              savePharmacyOrder: true,
              noRefill: true,
              items: [
                {
                  drug: 'Amoxicillin + Potassium Clavulanate (Co-amoxiclav) 625 mg tablet',
                  quantity: '21',
                  dosage: '625 mg',
                  frequency: 'Every 8 hours (TID)',
                  timing: 'With meals',
                  period: 'Days',
                  duration: '7'
                },
                {
                  drug: 'Paracetamol 500 mg tablet',
                  quantity: '15',
                  dosage: '500 mg',
                  frequency: 'Every 6 hours (Q6H)',
                  timing: 'After meals',
                  period: 'Days',
                  duration: '3'
                }
              ]
            },
            special: [{ text: 'Oxygen at 2 L/minute via nasal cannula; maintain SpO2 at 95% or higher.', dateTime: '2026-06-12T08:30:00+08:00', cared: ['C'], timeSignature: 'C - 12:50 PM nurse' }],
            procedures: [],
            clinicalRequests: {
              laboratory: [
                { code: 'LAB0001', description: 'Complete Blood Count (CBC)', priority: 'STAT', remarks: 'Baseline before antibiotics', quantity: 1, price: 180, dateTime: '2026-06-12T08:30:00+08:00', cared: ['R'], timeSignature: 'R - 1:31 AM physician' },
                { code: 'LAB0005', description: 'Electrolytes (Na, K, Cl)', priority: 'Routine', remarks: '', quantity: 1, price: 390, dateTime: '2026-06-12T08:30:00+08:00', cared: ['R'], timeSignature: 'R - 1:33 AM physician' }
              ],
              radiology: [{ code: 'RAD0001', description: 'Chest X-Ray (PA)', priority: 'STAT', remarks: 'Rule out pneumonia', quantity: 1, price: 450, dateTime: '2026-06-12T08:30:00+08:00', cared: ['R'], timeSignature: 'R - 1:35 AM physician' }],
              respiratory: [], heart: [], eeg: []
            }
          },
          disposition: 'Admitted',
          referrals: [{ date: '2026-06-13', department: 'GENERAL MEDICINE', reason: 'Co-manage persistent hypoxemia and review respiratory support.', primaryPhysician: 'Dr. Andrea Reyes', coManagingPhysician: 'Dr. Miguel Santos', receivingPhysician: 'Dr. Miguel Santos' }],
          follow_up_needed: 'Yes',
          follow_up_date: '2026-06-20',
          follow_up_reason: 'Repeat chest examination and review laboratory results.',
          exam_laboratory: 'CBC: WBC 14.2 x10^9/L with neutrophilia; electrolytes within acceptable limits.',
          exam_diagnostics: 'Chest X-ray: right lower lobe infiltrates consistent with pneumonia.',
          exam_heart_station: 'ECG: sinus tachycardia.',
          exam_eeg: '',
          exam_pulmonology: 'Oxygen saturation improved to 97% on nasal cannula.'
        }
      };
    }

    var OP_PATIENT_ID = 'patient_op_juan';

    function opPatientRecord() {
      return {
        id: OP_PATIENT_ID,
        seedVersion: 46,
        createdAt: '2026-03-14T08:45:00+08:00',
        updatedAt: '2026-09-26T09:30:00+08:00',
        data: {
          hrn: '0000001890',
          philhealth_no: '06-018274910-3',
          phic_member_category: 'Direct Contributor - Employed (Private)',
          attending_physician: { name: 'Miguel Santos, MD', prc_no: '0094821', s2_no: 'S2-094821-2026' },
          last_name: 'DEL ROSARIO',
          first_name: 'JUAN',
          middle_name: 'BAUTISTA',
          birthdate: '1978-03-22',
          gender: 'Male',
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
          vs_bp: '', vs_hr: '', vs_rr: '', vs_temp: '', vs_spo2: '', vs_weight: '', vs_height: '', vs_date_time: '',
          vital_signs: [],
          admitting_diagnosis: '',
          final_diagnosis: '', // Blank for current active consultation; finalized on historical encounters
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
                history: 'Patient is a 48-year-old male presenting for scheduled semi-annual review. Reports occasional mild afternoon fatigue; denies polyuria, polydipsia, numbness, chest tightness, or dyspnea. Compliant with Metformin 500 mg BID and Losartan 50 mg OD. Home BP ranges 130-138/80-86 mmHg.\n\nPhysical Examination: General: Alert, oriented, in no acute distress. Lungs: Clear to auscultation bilaterally. Heart: Regular rate and rhythm, no murmurs. Extremities: No edema, dorsalis pedis pulses palpable.',
                final_diagnosis: 'Type 2 Diabetes Mellitus, suboptimally controlled; Essential Hypertension (ICD-10: E11.9, I10)'
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
              status_tag: 'Initial Visit',
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
                final_diagnosis: 'Type 2 Diabetes Mellitus; Essential Hypertension Stage 1 (ICD-10: E11.9, I10)'
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
                history: 'Patient is a 47-year-old male with diagnosed mild primary osteoarthritis of the right knee returning for scheduled 3-month orthopedic follow-up. Demonstrates good symptom improvement on physical therapy and home quadriceps rehabilitation.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, clinically stable (ICD-10: M17.11)'
              },
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
                history: 'Patient is a 47-year-old male presenting with a 2-month history of right knee pain without prior trauma. Denies knee locking, giving way, or redness. Digital knee radiograph confirms mild primary osteoarthritis.',
                final_diagnosis: 'Unilateral Primary Osteoarthritis, Right Knee, Grade II (ICD-10: M17.11)'
              },
              progress_notes: 'Initial Outpatient Consultation (Orthopedics). Right knee pain evaluation.\nSubjective: 2-month history of dull aching pain over the medial aspect of the right knee, aggravated by prolonged standing and climbing stairs. Pain score 6/10. No history of direct knee trauma, fall, or fever.\nObjective: Vital signs: BP 126/80 mmHg, HR 78 bpm, RR 18/min, Temp 36.7 °C. Weight 70 kg, BMI 24.8. Right knee examination: Mild tenderness on palpation of medial joint line. No knee joint effusion or ballottable patella. Active flexion 120°, extension 0°. Lachman and pivot-shift tests negative. Neurovascular examination intact.\nDiagnostic Imaging: Digital Knee Radiograph (AP & Lateral Weight-Bearing Views): Mild medial compartment joint space narrowing, subchondral sclerosis, and minimal osteophyte formation at medial tibial spine. Alignment intact; no fracture or osteolytic lesion.\nAssessment: Unilateral Primary Osteoarthritis, Right Knee, Kellgren-Lawrence Grade II (M17.11).\nPlan: Celecoxib 200 mg cap PO once daily for 14 days. Paracetamol 500 mg tab PO TID PRN. Referral to Physical Therapy for quadriceps rehabilitation and joint kinematics. Follow-up after 12 weeks.',
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
          encounters: [],
          orders: { plans: [], diet: [], iv: [], medications: [], special: [], procedures: [], clinicalRequests: { laboratory: [], radiology: [], respiratory: [], heart: [], eeg: [] }, prescriptions: { items: [] } },
          referrals: []
        }
      };
    }

    function ensureSeedPatient() {
      var records = getPatients();
      var index = records.findIndex(function (record) { return record.id === SEED_PATIENT_ID; });
      if (index < 0) records.push(seedPatientRecord());
      else if (Number(records[index].seedVersion || 0) < 43) records[index] = seedPatientRecord();

      var opIndex = records.findIndex(function (record) { return record.id === OP_PATIENT_ID; });
      if (opIndex < 0) {
        records.push(opPatientRecord());
      } else if (Number(records[opIndex].seedVersion || 0) < 46) {
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
