# Repository Instructions for HIS (CLMMRH Physician Dashboard)

## Pre-Patch Issue Tracking via GitHub Issues
- **Mandatory Issue-First Invariant**: Before applying any bug fixes, feature implementations, or refactoring patches to the HIS application, an issue MUST first be created and logged in GitHub Issues (`crmry/HIS/issues`).
- **Workflow**:
  1. **Identify & Specify**: Define the issue, affected clinical modules, reproduction details, or clinical workflow requirements.
  2. **Create GitHub Issue**: File the issue via the GitHub API/CLI before modifying application code, ensuring full traceability prior to patching.
  3. **Traceability in Commits**: When applying the patch, reference the issue number in the commit message (e.g., `Fixes #<issue-id>` or `Ref #<issue-id>`).
  4. **Verification & Closure**: Verify the patch against EHR/EMR standards, update or close the issue with verification evidence, and cross-reference the commit hash.

## Continuous GitHub Synchronization
- **Mandatory Push Invariant**: After completing any file additions, edits, or removals requested by the user, you MUST immediately commit and push the changes to GitHub (`origin/main`).
- **Workflow**:
  1. Verify the changes locally and execute the automated headless verification gate (`python scripts/verify_site.py`).
  2. Ensure zero console errors, zero syntax errors, and zero broken asset requests across all pages.
  3. Stage modified files (`git add <files>`).
  4. Create a concise, descriptive commit message explaining the change (referencing the active GitHub Issue).
  5. Push to remote (`git push origin main`).
  6. Provide the commit hash, GitHub link, and verification summary in your response to the user.
- **Rationale**: The user reviews and verifies all dashboard changes directly through the GitHub repository interface.

## Automated Quality Gates & Script Integrity Standards
- **Pre-Commit Headless CDP Verification**:
  - Run `python scripts/verify_site.py` across all workspace pages (`dashboard.html`, `doctors_order_patient.html`, `forms_localstorage.html`, `index.html`, `patients.html`, `simulation.html`) with both default and patient query routes.
  - The build is strictly rejected if any page produces a JavaScript runtime exception (`SyntaxError`, `TypeError`, `ReferenceError`), console error, or HTTP 404 network failure.
  - **Interactive Widget Smoke Testing**: Any interactive component (e.g., requisition pads, side drawers, CPOE modal launchers) must include automated click verification (`element.click()`) in the test harness to confirm event bindings, modal state toggling, and absence of runtime reference errors.
- **Global Namespace & Refactoring Safety**:
  - Shared modules (e.g., `js/data/patient_seeds.js`) and consuming HTML files must never declare colliding top-level `const` or `let` variables in the global window scope.
  - Consuming pages must use safe fallback patterns (`var STORAGE_KEY = window.STORAGE_KEY || ...;`) or scoped namespaces (`window.SegHIS`).
  - When extracting or compartmentalizing scripts out of an HTML file, verify that all called helper functions (e.g., `buildEmptyPage`, table builders, renderers, event listeners) remain defined and accessible in the page's runtime scope.
  - Always guard DOM element queries before mutating properties or innerHTML (`if (!el) return;`) to eliminate unhandled null reference crashes.

## Interactive Component & DOM Lifecycle Invariants
- **DOM-Before-Script Sequencing**:
  - All persistent UI components, floating drawers, toolkits, and modal structures must be declared in the HTML markup **before** script blocks execute.
  - Never place interactive component markup beneath core `<script>` tags where synchronous queries fail.
- **Idempotent Event Listener Guarding**:
  - Component initialization functions (e.g., `initFloatingRequisitionToolkit()`) must be idempotent.
  - Always guard with an initialization marker (e.g., `if (container.dataset.initialized === 'true') return; container.dataset.initialized = 'true';`) to prevent double-binding when scripts run across both inline and `DOMContentLoaded` lifecycles.
- **Modal Layering & Stacking Context Invariants**:
  - Floating tools and docked panels must respect modal backdrops (e.g., max `z-index: 1050`, below standard modal dialogs at `z-index: 1060+`).
  - Floating components must cleanly suppress or hide when `.modal-lock` is active on `<body>` (`body.modal-lock #floating-widget { display: none !important; }`).

## EHR and EMR Architectural & Design Standards
- **Core Target**: All modules, clinical documentation tools, and order entry interfaces must be designed to fit directly into a hospital **Electronic Health Record (EHR)** and **Electronic Medical Record (EMR)** system (aligned with DOH Philippines, PhilHealth eClaims/CF4, and CLMMRH clinical workflows).
- **Clinical Terminology & CPOE Standards**:
  - Adhere to Computerized Physician Order Entry (CPOE) and Electronic Medication Administration Record (eMAR) conventions.
  - Use recognized clinical headings and data attributes (e.g., standard clinical flowsheets for vitals/intake/output, CPOE order types for diet/IVF/medications/labs/diagnostics/procedures).
  - Avoid consumer-grade or generic web labels; terminology must be clear, concise, and standard for physicians and nurses.
- **Interoperability & Hospital Audit Trails**:
  - Model all entries with audit-ready metadata: provider identity/signatures, date/time with timezones, encounter numbers, registry types (InPatient, OutPatient, Emergency), and status flags (CARED/Active/Discontinued).
  - Ensure clinical outputs can be translated or mapped directly to official DOH hospital records, Doctor's Order Sheets, and PhilHealth Claim Form 4 (CF4).
