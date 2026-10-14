# Antigravity Implementation Specification
## Enhance the EXISTING OB-Gyne / Obstetric History Module

**Document role:** Repository-aware implementation instructions for Gemini in Google Antigravity  
**Scope:** Existing Hospital Information System (HIS), **not a new application or replacement module**  
**Primary UI reference:** The seven screenshots supplied by the requester  
**Clinical indication reference:** `PC-2026-0016.pdf` (PhilHealth Circular, *Quality Standards on Maternal Health Care*; Section V.C, Tables 2–7, printed pp. 4–8)  
**Status:** Implementation specification; requirements containing clinical ambiguity require clinical-team confirmation before production.

---

# 0. CRITICAL SPECIAL INSTRUCTIONS — READ FIRST

> [!IMPORTANT]
> **THIS PROJECT ALREADY HAS A WORKING OB-GYNE / OBSTETRIC HISTORY MODULE. ENHANCE IT IN PLACE. DO NOT CREATE A NEW MODULE, NEW PAGE, NEW PROJECT, PARALLEL FORM, OR REPLACEMENT ARCHITECTURE.**

You are Gemini acting as a **senior engineer maintaining an existing production-oriented HIS**. The screenshots describe the desired user-facing behavior of an **already existing** OB-Gyne History workflow.

## Non-negotiable safeguards

1. **Repository-first:** Inspect the real project before suggesting code changes. Locate the current OB-Gyne/Obstetric History entry point, Present Pregnancy and Past Pregnancy forms, summary cards, field definitions, existing state/store, API handlers, persistence models, migrations, route registration, and tests.
2. **Do not assume the tech stack:** Identify the actual frameworks, language versions, ORM, DB, routing, design system, and validation conventions from repository files. Do **not** scaffold React, Next.js, Laravel, Django, or a new database just because this specification uses example pseudocode.
3. **No duplication:** Reuse and extend the existing components, data tables, endpoints, services, and design system. Consolidate existing computations rather than implement a second, competing GP(TPAL) engine.
4. **Preserve the UI:** Keep the left-side Pregnancy navigation/editor panel, right-side GP(TPAL) summary, pregnancy cards, **ADD** workflow and top-right **SAVE** action shown in screenshots. Use existing labels/styles unless the requirements specifically change them.
5. **Protect patient data:** No destructive schema changes, no drop/recreate, no truncation, no seed-script overwrites, no silent record deletion, and no changes to unrelated modules. Add backward-compatible migrations only when required and approved.
6. **Separate planning from editing:** **Phase A is read-only discovery + written plan. STOP and ask for approval before Phase B code/database changes.** Never claim completion after merely producing a plan.
7. **Existing records are source of truth:** Inspect how legacy pregnancies, births, and statuses are represented. Provide a compatibility/mapping strategy and preservation tests before adjusting calculations. Do not auto-reclassify or rewrite unverified historical clinical records.
8. **No fake results:** Do not populate mock pregnancies into real patient data or hardcode screenshot values/dates. Use synthetic fixtures only in tests or an isolated development environment.
9. **Clinical safety:** These are **documentation and arithmetic rules**, not automatic recommendations for delivery, surgery, clinical dating, or medical management. Flag ambiguous records for qualified clinician review; do not infer findings.
10. **Avoid scope creep:** Do not change unrelated OB-Gyne tabs, encounters, orders, notes, other patient modules, authentication, or security patterns unless existing module integration strictly requires it; explain unavoidable cross-module changes first.
11. **Reversible work:** Before any migration, capture the current schema and design a rollback/backup procedure appropriate to the repository's deployment practices. Do not run production migrations without authorization.
12. **Patient privacy:** Do not copy production identifiers, names, or protected health information into logs, generated fixtures, screenshots, or external tools. Use de-identified examples.

## Mandatory Phase A output — before touching files

Produce a short **Existing Module Impact Assessment** with these headings:

- **Current implementation found:** actual file paths, components, routes, API endpoints, DB tables and relationships.
- **Requirements gap matrix:** `Requirement | Existing behavior | Gap/defect | Proposed minimal change | Files affected | Risk`.
- **Data preservation plan:** how existing records map to any proposed new fields, migration/backfill strategy, rollback, and treatment of missing/ambiguous data.
- **Computation plan:** one canonical implementation of LMP EDD, ultrasound EDD, dynamic GA, and GP(TPAL).
- **UI change plan:** screenshot alignment, exact conditional fields, and how ADD/SAVE continue to work.
- **Test plan:** unit, integration, persistence and regression cases.
- **Clinical questions requiring sign-off:** only decisions not resolved by the screenshots, these requirements or the supplied circular.

**End Phase A with:** `I have inspected the existing module. Please approve the proposed changes before I modify code or database files.`  
**Proceed to Phase B only after explicit approval.**

---

# 1. Objective and existing user workflow

Enhance the current **Obstetric History** view with:

- **Present Pregnancy** — LMP-based and ultrasound-based dating, automatically calculated EDD and current GA.
- **Past Pregnancy** — conditional fields for singleton, multiple, miscarriage, ectopic and molar pregnancies; delivery modes; CS indications; intervention details; and per-baby records.
- **Right-side history** — live/recomputed `G`, `P`, `FT`, `Pr`, `Ab`, `LB` indicators and pregnancy cards, ordered chronologically with the newest first.
- **Persistence** — preserve current **ADD** (stage a record into the displayed history) and **SAVE** (persist to the backend) semantics if this is how the existing UI works. Inspect before changing these actions. Show dirty/unsaved state consistently.

The screenshots show a **left editor panel** and a **right obstetric history summary**. Do **not** replace them with a wizard, generic table, new dashboard, or standalone component library.

### UI anchors from the screenshots

- Main heading: **Obstetric History**.
- Left menu: **Present Pregnancy** / **Past Pregnancy**.
- Left forms use compact labels, dropdowns, radio/toggle buttons, and an **ADD** button.
- Right summary headings: `G (# of Pregnancy)`, `P (# of Delivery)`, `FT (# of Full term)`, `Pr (# of Preterm)`, `Ab (# of Abortion)`, `LB (# of Currently Living)`.
- Right cards: `G3 (Present Pregnancy)`, `G2`, `G1`, etc.; present card has separate **BASED ON LMP** and **BASED ON ULTRASOUND** subsections.
- Preserve existing menu actions, responsive behavior, scroll positions, error handling, and user role restrictions.

---

# 2. Present Pregnancy — Based on LMP

## Inputs and computed outputs

| Field | Behavior |
|---|---|
| LMP start (first day of last normal menstrual period) | Editable date; source of LMP gestational dating |
| LMP end | Editable date, if existing UI includes it; **must not** influence EDD/GA |
| Current age of gestation | Read-only derived display as `N weeks M days` |
| Expected delivery date (EDD) | Read-only derived date |

### Exact computation

Use **date-only** arithmetic with the HIS's documented local date/time policy; avoid UTC parsing that silently shifts a chosen calendar day.

```text
lmpGA_days = calendarDaysBetween(LMP_START_DATE, AS_OF_DATE)
lmpGA_weeks = floor(lmpGA_days / 7)
lmpGA_remainder_days = lmpGA_days % 7
lmpEDD = LMP_START_DATE + 280 calendar days
```

- Use the **first day** of the LMP; never use LMP end.
- Use the correct as-of date (normally the current date in hospital-configured timezone); allow an explicit `asOfDate` internally for deterministic tests.
- Compute current GA afresh when rendering or on date rollover; do **not** persist a permanently aging “current weeks/days” field as source of truth.
- Validate that LMP start exists and is a plausible calendar date; LMP end cannot be earlier than LMP start. Handle future dates and negative GA without presenting misleading results.
- Compute across month/year boundaries and leap days accurately.

**Fixed-date test:** LMP start `2026-06-01` → EDD `2027-03-08`. The screenshot's displayed `12 weeks 1 day` was true only on an earlier as-of date; **do not hardcode it or assume it is today's GA**.

---

# 3. Present Pregnancy — Based on Ultrasound

## Inputs and computed outputs

| Field | Behavior |
|---|---|
| Ultrasound examination date | Editable date |
| Gestational age **at the time of that ultrasound** | Editable whole weeks and days |
| Ultrasound-derived EDD | Read-only calculated date |
| Current GA from ultrasound | Read-only calculated weeks and days |

### Exact computation

```text
scanGA_days = scanGA_weeks * 7 + scanGA_remainder_days
scanEDD = ultrasoundDate + (280 - scanGA_days) calendar days
elapsed_days = calendarDaysBetween(ultrasoundDate, asOfDate)
currentScanGA_days = scanGA_days + elapsed_days
currentScanGA_weeks = floor(currentScanGA_days / 7)
currentScanGA_remainder_days = currentScanGA_days % 7
```

- Ultrasound EDD is **NOT** `ultrasoundDate + 280 days`.
- Validate ultrasound GA weeks and `0–6` days. Don't silently coerce unknown values to zero.
- Handle ultrasound dates after the as-of date as a validation issue.
- Preserve both LMP-based and ultrasound-based computed dates independently.
- If both dates exist, show their difference only if supported by the current design. **Do not automatically overwrite/select the “official” clinical EDD based solely on the smaller gap or scan timing.** The attending clinician decides per an approved dating protocol.
- Preserve the existing first-trimester recommendation/information panel if present, but review any hardcoded clinical wording with the user/hospital before changing dating precedence.

**Fixed-date test:** scan on `2026-08-14` at **11 weeks 1 day** (`78 days`) → EDD `2027-03-04`.

**Important:** Screenshots were captured on another day. GA “today” will not match those screenshots when the application is used on a later date; that is correct.

---

# 4. Past Pregnancy — shared form and type selector

Keep the existing **Past Pregnancy** form. `Type of Pregnancy` options:

1. `Singleton Pregnancy`
2. `Multiple Pregnancy`
3. `Miscarriage`
4. `Ectopic`
5. `Molar`

Use exact existing stored values/enum codes where already present and map display labels non-destructively. Do not rename columns or existing enumerations without checking all consumers.

## Shared birth/delivery fields for singleton and multiple pregnancy

| Field | Type / behavior |
|---|---|
| Type of Pregnancy | Dropdown above |
| Date of Delivery | Month + year per screenshot; persist without inventing a day |
| Place | Text |
| Age of Gestation | Weeks + days, `days` 0–6 |
| Mode of Delivery | Existing dropdown, extended only if needed |
| Cesarean Indication | Only visible for Cesarean, see §5 |
| Pregnancy Remarks | Multiline free text |
| Baby records | See §6; individual fields for each baby |

**Delivery mode labels** (retain existing machine codes if different):

- `Normal (Vaginal Delivery)` / NSD
- `Cesarean`
- `Vaginal Birth after Cesarean (VBAC)`
- `Vacuum Extraction`
- `Forceps Delivery`

`Mode of Delivery` describes **how** delivery occurred. Gestational age and pregnancy outcome determine **term/preterm/parity**. Do **not** increment parity solely because a delivery mode was selected.

### Baby information (per child)

- Baby name (optional or required according to existing business rules)
- Sex: Male / Female (follow current supported data model; do not erase existing alternate/unknown values)
- Birth weight in **kg**; support decimals without rounding away stored precision
- **Current** status: Living / Deceased
- Baby remarks

Do not interpret `Deceased` as “stillborn” without a separate birth outcome field. A child may have been born living and later become deceased. Living count uses **current** status.

---

# 5. Cesarean indication — conditional dropdown, reference to circular

## Trigger and UX

When `Mode of Delivery == Cesarean`:

- Reveal the existing **INDICATION** dropdown (as in screenshot).
- Populate with **searchable, grouped** clinical documentation choices derived from **PhilHealth Circular PC-2026-0016, Section V.C, Tables 2–7 (printed pages 4–8)**.
- Group under `Planned (Elective)` and `Emergency`, then by maternal/fetal/placental/umbilical category.
- If the existing UI has no separate CS type selector, **prefer a grouped searchable indication dropdown** over adding an unnecessary new required step. A separate planned/emergency selector may be introduced only if it clearly fits existing UI/data design and is approved in Phase A.
- Offer `Other / Specify` and a conditional free-text field for medically documented indications not in the dropdown, subject to hospital approval.
- Persist stable option identifier, human-readable label, classification, and optional remarks as appropriate to existing schema.
- On edit, restore the historical selected value even if the indication list later changes; version/reference the list as needed.
- When delivery mode is changed away from Cesarean, do not silently destroy a previously saved indication; implement documented conditional cleanup behavior and confirmation if necessary.
- A selected indication is **not** an automatic determination of CS eligibility or a clinical recommendation.
- Do not retroactively require 2026 circular indication fields for legacy CS records that were previously saved without them; display missing/unknown as legacy or needs review.

## Source categories and suggested normalized entries

**READ THE SUPPLIED PDF before implementing.** The following is an implementation index and intentionally condenses some long qualifications; preserve medically material conditions/details from the PDF's tables in the final option metadata/help text. Do not present condensed labels as exact verbatim regulatory text.

### 5A. Planned/Elective — maternal (Table 2, pp. 4–5)

- Previous uterine surgery (not in labor): **history of two or more previous CS; prior uterine rupture; previous myomectomy**.
- Cardiovascular/vascular: **aortopathy with aortic-root dilatation (e.g., Marfan syndrome); chronic aortic dissection; Eisenmenger syndrome; pulmonary arterial hypertension; cerebral aneurysm; history of CVA/stroke**.
- Other maternal/medical: **antiphospholipid syndrome with associated maternal/fetal complications; warfarin at labor in a patient with mechanical heart valve; active genital herpes; HIV with high (>1,000 copies/mL) or unknown viral load; extensive genital condyloma obstructing birth or posing bleeding risk**.
- Obstructive: **tumor previa blocking birth canal (e.g., myoma, ovarian mass, cervical cancer); clinically significant pelvic deformity hindering safe vaginal delivery**.
- Infertility/other: **pregnancy achieved through assisted reproductive technologies with complications**.

### 5B. Planned/Elective — fetal (Tables 3, pp. 5–6)

- Persistent breech presentation at term; persistent transverse lie at term (source specifies **38–39 weeks**).
- Fetal macrosomia (**>4,000 g**, with applicable clinical assessment/documentation qualifications from the PDF).
- Intrauterine fetal growth restriction with abnormal fetal surveillance or when labor may worsen fetal survival.
- Congenital fetal anomalies or tumors that obstruct vaginal delivery.
- Twin pregnancy with non-cephalic first twin, monoamniotic twins, or conjoined twins; higher-order multiple pregnancy (triplets or more).

### 5C. Planned/Elective — placental (Table 4, p. 6)

- Placenta previa.
- Placenta accreta spectrum.
- Vasa previa.

### 5D. Emergency — maternal (Table 5, pp. 6–7)

- Labor dystocia: arrest of cervical dilatation, prolonged second stage, arrest/failure of descent, failed induction **after the qualifying management/time specified in the circular**.
- Previous uterine surgery in labor, when not a candidate for trial of labor after CS / VBAC: previous CS, prior uterine rupture, previous myomectomy.
- Uncontrolled preeclampsia with severe features; eclampsia or impending eclampsia; HELLP syndrome; antiphospholipid syndrome (where associated with maternal instability).
- Critical cardiovascular/vascular conditions: aortopathy with root dilatation; aortic dissection; cerebral aneurysm; prior stroke; Eisenmenger syndrome; pulmonary arterial hypertension; severe right ventricular failure; severe symptomatic aortic stenosis; severe mitral stenosis; advanced peripartum cardiomyopathy; vascular Ehlers-Danlos syndrome; other critical heart/lung conditions posing an immediate threat during labor; mechanical heart-valve patient on warfarin at labor.
- Maternal infection: active primary HSV infection in third trimester **with the conditions described in the PDF**; high/unknown HIV viral load; other severe intrauterine or pelvic infections remote from vaginal delivery.
- Other emergencies: suspected/confirmed uterine rupture; severe obstetric bleeding; maternal shock/collapse; perimortem CS.

### 5E. Emergency — fetal (Tables 6, pp. 7–8)

- Acute fetal compromise: non-reassuring fetal heart-rate patterns **when delivery is not imminent**.
- Malpresentation/malposition in labor: breech; transverse lie/shoulder; face (mentum posterior); brow.
- Fetal macrosomia with applicable PDF qualifications; obstructive congenital anomalies; post-Zavanelli maneuver.
- Twin pregnancy with non-cephalic first twin, monoamniotic or conjoined twins; higher-order multiple pregnancy.
- Failed assisted vaginal delivery: failed vacuum extraction; failed forceps delivery.

### 5F. Emergency — placental / umbilical (Table 7, p. 8)

- Placenta previa; abruptio placenta; placenta accreta spectrum; vasa previa, **with applicable acute-compromise/bleeding context**.
- Umbilical cord prolapse.

**Source precedence:** The uploaded circular's actual tables and wording prevail over this abbreviated index. **Do not use the circular's referral/high-risk annex as an indication list**; the requested dropdown comes from the CS tables, not the entire PDF. The circular also emphasizes physician assessment, documented consent, and institutional safety protocols.

---

# 6. Multiple pregnancy — one pregnancy, individual baby records

When `Type of Pregnancy == Multiple Pregnancy`:

Display `Multiple Pregnancy Type` dropdown:

- Twins → initial baby count **2**
- Triplets → **3**
- Quadruplets → **4**
- Other → numeric **Number of Babies** and Add Baby control

Then display **Baby 1, Baby 2, … Baby N**, each with independent name, sex, birth weight, status and remarks.

Requirements:

1. A multiple gestation is **one pregnancy record**, regardless of number of babies.
2. At delivery, it is **one parity event** and **one term/preterm event** if classified by gestational age.
3. Every baby with `Current Status = Living` contributes **one** to `LB`.
4. Each baby is stored as a separate child entity (or equivalent existing normalized record), linked to the one pregnancy; never duplicate the parent pregnancy for every baby.
5. Switching from twins to triplets adds one baby input; decreasing the count must not silently delete existing baby data — require explicit confirmation and follow the application's deletion/audit conventions.
6. If `Other`, allow an appropriate integer >=2 and confirm any operational upper limit with the clinical team; do not arbitrarily truncate the number to four.
7. Existing singleton pregnancies still have one child subrecord where appropriate; map preexisting flat baby fields to a single child without dropping values.
8. Apply the shared delivery mode and Cesarean-indication behavior to multiple pregnancies.

**Counting example:** Twins delivered at 38w0d, both currently living → pregnancy contribution `G1 P1 T1 Pr0 A0 L2`. Twins at 35w0d, one living and one deceased → `G1 P1 T0 Pr1 A0 L1`.

---

# 7. Miscarriage, molar and ectopic — conditional interventions

These are **completed pregnancies** for history purposes. Use the existing Past Pregnancy form and only display clinically relevant fields. For all three, include date (month/year), place, GA weeks/days and pregnancy remarks. Avoid requiring the ordinary delivery-mode or live-baby fields for these types.

| Pregnancy type | Show intervention options | Additional conditional behavior |
|---|---|---|
| Miscarriage | `No Intervention`, `Dilation and Curettage (D&C)` | Store selected intervention; no standard baby form |
| Molar | `Suction`, `TAHMIS` | Preserve the provided literal label `TAHMIS` unless clinician confirms its intended expansion/terminology |
| Ectopic | `Medical Management`, `Surgery` | If `Surgery`, show **Surgical Procedure / Details** free-text field |

**Do not invent an approved surgical procedure list** because none was supplied. If the user provides one later, extend the dropdown accordingly.

### GP(TPAL) classification

For miscarriage, molar or ectopic **that ended before 20w0d**, count `G +1`, `Ab +1`, but `P/T/Pr/L +0` (assuming no child record). If the outcome/GA contradicts this normal mapping, **do not silently force it into Ab**; require clinical resolution or preserve it as an incomplete/unclassified historical record.

Prevent data loss if users change pregnancy type after entering fields. Do not silently carry irrelevant previous-type fields into display or calculations; keep legacy data safely persisted until deliberate user confirmation, as aligned with the existing application.

---

# 8. GP(TPAL) — canonical computed summary

## Definitions required by the requester

| UI | Variable | Count rule |
|---|---|---|
| `G` | Gravidity | All distinct pregnancies, **including present ongoing pregnancy**. Twins/triplets still count as one. |
| `P` | Parity | Number of **completed pregnancies reaching delivery at >=20w0d** (not number of babies). Independent of the selected delivery-mode label. |
| `FT` / `T` | Term | Number of completed deliveries at **>=37w0d**. |
| `Pr` | Preterm | Number of completed deliveries from **20w0d through 36w6d**. |
| `Ab` / `A` | Abortion / early loss | Completed pregnancies ending **before 20w0d** when loss classification is confirmed (e.g., miscarriage, molar, ectopic). |
| `LB` / `L` | Currently living | Number of **individual children currently marked Living**, not number of pregnancies or delivery events. |

Boundary values in **days**: 20w0d = 140 days; 37w0d = 259 days.

For fully classified delivery/loss records under these definitions, `P = FT + Pr`. The present pregnancy contributes to `G` but **not** `P`, `FT`, `Pr`, `Ab`, or `LB` while ongoing.

### Explicitly avoid these common errors

- **Do not** count two babies from twins as two pregnancies or two deliveries.
- **Do not** count `Mode of Delivery` selections as births irrespective of GA or outcome.
- **Do not** exclude stillbirth from parity if delivered at >=20w0d; current living count is separate.
- **Do not** count an ongoing pregnancy as a live child.
- **Do not** classify missing/unknown GA as zero weeks or as abortion.
- **Do not** count a pregnancy outcome twice, or keep stale cached totals after edit/delete.
- **Do not** increment LB from the number of pregnancies; calculate child statuses individually.

### Algorithm — design guidance, adapt to actual domain model

```pseudo
function calculateObstetricSummary(records):
  G = countDistinctPregnancyRecords(records)
  P = 0; FT = 0; Pr = 0; Ab = 0; LB = 0
  issues = []

  for pregnancy in records:
    if pregnancy.isOngoing:
      continue  // ongoing does not yet contribute to P/T/Pr/A/L

    if pregnancy.outcomeIsCompleted:
      if pregnancy.gestationalAgeDays is UNKNOWN:
        issues.push(pregnancy.id + ': gestational age needs review')
      else if pregnancy.gestationalAgeDays >= 259:
        P += 1; FT += 1
      else if pregnancy.gestationalAgeDays >= 140:
        P += 1; Pr += 1
      else if pregnancy.type is confirmed early pregnancy loss:
        Ab += 1
      else:
        issues.push(pregnancy.id + ': outcome/type inconsistent at <20 weeks')
    else:
      issues.push(pregnancy.id + ': pregnancy completion status unknown')

    for child in uniqueChildren(pregnancy):
      if child.currentStatus == LIVING:
        LB += 1
      else if child.currentStatus is UNKNOWN:
        issues.push(child.id + ': current status unknown')

  return {G, P, FT, Pr, Ab, LB, issues, isComplete: issues.isEmpty()}
```

**Implementation note:** The simple algorithm intentionally **does not** invent missing data. If any record is unclassified, show an `Incomplete / Needs Clinical Review` marker beside the numerical summary instead of portraying partial subtotals as certified totals. Decide with the current team whether saving incomplete **legacy** records remains permitted; new records should use proper validation. Ongoing pregnancies should not require baby status. A newborn born deceased and a child later deceased both contribute `0` to current LB.

### Ordering and IDs

- Store **stable pregnancy IDs** for edits, audit trails and child links.
- Display `G1`, `G2`, `G3` in chronological pregnancy sequence, **not database insert order**; newest first in the UI.
- If historical records have only month/year and their order is ambiguous, preserve an existing sequence/order field or ask a user instead of fabricating exact dates.
- Adding an older pregnancy may cause displayed `G#` labels to change; this must **never change stable record IDs**.
- Keep at most one active present-pregnancy record per episode/patient unless the existing clinical model supports multiple episodes explicitly.

---

# 9. Data compatibility and minimal schema extension

**These are conceptual fields, NOT a command to create new tables.** Discover existing equivalents first and map them non-destructively.

```text
Pregnancy:
  id / stable key
  patient or maternal record FK
  episode / encounter FK (where the existing model requires it)
  pregnancy sequence / chronology
  status: ongoing, completed, unknown
  type: singleton, multiple, miscarriage, ectopic, molar
  delivery/loss month and year (no fictional day)
  place
  GA weeks + days at delivery/loss
  delivery mode (when applicable)
  CS indication stable code + display/clinical qualifiers
  intervention and surgery details (conditional)
  pregnancy remarks
  multiple type and recorded baby count (where applicable)

Present-pregnancy dating:
  LMP start / optional LMP end
  ultrasound exam date
  ultrasound GA weeks/days at exam
  derived LMP EDD and ultrasound EDD (not mandatory sources of truth)
  clinician-authorized final EDD only if the existing model provides it

Child / baby (one per baby):
  stable baby ID and pregnancy FK
  sequence within pregnancy
  name, sex, birth weight kg
  current living/deceased status
  baby remarks
```

### Required migration safety

- Prefer additive nullable columns with explicit typing and relevant indexing/FKs; migrate only if existing schema lacks the data.
- Preserve existing single-baby fields. If normalization is needed, migrate their values to the correct child record transactionally and verify one-to-one parity with original data before retiring any field (do **not** remove old fields in this task by default).
- Avoid assigning `Deceased`, `Living`, `0 weeks`, or a specific intervention to missing historical data; use explicit `unknown` / null.
- No destructive renames or mandatory backfills based on guesses.
- Respect existing audit trail, soft delete, patient authorization/permissions, API contracts, and concurrency rules.
- The summary should come from the canonical persisted records; if cached/materialized, update transactionally and reconcile after every mutation.

---

# 10. Validations and conditional-UI matrix

| Selection | Fields to show | Fields to hide/disable |
|---|---|---|
| Present Pregnancy | LMP section + ultrasound section | Completed pregnancy birth/loss fields |
| Past: Singleton | date, place, GA, delivery mode, pregnancy remarks, **one** baby | multiple-type selector, loss-intervention fields |
| Past: Multiple | date, place, GA, delivery mode, pregnancy remarks, multiple-type selector, **N** independent babies | loss-intervention fields |
| Delivery mode: Cesarean | CS indication dropdown / specify | — |
| Delivery mode: non-CS | usual delivery data | CS indication field (preserve preexisting value safely when editing) |
| Past: Miscarriage | date, place, GA, remarks, intervention (`No Intervention`, `D&C`) | ordinary delivery mode, baby information |
| Past: Molar | date, place, GA, remarks, intervention (`Suction`, `TAHMIS`) | ordinary delivery mode, baby information |
| Past: Ectopic | date, place, GA, remarks, intervention (`Medical Management`, `Surgery`) | ordinary delivery mode, baby information |
| Ectopic intervention: Surgery | surgery details free text | — |
| Multiple type: Other | user-entered number of babies and add/remove controls | fixed baby count |

- Validate exact real dates; month/year combinations should not be converted into arbitrary first-of-month delivery dates in clinical display.
- GA `days` only `0..6`; weeks nonnegative and clinically plausible. **Use warnings/review for unusual but possible gestations** instead of irreversible deletion or arbitrary cutoffs.
- LMP end date must be >= LMP start date when provided; scan date must be a valid calendar date.
- Weight is in kg, positive decimal when known; never autofill `0 kg` when unknown.
- Sex/current status selectors must preserve unknown/null legacy values without treating them as `Male` or `Living`.
- Do not silently clear user input on dropdown changes; if changing type would remove data from the active record, confirm or preserve values according to existing edit semantics.
- Field requiredness should depend on pregnancy type; do not block old records simply because new fields were introduced later.
- Prevent duplicated pregnancies/children on repeated clicks, edit/save, network retries, and optimistic refreshes.

---

# 11. Save/edit behavior and UI acceptance

- **ADD** creates or stages exactly one pregnancy record in the current workflow; if existing code defers persistence until top **SAVE**, preserve that behavior. Verify whether saving occurs per record or on final SAVE before changing anything.
- Recompute the right-side summary after each local add/edit/delete; after SAVE, recompute from the server-confirmed canonical dataset.
- Show visible validation errors and prevent contradictory records from being finalized silently.
- Preserve scrollable left panel and right pregnancy-card expansion/actions from screenshots.
- Present card shows LMP and ultrasound dates, GA and EDD in separate sections; past card shows only fields meaningful to its type; multi card lists **all** babies.
- No duplicated pregnancy when adding a baby, revisiting the page or resaving.
- User permissions, CSRF/authentication, existing confirmation dialogs and audit fields remain intact.
- No unrelated UI redesign, framework swap, route renaming, or change in downstream summary consumers.

---

# 12. Tests — minimum acceptance suite

## A. Dating unit tests (fixed `asOfDate`)

1. LMP start `2026-06-01` → EDD `2027-03-08`.
2. LMP end change alone does **not** alter GA/EDD.
3. Ultrasound `2026-08-14` at `11w1d` → EDD `2027-03-04`.
4. Correct ultrasound *current* GA using exam GA + elapsed days, not scan date as pregnancy day zero.
5. Leap-year and year rollover; hospital timezone midnight; HTML date-only parsing; no off-by-one due to UTC.
6. Future ultrasound date, invalid LMP end, missing input, week/day overflow produce validation issues rather than invented output.
7. Changing input recomputes; navigating away/back reloads original input correctly; the current GA increases as the real date advances.

## B. GP(TPAL) scenarios

| History | G | P | FT | Pr | Ab | LB |
|---|---:|---:|---:|---:|---:|---:|
| First pregnancy, ongoing | 1 | 0 | 0 | 0 | 0 | 0 |
| One previous 40w delivery, one living baby, now pregnant | 2 | 1 | 1 | 0 | 0 | 1 |
| 10w miscarriage + 40w delivery (one living) + ongoing pregnancy | 3 | 1 | 1 | 0 | 1 | 1 |
| One 38w twin delivery; 2 living | 1 | 1 | 1 | 0 | 0 | 2 |
| One 35w twin delivery; one living, one deceased | 1 | 1 | 0 | 1 | 0 | 1 |
| 8w ectopic treated by surgery | 1 | 0 | 0 | 0 | 1 | 0 |
| 12w molar treated by suction | 1 | 0 | 0 | 0 | 1 | 0 |
| 10w miscarriage + 38w twin delivery (2 living) + ongoing pregnancy | 3 | 1 | 1 | 0 | 1 | 2 |
| One 38w delivery, only child now deceased | 1 | 1 | 1 | 0 | 0 | 0 |
| One 35w stillbirth (baby deceased) | 1 | 1 | 0 | 1 | 0 | 0 |

## C. Boundary and exception tests

- `19w6d` confirmed loss → Ab; `20w0d` completed delivery → Pr; `36w6d` → Pr; `37w0d` → FT; `40w0d` → FT.
- Multiple babies do **not** increase G/P/T/Pr, but each living baby increases LB.
- Deceased status change lowers LB; does not alter G/P/T/Pr.
- Past record with unknown GA is marked **incomplete**, not automatically counted as Ab.
- Historical data with a CS indication not on the new list remains viewable/editable without losing the original label.
- Miscarriage recorded at >=20 weeks and singleton outcome recorded at <20 weeks are flagged for clinical resolution, not silently reclassified.
- Chronology and stable record IDs remain correct when an older month/year is inserted after newer records.

## D. UI/DB integration tests

- All type/condition selections show correct fields and persist through SAVE/reload/edit.
- CS indication grouped options, other/specify, and legacy option display work.
- Twins, triplets, quadruplets, Other create proper number of child records; attempted removal of populated child requires confirmation.
- ADD followed by SAVE doesn't duplicate records; navigation away from unsaved edits is handled as currently intended.
- Repeated save/retry/concurrent edit respects current application protections.
- Current permissions and audit history are not bypassed.
- Existing OB-Gyne screens outside this scope still pass their regression tests.

---

# 13. Phase B execution order — only after plan approval

1. Make small, reviewable code changes using **actual project file paths** established in Phase A.
2. Add or correct a **single** gestational-age/EDD computation path with deterministic `asOfDate` tests.
3. Extend conditional past pregnancy fields within existing form components.
4. Add the CS indication catalog using the PDF's Tables 2–7 and preserve old selections.
5. Support one-to-many child records for multiple gestation while preserving historical singleton data.
6. Replace inconsistent GP(TPAL) logic with one canonical tested derivation (or refactor existing calculation in place).
7. Apply only necessary, backward-compatible database/API changes; handle legacy unknowns safely.
8. Integrate with existing ADD/SAVE/edit/reload workflow.
9. Run tests, inspect actual screens, confirm no regressions, summarize changed files and any unresolved clinical decisions.

## Required final report after implementation

```text
A. Existing module locations actually modified
B. Files changed and justification
C. Database migration(s), safety checks and rollback instructions
D. Functional changes by screen (Present / Past / History)
E. Exact calculation rules and clinically ambiguous cases
F. Tests executed with pass/fail results (do not claim tests you didn't run)
G. Screenshots/UI comparison results
H. Known issues, missing references, questions requiring hospital sign-off
```

---

# 14. Decision register — confirm these, do not guess

For the planned implementation, explicitly surface these questions **only if the existing code, user-provided screenshots or clinical reference do not resolve them**:

1. **Approved dating precedence:** Whether the clinician selects a finalized EDD and how to record it; LMP and ultrasound derived EDD remain independent.
2. **Historical pregnancy loss classification:** The requested 20-week threshold should be approved by the clinical team for local reporting/coding workflows, including special situations (e.g., late loss, stillbirth, termination or unusual ectopic/molar history).
3. **Meaning of `TAHMIS`:** Keep exact requested label until the hospital confirms its expansion; do not invent it.
4. **Multiple gestation where fetal outcomes differ:** Existing data must be reviewed rather than forced into one undocumented assumption; source/current rules define parity per *pregnancy*, living per *baby*.
5. **Baby status unknown:** Preserve unknown; do not default it to Living or Deceased.
6. **Birth weight/sex requirements:** Respect established clinical intake rules and existing data formats.
7. **Other/Surgery detail fields:** Exact form layout is flexible, but content must not be guessed from clinical practice without an approved source.
8. **Effective use of 2026 circular for historic pregnancies:** Use the circular for the catalog, but do not retroactively invalidate earlier entries.

---

# 15. Reference checklist for Antigravity

Before Phase A, make these files visible to the Antigravity workspace or attach them in the same agent conversation:

- `ANTIGRAVITY_EXISTING_OB_GYNE_HISTORY_ENHANCEMENT.md` (this specification)
- `PC-2026-0016.pdf` (exact CS indication source)
- **Seven OB-Gyne screenshots** from the request, covering:
  - existing full Obstetric History with completed pregnancies and LMP/ultrasound sections;
  - pregnancy type dropdown;
  - Cesarean selection revealing Indication;
  - delivery mode dropdown;
  - Present Pregnancy form;
  - Past Pregnancy form with existing record; and
  - left pregnancy navigation / empty history state.

If the references are not present in the workspace, **request them instead of fabricating clinical indication data or assuming unseen UI**. Use screenshots as *layout and behavior references*, not live test data.

---

# 16. Exact first message to send Gemini in Antigravity

> Read `ANTIGRAVITY_EXISTING_OB_GYNE_HISTORY_ENHANCEMENT.md` in full and treat Section 0 as mandatory. **We ALREADY HAVE an OB-Gyne History / Obstetric History module in this HIS. You must improve the EXISTING module only; do not create a second module or redesign the application.** Locate and inspect its current source files, APIs, persistence, validations and tests. Compare the current behavior to the attached seven screenshots and `PC-2026-0016.pdf`. **Start with Phase A READ-ONLY AUDIT, a gap matrix, data compatibility plan, exact calculations and a minimal implementation plan with actual file paths. DO NOT edit any code, database schema or patient data until I approve Phase B.** Explicitly identify anything clinically ambiguous instead of guessing.

**Once Phase A is approved, send:**

> I approve Phase B as scoped in the reviewed gap analysis. Implement it incrementally **in the existing OB-Gyne History files**, maintain full compatibility with existing records, and run the test suite. Show me all changed files, tests, migrations and remaining clinical questions before claiming completion.

---

**End of specification.**
