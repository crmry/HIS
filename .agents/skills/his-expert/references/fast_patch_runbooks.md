# HIS Fast-Patch Runbooks

*Proven step-by-step blueprints for recurring clinical dashboard tasks.*

---

## Runbook 1: Transfer / Add a Module to the Requisitions Floating Drawer

Whenever the user requests moving or transferring a dashlet into the Requisitions floating drawer (or adding a new quick pad action), execute these 5 steps in order:

### Step 1: Add the Button in `#floating-req-toolkit`
Navigate to lines `~4920–4945` in `dashboard.html` (`.floating-req-items`):
```html
<button type="button" class="floating-req-item-btn" id="floating-btn-<name>" onclick="open<Name>Modal(event)" data-station="<name>" title="<Title> (<Sub>)">
  <div class="floating-req-item-info">
    <div class="floating-req-item-title"><Title></div>
    <div class="floating-req-item-sub"><Subtitle / Details></div>
  </div>
  <span class="floating-req-item-action" id="floating-<name>-action">Open</span>
</button>
```

### Step 2: Declare the Modal Markup
Navigate to the Modals section (lines `~3550–3700` in `dashboard.html`):
```html
<div class="seg-modal-backdrop" id="modal-<name>" role="dialog" aria-modal="true" aria-labelledby="modal-<name>-heading" style="display:none; z-index:2010;">
  <div class="seg-modal" style="min-width: 860px; max-width: 1080px; margin: 25px auto;">
    <div class="seg-modal-title" id="modal-<name>-heading" style="display:flex; justify-content:space-between; align-items:center; background: linear-gradient(135deg, #1b4d3e, #0e2f24); color:#fff; padding:12px 18px; border-radius:4px 4px 0 0;">
      <span style="font-weight:700; font-size:15px; display:flex; align-items:center; gap:8px;">
        <Title>
        <span id="modal-<name>-count-badge" class="badge badge-success" style="font-size:11px; padding:2px 8px; background:#10b981; color:#fff; font-weight:600;">Status</span>
      </span>
      <button type="button" class="seg-modal-close" id="close-modal-<name>" onclick="close<Name>Modal(event)" title="Close" style="color:#fff; opacity:0.85; font-size:18px; background:transparent; border:none; cursor:pointer;">✕</button>
    </div>
    <div class="seg-modal-body" style="padding:16px 20px; background:#fff; max-height:80vh; overflow-y:auto;">
      <!-- Patient Demographics Banner -->
      <div id="modal-<name>-patient-banner" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:5px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; font-size:12px;">
        <div>
          <strong style="color:#475569;">Patient:</strong> <span id="<name>-patient-name" style="font-weight:700; color:#1b4d3e;">—</span>
          &nbsp;|&nbsp; <strong style="color:#475569;">HRN:</strong> <span id="<name>-patient-hrn" style="font-family:monospace; font-weight:600;">—</span>
          &nbsp;|&nbsp; <strong style="color:#475569;">Age/Sex:</strong> <span id="<name>-patient-agesex">—</span>
        </div>
        <div>
          <span class="badge" id="<name>-encounter-badge" style="background:#1b4d3e; color:#fff; font-size:10px;">Active Encounter</span>
        </div>
      </div>
      <!-- Transferred / Custom Dashlet Content -->
      <div id="dashlet-<name>">
        ...
      </div>
    </div>
    <div style="padding:10px 18px; background:#f8fafc; border-top:1px solid #e2e8f0; border-radius:0 0 4px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:11px; color:#718096;"><i class="icon-info-sign"></i> Guidance Note</span>
      <button type="button" class="btn btn-primary" id="btn-close-modal-<name>" onclick="close<Name>Modal(event)">Close</button>
    </div>
  </div>
</div>
```

### Step 3: Implement Open & Close Controllers
Navigate to lines `~12300–12450` in `dashboard.html`:
```javascript
function open<Name>Modal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  var toolkit = document.getElementById('floating-req-toolkit');
  if (toolkit && !toolkit.classList.contains('pinned')) {
    toolkit.classList.remove('expanded');
    var arrow = document.getElementById('floating-req-toggle-arrow');
    if (arrow) arrow.textContent = '\u25C0';
  }
  var modal = document.getElementById('modal-<name>');
  if (modal) {
    var pData = currentPatientData();
    var pName = (pData ? patientName(pData) : '') || 'UNKNOWN PATIENT';
    var hrn = (pData && (pData.hrn || pData.hospital_number)) || '—';
    var age = pData && pData.birthdate ? calculateAge(pData.birthdate) : (pData && pData.age ? pData.age : '—');
    var sex = (pData && (pData.gender || pData.sex || '—')).charAt(0).toUpperCase();

    var nameEl = document.getElementById('<name>-patient-name');
    if (nameEl) nameEl.textContent = pName;
    var hrnEl = document.getElementById('<name>-patient-hrn');
    if (hrnEl) hrnEl.textContent = hrn;
    var ageSexEl = document.getElementById('<name>-patient-agesex');
    if (ageSexEl) ageSexEl.textContent = (age ? age + ' / ' : '') + (sex || '—');

    modal.classList.add('open');
    modal.style.display = 'block';
    document.body.classList.add('modal-lock');
  }
}

function close<Name>Modal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  var modal = document.getElementById('modal-<name>');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
  var otherOpen = document.querySelector('.seg-modal-backdrop.open');
  if (!otherOpen) {
    document.body.classList.remove('modal-lock');
  }
}
```

### Step 4: Wire Up Listeners & Window Exports
Export to `window` at lines `~12470`:
```javascript
window.open<Name>Modal = open<Name>Modal;
window.close<Name>Modal = close<Name>Modal;
```

---

## Runbook 2: Modifying CPOE Orders & Summaries

When modifying CPOE categories (Diet, IVF, General Orders):
1. **Locate**: Run `python .agents/skills/his-expert/scripts/locate.py "renderOrdersTable"`.
2. **Order Aggregation**: Ensure `collectOrders()` extracts the updated field schema from DOM rows.
3. **Summary Badge Coalescing**: Keep order counter updates wrapped in `scheduleOrderSummaryUpdate()` using `window.requestAnimationFrame`.

---

## Runbook 3: Modifying Medication Tables (Scheduled, Continuous, Oxygen)

When modifying columns, headers, or row inputs in the medication tables:

### 1. Locate Row Generator and Table Header in 1 Shot
Run:
```bash
python .agents/skills/his-expert/scripts/locate.py addContinuousMedRow
```
Notice:
- `addContinuousMedRow`: line `~10646` in `dashboard.html`, line `~10551` in `dashboard_er_inpatient.html`
- Table `<thead>`: line `~10775` in `dashboard.html`, line `~10680` in `dashboard_er_inpatient.html`

### 2. Apply Field & Header Edits Concurrently
Ensure the column order in `<thead>` matches `row.innerHTML` exactly:
- `Carrier Solution (Diluent)` (`<select>`)
- `Drug/s in Mixture` (`<input type="text">` with datalist)
- `Final Concentration` (`<input type="text">` with datalist)
- `Prescribed Dose & Unit` (`<input type="text">` with datalist)
- `*Infusion Rate` (`<input type="text">` with `mL/h` span)
- `Titration / Safety Instructions` (`<input type="text">` with datalist)

### 3. Synchronize Both Dashboards
Always apply matching edits to **both** `dashboard.html` and `dashboard_er_inpatient.html`.

---

## Runbook 4: Converting Select Dropdowns into Textboxes with Datalist Suggestions

When physicians request flexible typing (free text) while retaining standard options:

1. **Declare the Datalist** (in the `<datalist>` constants block around line `~10370`):
   ```javascript
   '<datalist id="med-sample-<feature>">' +
   SAMPLE_<FEATURE>.map(function (v) { return '<option value="' + esc(v) + '">'; }).join('') +
   '</datalist>' +
   ```
2. **Replace `<select>` with `<input>` in Row Builder**:
   ```javascript
   // Old: '<td><select data-medication-field="<field>">...</select></td>'
   // New:
   '<td><input type="text" data-medication-field="<field>" list="med-sample-<feature>" value="' + esc((data && data.<field>) || '') + '" placeholder="<placeholder>"></td>'
   ```
3. **Preserve Fallbacks**: Ensure legacy string/object data binds gracefully to the value attribute.
