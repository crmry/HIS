# HIS Component & Data Dictionary

*A comprehensive reference of element IDs, state models, and selectors in the HIS dashboard.*

---

## 1. Floating Requisition Toolkit (`#floating-req-toolkit`)

The right-docked expandable drawer (`▲ REQUISITIONS` tab) contains quick clinical actions:

| Action Item | Button ID | Controller Function | Target Modal / View | Station Color Accent |
| :--- | :--- | :--- | :--- | :--- |
| **OB-Gyne Clinical Record** | `#floating-btn-obgyne` | `openObGyneWorkspace('encode')` | `OB_Gyne_Clinical_Module.html` | `#10b981` (Emerald) |
| **Neonate Clinical Record** | `#floating-btn-neonate` | `openNeonateWorkspace('encode')` | `Neonate_Clinical_Module.html` | `#0284c7` (Sky Blue) |
| **Rx Writer (Prescriptions)**| `#floating-btn-rx` | `openRxWriterFromToolkit(event)` | `#rx-writer-modal` | `#059669` (Green) |
| **Examination Result** | `#floating-btn-results` | `openViewableResultsModal(event)` | `#viewable-results-modal` | `#0284c7` (Sky Blue) |
| **Referral / Co-Manage** | `#floating-btn-referral` | `openReferralModal(event)` | `#modal-referral-comanage`| `#10b981` (Emerald) |

Toolkit DOM Controls:
- Handle: `#floating-req-handle`
- Close button: `#floating-req-close-btn`
- Pin toggle: `#floating-req-pin-btn`
- Expand arrow: `#floating-req-toggle-arrow` (`◀` / `▶`)

---

## 2. Dashlets & Main Page Containers

| Dashlet / Domain | Wrapper ID / Class | Key Sub-Elements | Primary Action Buttons |
| :--- | :--- | :--- | :--- |
| **Demographics Banner** | `#patient-info-banner` | `#patient-name`, `#patient-hrn`, `#patient-age`, `#patient-sex`, `#patient-pin` | Patient selector dropdown |
| **Vital Signs & Flowsheet**| `#dashlet-vitals` | `#vitals-table`, `#vitals-bp`, `#vitals-hr`, `#vitals-rr`, `#vitals-temp` | View-only bedside monitoring (nursing logs) |
| **Progress Notes (SOA)** | `.care-notes` | `#note-subjective`, `#note-objective`, `#note-assessment` | `#btn-save-progress-note` |
| **Initial / Admitting Dx** | `#admitting-dx-col` | `#admitting_dx` | ICD-10 search input |
| **Final Diagnosis** | `#final-dx-col` / `#row-final-dx` | `#final_dx`, `#final-dx-status-badge` | Read-only during inspection |
| **Doctor's Orders** | `#orders-summary-table` | Table body `#orders-summary-rows` | `#save-orders-btn`, `#open-request-modal` |
| **Disposition** | `#dashlet-disposition` | `input[name="disposition"]` | `#save-disposition-btn` |
| **Follow-up** | `#dashlet-followup` | `input[name="follow_up_needed"]`, `#follow-up-fields` | `#save-followup-btn` |
| **Specialized Forms** | `#dashlet-specialized-forms` | `#dashlet-other-forms` | `#btn-open-obgyne-module`, `#btn-open-neonate-module` |

---

## 3. JavaScript State Variables

All shared state variables live in the page's closure/global scope:

| Variable Name | Type | Description & Lifecycle |
| :--- | :--- | :--- |
| `activePatientId` | `string` | ID of the currently selected patient record (e.g. `'patient_op_juan'`). |
| `activeInspectedEncounterIndex` | `number \| null` | `null` or `0` when viewing active encounter. `> 0` when inspecting historical encounter. |
| `savedOrders` | `object` | Dictionary of CPOE orders: `{ plans: [], diet: [], iv: [], medications: [], special: [] }`. |
| `referrals` | `Array<object>` | List of active encounter referrals: `[{ date, department, reason, primaryPhysician, coManagingPhysician, receivingPhysician }]`. |
| `loadedEncounters` | `Array<object>` | Complete list of all encounters for the active patient. |
| `activeResultScope` | `string` | Filter for diagnostic results modal: `'all'`, `'current'`, `'30d'`, `'90d'`, `'6m'`, `'1y'`, `'custom'`. |
| `activeResultDateFrom` | `string` | Custom date range start (`YYYY-MM-DD`). |
| `activeResultDateTo` | `string` | Custom date range end (`YYYY-MM-DD`). |
| `_cachedCurrentPatientRecord` | `object \| null` | In-memory cache of current patient data. Invalidate on save or switch. |

---

## 4. Historical Encounter Read-Only Lock Engine

When `activeInspectedEncounterIndex > 0`, `setDashboardReadOnly(true)` is executed. It strictly disables or hides the following controls to preserve clinical audit trails:

1. **CPOE Diagnostic Orders**: `#open-request-modal`, `[data-remove-request]`.
2. **Medications & General Orders**: `.med-sub-add-btn`, `button[data-add-med]`, `button[data-add]`, `.rm-medication`, `.rm-order`, `.btn-add-order`.
3. **Prescription Writer (`Rx Writer`)**: All inputs in `#rx-writer-main-container`, `#rx-btn-add-drug`, `#rx-btn-save-prescription`, `#rx-btn-now`.
4. **Referral / Co-Manage**: `.referral-fields` hidden, `#save-referral-btn` hidden, `#referral-readonly-msg` displayed (`block`).
5. **Follow-up & Disposition**: `input[name="follow_up_needed"]`, `input[name="disposition"]`, `#save-followup-btn`.
6. **Discharge & End Care**: `.btn-conclude-care-trigger`, `#btn-finalize-end-care`.
