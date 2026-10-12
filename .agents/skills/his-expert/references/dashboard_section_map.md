# `dashboard.html` Line-Range Section Map

*Accurate as of October 2026 (HIS Main Build, ~15,420 lines)*

Use this table to jump directly to the relevant line numbers rather than reading large slices of `dashboard.html`.

---

## 1. Top-Level Page Structure

| Section | Line Range | Description & Key Elements |
| :--- | :--- | :--- |
| **Document Head & Inline CSS** | `1` – `495` | Meta tags, vendor CSS links, floating requisition drawer styles (`#floating-req-toolkit`), encounter badge styles. |
| **Top Navigation Bar** | `496` – `595` | Hospital header, Department selector, Physician profile badge, and search bar. |
| **Patient Demographics Banner** | `596` – `730` | `#patient-info-banner`: Name, HRN, Age/Sex, Civil Status, PhilHealth Identification Number (PIN), Admitting Service, Attending Physician. |
| **Encounter History Tabs** | `731` – `850` | Encounter selector pill tabs, registry badges (`[IP]`, `[OP]`, `[ER]`), active vs historical inspection indicators. |
| **Vital Signs & Bedside Flowsheet** | `851` – `2030` | `#dashlet-vitals`: BP, HR, RR, Temp, SpO2, GCS, Pain score, and trend triggers. |
| **Progress Notes (SOA Format)** | `2070` – `2778` | **ROW 4.5**: Subjective, Objective, Assessment text areas, bedside notes, and historical round logs. |
| **Admitting & Final Diagnoses** | `2779` – `2810` | **ROW 4 & ROW 5**: `#admitting_dx`, `#final_dx`, ICD-10 diagnostic codes, and encounter lock indicators. |
| **Doctor's Orders (CPOE Summary)** | `2811` – `2836` | **ROW 6**: Active orders table (`#orders-summary-table`), order type tabs, and order action buttons. |
| **Disposition Dashlet** | `2837` – `2868` | **ROW 8**: Discharge status, Home against medical advice, transferred, expired options. |
| **Follow-up Dashlet** | `2869` – `2901` | **ROW 9**: Follow-up appointment scheduling, return dates, and clinic notes. |
| **Specialized Clinical Forms** | `2902` – `2935` | **ROW 10**: Specialized encoders launcher (`#dashlet-specialized-forms`), OB-Gyne, Neonate quick links. |
| **Clinical Modals Markup** | `2936` – `4725` | All persistent dialog backdrops (`.seg-modal-backdrop`). See Section 2 below. |
| **Floating Requisitions Drawer** | `4726` – `4785` | `#floating-req-toolkit`: Right-docked quick drawer containing OB-Gyne, Neonate, Rx Writer, Results, Referral buttons. |
| **Core JavaScript Engine** | `4786` – `15425` | All application state, patient seed integration, CPOE builders, and verification harnesses. See Section 3 below. |

---

## 2. Modals Markup Index (`lines 2936 – 4725`)

Every modal is declared in markup before the main `<script>` tags:

| Modal ID | Line Range | Accessible From / Purpose |
| :--- | :--- | :--- |
| `#clinical-module-action-modal` | `2938` – `2983` | Specialized modules selector dialog (OB-Gyne, Neonatal chart launchers). |
| `#clinical-request-modal` | `2984` – `3073` | CPOE diagnostic order selector (Laboratory, Radiology/DDIRS, ECG, Pulmonary). |
| `#clinical-request-print-modal` | `3074` – `3094` | Diagnostic request order slip print preview dialog. |
| `#modal-order-cosignature` | `3095` – `3139` | Physician order pairing & co-signature requisition modal. |
| `#rx-writer-modal` | `3169` – `3183` | Pop-out Prescription & Outpatient Rx Writer dialog. |
| `#rx-print-modal` | `3184` – `3202` | Prescription pad official DOH/PhilHealth print preview dialog. |
| `#flowsheet-entry-modal` | `3085` – `3280` | Bedside clinical chart flowsheet entry dialog (including blood unit expiration). |
| `#encounter-record-modal` | `3429` – `3480` | Complete encounter summary record viewer. |
| `#viewable-results-modal` | `3481` – `3567` | Unified diagnostic examination results viewer (transferred from main body). |
| `#modal-referral-comanage` | `3568` – `3656` | Inter-departmental referral & physician co-management consultation modal. |
| `#encounter-results-modal` | `3657` – `3686` | Encounter-specific diagnostic reports dialog. |
| `#encounter-entry-modal` | `3687` – `3780` | Log new clinical round / bedside progress note (SOA format). |
| `#encounter-simulation-modal` | `3781` – `3828` | Clinical round simulator dialog. |
| `#end-care-modal` | `3829` – `3890` | Conclude patient care and finalize encounter dialog. |

---

## 3. Core JavaScript Engine Index (`lines 4786 – 15425`)

| Functional Domain | Line Range | Key Functions & Identifiers |
| :--- | :--- | :--- |
| **Patient Seeds & Formatting** | `4786` – `5100` | `patientName(d)`, `calculateAge(b)`, `formatDate(v)`, Ballard score maps. |
| **Storage & Memoized Caching** | `5100` – `6000` | `getPatients()`, `saveCurrentPatientRecord()`, `STORAGE_KEY`, cache invalidation. |
| **Patient Selection & Encounter Switch** | `6000` – `7100` | `selectPatient(id)`, demographics population, encounter tab builders. |
| **Read-Only Lockdown Engine** | `7101` – `7220` | `setDashboardReadOnly(isReadOnly)`: Locks CPOE, orders, disposition, and referrals on signed encounters. |
| **Historical Encounter Inspector** | `7221` – `7550` | `loadHistoricalEncounter(idx)`, `exitHistoricalEncounter()`. |
| **Flowsheet & Vitals Calculations** | `7550` – `8450` | Bedside logs, fluid balance tally, MAP calculations, vitals graph hooks. |
| **Modal Backdrops & Global Escape** | `8451` – `8650` | Backdrop click listeners, Escape key listeners (`closeAllModals`). |
| **Bedside SOA Progress Notes** | `8651` – `9200` | Subjective, Objective, Assessment auto-save and history renderers. |
| **CPOE Orders & Medication Sub-system**| `9201` – `11500` | Diet, IVF, medications table, drug search, dose calculator, Rx Writer controller. |
| **Floating Requisition Pad Controller**| `11501` – `11750`| `toggleFloatingRequisitionToolkit()`, `openViewableResultsModal()`, `openReferralModal()`, `initFloatingRequisitionToolkit()`. |
| **CPOE Diagnostic Slips & Printing** | `11751` – `12600`| `openRequestModal(tab)`, service catalog search, requisition slip generator. |
| **Physician's Orders Summary Table** | `12601` – `12800`| `renderOrdersTable()`: groups orders by timestamp, physician, and category. |
| **Referrals, Follow-up & Disposition** | `12801` – `13100`| `referrals` array, `renderReferrals()`, `save-referral-btn`, follow-up toggles. |
| **Patient Data Persistence & Audit** | `13101` – `14200`| `saveCurrentPatientRecord()`, validation, discharge summary builder. |
| **Bootstrap & Initialization Triggers**| `14201` – `15425`| `DOMContentLoaded`, smoke readiness flags, event delegations. |
