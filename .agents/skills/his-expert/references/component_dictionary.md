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
| **Demographics Banner** | `#dashlet-patient-info` | `#banner-patient-name`, `#banner-hrn`, `#banner-encounter-no`, `#banner-bdate`, `#banner-phic` | Patient selector dropdown |
| **Encounter History** | `#dashlet-encounter` | `#encounter-rows`, `#encounter-date-from`, `#encounter-date-to` | `#btn-clear-date-filter`, department filter group |
| **Vital Signs & Flowsheet**| `#dashlet-vitals` | `#clinical-chart-tabs`, bedside tables (Vitals, IVF, Blood Transfusion, Intake/Output) | Bedside nursing flowsheet log triggers |
| **Admitting Diagnosis** | `#admitting-dx-col` | `#admitting_dx` | ICD-10 search input |
| **Final Diagnosis** | `#final-dx-col` | `#final_dx`, encounter lock indicators | Read-only during inspection |
| **Doctor's Orders (CPOE)** | `#orders-summary-table` | Table body `#orders-summary-rows` | `#save-orders-btn`, `#open-request-modal` |
| **Disposition** | `#dashlet-disposition` | `input[name="disposition"]` | `#save-disposition-btn` |
| **Follow-up** | `#dashlet-followup` | `input[name="follow_up_needed"]`, `#follow-up-fields` | `#save-followup-btn` |
| **Specialized Forms** | `#dashlet-specialized-forms` | Physical Examination Form and Special Form groups | OB-Gyne & Neonate quick links |

---

## 3. CPOE Medication Subsystem & Grid Fields

The medication order pad (`.medication-grid`) supports three order categories:

### A. Continuous Infusions (`data-medication-list="continuous"`)
- **Row Generator**: `addContinuousMedRow(body, data)`
- **Table Headers**:
  - `Carrier Solution (Diluent)` (width: 20%, required)
  - `Drug/s in Mixture` (width: 20%, required)
  - `Final Concentration` (width: 14%)
  - `Prescribed Dose & Unit` (width: 17%, required)
  - `*Infusion Rate` (width: 11%, required, includes `mL/h` unit suffix)
  - `Titration / Safety Instructions`
- **Field Selectors**:
  - `data-medication-field="solution"`: Dropdown (`INFUSION_SOLUTIONS`)
  - `data-medication-field="additiveDrug"`: Textbox (`list="med-sample-infusion-drugs"`)
  - `data-medication-field="finalConcentration"`: Textbox (`list="med-sample-concentrations"`)
  - `data-medication-field="prescribedDose"`: Textbox (`list="med-sample-continuous-doses"`, unified dose and unit)
  - `data-medication-field="infusionRate"`: Textbox (rate number in mL/h)
  - `data-medication-field="precautions"`: Textbox (`list="med-sample-infusion-precautions"`)

### B. Scheduled Medications (`data-medication-list="scheduled"`)
- **Row Generator**: `addScheduledMedRow(body, data)`
- **Field Selectors**:
  - `data-medication-field="drug"`: Drug name (`list="med-sample-drugs"`)
  - `data-medication-field="dose"`: Dose quantity
  - `data-medication-field="unit"`: Dose unit dropdown / datalist
  - `data-medication-field="route"`: Flexible textbox (`list="med-sample-routes"`)
  - `data-medication-field="frequency"`: Flexible textbox (`list="med-sample-frequencies"`)
  - `data-medication-field="instructions"`: Special instructions

### C. Oxygen Therapy (`data-medication-list="oxygen"`)
- **Row Generator**: `addOxygenMedRow(body, data)`
- **Field Selectors**:
  - `data-medication-field="deliveryMethod"`: Delivery device dropdown (`OXYGEN_METHODS`)
  - `data-medication-field="oxygenParameters"`: Textbox (e.g. `2-3 L/min`)
  - `data-medication-field="oxygenTarget"`: Target parameter dropdown (`OXYGEN_TARGETS`)
  - `data-medication-field="oxygenDuration"`: Duration dropdown (`OXYGEN_DURATIONS`)

---

## 4. JavaScript State Variables

All shared state variables live in the page's closure/global scope:

| Variable Name | Type | Description & Lifecycle |
| :--- | :--- | :--- |
| `activePatientId` | `string` | ID of the currently selected patient record (e.g. `'patient_op_juan'`). |
| `activeInspectedEncounterIndex` | `number \| null` | `null` or `0` when viewing active encounter. `> 0` when inspecting historical encounter. |
| `savedOrders` | `object` | Dictionary of CPOE orders: `{ plans: [], diet: [], iv: [], medications: [], special: [] }`. |
| `referrals` | `Array<object>` | List of active encounter referrals. |
| `loadedEncounters` | `Array<object>` | Complete list of all encounters for the active patient. |
| `activeResultScope` | `string` | Filter for diagnostic results modal (`'all'`, `'current'`, `'30d'`, etc.). |
| `_cachedCurrentPatientRecord` | `object \| null` | In-memory cache of current patient data. Invalidate on save or switch. |

---

## 5. Historical Encounter Read-Only Lock Engine

When `activeInspectedEncounterIndex > 0`, `setDashboardReadOnly(true)` is executed. It strictly disables or hides the following controls to preserve clinical audit trails:

1. **CPOE Diagnostic Orders**: `#open-request-modal`, `[data-remove-request]`.
2. **Medications & General Orders**: `.med-sub-add-btn`, `button[data-add-med]`, `button[data-add]`, `.rm-medication`, `.rm-order`, `.btn-add-order`.
3. **Prescription Writer (`Rx Writer`)**: All inputs in `#rx-writer-main-container`, `#rx-btn-add-drug`, `#rx-btn-save-prescription`, `#rx-btn-now`.
4. **Referral / Co-Manage**: `.referral-fields` hidden, `#save-referral-btn` hidden, `#referral-readonly-msg` displayed (`block`).
5. **Follow-up & Disposition**: `input[name="follow_up_needed"]`, `input[name="disposition"]`, `#save-followup-btn`.
6. **Discharge & End Care**: `.btn-conclude-care-trigger`, `#btn-finalize-end-care`.
