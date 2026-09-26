# Repository Instructions for HIS (CLMMRH Physician Dashboard)

## Continuous GitHub Synchronization
- **Mandatory Push Invariant**: After completing any file additions, edits, or removals requested by the user, you MUST immediately commit and push the changes to GitHub (`origin/main`).
- **Workflow**:
  1. Verify the changes locally.
  2. Stage modified files (`git add <files>`).
  3. Create a concise, descriptive commit message explaining the change.
  4. Push to remote (`git push origin main`).
  5. Provide the commit hash and GitHub link in your response to the user.
- **Rationale**: The user reviews and verifies all dashboard changes directly through the GitHub repository interface.

## EHR and EMR Architectural & Design Standards
- **Core Target**: All modules, clinical documentation tools, and order entry interfaces must be designed to fit directly into a hospital **Electronic Health Record (EHR)** and **Electronic Medical Record (EMR)** system (aligned with DOH Philippines, PhilHealth eClaims/CF4, and CLMMRH clinical workflows).
- **Clinical Terminology & CPOE Standards**:
  - Adhere to Computerized Physician Order Entry (CPOE) and Electronic Medication Administration Record (eMAR) conventions.
  - Use recognized clinical headings and data attributes (e.g., standard clinical flowsheets for vitals/intake/output, CPOE order types for diet/IVF/medications/labs/diagnostics/procedures).
  - Avoid consumer-grade or generic web labels; terminology must be clear, concise, and standard for physicians and nurses.
- **Interoperability & Hospital Audit Trails**:
  - Model all entries with audit-ready metadata: provider identity/signatures, date/time with timezones, encounter numbers, registry types (InPatient, OutPatient, Emergency), and status flags (CARED/Active/Discontinued).
  - Ensure clinical outputs can be translated or mapped directly to official DOH hospital records, Doctor's Order Sheets, and PhilHealth Claim Form 4 (CF4).
