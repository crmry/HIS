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
- **UI Responsiveness & Main-Thread Performance Invariants**:
  - **In-Memory Storage Caching**: Never perform synchronous `JSON.parse(localStorage.getItem(...))` repeatedly across loops, table renderers, or query lookups. Use an in-memory memoized cache invalidated on write and `window.addEventListener('storage')`.
  - **Live Calculation Coalescing**: Order summary updates, badge counters, and live aggregations triggered by rapid typing events (`input`, `change`) must be coalesced using `window.requestAnimationFrame` to avoid layout thrashing and main-thread blocking.
  - **Input Debouncing**: Search inputs (e.g., CPOE service lookup, ICD-10 search) that filter or re-render large DOM lists must be debounced with a timer (100–150ms) to ensure instant key entry without frame drops.

## Interactive Component & DOM Lifecycle Invariants
- **DOM-Before-Script Sequencing**:
  - All persistent UI components, floating drawers, toolkits, and modal structures must be declared in the HTML markup **before** script blocks execute.
  - Never place interactive component markup beneath core `<script>` tags where synchronous queries fail.
- **Idempotent Event Listener Guarding**:
  - Component initialization functions (e.g., `initFloatingRequisitionToolkit()`) must be idempotent.
  - Always guard with an initialization marker (e.g., `if (container.dataset.initialized === 'true') return; container.dataset.initialized = 'true';`) to prevent double-binding when scripts run across both inline and `DOMContentLoaded` lifecycles.
- **Inline Event Handler Scoping & Window Binding**:
  - Every function referenced directly in inline HTML attributes (e.g., `onclick="closeRxWriterModal(event)"`) MUST be declared and explicitly assigned to the `window` scope (`window.closeRxWriterModal = closeRxWriterModal;`).
  - Automated smoke tests must click all close buttons and cancel triggers in addition to open triggers to verify tear-down and scope completeness.
- **Intentional Interaction vs. Hover Traps**:
  - Floating panels, toolkits, and drawers must be strictly click-activated rather than hover-activated (`:hover`).
  - Implement outside-click auto-collapse (`document.addEventListener('click', ...)`) with a pinned-state override so users can effortlessly dismiss panels without trapped UI states.
- **Modal Layering & Stacking Context Invariants**:
  - Floating tools and docked panels must respect modal backdrops (e.g., max `z-index: 1050`, below standard modal dialogs at `z-index: 1060+`).
  - Floating components must cleanly suppress or hide when `.modal-lock` is active on `<body>` (`body.modal-lock #floating-widget { display: none !important; }`).

## EHR and EMR Architectural & Design Standards
- **Core Target**: All modules, clinical documentation tools, and order entry interfaces must be designed to fit directly into a hospital **Electronic Health Record (EHR)** and **Electronic Medical Record (EMR)** system (aligned with DOH Philippines, PhilHealth eClaims/CF4, and CLMMRH clinical workflows).
- **Minimalist Clinical UI & Icon Constraints**:
  - Clinical documentation tools and requisition toolbars must maintain an ultra-clean, minimalist hospital UI.
  - Do NOT use consumer-grade emoji icons (e.g., ⚡, 💊, 🧪, 🩻, 🫀, 🫁, 📌, 📍) in headers, handles, or action lists.
  - Use subtle clinical color accents (e.g., 3px left border stripes), standard system glyphs (◀, ▶, ✕), and refined hospital typography.
- **Clinical Terminology & CPOE Standards**:
  - Adhere to Computerized Physician Order Entry (CPOE) and Electronic Medication Administration Record (eMAR) conventions.
  - Use recognized clinical headings and data attributes (e.g., standard clinical flowsheets for vitals/intake/output, CPOE order types for diet/IVF/medications/labs/diagnostics/procedures).
  - Avoid consumer-grade or generic web labels; terminology must be clear, concise, and standard for physicians and nurses.
- **Interoperability & Hospital Audit Trails**:
  - Model all entries with audit-ready metadata: provider identity/signatures, date/time with timezones, encounter numbers, registry types (InPatient, OutPatient, Emergency), and status flags (CARED/Active/Discontinued).
  - Ensure clinical outputs can be translated or mapped directly to official DOH hospital records, Doctor's Order Sheets, and PhilHealth Claim Form 4 (CF4).
- **PhilHealth CF4 & DOH Clinical Data Invariants**:
  - **Patient Identification**: Every patient demographic banner, encounter header, and CF4 clinical view must support the PhilHealth Identification Number (PIN / PHIC No., `XX-XXXXXXXXX-X`) alongside the Hospital Record Number (HRN) and Case / Encounter Number.
  - **Physician Professional Credentials**: All doctor's orders, prescriptions, and encounter certifications must include the physician's full name, PRC License Number, PhilHealth Accreditation Number (PAN), and S2 License (for regulated medications) per DOH A.O. 2021-0037.
  - **Standardized Diagnostic & Procedural Coding**: Diagnoses must enforce ICD-10 format, and procedural documentation must reference PhilHealth Relative Value Scale (RVS) codes with anatomical laterality where indicated.
  - **Strictly Minimalist Clinical Typography**: Purge all consumer emoji glyphs from headers, tabs, select inputs, and modal dialogs to maintain an authentic, high-trust hospital EHR aesthetic.
  - **Production Code Hygiene & Authentic Hospital Terminology (Zero AI Markers)**:
    - Maintain production hospital engineering standards throughout all code comments, documentation, and user interfaces.
    - Strictly purge and ban conversational AI markers, prompts, assistant meta-commentary, or artificial demo qualifiers (e.g., "per user request", "STATIC PROTOTYPE ONLY", "mock datasets", "Zero Orders Demo", "(Seed — Previous Patient)", "(Sample — Outpatient Only, OPD)", "(Example — New Patient, Blank)").
    - Replace all descriptive tags with authentic hospital designations (e.g., "(Inpatient — Medical Ward)", "(Outpatient — Adult Medicine OPD)", "(New Patient — Blank Chart)", "Clinical Pathways & Protocols").
    - Ensure all refactorings and hygiene enhancements preserve strict backwards compatibility, zero console exceptions, zero regression in clinical flows, and 100% compliance with automated verification gates.
