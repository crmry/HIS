/*
 * Cesarean indication catalog.
 * Source: PhilHealth Circular PC-2026-0016, Section V.C, Tables 2-7 (printed pp. 4-8).
 * Labels are normalized for documentation; qualifying conditions are carried in `note`.
 * Stable ids must never be renamed; add new ids for new entries.
 */
(function (root) {
  'use strict';

  var VERSION = 'PC-2026-0016';

  var MACROSOMIA_NOTE = 'Estimated or actual birthweight over 4,000 g by overall clinical assessment and/or ultrasonography. Without a recent ultrasound, suspected macrosomia requires documented clinical evaluation (symphysis-fundal height, abdominal examination, Leopold maneuvers, clinical weight estimation, maternal risk factors).';

  function e(id, cls, group, label, note) {
    return { id: id, cls: cls, group: group, label: label, note: note || '' };
  }

  var P = 'Planned (Elective)';
  var E = 'Emergency';

  var LIST = [
    /* Table 2: Planned, maternal */
    e('PL-M-UTS-2CS', P, 'Maternal: Previous Uterine Surgery (not in labor)', 'History of two or more previous CS'),
    e('PL-M-UTS-RUP', P, 'Maternal: Previous Uterine Surgery (not in labor)', 'Prior uterine rupture'),
    e('PL-M-UTS-MYO', P, 'Maternal: Previous Uterine Surgery (not in labor)', 'Previous myomectomy'),
    e('PL-M-CV-AORT', P, 'Maternal: Cardiovascular and Vascular', 'Aortopathy with aortic root dilatation (e.g. Marfan syndrome)'),
    e('PL-M-CV-DISS', P, 'Maternal: Cardiovascular and Vascular', 'Chronic aortic dissection'),
    e('PL-M-CV-EISE', P, 'Maternal: Cardiovascular and Vascular', 'Eisenmenger syndrome'),
    e('PL-M-CV-PAH', P, 'Maternal: Cardiovascular and Vascular', 'Pulmonary arterial hypertension'),
    e('PL-M-CV-ANEU', P, 'Maternal: Cardiovascular and Vascular', 'Cerebral aneurysm'),
    e('PL-M-CV-CVA', P, 'Maternal: Cardiovascular and Vascular', 'History of cerebrovascular accident / stroke'),
    e('PL-M-MED-APS', P, 'Maternal: Medical Conditions', 'Antiphospholipid syndrome with associated maternal and fetal complications'),
    e('PL-M-MED-WARF', P, 'Maternal: Medical Conditions', 'Warfarin use at the time of labor in patients with mechanical heart valves'),
    e('PL-M-MED-HSV', P, 'Maternal: Medical Conditions', 'Active genital herpes'),
    e('PL-M-MED-HIV', P, 'Maternal: Medical Conditions', 'HIV with high (viral load > 1,000 copies/mL) or unknown viral load'),
    e('PL-M-MED-COND', P, 'Maternal: Medical Conditions', 'Extensive genital condyloma causing obstruction or bleeding risk'),
    e('PL-M-OBS-TUM', P, 'Maternal: Obstructive Conditions', 'Tumor previa (e.g. myoma, ovarian mass, cervical cancer that blocks the birth canal)'),
    e('PL-M-OBS-PELV', P, 'Maternal: Obstructive Conditions', 'Clinically significant pelvic deformity that hinders safe vaginal delivery'),
    e('PL-M-ART', P, 'Maternal: Infertility and Other Factors', 'Pregnancy achieved through assisted reproductive techniques (ART) with complications'),
    /* Table 3: Planned, fetal */
    e('PL-F-BRE', P, 'Fetal: Malpresentation or Malposition (not in labor)', 'Persistent breech presentation at term', 'At term, 38 to 39 weeks age of gestation.'),
    e('PL-F-TRA', P, 'Fetal: Malpresentation or Malposition (not in labor)', 'Persistent transverse lie at term', 'At term, 38 to 39 weeks age of gestation.'),
    e('PL-F-MAC', P, 'Fetal: Size and Structural Conditions', 'Fetal macrosomia', MACROSOMIA_NOTE),
    e('PL-F-IUGR', P, 'Fetal: Size and Structural Conditions', 'Intrauterine fetal growth restriction (IUGR) with abnormal fetal surveillance or when labor may worsen fetal survival'),
    e('PL-F-ANOM', P, 'Fetal: Size and Structural Conditions', 'Congenital fetal anomalies or fetal tumors that can obstruct vaginal delivery'),
    e('PL-F-TWIN-NC', P, 'Fetal: Multiple Gestation', 'Twin pregnancy with non-cephalic first twin'),
    e('PL-F-TWIN-MA', P, 'Fetal: Multiple Gestation', 'Twin pregnancy: monoamniotic twins'),
    e('PL-F-TWIN-CJ', P, 'Fetal: Multiple Gestation', 'Twin pregnancy: conjoined twins'),
    e('PL-F-HOM', P, 'Fetal: Multiple Gestation', 'Higher order multiple pregnancy (triplets and more)'),
    /* Table 4: Planned, placental */
    e('PL-P-PREV', P, 'Placental', 'Placenta previa'),
    e('PL-P-PAS', P, 'Placental', 'Placenta accreta spectrum'),
    e('PL-P-VASA', P, 'Placental', 'Vasa previa'),
    e('PL-P-ABN', P, 'Placental', 'Placental abnormalities diagnosed antenatally where vaginal delivery is unsafe'),
    /* Table 5: Emergency, maternal */
    e('EM-M-DYS-ARR', E, 'Maternal: Labor Dystocia', 'Arrest in cervical dilatation'),
    e('EM-M-DYS-2ND', E, 'Maternal: Labor Dystocia', 'Prolonged second stage of labor'),
    e('EM-M-DYS-DESC', E, 'Maternal: Labor Dystocia', 'Arrest or failure of descent'),
    e('EM-M-DYS-IND', E, 'Maternal: Labor Dystocia', 'Failed induction of labor', 'Exceeding twelve (12) hours after appropriate management measures.'),
    e('EM-M-UTS-CS', E, 'Maternal: Previous Uterine Surgery in labor', 'Previous CS, not a candidate for TOLAC / VBAC'),
    e('EM-M-UTS-RUP', E, 'Maternal: Previous Uterine Surgery in labor', 'Prior uterine rupture, not a candidate for TOLAC / VBAC'),
    e('EM-M-UTS-MYO', E, 'Maternal: Previous Uterine Surgery in labor', 'Previous myomectomy, not a candidate for TOLAC / VBAC'),
    e('EM-M-HT-PE', E, 'Maternal: Hypertensive and Hematologic Disorders', 'Uncontrolled preeclampsia with severe features', 'With maternal instability.'),
    e('EM-M-HT-EC', E, 'Maternal: Hypertensive and Hematologic Disorders', 'Eclampsia (or impending eclampsia)', 'With maternal instability.'),
    e('EM-M-HT-HELLP', E, 'Maternal: Hypertensive and Hematologic Disorders', 'HELLP syndrome (hemolysis, elevated liver enzymes, low platelet count)', 'With maternal instability.'),
    e('EM-M-HT-APS', E, 'Maternal: Hypertensive and Hematologic Disorders', 'Antiphospholipid syndrome', 'With maternal instability.'),
    e('EM-M-CV-AORT', E, 'Maternal: Cardiovascular and Vascular', 'Aortopathy with aortic root dilatation (e.g. Marfan syndrome)', 'With maternal instability.'),
    e('EM-M-CV-DISS', E, 'Maternal: Cardiovascular and Vascular', 'Aortic dissection', 'With maternal instability.'),
    e('EM-M-CV-ANEU', E, 'Maternal: Cardiovascular and Vascular', 'Cerebral aneurysm', 'With maternal instability.'),
    e('EM-M-CV-CVA', E, 'Maternal: Cardiovascular and Vascular', 'History of cerebrovascular accident / stroke', 'With maternal instability.'),
    e('EM-M-CV-EISE', E, 'Maternal: Cardiovascular and Vascular', 'Eisenmenger syndrome', 'With maternal instability.'),
    e('EM-M-CV-PAH', E, 'Maternal: Cardiovascular and Vascular', 'Pulmonary arterial hypertension', 'With maternal instability.'),
    e('EM-M-CV-RVF', E, 'Maternal: Cardiovascular and Vascular', 'Severe right ventricular failure', 'With maternal instability.'),
    e('EM-M-CV-AS', E, 'Maternal: Cardiovascular and Vascular', 'Severe symptomatic aortic stenosis', 'With maternal instability.'),
    e('EM-M-CV-MS', E, 'Maternal: Cardiovascular and Vascular', 'Severe mitral stenosis', 'With maternal instability.'),
    e('EM-M-CV-PPCM', E, 'Maternal: Cardiovascular and Vascular', 'Advanced peripartum cardiomyopathy', 'With maternal instability.'),
    e('EM-M-CV-VEDS', E, 'Maternal: Cardiovascular and Vascular', 'Vascular type Ehlers-Danlos syndrome', 'With maternal instability.'),
    e('EM-M-CV-CRIT', E, 'Maternal: Cardiovascular and Vascular', 'Other critical cardiac or pulmonary condition posing an immediate threat during labor', 'With maternal instability.'),
    e('EM-M-CV-WARF', E, 'Maternal: Cardiovascular and Vascular', 'Warfarin use at the time of labor in patients with mechanical heart valves', 'With maternal instability.'),
    e('EM-M-INF-HSV', E, 'Maternal: Infections', 'Active primary HSV infection in the third trimester', 'With ruptured membranes at the onset of labor.'),
    e('EM-M-INF-HIV', E, 'Maternal: Infections', 'HIV infection with high viral load (> 1,000 copies/mL) or unknown viral load'),
    e('EM-M-INF-OTH', E, 'Maternal: Infections', 'Other severe intrauterine or pelvic infection remote from vaginal delivery'),
    e('EM-M-OTH-RUP', E, 'Maternal: Other Emergency Conditions', 'Suspected or confirmed uterine rupture'),
    e('EM-M-OTH-BLD', E, 'Maternal: Other Emergency Conditions', 'Severe obstetric bleeding'),
    e('EM-M-OTH-SHK', E, 'Maternal: Other Emergency Conditions', 'Maternal shock or collapse'),
    e('EM-M-OTH-PMCS', E, 'Maternal: Other Emergency Conditions', 'Perimortem CS'),
    /* Table 6: Emergency, fetal */
    e('EM-F-NRFHR', E, 'Fetal: Acute Fetal Compromise', 'Non-reassuring fetal heart rate pattern', 'When delivery is not imminent.'),
    e('EM-F-BRE', E, 'Fetal: Malpresentation or Malposition in Labor', 'Breech presentation'),
    e('EM-F-TRA', E, 'Fetal: Malpresentation or Malposition in Labor', 'Transverse lie / shoulder presentation'),
    e('EM-F-FACE', E, 'Fetal: Malpresentation or Malposition in Labor', 'Face (mentum or chin posterior) presentation'),
    e('EM-F-BROW', E, 'Fetal: Malpresentation or Malposition in Labor', 'Brow presentation'),
    e('EM-F-MAC', E, 'Fetal: Size and Structural Conditions', 'Fetal macrosomia', MACROSOMIA_NOTE),
    e('EM-F-ANOM', E, 'Fetal: Size and Structural Conditions', 'Obstructive congenital anomalies'),
    e('EM-F-ZAV', E, 'Fetal: Size and Structural Conditions', 'Post-Zavanelli maneuver'),
    e('EM-F-TWIN-NC', E, 'Fetal: Multiple Gestation (in labor)', 'Twin pregnancy with non-cephalic first twin'),
    e('EM-F-TWIN-MA', E, 'Fetal: Multiple Gestation (in labor)', 'Twin pregnancy: monoamniotic twins'),
    e('EM-F-TWIN-CJ', E, 'Fetal: Multiple Gestation (in labor)', 'Twin pregnancy: conjoined twins'),
    e('EM-F-HOM', E, 'Fetal: Multiple Gestation (in labor)', 'Higher order multiple pregnancy (triplets and more)'),
    e('EM-F-VAC', E, 'Fetal: Failed Assisted Vaginal Delivery', 'Failed vacuum extraction'),
    e('EM-F-FORC', E, 'Fetal: Failed Assisted Vaginal Delivery', 'Failed forceps delivery'),
    /* Table 7: Emergency, placental and umbilical */
    e('EM-P-PREV', E, 'Placental and Umbilical', 'Placenta previa', 'With acute maternal or fetal compromise, or with significant bleeding.'),
    e('EM-P-ABR', E, 'Placental and Umbilical', 'Abruptio placenta', 'With acute maternal or fetal compromise, or with significant bleeding.'),
    e('EM-P-PAS', E, 'Placental and Umbilical', 'Placenta accreta spectrum', 'With acute maternal or fetal compromise, or with significant bleeding.'),
    e('EM-P-VASA', E, 'Placental and Umbilical', 'Vasa previa', 'With acute maternal or fetal compromise, or with significant bleeding.'),
    e('EM-U-PROL', E, 'Placental and Umbilical', 'Umbilical cord prolapse')
  ];

  var OTHER = { id: 'OTHER', cls: '', group: 'Other', label: 'Other / Specify', note: '' };

  var byId = {};
  LIST.forEach(function (x) { byId[x.id] = x; });
  byId.OTHER = OTHER;

  var api = {
    version: VERSION,
    list: LIST,
    other: OTHER,
    byId: function (id) { return byId[id] || null; }
  };

  root.HIS = root.HIS || {};
  root.HIS.csIndications = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
