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
