# HIS Dashboard Section Map

*Accurate as of October 2026 (HIS Main Build: `dashboard.html` ~16,729 lines, `dashboard_er_inpatient.html` ~16,648 lines)*

> [!TIP]
> **Zero-Token-Waste Dynamic Locator**:
> Instead of manually browsing lines, run the local locator engine to obtain exact `StartLine` and `EndLine` targets in < 0.1s:
> ```bash
> python .agents/skills/his-expert/scripts/locate.py <identifier>
> ```
> This scans both `dashboard.html` and `dashboard_er_inpatient.html` simultaneously and outputs ready-to-use line ranges for `replace_file_content`.

---

## 1. Top-Level Page Structure

| Section | `dashboard.html` | `dashboard_er_inpatient.html` | Key Elements & Selectors |
| :--- | :--- | :--- | :--- |
| **Document Head & Inline CSS** | `1` – `1664` | `1` – `1664` | Typography, modal styles (`.seg-modal-backdrop`), floating drawer styles (`#floating-req-toolkit`), encounter badges. |
| **Top Navigation & Utility Bar** | `1665` – `1686` | `1665` – `1686` | Legacy nav (hidden for clinical module), page header, `#seg-clock`. |
| **Patient Demographics Banner** | `1687` – `1746` | `1687` – `1746` | `#dashlet-patient-info`: `#banner-hrn`, `#banner-patient-name`, `#banner-encounter-no`, `#banner-bdate`, `#banner-phic`, `#banner-ward`. |
| **Encounter History Dashlet** | `1747` – `1816` | `1747` – `1816` | `#dashlet-encounter`: `#encounter-rows`, date range filter (`#encounter-date-from`, `#encounter-date-to`), registry filter (`#encounter-dept-filter-group`). |
| **Vital Signs & Bedside Flowsheet** | `1817` – `2715` | `1817` – `2714` | `#dashlet-vitals`: Bedside monitoring tabs (Vitals, IVF & Drips, Blood Transfusion, Intake/Output, Blood Glucose / CBG). |
| **Admitting & Final Diagnoses** | `2716` – `2817` | `2715` – `2816` | `#admitting-dx-col` (`#admitting_dx`), `#final-dx-col` (`#final_dx`), ICD-10 diagnostic search. |
| **Disposition Dashlet** | `2818` – `2850` | `2817` – `2849` | `#dashlet-disposition`: Radio options (`disposition`), `#save-disposition-btn`. |
| **Follow-up Dashlet** | `2851` – `2878` | `2850` – `2877` | `#dashlet-followup`: Follow-up toggles (`follow_up_needed`), date picker, clinic instructions. |
| **Special Forms & Operative Records** | `2879` – `2922` | `2878` – `2921` | `#dashlet-special-forms`: Operative Technique & Surgical Memorandum. Note: `#dashlet-specialized-forms` (Specialized PE Forms) is located directly inside the Physical Examination section (`#row-physical-exam`). |
| **Clinical Modals Markup** | `2923` – `4897` | `2922` – `4854` | All persistent modal backdrops (`.seg-modal-backdrop`). See Section 2 below. |
| **Floating Requisition Drawer** | `4898` – `4947` | `4855` – `4903` | `#floating-req-toolkit`: Pinned drawer handle, OB-Gyne, Neonate, Rx Writer, Results, Referral buttons. |
| **Core JavaScript Engine** | `4948` – `16729` | `4904` – `16648` | All application state, patient seeds, CPOE builders, order tables, event wiring. See Section 3 below. |

---

## 2. Modals Markup Index (`lines 2923 – 4897`)

Every modal is declared in persistent markup before the main `<script>` blocks:

| Modal ID | `dashboard.html` | Purpose & Controller Function |
| :--- | :--- | :--- |
| `#clinical-module-action-modal` | `2923` – `2968` | Specialized modules selector dialog (OB-Gyne, Neonatal chart launchers). |
| `#clinical-request-modal` | `2969` – `3058` | CPOE diagnostic order selector (Laboratory, Radiology/DDIRS, ECG, Pulmonary). |
| `#clinical-request-print-modal` | `3059` – `3079` | Diagnostic request order slip print preview dialog. |
| `#modal-order-cosignature` | `3080` – `3124` | Physician order pairing & co-signature requisition modal. |
| `#rx-writer-modal` | `3125` – `3139` | Pop-out Prescription & Outpatient Rx Writer dialog. |
| `#rx-print-modal` | `3140` – `3159` | Prescription pad official DOH/PhilHealth print preview dialog. |
| `#flowsheet-entry-modal` | `3160` – `3428` | Bedside clinical chart flowsheet entry dialog (including blood unit logs). |
| `#encounter-record-modal` | `3429` – `3480` | Complete encounter summary record viewer. |
| `#viewable-results-modal` | `3481` – `3567` | Unified diagnostic examination results viewer. |
| `#modal-referral-comanage` | `3568` – `3656` | Inter-departmental referral & physician co-management consultation modal. |
| `#encounter-results-modal` | `3657` – `3686` | Encounter-specific diagnostic reports dialog. |
| `#encounter-entry-modal` | `3687` – `3780` | Log new clinical round / bedside progress note (SOA format). |
| `#encounter-simulation-modal` | `3781` – `3828` | Clinical round simulator dialog. |
| `#end-care-modal` | `3829` – `3890` | Conclude patient care and finalize encounter dialog. |

---

## 3. Core JavaScript Engine Index (`lines 4948 – 16729`)

| Functional Domain | `dashboard.html` | `dashboard_er_inpatient.html` | Key Functions & Identifiers |
| :--- | :--- | :--- | :--- |
| **Patient Seeds & In-Memory Store** | `4948` – `6000` | `4904` – `5950` | `patientName(d)`, `calculateAge(b)`, `getPatients()`, `STORAGE_KEY`. |
| **Patient Switch & Demographics** | `6001` – `7200` | `5951` – `7100` | `selectPatient(id)`, `#banner-patient-name`, encounter history table. |
| **Bedside Flowsheets & Charts** | `7201` – `7664` | `7101` – `7568` | `renderEncounterVitalSigns()`, `renderEncounterCBGs()`, bedside logs. |
| **Encounter Read-Only Lock Engine** | `7665` – `7782` | `7569` – `7686` | `setDashboardReadOnly(isReadOnly)`: Locks CPOE, orders, disposition on signed encounters. |
| **Historical Encounter Inspector** | `7783` – `8861` | `7687` – `8760` | `inspectEncounterInDashboard(idx)`, `restoreCurrentEncounterView()`. |
| **Encounter Print & Diagnostic Viewer** | `8862` – `9231` | `8761` – `9130` | `printEncounterDocument()`, results viewer filter listeners. |
| **Encounter Simulator & Filters** | `9232` – `10139` | `9131` – `10040` | `openEncounterSimulationModal()`, date range filter events. |
| **CPOE Orders & Medication Subsystem** | `10140` – `11080` | `10041` – `10980` | `INFUSION_SOLUTIONS`, `SAMPLE_CONTINUOUS_DOSES`, datalists, order generators. |
| ↳ *Scheduled Medications* | `10540` – `10645` | `10440` – `10550` | `addScheduledMedRow(body, data)` |
| ↳ *Continuous Infusion Table Engine* | `10646` – `10674` | `10551` – `10579` | `addContinuousMedRow(body, data)` |
| ↳ *Continuous Infusion Table Headers* | `10775` – `10786` | `10680` – `10691` | `Final Concentration`, `Prescribed Dose & Unit`, `*Infusion Rate` |
| ↳ *Oxygen Therapy Orders* | `10675` – `10717` | `10580` – `10622` | `addOxygenMedRow(body, data)` |
| **Prescription Writer (`Rx Writer`)** | `11081` – `11699` | `10981` – `11600` | `syncRxWriterPatient()`, `syncRxWriterEncounter()`, dosage calculations. |
| **CPOE Order Builder & Collection** | `11700` – `12191` | `11601` – `12096` | `buildOrders(savedOrders)`, `collectOrders()`. |
| **Floating Requisition Controller** | `12192` – `12476` | `12097` – `12381` | `toggleFloatingRequisitionToolkit()`, `initFloatingRequisitionToolkit()`. |
| **CPOE Diagnostic Slips & Co-Signature**| `12477` – `13167` | `12382` – `13072` | `openRequestModal(tab)`, service catalog lookup, co-signature dialog. |
| **Doctor's Orders Summary Table** | `13168` – `13377` | `13073` – `13282` | `renderOrdersTable()`, live summary update scheduler. |
| **Referrals & Disposition Handlers** | `13378` – `13560` | `13283` – `13465` | `referrals` array, `renderReferrals()`, `#save-referral-btn`. |
| **Patient Persistence & Audit Trails** | `13561` – `14474` | `13466` – `14380` | `saveCurrentPatientRecord(options)`, validation, audit fields. |
| **Bedside SOA Progress Notes Sync** | `14475` – `15522` | `14381` – `15441` | Auto-save SOA textareas, patient switcher event delegation. |
| **DOMContentLoaded & Event Wiring** | `15523` – `15721` | `15442` – `15640` | Smoke readiness flags, keyboard shortcuts (Escape, Enter). |
| **OB-Gyne & Neonatal Modules** | `15722` – `16729` | `15641` – `16648` | `initObGyneModule()`, `initNeonateModule()`, state synchronization. |
