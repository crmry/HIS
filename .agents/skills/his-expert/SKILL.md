---
name: his-expert
description: >-
  Architectural navigator, component index, and fast-patch runbook for the HIS (Physician Dashboard) codebase.
  Activate this skill whenever inspecting, modifying, debugging, or refactoring dashboard.html, clinical modules,
  CPOE orders, patient state flows, modals, floating requisition toolkits, or running headless verification gates.
---

# HIS Expert Skill & Architectural Navigator

This skill provides an indexed architectural map, component dictionary, and fast-patch engine for the Physician Dashboard codebase (`HIS`).

Use this skill to bypass token-heavy scanning across the 16,700+ line `dashboard.html` file and execute zero-drift, targeted modifications directly in minimal tool turns.

---

## 4 Mandatory Invariants for Zero-Waste Token Execution

### 1. Zero-Clarification Delay Invariant (Fix What Is Asked Immediately)
- **Do NOT Pause for Clarification**: When a user requests a feature, UI change, field adjustment, or bug fix, **NEVER** invoke the `ask_question` tool or halt to ask questions if the requirement or clinical intent is reasonably inferrable.
- **Translate Clinical Intent & Typos Directly**: Recognize common medical abbreviations and typos automatically:
  - `"Final Conception"` $\rightarrow$ `"Final Concentration"`
  - `"Prescribed Dose & Unit *Infusion Rate"` $\rightarrow$ update continuous infusion columns with required asterisk
  - `"Fq"` $\rightarrow$ `"Frequency"`
  - `"stat to now"` $\rightarrow$ update stat urgency button to label `Now`
- **Execute Directly with Sensible Defaults**: Implement the change cleanly using hospital EHR standards and summarize the outcome concisely in your response.

### 2. Single-Command Dynamic Locator (No Exploratory Reading)
- **Never Call Chains of `view_file`**: Do NOT view slices repeatedly across turns.
- **Run the Dynamic Locator Engine**:
  ```bash
  python .agents/skills/his-expert/scripts/locate.py <identifier>
  ```
  This command inspects both `dashboard.html` and `dashboard_er_inpatient.html` simultaneously in `< 0.1s`, printing the exact `StartLine` and `EndLine` ready for `replace_file_content`.

### 3. Concurrent Multi-Dashboard Patching
- When modifying CPOE orders, medication tables, or patient views, always patch **both** `dashboard.html` and `dashboard_er_inpatient.html` within the same turn.
- View at most **one** target slice (15–40 lines) if needed, then immediately call `replace_file_content`.

### 4. Mandatory Issue-First, Verification & Push Invariant
- **Pre-Patch Issue Creation**: File an issue via GitHub API before modifying code (`crmry/HIS/issues`).
- **Headless Verification Gate**: Run `python scripts/verify_site.py` across all workspace pages. Must pass with zero errors.
- **Continuous Git Synchronization**: Stage, commit referencing the issue, and push to `origin/main`.
- **Zero AI Markers**: Never write artificial demo tags, AI disclaimers, or mock qualifiers in UI or code comments.

---

## Quick Reference Index

| Documentation & Tools | Purpose & Contents |
| :--- | :--- |
| [Dynamic Locator Engine](./scripts/locate.py) | Python CLI tool returning exact `StartLine`/`EndLine` ranges for `replace_file_content` across all dashboards. |
| [Section Map](./references/dashboard_section_map.md) | Exact line-range index for HTML markup, modals, floating drawer, and JavaScript functions (`16,729` lines). |
| [Component Dictionary](./references/component_dictionary.md) | Mapping of Dashlets, IDs, CPOE Medication grids, Modals, State Variables (`savedOrders`, `referrals`), and Locks. |
| [Fast-Patch Runbooks](./references/fast_patch_runbooks.md) | Step-by-step recipes for Requisition Drawer transfers, CPOE modifications, and datalist textboxes. |

---

## Standard 3-Turn Fast Execution Blueprint

Execute any user change within **3 turns maximum**:

```bash
# Turn 1: Locate Target Lines
python .agents/skills/his-expert/scripts/locate.py <target-feature-or-id>

# Turn 2: Apply Edits directly via replace_file_content in dashboard.html and dashboard_er_inpatient.html

# Turn 3: Headless Verification Gate & Git Sync
python scripts/verify_site.py
git add .
git commit -m "<type>(<module>): <description>"
```
