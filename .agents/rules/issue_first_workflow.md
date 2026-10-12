# Issue-First Development & Commit Invariant

## Strict Workflow Order
For every bug fix, feature request, or code patch in this repository, you MUST follow this sequence strictly:

1. **Step 1 — Verify or Create GitHub Issue**:
   - Before editing any application code, check if an issue already exists for the task.
   - If not, create an issue in `crmry/HIS/issues` via the GitHub API detailing:
     - Issue title and affected clinical module(s) (e.g., Doctor's Orders, Flowsheet, Vitals, CF4 mapping).
     - Clinical/technical description of the bug or requirement.
     - Planned resolution approach.
   - Note the resulting Issue Number (`#<id>`).

2. **Step 2 — Implement & Verify Patch**:
   - Apply the code changes locally.
   - Verify the changes against hospital EHR/EMR standards.

3. **Step 3 — Issue-Linked Commit & Push**:
   - Stage and commit changes referencing the issue explicitly:
     ```bash
     git commit -m "<type>(<scope>): <summary> (Fixes #<id>)"
     ```
   - Push immediately to `origin/main`.

4. **Step 4 — Issue Audit Update**:
   - Post a comment to the GitHub issue with verification results and the commit hash.
   - Close the issue if the fix is fully completed.

## Hard Constraints
- **NEVER** apply a fix directly to code without first logging the issue on GitHub.
- **NEVER** commit a patch without referencing the issue number in the commit message.
