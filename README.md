# Hospital Information System (HIS) — Physician's Module Dashboard
### Corazon Locsin Montelibano Memorial Regional Hospital (CLMMRH) | SegHIS

A web-based clinical dashboard and hospital information system prototype designed for attending physicians, residents, and clinical care teams.

## 🚀 Live Demo
- **Physician's Module Dashboard:** [https://crmry.github.io/HIS/dashboard.html](https://crmry.github.io/HIS/dashboard.html)
- **Patient List:** [https://crmry.github.io/HIS/patients.html](https://crmry.github.io/HIS/patients.html)
- **Patient Registration:** [https://crmry.github.io/HIS/forms_localstorage.html](https://crmry.github.io/HIS/forms_localstorage.html)
- **Order & Compliance Sheet:** [https://crmry.github.io/HIS/doctors_order_patient.html](https://crmry.github.io/HIS/doctors_order_patient.html)
- **Progress Notes / Printable Sheet:** [https://crmry.github.io/HIS/index.html](https://crmry.github.io/HIS/index.html)

---

## ✨ Key Features

### 1. Physician's Dashboard (`dashboard.html`)
- **Patient Overview Bar**: Real-time patient selection, HRN, Case No., Ward/Room, Bed, Admission Date, and Attending Physician.
- **Clinical Impression & Admitting Diagnosis**: Editable clinical notes with auto-saving to local browser storage.
- **Structured Vital Signs & History**: Blood pressure, Heart rate, Respiratory rate, Temperature, SpO2, and Review of Systems with dynamic site specification.

### 2. Physician's Orders & Medication Management
- **Plans, Diet, & IV Orders**: Formatted chronological order entries with time signatures and nurse care indicators (C, A, E, R).
- **Labs & Diagnostics**: Order placement for Laboratory, Radiology, Respiratory, Heart Station, and EEG.
- **Drugs and Medicines**:
  - *Scheduled & Intermittent Medications* (Generic, Dose, Route, Frequency, Duration, Precautions).
  - *Continuous Infusions* (Carrier solution, Additive drug, Final concentration, Dose expression in mcg/kg/min, Infusion rate).
  - *Oxygen Therapy & Medical Gas Orders* (Delivery method, Parameters, Goal/Target SpO2, Duration, Monitoring safety).
- **Chronological Grouped Orders Summary Table**: Auto-groups orders sharing the same date/time with individual row entries and nurse execution tracking.

### 3. Segworks Rx Writer (Prescription Writer)
- Dedicated prescription writer module placed directly under Drugs and Medicines.
- **Dangerous Drug License (DD/DDP / S2)** number management.
- **Patient Particulars Card**: PID, Encounter Number, Patient Name, Address, Age, Gender, Prescription Date, and Clinical Impression (with Clear tool).
- **Prescribed Medicines Table**: Drug name (with Philippine drug catalog datalist), Quantity, Dosage, Frequency, Timing, Period, Duration, and Row Deletion.
- **Quick Clinical Templates**: Pre-configured drug regimens for CAP, Hypertension, URTI/Cold, Gastritis/GERD, Analgesic/Pain, and Type 2 Diabetes.
- **Special Instructions**: Dietary advice, precautions, and administration instructions.
- **Pop-out Window & Docking**: Switch seamlessly between inline editing and a full-featured floating modal window.
- **Official Prescription Pad Preview & Print**: Printable doctor's prescription pad with CLMMRH header, ℞ symbol, Disp / Sig notation, and physician license signature block.

### 4. Patient Registration & Records (`forms_localstorage.html`, `patients.html`)
- Complete patient registration form storing data in `localStorage`.
- Comprehensive patient search, filter, and quick launch to the Physician Dashboard.
- Pre-seeded with realistic sample patient data (`Maria Santos Dela Cruz`) for immediate demonstration.

---

## 🛠️ Technology Stack
- **Structure:** Semantic HTML5
- **Styling:** Two-shade healthcare green (`#1f7d45` / `#279654`) and dark slate (`#394247`) theme with Bootstrap 2.3.2 and responsive CSS
- **Interactivity:** Vanilla JavaScript with jQuery 1.12.4
- **Storage:** Client-side persistent `localStorage` (no external database or server required)
- **Deployment:** GitHub Pages

---

## 💻 Local Usage
Simply open `dashboard.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
