---
name: his-expert
description: >-
  Architectural navigator, component index, and fast-patch runbook for the HIS (CLMMRH Physician Dashboard) codebase.
  Activate this skill whenever inspecting, modifying, debugging, or refactoring dashboard.html, clinical modules,
  CPOE orders, patient state flows, modals, floating requisition toolkits, or running headless verification gates.
---

# HIS Expert Skill & Architectural Navigator

This skill provides an indexed architectural map, component dictionary, and fast-patch recipes for the CLMMRH Physician Dashboard codebase (`HIS`).

Use this skill to bypass token-heavy scanning across the 15,400+ line `dashboard.html` file and execute zero-drift, targeted modifications directly.

---

## 4 Golden Rules for Zero-Waste Token Execution

1. **Check the Section Map First**: Never read large 500+ line blocks of `dashboard.html`. Consult [dashboard_section_map.md](./references/dashboard_section_map.md) to locate exact line numbers.
2. **Use Targeted Grep Signatures**: Search only for unique element IDs or function signatures (see [component_dictionary.md](./references/component_dictionary.md)) rather than broad keywords like `patient` or `order`.
3. **Follow Standard Fast-Patch Runbooks**: Use proven step-by-step blueprints in [fast_patch_runbooks.md](./references/fast_patch_runbooks.md) for recurring clinical dashboard tasks.
4. **Adhere to Hospital EHR & Repository Invariants**:
   - **Issue-First Invariant**: Create a GitHub issue via API *before* patching code (`crmry/HIS/issues`).
   - **Strict Verification Gate**: Execute `python3 scripts/verify_site.py` across all 19 workspace pages.
   - **Continuous Push Invariant**: Stage, commit referencing the issue, and push to `origin/main`.
   - **Zero AI Markers**: Never write artificial test tags, AI disclaimers, or mock markers in UI or code comments.

---

## Quick Reference Index

| Documentation & Guides | Purpose & Contents |
| :--- | :--- |
| [Section Map](./references/dashboard_section_map.md) | Exact line-range index for HTML markup, modals, floating drawer, and JavaScript functions in `dashboard.html`. |
| [Component Dictionary](./references/component_dictionary.md) | Mapping of Dashlets, IDs, Modals, State Variables (`savedOrders`, `referrals`, etc.), and Read-Only Locks. |
| [Fast-Patch Runbooks](./references/fast_patch_runbooks.md) | Step-by-step recipes for Requisition Drawer transfers, CPOE modifications, and automated verification. |

---

## Standard One-Shot Workflow Command

To execute the mandatory issue-tracking and verification workflow in minimal turns:

```bash
# 1. Create GitHub Issue
GH_TOKEN=$(printf "protocol=https\nhost=github.com\n" | git credential fill | grep "^password=" | cut -d= -f2)
ISSUE_URL=$(curl -s -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/crmry/HIS/issues \
  -d '{"title":"<type>(<module>): <description>","body":"### Context & Requirements\n..."}' | grep -o 'https://github.com/crmry/HIS/issues/[0-9]*' | head -1)
ISSUE_NUM=$(basename "$ISSUE_URL")

# 2. (Apply edits to files via replace_file_content)

# 3. Headless Verification Gate
python3 scripts/verify_site.py

# 4. Commit, Push, and Close Issue
git add .
git commit -m "<type>(<module>): <description> (Fixes #$ISSUE_NUM)"
git push origin main
curl -s -X PATCH -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/crmry/HIS/issues/$ISSUE_NUM -d '{"state":"closed"}'
```
