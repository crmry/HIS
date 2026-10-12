# Hospital Information System (HIS) — Sanitization & Privacy Audit Report

**Date:** 2026-10-12  
**Repository Directory:** `C:\Users\Tech-Support\.gemini\antigravity-ide\scratch\HIS`  
**Git Branch:** `main`  
**Initial Commit:** `3e54a4e16e9a6a164fae253dc481b685ece80667`

---

## 1. Overview & Objective
This repository was pulled from `https://github.com/crmry/HIS` and thoroughly sanitized to remove all explicit mentions of hospital names (such as CLMMRH / Corazon Locsin Montelibano Memorial Regional Hospital), proprietary vendor branding (SegHIS / Segworks), actual physical locations/contact numbers, and personal author metadata that could raise privacy or data protection concerns.

---

## 2. Changes Made

### A. Hospital Names & Brand Identity
- **Removed:** `Corazon Locsin Montelibano Memorial Regional Hospital`, `CLMMRH`, `Corazon L. Montelibano Memorial Regional Hospital`.
- **Replaced With:** `REGIONAL MEDICAL CENTER & HOSPITAL`, `Tertiary Hospital (Government / Public)`, and `Hospital Information System (HIS)`.
- **Files Modified:**
  - `dashboard.html`
  - `dashboard_er_inpatient.html`
  - `doctors_order_er_admission.html`
  - `doctors_order_patient.html`
  - `index.html`
  - `opd_record_patient.html`
  - `patients.html`
  - `Neonate_Clinical_Module.html`
  - `OB_Gyne_Clinical_Module.html`
  - `js/data/patient_seeds.js`
  - `README.md`
  - `AGENTS.md`
  - `.agents/skills/his-expert/SKILL.md`

### B. Physical Addresses & Hospital Contact Details
- **Removed:**
  - `Lacson - Burgos Streets, Bacolod City`
  - `Lacson-Burgos Sts., Bacolod City 6100`
  - `Lacson Street, Bacolod City, Negros Occidental • Tel: (034) 435-1591`
  - `Lacson Street, Bacolod City 6100, Negros Occidental, Philippines • Tel: (034) 700-0000`
  - Real barangay references tied to Bacolod City (`Brgy. Bata`, `Brgy. Mansilingan`).
- **Replaced With:**
  - `Medical Center Drive, Health District`
  - `Tel: (02) 8800-0000`
  - Generic district addresses (`Brgy. Central, Metro City`, `Brgy. San Jose, Medical District`).

### C. Form Identifiers
- `CLMMRH-MRS.F.032` → `MRS-F-032`
- `CLMMRH Form OPD.F.014` → `Form OPD-F-014`

### D. Vendor Branding (`SegHIS`)
- In `Neonate Dashlet.xlsx`:
  - `Proposed Dashlet for SEGHIS+ Neonate` → `Proposed Dashlet for HIS+ Neonate`
  - Sheet name `SEGHISNEO` → `HISNEO`

### E. Personal Names & Document Metadata
- In `Propsosed Doctors Module Interface V2.docx`:
  - Removed author `sherian grace serrano` from `docProps/core.xml`.
  - Removed hospital department `Integrated Hospital Operations and Management Section CLMMRH` from `docProps/core.xml`.
- In `Propsosed Doctors Module Interface V2.pdf`:
  - Replaced author string `sherian grace serrano` in PDF metadata dictionary (`/Author`) and XMP metadata stream (`<dc:creator>`).
- Removed `img/clmmrh_orders_header.png` (unreferenced image containing the hospital seal, logo, and address).

### F. LocalStorage Keys & Data Compatibility
- Standardized storage keys from `clmmrh_*` to `his_*`:
  - `his_patients_v1`
  - `his_chart_monitoring_data_v1`
  - `his_physician_dashlet_state_v1`
  - `his_doctors_orders_draft`
  - `his_compliance_sheet_snapshot`
  - `his_obgyne_draft_<id>`
  - `his_neonate_draft_<id>`
  - `his_patient_draft_v1`

---

## 3. Verification & Compliance
1. **Repository-Wide Keyword Audit:**
   - Case-insensitive scan across all source files, documents, sheets, PDFs, and image metadata for `clmmrh`, `corazon`, `montelibano`, `seghis`, `segworks`, `sherian`, `serrano`, `bacolod`, and `negros` yielded **0 hits**.
2. **Automated Headless Quality Gate (`python scripts/verify_site.py`):**
   - 45 test runs across all HTML views and patient routes (`patient_op_carmela`, `patient_er_juan`, `patient_op_juan`, `patient_ob_maria`, `patient_new_blank_*`).
   - **Result: 100% PASS** (0 runtime exceptions, 0 console errors, 0 broken 404 network assets).
