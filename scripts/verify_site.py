#!/usr/bin/env python3
"""
HIS — Automated Headless Quality Gate
Scans all workspace HTML pages and query routes using headless Chromium DevTools Protocol (CDP).
Enforces:
- 0 JavaScript runtime exceptions (SyntaxError, ReferenceError, TypeError)
- 0 Console errors
- 0 Network 404s
"""

import asyncio
import glob
import json
import os
import subprocess
import sys
import time
import urllib.request
import websockets

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Locate Chromium installed via Playwright / ms-playwright
POSSIBLE_CHROME_PATHS = [
    # Windows paths
    os.path.expandvars(r"%LOCALAPPDATA%\ms-playwright\chromium-1200\chrome-win64\chrome.exe"),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    # macOS paths
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    os.path.expanduser("~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    os.path.expanduser("~/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"),
    os.path.expanduser("~/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"),
]

CHROME_PATH = None
for p in POSSIBLE_CHROME_PATHS:
    if os.path.exists(p):
        CHROME_PATH = p
        break

if not CHROME_PATH:
    # Search in ms-playwright recursively
    ms_play = os.path.expandvars(r"%LOCALAPPDATA%\ms-playwright")
    if os.path.exists(ms_play):
        for root, _, files in os.walk(ms_play):
            if "chrome.exe" in files:
                CHROME_PATH = os.path.join(root, "chrome.exe")
                break

if not CHROME_PATH:
    print("[ERROR] Could not locate a valid Chromium or Chrome executable.")
    sys.exit(1)

async def robust_ws_connect(url, retries=5, delay=0.5):
    for i in range(retries):
        try:
            return await websockets.connect(url)
        except (ConnectionRefusedError, OSError):
            if i < retries - 1:
                await asyncio.sleep(delay)
            else:
                raise

async def scan_single_target(browser_ws, file_url):
    b_ws = await robust_ws_connect(browser_ws)
    async with b_ws:
        msg_id = 1
        create_msg = {"id": msg_id, "method": "Target.createTarget", "params": {"url": "about:blank"}}
        await b_ws.send(json.dumps(create_msg))
        resp = json.loads(await b_ws.recv())
        target_id = resp["result"]["targetId"]

    target_ws = f"ws://127.0.0.1:9222/devtools/page/{target_id}"
    errors = []

    p_ws = await robust_ws_connect(target_ws)
    async with p_ws:
        p_id = 1
        async def send(method, params=None):
            nonlocal p_id
            m = {"id": p_id, "method": method, "params": params or {}}
            p_id += 1
            await p_ws.send(json.dumps(m))
            return m["id"]

        await send("Page.enable")
        await send("Runtime.enable")
        await send("Log.enable")
        await send("Network.enable")

        await send("Page.navigate", {"url": file_url})

        loaded = False
        t0 = time.time()
        while time.time() - t0 < 3.0:
            try:
                raw = await asyncio.wait_for(p_ws.recv(), timeout=0.2)
                msg = json.loads(raw)
                method = msg.get("method", "")
                params = msg.get("params", {})

                if method == "Page.loadEventFired":
                    loaded = True
                elif method == "Runtime.exceptionThrown":
                    details = params.get("exceptionDetails", {})
                    text = details.get("text", "")
                    ex = details.get("exception", {}).get("description", "")
                    line = details.get("lineNumber", 0)
                    col = details.get("columnNumber", 0)
                    errors.append(f"Runtime Exception: {text} {ex} (line {line}:{col})")
                elif method == "Log.entryAdded":
                    entry = params.get("entry", {})
                    if entry.get("level") == "error":
                        errors.append(f"Log Error: {entry.get('text')}")
                elif method == "Network.responseReceived":
                    res = params.get("response", {})
                    status = res.get("status", 200)
                    if status >= 400:
                        errors.append(f"HTTP {status}: {res.get('url')}")
                elif method == "Runtime.consoleAPICalled":
                    t = params.get("type")
                    args = " ".join([str(a.get("value", a.get("description", ""))) for a in params.get("args", [])])
                    if t in ("error", "assert"):
                        errors.append(f"Console {t}: {args}")
            except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                if loaded and time.time() - t0 > 1.0:
                    break

        # Interactive component smoke tests for dashboard/updated pages
        if any(p in file_url for p in ("dashboard.html", "dashboard_er_inpatient.html")):
            smoke_js = """
            (async () => {
                const isDashboardPage = window.location.href.includes('dashboard.html') || window.location.href.includes('dashboard_er_inpatient.html');
                let toolkit = document.getElementById('floating-req-toolkit');
                const t0 = Date.now();
                while (!toolkit && Date.now() - t0 < 3000) {
                    await new Promise(r => setTimeout(r, 50));
                    toolkit = document.getElementById('floating-req-toolkit');
                }
                if (!toolkit) return 'No toolkit element found';
                const handle = document.getElementById('floating-req-handle');
                if (!handle) return 'No handle found';
                handle.click();
                if (!toolkit.classList.contains('expanded')) return 'Handle click did not expand toolkit';
                
                // Test all 5 clinical station buttons and their close buttons
                const rxBtn = document.getElementById('floating-btn-rx');
                if (!rxBtn) return 'Button floating-btn-rx not found';
                rxBtn.click();
                const rxModal = document.getElementById('rx-writer-modal');
                if (!rxModal || window.getComputedStyle(rxModal).display === 'none') return 'Rx writer modal failed to open';
                const rxCloseBtn = document.getElementById('close-rx-writer-modal');
                if (!rxCloseBtn) return 'Close button close-rx-writer-modal not found';
                rxCloseBtn.click();
                if (window.getComputedStyle(rxModal).display !== 'none' || rxModal.classList.contains('open')) return 'Rx writer modal failed to close via close button';

                // Test Examination Result modal & close button
                const resBtn = document.getElementById('floating-btn-results') || document.getElementById('floating-btn-exam');
                if (!resBtn) return 'Button floating-btn-results not found in hovering toolkit';
                resBtn.click();
                const resModal = document.getElementById('viewable-results-modal');
                if (!resModal || window.getComputedStyle(resModal).display === 'none') return 'Examination result modal failed to open';

                // Test date range & scope filter controls in Examination Result modal
                const resScopeSelect = document.getElementById('viewable-results-scope');
                if (!resScopeSelect) return 'Scope select viewable-results-scope not found';
                const resDateFrom = document.getElementById('viewable-results-date-from');
                const resDateTo = document.getElementById('viewable-results-date-to');
                if (!resDateFrom || !resDateTo) return 'Date range inputs for examination results not found';
                const resResetBtn = document.getElementById('btn-results-reset-dates');
                if (!resResetBtn) return 'Reset button btn-results-reset-dates not found';

                // Test switching scope to current encounter
                resScopeSelect.value = 'current';
                resScopeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                // Test reset button
                resResetBtn.click();

                const resCloseBtn = document.getElementById('close-viewable-results-modal');
                if (!resCloseBtn) return 'Close button close-viewable-results-modal not found';
                resCloseBtn.click();
                if (window.getComputedStyle(resModal).display !== 'none' || resModal.classList.contains('open')) return 'Examination result modal failed to close via close button';

                // Test Escape key dismissal on Examination Result modal
                resBtn.click();
                if (window.getComputedStyle(resModal).display === 'none') return 'Examination result modal failed to reopen';
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                if (window.getComputedStyle(resModal).display !== 'none' || resModal.classList.contains('open')) return 'Examination result modal failed to close via Escape key';

                // Test Referral / Co-Manage modal & close button
                const refBtn = document.getElementById('floating-btn-referral');
                if (!refBtn) return 'Button floating-btn-referral not found in floating requisition toolkit';
                refBtn.click();
                const refModal = document.getElementById('modal-referral-comanage');
                if (!refModal || window.getComputedStyle(refModal).display === 'none') return 'Referral modal failed to open';

                // Verify referral table and inputs exist inside the modal
                const refRows = document.getElementById('referral-rows');
                if (!refRows) return 'referral-rows not found in referral modal';
                const refDoc = document.getElementById('referral-doctor');
                const refDept = document.getElementById('referral-department');
                const refReason = document.getElementById('referral-reason');
                if (!refDoc || !refDept || !refReason) return 'Referral inputs not found in modal';

                const refCloseBtn = document.getElementById('close-modal-referral-comanage');
                if (!refCloseBtn) return 'Close button close-modal-referral-comanage not found';
                refCloseBtn.click();
                if (window.getComputedStyle(refModal).display !== 'none' || refModal.classList.contains('open')) return 'Referral modal failed to close via close button';

                // Test Escape key dismissal on Referral modal
                refBtn.click();
                if (window.getComputedStyle(refModal).display === 'none') return 'Referral modal failed to reopen';
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                if (window.getComputedStyle(refModal).display !== 'none' || refModal.classList.contains('open')) return 'Referral modal failed to close via Escape key';

                // Verify AMS Restricted Antibiotic button in toolkit
                const amsBtn = document.getElementById('floating-btn-ams');
                if (!amsBtn) return 'Button floating-btn-ams not found in floating requisition toolkit';
                if (typeof window.openAmsFormFromToolkit !== 'function') return 'window.openAmsFormFromToolkit is not defined';

                // Verify Referral dashlet was transferred from main dashboard body
                const mainReferralDashlet = document.querySelector('.container-fluid > .row-fluid .care-referral');
                if (mainReferralDashlet) return 'care-referral should be transferred from main dashboard body';

                // Test CPOE Clinical Request modal via Doctor\'s Orders section
                const cpoeReqBtn = document.getElementById('open-request-modal');
                if (cpoeReqBtn) {
                    cpoeReqBtn.click();
                    const clModal = document.getElementById('clinical-request-modal');
                    if (!clModal || window.getComputedStyle(clModal).display === 'none') return 'Clinical request modal failed to open from CPOE';
                    const clCloseBtn = document.getElementById('close-request-modal');
                    if (clCloseBtn) clCloseBtn.click();
                    if (window.getComputedStyle(clModal).display !== 'none' || clModal.classList.contains('open')) return 'Clinical modal failed to close via close button';
                }

                // Verify Examination Result dashlet was transferred from main dashboard body
                const mainResultRow = document.getElementById('row-viewable-results');
                if (mainResultRow) return 'row-viewable-results should be transferred from main dashboard body';

                // Test pin toggle
                const pinBtn = document.getElementById('floating-req-pin-btn');
                if (pinBtn) {
                    pinBtn.click();
                    if (!toolkit.classList.contains('pinned')) return 'Pin button failed to pin toolkit';
                    pinBtn.click();
                }

                // Test toolkit close button
                const tkCloseBtn = document.getElementById('floating-req-close-btn');
                if (tkCloseBtn) {
                    tkCloseBtn.click();
                    if (toolkit.classList.contains('expanded') || toolkit.classList.contains('pinned')) return 'Toolkit close button failed to collapse toolkit';
                }

                // Test click-outside collapse on floating requisition toolkit
                handle.click();
                if (!toolkit.classList.contains('expanded')) return 'Handle failed to reopen toolkit for outside-click test';
                document.body.click();
                if (toolkit.classList.contains('expanded')) return 'Click outside failed to collapse floating toolkit';

                // Test Medical History Encounter Registry Filters (ALL/IP/OP/ER)
                const ipFilterBtn = document.querySelector('.btn-hx-filter[data-filter="IP"]');
                const allFilterBtn = document.querySelector('.btn-hx-filter[data-filter="ALL"]');
                const erFilterBtn = document.querySelector('.btn-hx-filter[data-filter="ER"]');
                const opFilterBtn = document.querySelector('.btn-hx-filter[data-filter="OP"]');
                if (ipFilterBtn && allFilterBtn && erFilterBtn && opFilterBtn) {
                    ipFilterBtn.click();
                    if (window.currentHxFilter !== 'IP') return 'Clicking IP filter did not update currentHxFilter';
                    erFilterBtn.click();
                    if (window.currentHxFilter !== 'ER') return 'Clicking ER filter did not update currentHxFilter';
                    opFilterBtn.click();
                    if (window.currentHxFilter !== 'OP') return 'Clicking OP filter did not update currentHxFilter';
                    allFilterBtn.click();
                    if (window.currentHxFilter !== 'ALL') return 'Clicking ALL filter did not update currentHxFilter';
                }

                // Test Patient Encounter Date Filter Controls & Direct From/To Inputs
                const encDateSel = document.getElementById('encounter-date-filter');
                const encDateFrom = document.getElementById('encounter-date-from');
                const encDateTo = document.getElementById('encounter-date-to');
                const btnClearDate = document.getElementById('btn-clear-date-filter');

                if (encDateFrom && encDateTo && btnClearDate) {
                    encDateFrom.value = '2026-09-01';
                    encDateFrom.dispatchEvent(new Event('change'));
                    encDateTo.value = '2026-09-26';
                    encDateTo.dispatchEvent(new Event('change'));
                    if (window.activeEncounterDateFilter !== 'custom') return 'Direct date range input did not set activeEncounterDateFilter to custom';
                    if (window.customEncounterDateFrom !== '2026-09-01' || window.customEncounterDateTo !== '2026-09-26') return 'Date range values not stored in window state';

                    btnClearDate.click();
                    if (encDateFrom.value !== '' || encDateTo.value !== '') return 'Reset button did not clear From/To date inputs';
                    if (window.activeEncounterDateFilter !== 'all') return 'Reset button did not restore activeEncounterDateFilter to all';
                }

                if (encDateSel) {
                    encDateSel.value = 'year-2026';
                    encDateSel.dispatchEvent(new Event('change'));
                    if (window.activeEncounterDateFilter !== 'year-2026') return 'Changing encounter date filter did not update activeEncounterDateFilter';
                    if (encDateFrom && encDateFrom.value !== '2026-01-01') return 'Preset year-2026 did not populate From input';
                    if (encDateTo && encDateTo.value !== '2026-12-31') return 'Preset year-2026 did not populate To input';
                    encDateSel.value = 'all';
                    encDateSel.dispatchEvent(new Event('change'));
                    if (window.activeEncounterDateFilter !== 'all') return 'Resetting encounter date filter did not restore all';
                    if (encDateFrom && encDateFrom.value !== '') return 'Resetting encounter date filter did not clear From input';
                }

                // Test Medical History Accordion Card Toggling (Individual Headers)
                const firstCardHdr = document.querySelector('.encounter-hx-header');
                if (firstCardHdr) {
                    const card = firstCardHdr.closest('.encounter-hx-card');
                    firstCardHdr.click();
                    if (!card.classList.contains('collapsed')) return 'Clicking card header did not collapse card';
                    firstCardHdr.click();
                    if (card.classList.contains('collapsed')) return 'Clicking card header again did not expand card';
                }

                // Test Pagination Page Size Input Control & Navigation
                const sizeInput = document.querySelector('.hx-page-size-input');
                if (sizeInput) {
                    if (sizeInput.value !== '2') return 'Default page size input should be 2';
                    sizeInput.value = '3';
                    sizeInput.onchange();
                    if (window.hxPageSizes['hx-present-timeline'] !== 3) return 'Changing page size input did not update hxPageSizes';
                    sizeInput.value = '2';
                    sizeInput.onchange();
                }

                // Test Obstetric & Gynecologic History viewable summary in Medical History
                const obTabLi = document.getElementById('tab-li-hx-gyn');
                const isObTabHidden = obTabLi && obTabLi.style.display === 'none';
                if (!isObTabHidden) {
                    const obTabLink = document.querySelector('a[href="#hx-gyn"]');
                    if (obTabLink) {
                        obTabLink.click();
                        const obViewContainer = document.getElementById('ob-view-container');
                        if (!obViewContainer) return 'OB view container not found in #hx-gyn';
                        const scoreEl = document.getElementById('ob-view-score-main');
                        if (!scoreEl || !scoreEl.textContent.trim()) return 'OB view score element empty or missing';
                        const obAddBtn = document.getElementById('btn-add-ob-record');
                        if (obAddBtn) return 'OB Add button (#btn-add-ob-record) should not be present in view-only #hx-gyn dashboard';
                    }
                } else if (window.location.href.includes('patient=patient_er_juan')) {
                    if (obTabLi.style.display !== 'none') {
                        return 'OB-Gyne tab was not hidden for male patient Juan Makiling';
                    }
                }

                // Test Personal & Social History (HEADS Assessment)
                if (isDashboardPage) {
                    const socTabLink = document.querySelector('a[href="#hx-social"]');
                    if (!socTabLink) return 'Social history tab link a[href="#hx-social"] missing';
                    socTabLink.click();
                    const headsGridView = document.getElementById('heads-grid-view');
                    if (!headsGridView) return 'heads-grid-view container missing in #hx-social';
                    const headsContainer = headsGridView.querySelector('.heads-grid-container');
                    if (!headsContainer) return '.heads-grid-container missing in heads-grid-view';
                    const compStyle = window.getComputedStyle(headsContainer);
                    if (compStyle.flexDirection !== 'column' && compStyle.display !== 'flex') {
                        return 'heads-grid-container should use full-width flex column layout matching progress notes';
                    }
                    const headsFields = ['hx_social_home', 'hx_social_education_employment', 'hx_social_activities', 'hx_social_drugs', 'hx_social_sexuality', 'hx_social_suicide_mood'];
                    for (let hf of headsFields) {
                        const el = document.getElementById(hf);
                        if (!el) return 'HEADS field #' + hf + ' missing in #hx-social';
                    }
                    const btnNarrative = document.getElementById('btn-view-heads-narrative');
                    const btnGrid = document.getElementById('btn-view-heads-grid');
                    if (!btnNarrative || !btnGrid) return 'HEADS view toggle buttons missing';
                    btnNarrative.click();
                    const narrativeView = document.getElementById('heads-narrative-view');
                    if (!narrativeView || narrativeView.style.display === 'none') return 'heads-narrative-view not displayed after toggle';
                    btnGrid.click();
                    if (!headsGridView || headsGridView.style.display === 'none') return 'heads-grid-view not displayed after toggle';
                    if (typeof window.applyHeadsChip !== 'function') return 'applyHeadsChip function not exposed on window';
                    if (typeof window.syncHeadsToSocialSummary !== 'function') return 'syncHeadsToSocialSummary function not exposed on window';
                }

                // Test Specialized Clinical Forms unified launcher list
                if (isDashboardPage) {
                    const dashletForms = document.getElementById('dashlet-specialized-forms');
                    if (!dashletForms) return 'dashlet-specialized-forms not found';
                    const obModBtn = document.getElementById('btn-open-obgyne-module');
                    const neoModBtn = document.getElementById('btn-open-neonate-module');
                    const growthBtn = document.getElementById('btn-open-growth-chart');
                    if (!obModBtn) return 'btn-open-obgyne-module missing in specialized forms';
                    if (!neoModBtn) return 'btn-open-neonate-module missing in specialized forms';
                    if (!growthBtn) return 'btn-open-growth-chart missing in specialized forms';
                    if (!growthBtn.getAttribute('onclick') || !growthBtn.getAttribute('onclick').includes('openGrowthChartsModule')) return 'btn-open-growth-chart onclick should be openGrowthChartsModule';
                    if (typeof window.openGrowthChartsModule !== 'function') return 'openGrowthChartsModule is not defined on window';
                    const tannerBtn = document.getElementById('btn-open-tanner-staging');
                    if (tannerBtn) return 'btn-open-tanner-staging should be removed from specialized forms (consolidated into Growth Chart)';
                    const ropSpecialBtn = document.getElementById('btn-open-rop-screening');
                    if (ropSpecialBtn) return 'btn-open-rop-screening should not be present in specialized forms dashlet';
                }
                const openModBtn = document.getElementById('btn-open-obgyne-module');
                if (openModBtn) {
                    openModBtn.click();
                    const modModal = document.getElementById('clinical-module-action-modal');
                    if (!modModal || window.getComputedStyle(modModal).display === 'none') return 'Clinical module action modal failed to open';
                    const closeModBtn = document.getElementById('close-mod-modal');
                    if (closeModBtn) closeModBtn.click();
                    if (window.getComputedStyle(modModal).display !== 'none' && modModal.classList.contains('open')) return 'Clinical module action modal failed to close';
                }

                // Test PMH Interviewed Medications Encoder Modal & Table
                const btnAddIntMed = document.getElementById('btn-add-interview-med');
                if (btnAddIntMed) {
                    btnAddIntMed.click();
                    const intModal = document.getElementById('modal-interview-med');
                    if (!intModal || window.getComputedStyle(intModal).display === 'none') return 'Interview Medication modal failed to open upon clicking #btn-add-interview-med';
                    const btnCloseIntMed = document.getElementById('btn-close-interview-med');
                    if (btnCloseIntMed) btnCloseIntMed.click();
                    if (window.getComputedStyle(intModal).display !== 'none' && intModal.classList.contains('open')) return 'Interview Medication modal failed to close upon clicking #btn-close-interview-med';
                }

                // Verify ER and Inpatient Progress Notes (SOA) vs OPD HPI/ROS/PE documentation behavior
                if (isDashboardPage) {
                    const pnRow = document.getElementById('row-progress-notes');
                    const pnDashlet = document.getElementById('dashlet-progress-notes');
                    if (!pnRow || !pnDashlet) {
                        return 'Progress Notes dashlet or row missing in dashboard.html';
                    }
                    if (typeof window.parseStructuredProgressNotes !== 'function') {
                        return 'parseStructuredProgressNotes not defined on window in dashboard.html';
                    }
                    const parsedSample = window.parseStructuredProgressNotes('Subjective: Interval fever\n\nObjective: Temp 38.5 C\n\nAssessment: CAP moderate risk');
                    if (parsedSample.subjective !== 'Interval fever' || parsedSample.objective !== 'Temp 38.5 C' || parsedSample.assessment !== 'CAP moderate risk') {
                        return 'parseStructuredProgressNotes failed structured sample test';
                    }
                    if (typeof window.getEncounterProgressNotes !== 'function') {
                        return 'getEncounterProgressNotes not defined on window in dashboard.html';
                    }
                    if (typeof window.syncEncounterDocumentationSections !== 'function') {
                        return 'syncEncounterDocumentationSections not defined on window in dashboard.html';
                    }

                    // Verify Review of Systems and Physical Examination independent dashlets
                    const rosDashlet = document.getElementById('dashlet-review-of-systems');
                    if (!rosDashlet) {
                        return 'dashlet-review-of-systems independent dashlet missing in dashboard.html';
                    }
                    const peDashlet = document.getElementById('dashlet-physical-exam');
                    if (!peDashlet) {
                        return 'dashlet-physical-exam independent dashlet missing in dashboard.html';
                    }
                    if (rosDashlet.classList.contains('is-collapsed')) {
                        return 'dashlet-review-of-systems should be open/maximized by default';
                    }
                    if (peDashlet.classList.contains('is-collapsed')) {
                        return 'dashlet-physical-exam should be open/maximized by default';
                    }

                    const rosRow = document.getElementById('row-review-of-systems');
                    const peRow = document.getElementById('row-physical-exam');
                    const hpiTabLi = document.getElementById('tab-li-hx-present');
                    if (pnRow.style.display === 'none') {
                        return 'Progress Notes row should be visible on OPD encounters';
                    }
                    if (rosRow && rosRow.style.display === 'none') {
                        return 'Review of Systems should be visible on OPD encounters';
                    }
                    if (peRow && peRow.style.display === 'none') {
                        return 'Physical Exam should be visible on OPD encounters';
                    }

                    // Test collapsible behavior of Progress Notes dashlet
                    const pnToggle = pnDashlet.querySelector('.dashlet-toggle');
                    if (!pnToggle) {
                        return 'dashlet-progress-notes toggle button missing';
                    }
                    const wasCollapsed = pnDashlet.classList.contains('is-collapsed');
                    pnToggle.click();
                    if (pnDashlet.classList.contains('is-collapsed') === wasCollapsed) {
                        return 'dashlet-progress-notes toggle failed to switch is-collapsed state';
                    }
                    pnToggle.click(); // restore state

                    // Test switching to an ER encounter
                    const erTestEnc = {
                        registry_type: 'ER',
                        progress_notes_subjective: 'Acute onset epigastric pain',
                        progress_notes_objective: 'BP 130/80, tenderness epigastrium',
                        progress_notes_assessment: 'Acute Gastritis vs Peptic Ulcer Disease'
                    };
                    window.syncEncounterDocumentationSections(erTestEnc, true);
                    if (pnRow.style.display === 'none') {
                        return 'Progress Notes row should be visible on ER encounters';
                    }
                    const elSubj = document.getElementById('progress_notes_subjective');
                    const elObj = document.getElementById('progress_notes_objective');
                    const elAss = document.getElementById('progress_notes_assessment');
                    const sVal = (elSubj && (elSubj.value || elSubj.textContent)) || '';
                    const oVal = (elObj && (elObj.value || elObj.textContent)) || '';
                    const aVal = (elAss && (elAss.value || elAss.textContent)) || '';
                    if (!sVal || !sVal.includes('Acute onset epigastric pain')) {
                        return 'Progress notes subjective not populated correctly for ER encounter';
                    }
                    if (!oVal || !oVal.includes('BP 130/80')) {
                        return 'Progress notes objective not populated correctly for ER encounter';
                    }
                    if (!aVal || !aVal.includes('Acute Gastritis')) {
                        return 'Progress notes assessment not populated correctly for ER encounter';
                    }
                    if (rosRow && rosRow.style.display === 'none') {
                        return 'Review of Systems should remain visible on ER encounters as generic clinical requirement';
                    }
                    if (peRow && peRow.style.display === 'none') {
                        return 'Physical Exam should remain visible on ER encounters as generic clinical requirement';
                    }
                    if (hpiTabLi && hpiTabLi.style.display === 'none') {
                        return 'HPI tab should be visible on ER encounters';
                    }

                    // Test restoring back to OPD encounter
                    const opdTestEnc = {
                        registry_type: 'OP',
                        hx_present: 'Routine follow-up'
                    };
                    window.syncEncounterDocumentationSections(opdTestEnc, false);
                    if (pnRow.style.display === 'none') {
                        return 'Progress Notes row should remain visible when restored to OPD';
                    }
                    if (rosRow && rosRow.style.display === 'none') {
                        return 'Review of Systems should be restored on OPD';
                    }
                    if (peRow && peRow.style.display === 'none') {
                        return 'Physical Exam should be restored on OPD';
                    }
                    if (hpiTabLi && hpiTabLi.style.display === 'none') {
                        return 'HPI tab should be restored on OPD';
                    }

                    // Test Doctors' Order Pairing & Co-Signature Workflow
                    const saveOrdersBtn = document.getElementById('save-orders-btn');
                    const cosigModal = document.getElementById('modal-order-cosignature');
                    const cosigSelect = document.getElementById('cosig-doctor-select');

                    if (!saveOrdersBtn || !cosigModal || !cosigSelect) {
                        return 'Doctors order co-signature modal elements missing on dashboard.html';
                    }

                    // Verify save-orders-btn sits outside collapsible dashlet container
                    const ordersDashlet = document.getElementById('dashlet-physician-orders');
                    if (ordersDashlet && ordersDashlet.contains(saveOrdersBtn)) {
                        return 'save-orders-btn should be outside collapsible orders dashlet';
                    }

                    // Test 1: Clicking Save Orders opens the pairing modal
                    saveOrdersBtn.click();
                    if (!cosigModal.classList.contains('open')) {
                        return 'Clicking save-orders-btn did not open modal-order-cosignature';
                    }

                    // Test 2: Default selection MUST be NONE
                    if (cosigSelect.value !== 'NONE') {
                        return 'Default selection in cosig-doctor-select is not NONE';
                    }

                    // Test 3: Closing modal without selection
                    const btnCancelCosig = document.getElementById('btn-cancel-cosig');
                    if (btnCancelCosig) btnCancelCosig.click();
                    if (cosigModal.classList.contains('open')) {
                        return 'Cancel button failed to close modal-order-cosignature';
                    }

                    // Test 4: Open and select a paired doctor (Dr. Maria Santos)
                    if (typeof window.openOrderCosignatureModal === 'function') {
                        window.openOrderCosignatureModal();

                        // Test 4a: Live Search-as-you-type filtering & auto-selection
                        const cosigSearch = document.getElementById('cosig-doctor-search');
                        if (cosigSearch) {
                            cosigSearch.value = 'Mahin';
                            cosigSearch.dispatchEvent(new Event('input'));
                            if (cosigSelect.options.length !== 2) {
                                return 'Typing Mahin in cosig-doctor-search did not filter to 2 matching physicians';
                            }
                            if (cosigSelect.value !== 'mahinay_arthur') {
                                return 'Typing Mahin in cosig-doctor-search did not auto-select first matching physician';
                            }
                            const prevTitle = document.getElementById('cosig-preview-title');
                            if (!prevTitle || !prevTitle.textContent.includes('Mahinay, Arthur') || !prevTitle.textContent.includes('Pulmonary Medicine')) {
                                return 'Auto-selection of physician did not update selection preview with doctor name and department';
                            }
                            const clearSearchBtn = document.getElementById('btn-clear-cosig-search');
                            if (clearSearchBtn) clearSearchBtn.click();
                            if (cosigSelect.options.length < 5) {
                                return 'Clearing search input did not restore physician directory options';
                            }
                        }

                        cosigSelect.value = 'santos_maria';
                        cosigSelect.dispatchEvent(new Event('change'));
                        const btnConfirmSave = document.getElementById('btn-confirm-save-cosig');
                        if (btnConfirmSave) {
                            btnConfirmSave.click();
                        } else if (typeof window.confirmAndSaveOrderWithCosignature === 'function') {
                            window.confirmAndSaveOrderWithCosignature();
                        }

                        if (!window.activeOrderCoSignature || window.activeOrderCoSignature.status !== 'PENDING') {
                            return 'Selecting paired doctor did not set activeOrderCoSignature to PENDING';
                        }
                        // Verify co-signature status banner is NOT rendered on dashboard (handled in doctor orders)
                        const cosigBanner = document.getElementById('orders-cosig-status-banner');
                        if (cosigBanner && window.getComputedStyle(cosigBanner).display !== 'none' && cosigBanner.innerHTML.trim() !== '') {
                            return 'Co-signature status banner should not be displayed on dashboard';
                        }
                    }

                    // Verify CPOE Medication row removal and addition without auto-resurrection
                    const schedBody = document.querySelector('[data-medication-list="scheduled"]');
                    if (schedBody) {
                        const firstRmBtn = schedBody.querySelector('.rm-medication');
                        if (firstRmBtn && window.getComputedStyle(firstRmBtn).display !== 'none') {
                            const initialCount = schedBody.children.length;
                            firstRmBtn.click();
                            if (schedBody.children.length >= initialCount) {
                                return 'Clicking rm-medication failed to remove row or auto-resurrected row';
                            }
                            const addMedBtn = document.querySelector('button[data-add-med="scheduled"]');
                            if (addMedBtn && window.getComputedStyle(addMedBtn).display !== 'none') {
                                addMedBtn.click();
                                if (schedBody.children.length !== initialCount) {
                                    return 'Clicking data-add-med="scheduled" failed to re-add medication row';
                                }
                            }
                        }
                    }

                    // Verify End Patient Care Pairing / Co-Signature Modal on Dashboard pages
                    const endCareCosigModal = document.getElementById('modal-end-care-cosignature');
                    const endCareCosigSelect = document.getElementById('endcare-cosig-doctor-select');
                    if (!endCareCosigModal || !endCareCosigSelect) {
                        return 'modal-end-care-cosignature or endcare-cosig-doctor-select missing on dashboard';
                    }
                    if (typeof window.openEndCareCosignatureModal !== 'function' || typeof window.closeEndCareCosignatureModal !== 'function') {
                        return 'End Patient Care co-signature modal functions not exported on window';
                    }
                    window.openEndCareCosignatureModal();
                    if (!endCareCosigModal.classList.contains('open')) {
                        return 'openEndCareCosignatureModal failed to open modal-end-care-cosignature';
                    }
                    if (endCareCosigSelect.value !== 'NONE') {
                        return 'Default selection in endcare-cosig-doctor-select is not NONE';
                    }
                    window.closeEndCareCosignatureModal(null, false);
                    if (endCareCosigModal.classList.contains('open') && window.getComputedStyle(endCareCosigModal).display !== 'none') {
                        return 'closeEndCareCosignatureModal failed to close modal';
                    }

                    // Verify embedded Co-Signature section inside end-care-modal
                    const endCareModal = document.getElementById('end-care-modal');
                    const embeddedCosigSelect = document.getElementById('endcare-modal-cosig-select');
                    const embeddedCosigSearch = document.getElementById('endcare-modal-cosig-search');
                    if (!endCareModal || !embeddedCosigSelect || !embeddedCosigSearch) {
                        return 'Embedded co-signature section elements missing inside end-care-modal';
                    }
                    if (typeof window.openEndCareModal === 'function') {
                        window.openEndCareModal();
                        if (embeddedCosigSelect.value !== 'NONE') {
                            return 'Default selection in embedded endcare-modal-cosig-select is not NONE';
                        }
                        if (typeof window.closeEndCareModal === 'function') {
                            window.closeEndCareModal();
                        }
                    }

                    // Verify Summary of Medications 10-column layout aligned with Rx Writer
                    const medTable = document.getElementById('med-summary-table');
                    if (medTable) {
                        const ths = Array.from(medTable.querySelectorAll('thead th')).map(th => th.textContent.trim());
                        const expectedHeaders = ['Drug name', 'Quantity', 'Dosage', 'Frequency', 'Timing', 'Period', 'Duration', 'Date Started', 'Remarks', 'Doctor'];
                        if (ths.length !== 10 || !expectedHeaders.every((h, i) => ths[i] === h)) {
                            return 'med-summary-table headers do not match expected 10-column Rx Writer schema: ' + ths.join(', ');
                        }

                        // Test Anti-Microbial Medicines tab filter
                        const amBtn = document.querySelector('#meds-filter-group button[data-filter="antimicrobial"]');
                        if (amBtn) {
                            amBtn.click();
                            const amThs = Array.from(medTable.querySelectorAll('thead th')).map(th => th.textContent.trim());
                            const expectedAmHeaders = ['Drug name', 'Quantity', 'Dosage', 'Frequency', 'Timing', 'Period', 'Duration', 'First Dose Date&Time', '7th Day Review Date&Time', 'Actual Last Dose Date&Time', 'Remarks', 'Doctor'];
                            if (amThs.length !== 12 || !expectedAmHeaders.every((h, i) => amThs[i] === h)) {
                                return 'Anti-microbial medicines table headers do not match expected 12-column schema: ' + amThs.join(', ');
                            }
                            const rows = document.getElementById('med-summary-rows');
                            if (!rows) return 'med-summary-rows element missing';
                            // Restore 'all' filter
                            const allBtn = document.querySelector('#meds-filter-group button[data-filter="all"]');
                            if (allBtn) {
                                allBtn.click();
                                const restoredThs = Array.from(medTable.querySelectorAll('thead th')).map(th => th.textContent.trim());
                                if (restoredThs.length !== 10 || !expectedHeaders.every((h, i) => restoredThs[i] === h)) {
                                    return 'med-summary-table headers failed to restore to standard 10-column schema: ' + restoredThs.join(', ');
                                }
                            }
                        }

                        // Verify that Doctor column never displays generic 'Attending Physician' placeholder
                        const docCells = Array.from(document.querySelectorAll('#med-summary-rows tr td:nth-child(10)'));
                        for (const cell of docCells) {
                            if (/attending\\s*physician/i.test(cell.textContent.trim())) {
                                return 'Summary of medications doctor column contains generic Attending Physician placeholder: ' + cell.textContent.trim();
                            }
                        }

                        // Verify that Drug name column never displays [SCHEDULED] or bracketed prefix tags
                        const drugCells = Array.from(document.querySelectorAll('#med-summary-rows tr td:first-child'));
                        for (const cell of drugCells) {
                            if (/\\[(?:SCHEDULED|CONTINUOUS INFUSION|OXYGEN THERAPY)\\]/i.test(cell.textContent.trim())) {
                                return 'Summary of medications Drug name column contains bracketed order prefix: ' + cell.textContent.trim();
                            }
                        }
                    }
                }

                if (window.location.href.includes('doctors_order_patient.html')) {
                    if (typeof window.getEncounterProgressNotes !== 'function') {
                        return 'getEncounterProgressNotes not defined on window in doctors_order_patient.html';
                    }
                    if (typeof window.approveSheetOrderCoSignature !== 'function') {
                        return 'approveSheetOrderCoSignature not defined on window in doctors_order_patient.html';
                    }
                    const sheetCosigSelect = document.getElementById('sheet-enc-cosig-doctor');
                    if (!sheetCosigSelect) {
                        return 'sheet-enc-cosig-doctor element missing in doctors_order_patient.html';
                    }
                    if (sheetCosigSelect.value !== 'NONE') {
                        return 'sheet-enc-cosig-doctor default value is not NONE';
                    }
                    const btnToEnd = document.getElementById('btn-move-to-end');
                    const btnToTop = document.getElementById('btn-move-to-top');
                    if (!btnToEnd || !btnToTop) {
                        return 'doctors_order_patient.html quick nav move to end/top buttons missing';
                    }
                    if (typeof window.scrollToSheetEnd !== 'function' || typeof window.scrollToSheetTop !== 'function') {
                        return 'doctors_order_patient.html scrollToSheetEnd or scrollToSheetTop missing';
                    }
                    btnToEnd.click();
                    btnToTop.click();
                }

                if (window.location.href.includes('forms_localstorage.html')) {
                    const fSubj = document.getElementById('progress_notes_subjective');
                    const fObj = document.getElementById('progress_notes_objective');
                    const fAss = document.getElementById('progress_notes_assessment');
                    const fAgg = document.getElementById('progress_notes');
                    if (!fSubj || !fObj || !fAss || !fAgg) {
                        return 'forms_localstorage.html separated progress notes inputs missing';
                    }
                }

                if (window.location.href.includes('dashboard_er_inpatient.html')) {
                    const rowProg = document.getElementById('row-progress-notes');
                    if (!rowProg || rowProg.style.display === 'none') {
                        return 'dashboard_er_inpatient.html Progress Notes row is missing or hidden';
                    }
                    if (window.location.href.includes('patient=patient_er_juan')) {
                        const pName = document.getElementById('banner-patient-name');
                        if (!pName || !pName.textContent.includes('MAKILING, JUAN')) {
                            return 'dashboard_er_inpatient.html did not display Juan Makiling in demographic banner';
                        }
                        const pHrn = document.getElementById('banner-hrn');
                        if (!pHrn || pHrn.textContent.trim() !== '0000001925') {
                            return 'dashboard_er_inpatient.html did not display HRN 0000001925 for Juan Makiling';
                        }
                        const encRows = document.getElementById('encounter-rows');
                        if (!encRows || encRows.children.length === 0) {
                            return 'dashboard_er_inpatient.html did not render encounters for Juan Makiling';
                        }
                    }
                }

                if (window.location.href.includes('doctors_order_er_admission.html')) {
                    const btnEr = document.getElementById('btn-view-er');
                    const btnAdm = document.getElementById('btn-view-admission');
                    const btnTmpl = document.getElementById('btn-view-template');
                    const btnAll = document.getElementById('btn-view-all');
                    if (!btnEr || !btnAdm || !btnTmpl || !btnAll) {
                        return 'doctors_order_er_admission.html view buttons missing';
                    }
                    const btnToEndEr = document.getElementById('btn-move-to-end');
                    const btnToTopEr = document.getElementById('btn-move-to-top');
                    if (!btnToEndEr || !btnToTopEr) {
                        return 'doctors_order_er_admission.html quick nav move to end/top buttons missing';
                    }
                    if (typeof window.scrollToSheetEnd !== 'function' || typeof window.scrollToSheetTop !== 'function') {
                        return 'doctors_order_er_admission.html scrollToSheetEnd or scrollToSheetTop missing';
                    }
                    btnToEndEr.click();
                    btnToTopEr.click();
                    btnAdm.click();
                    if (window.currentViewMode() !== 'admission') return 'Failed to switch to admission view';
                    btnTmpl.click();
                    if (window.currentViewMode() !== 'template') return 'Failed to switch to template view';
                    btnAll.click();
                    if (window.currentViewMode() !== 'all') return 'Failed to switch to all sheets view';
                    btnEr.click();
                    if (window.currentViewMode() !== 'er') return 'Failed to switch back to er view';

                    if (window.location.href.includes('patient=patient_er_juan')) {
                        const erName = document.getElementById('er-patient-name');
                        const admName = document.getElementById('adm-patient-name');
                        if (!erName || !erName.textContent.includes('MAKILING, JUAN')) {
                            return 'doctors_order_er_admission.html did not load Juan Makiling name in ER sheet header';
                        }
                        if (!admName || !admName.textContent.includes('MAKILING, JUAN')) {
                            return 'doctors_order_er_admission.html did not load Juan Makiling name in Admission sheet header';
                        }
                        const admSheet = document.getElementById('sheet-admission');
                        if (!admSheet || !admSheet.textContent.includes('Admit to Floor 1 ward 1') || !admSheet.textContent.includes('Under the service of Dr. Miguel Santos')) {
                            return 'doctors_order_er_admission.html missing Admit to Floor 1 ward 1 in admission sheet';
                        }
                    }
                }

                // Test Obstetric & Gynecologic standalone workspace encoder (on OB_Gyne_Clinical_Module.html)
                const obRoot = document.getElementById('ob-workspace-card') || document.querySelector('.workspace-card');
                if (obRoot && window.location.href.includes('OB_Gyne_Clinical_Module.html')) {
                    const scoreEl = document.getElementById('val-obstetric-score') || document.getElementById('ob-val-obstetric-score');
                    if (!scoreEl || !scoreEl.textContent.trim()) return 'OB standalone score element empty or missing';
                    
                    const obDraftBtn = document.getElementById('btn-ob-header-save-draft');
                    if (obDraftBtn) obDraftBtn.click();
                    const obBackBtn = document.getElementById('btn-ob-back-dashboard');
                    if (!obBackBtn || !obBackBtn.getAttribute('href').includes('dashboard.html')) return 'OB back to dashboard link invalid';

                    // Test Add Pregnancy Modal open & close
                    if (typeof window.openAddPregModal === 'function') {
                        window.openAddPregModal();
                        const pModal = document.getElementById('modal-pregnancy');
                        if (!pModal || !pModal.classList.contains('open')) return 'Pregnancy modal failed to open';
                        window.closePregnancyModal();
                        if (pModal.classList.contains('open')) return 'Pregnancy modal failed to close';
                    }

                    // Test LMP Modal open & close
                    if (typeof window.openLmpModal === 'function') {
                        window.openLmpModal();
                        const lmpModal = document.getElementById('modal-lmp');
                        if (!lmpModal || !lmpModal.classList.contains('open')) return 'LMP modal failed to open';
                        window.closeLmpModal();
                        if (lmpModal.classList.contains('open')) return 'LMP modal failed to close';
                    }

                    // Enhanced Obstetric History smoke tests
                    if (document.getElementById('ob-hist-panel')) {
                        if (!window.HIS || !window.HIS.obCalc || !window.HIS.csIndications) return 'OB calc/catalog modules not loaded';
                        const obk = 'HIS_OB_GYNE_' + currentPatientId;
                        const obBefore = localStorage.getItem(obk);
                        const baseG = window.computeGTPAL().G;

                        // Present pregnancy modal: open, preview, add, close
                        document.getElementById('btn-open-present-preg').click();
                        const ppModal = document.getElementById('modal-present-preg');
                        if (!ppModal.classList.contains('open')) return 'Present pregnancy modal failed to open';
                        document.getElementById('btn-close-present-preg').click();
                        if (ppModal.classList.contains('open')) return 'Present pregnancy modal close button failed';
                        document.getElementById('btn-open-present-preg').click();
                        document.getElementById('btn-cancel-present').click();
                        if (ppModal.classList.contains('open')) return 'Present pregnancy cancel failed';

                        // Past pregnancy modal: conditional fields
                        document.getElementById('btn-open-past-preg').click();
                        const pm = document.getElementById('modal-pregnancy');
                        if (!pm.classList.contains('open')) return 'Past pregnancy modal failed to open via button';
                        const setv = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('change')); };
                        setv('preg-mode', 'Cesarean');
                        if (document.getElementById('grp-cs').style.display === 'none') return 'CS indication group did not appear for Cesarean';
                        setv('preg-mode', 'Normal (Vaginal Delivery)');
                        if (document.getElementById('grp-cs').style.display !== 'none') return 'CS indication group did not hide for non-CS';
                        setv('preg-type', 'multiple');
                        if (document.querySelectorAll('#preg-babies .ob-baby').length !== 2) return 'Twins did not create two baby records';
                        setv('preg-multitype', 'Triplets');
                        if (document.querySelectorAll('#preg-babies .ob-baby').length !== 3) return 'Triplets did not create three baby records';
                        setv('preg-type', 'ectopic');
                        if (document.getElementById('grp-delivery').style.display !== 'none') return 'Delivery group should hide for ectopic';
                        setv('preg-intervention', 'Surgery');
                        if (document.getElementById('grp-surgery').style.display === 'none') return 'Surgery details did not appear';
                        setv('preg-type', 'molar');
                        const molarOpts = Array.from(document.getElementById('preg-intervention').options).map(o => o.value);
                        if (molarOpts.indexOf('TAHMIS') === -1 || molarOpts.indexOf('Suction') === -1) return 'Molar intervention options missing';

                        // Verify standardized Place of Delivery dropdown and conditional input
                        const placeSelect = document.getElementById('preg-place-select');
                        if (!placeSelect) return 'Standardized Place of Delivery select missing';
                        const placeOpts = Array.from(placeSelect.options).map(o => o.value);
                        if (!placeOpts.includes('Hospital') || !placeOpts.includes('Home') || !placeOpts.includes('Birthing Clinic') || !placeOpts.includes('Others (Specify)')) {
                            return 'Standardized Place of Delivery options missing';
                        }
                        setv('preg-place-select', 'Others (Specify)');
                        if (document.getElementById('grp-place-other').style.display === 'none') return 'Others (Specify) did not reveal text input';
                        setv('preg-place-select', 'Hospital');
                        if (document.getElementById('grp-place-other').style.display !== 'none') return 'Others (Specify) group should hide for Hospital';

                        // Verify GP(TPAL) score notation format
                        const initialGtpal = window.computeGTPAL();
                        if (!/^G\\d+P\\d+\\(\\d{4}\\)$/.test(initialGtpal.displayGP)) return 'Obstetric score displayGP not in standardized GP(TPAL) notation: ' + initialGtpal.displayGP;

                        // ADD a twin delivery (38w0d, both living) and verify canonical tiles
                        setv('preg-type', 'multiple');
                        setv('preg-multitype', 'Twins');
                        setv('preg-year', '2022'); setv('preg-month', '3');
                        setv('preg-ga-weeks', '38'); setv('preg-ga-days', '');
                        document.querySelectorAll('#preg-babies .baby-status').forEach(s => { s.value = 'living'; });
                        const countBefore = patientState.pregnancies.length;
                        document.getElementById('form-pregnancy').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        if (pm.classList.contains('open')) return 'Past pregnancy modal did not close after ADD: ' + (document.getElementById('preg-form-error').textContent || '');
                        if (patientState.pregnancies.length !== countBefore + 1) return 'ADD did not record exactly one pregnancy';
                        const rec = patientState.pregnancies[patientState.pregnancies.length - 1];
                        if (!rec.id || !rec.babies || rec.babies.length !== 2) return 'Twin record missing id or per-baby records';
                        if (window.computeGTPAL().G !== baseG + 1) return 'G did not increase by one after ADD';
                        const autoSaved = JSON.parse(localStorage.getItem(obk) || 'null');
                        if (!autoSaved || autoSaved.pregnancies.length !== countBefore + 1) return 'Form submit did not seamlessly persist pregnancy record to localStorage';

                        // Cancel button + Cesarean catalog search
                        document.getElementById('btn-open-past-preg').click();
                        document.getElementById('btn-cancel-preg').click();
                        if (pm.classList.contains('open')) return 'Past pregnancy cancel failed';
                        window.openAddPregModal();
                        setv('preg-mode', 'Cesarean');
                        if (document.querySelectorAll('#preg-cs-indication optgroup').length < 2) return 'CS catalog groups missing';
                        window.closePregnancyModal();

                        // Present pregnancy ADD with fixed dating and flexible ultrasound inputs
                        window.openPresentModal();
                        setv('pp-lmp-start', '2026-06-01');
                        // Changing ultrasound date directly triggers handleUltrasoundDateChange and auto-populates weeks and days from LMP
                        const usDateInput = document.getElementById('pp-us-date');
                        usDateInput.value = '2026-08-14';
                        if (typeof window.handleUltrasoundDateChange === 'function') {
                            window.handleUltrasoundDateChange();
                            if (!document.getElementById('pp-us-weeks').value) return 'handleUltrasoundDateChange failed to auto-populate weeks';
                        }
                        // Set specific ultrasound dating
                        setv('pp-us-weeks', '11'); setv('pp-us-days', '1');
                        document.getElementById('form-present-preg').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        const ppc = document.getElementById('card-present-preg');
                        if (!ppc || ppc.textContent.indexOf('Mar 8, 2027') === -1 || ppc.textContent.indexOf('Mar 4, 2027') === -1) return 'Present pregnancy card EDDs incorrect';
                        if (ppc.textContent.indexOf('ACOG') === -1) return 'ACOG dating recommendation missing from present pregnancy card';
                        if (window.computeGTPAL().G !== baseG + 2) return 'Present pregnancy did not count toward G';

                        // Canonical Save button persists; clean single-action hierarchy
                        const saveBtn = document.getElementById('btn-save-ob-history');
                        if (!saveBtn) return 'Canonical Obstetric History save button missing';
                        saveBtn.click();
                        const stored = JSON.parse(localStorage.getItem(obk) || 'null');
                        if (!stored || stored.pregnancies.length !== countBefore + 1 || !stored.presentPregnancy || !stored.presentPregnancy.active) return 'SAVE did not persist OB history';
                        if (document.getElementById('ob-dirty-flag').textContent) return 'Unsaved indicator not cleared after SAVE';

                        // Restore original storage state
                        if (obBefore === null) localStorage.removeItem(obk); else localStorage.setItem(obk, obBefore);
                        localStorage.removeItem(obk + '__bak_v1');
                    }
                }

                // Test Neonate viewable summary in Medical History (#hx-neo tab in dashboard.html)
                const neoTabLink = document.querySelector('a[href="#hx-neo"]');
                if (neoTabLink) {
                    neoTabLink.click();
                    const neoViewContainer = document.getElementById('neo-view-container');
                    if (!neoViewContainer) return 'Neonate view container not found in #hx-neo';
                    const sumType = document.getElementById('neo-view-sum-type');
                    if (!sumType || !sumType.textContent.trim()) return 'Neonate classification element empty or missing in #hx-neo';
                    const neoAddBtn = document.getElementById('btn-add-neo-record');
                    if (neoAddBtn) return 'Neonate preview container should not contain an Add button (#btn-add-neo-record)';
                }

                // Test Neonate Growth Chart Modal with Patient Gender Baseline
                if (isDashboardPage) {
                    const fentonBtn = document.getElementById('btn-chart-fenton');
                    const neoModal = document.getElementById('neonate-chart-modal');
                    const neoImg = document.getElementById('neonateZoomedChartImg');
                    if (fentonBtn && neoModal && neoImg) {
                        fentonBtn.click();
                        if (!neoModal.classList.contains('open')) return 'Neonate growth chart modal failed to open on clicking btn-chart-fenton';
                        if (!neoImg.src.includes('female_fenton_chart.png') && !neoImg.src.includes('boy_fenton_chart.png')) {
                            return 'Neonate growth chart image src invalid: ' + neoImg.src;
                        }
                        const neoModalClose = neoModal.querySelector('.neo-modal-close');
                        if (!neoModalClose) return 'Neonate growth chart modal close button not found';
                        neoModalClose.click();
                        if (neoModal.classList.contains('open')) return 'Neonate growth chart modal failed to close via close button';
                    }
                }

                // Test Growth Charts tab switching on Neonate_Clinical_Module.html
                if (window.location.href.includes('Neonate_Clinical_Module.html')) {
                    const tabChartsBtn = document.querySelector('button[data-tab="tab-charts"]');
                    if (tabChartsBtn) {
                        tabChartsBtn.click();
                        const tabCharts = document.getElementById('tab-charts');
                        if (!tabCharts || window.getComputedStyle(tabCharts).display === 'none') {
                            return 'Clicking tab-charts button did not switch to tab-charts';
                        }
                    }
                }

                // Test Neonate Clinical Module standalone encoder (on Neonate_Clinical_Module.html)
                const neoDashlet = document.getElementById('neo-workspace-card') || (window.location.href.includes('Neonate_Clinical_Module.html') ? document.querySelector('.workspace-card') : null);
                if (neoDashlet) {
                    const neoDraftBtn = document.getElementById('btn-neo-header-save-draft');
                    if (neoDraftBtn) neoDraftBtn.click();
                    const neoBackBtn = document.getElementById('btn-neo-back-dash');
                    if (neoBackBtn && !neoBackBtn.getAttribute('href').includes('dashboard.html')) return 'Neonate back to dashboard link invalid';

                    const inbornSel = document.getElementById('neo_inborn');
                    const outbornSel = document.getElementById('neo_outborn');
                    const readmitChk = document.getElementById('neo_readmission');
                    if (inbornSel && outbornSel && readmitChk) {
                        inbornSel.value = 'singleton-in hospital';
                        inbornSel.dispatchEvent(new Event('change'));
                        if (outbornSel.value !== '' || readmitChk.checked) return 'Inborn selection did not clear outborn/readmission';
                        outbornSel.value = 'singleton-outside hospital';
                        outbornSel.dispatchEvent(new Event('change'));
                        if (inbornSel.value !== '' || readmitChk.checked) return 'Outborn selection did not clear inborn/readmission';
                        readmitChk.checked = true;
                        readmitChk.dispatchEvent(new Event('change'));
                        if (inbornSel.value !== '' || outbornSel.value !== '') return 'Readmission check did not clear inborn/outborn';
                        inbornSel.value = 'singleton-in hospital';
                        inbornSel.dispatchEvent(new Event('change'));
                    }
                    // Test Ballard click-to-select: click a ref-cell and verify hidden input updates and toggles
                    if (typeof window.ballardCellClick === 'function') {
                        const firstRefCell = document.querySelector('.ballard-ref-cell[data-score-val]');
                        if (firstRefCell) {
                            window.ballardCellClick(firstRefCell);
                            const row = firstRefCell.closest('tr');
                            const hiddenInput = row ? row.querySelector('input.neo-ballard-score') : null;
                            if (hiddenInput && hiddenInput.value !== firstRefCell.getAttribute('data-score-val')) {
                                return 'Ballard click-to-select did not update hidden input value';
                            }
                            // Test toggle deselect on repeat click
                            window.ballardCellClick(firstRefCell);
                            if (hiddenInput && hiddenInput.value !== '') {
                                return 'Ballard repeat click did not clear hidden input value';
                            }
                            // Re-select for subsequent tests
                            window.ballardCellClick(firstRefCell);
                        }
                    }
                    // Test Ballard total score calculation
                    if (typeof window.recalcBallard === 'function') {
                        window.recalcBallard();
                        const bTotal = document.getElementById('ballard-total-score');
                        if (!bTotal || !bTotal.textContent.trim()) return 'Ballard total score element empty or missing';
                    }
                    // Test Growth Chart Zoom Modal
                    if (typeof window.openZoomModal === 'function') {
                        window.openZoomModal('img/neonate/lubchenco_chart.png');
                        const zoomModal = document.getElementById('neonate-chart-modal') || document.getElementById('chartModal');
                        if (!zoomModal || !zoomModal.classList.contains('open')) return 'Neonate zoom modal failed to open';
                        window.closeZoomModal();
                        if (zoomModal.classList.contains('open')) return 'Neonate zoom modal failed to close';
                    }
                    // Test VLOOKUP Details Toggle
                    const vlookupDetails = document.querySelector('.neo-vlookup-details');
                    if (vlookupDetails) {
                        vlookupDetails.open = true;
                        vlookupDetails.open = false;
                    }

                    // Verify Ballard Score titles
                    const bTotalTitle = document.getElementById('ballard-total-score')?.previousElementSibling;
                    if (!bTotalTitle || !bTotalTitle.textContent.includes('Total Score')) {
                        return 'Ballard Total Score title not updated to Total Score';
                    }
                    const bWeeksTitle = document.getElementById('ballard-weeks-display')?.previousElementSibling;
                    if (!bWeeksTitle || !bWeeksTitle.textContent.includes('Ballard Score')) {
                        return 'Ballard Weeks title not updated to Ballard Score';
                    }

                    // Verify Ballard Genitals criteria visibility based on sex
                    const rowGenMale = document.getElementById('ballard-row-genitals-male');
                    const rowGenFemale = document.getElementById('ballard-row-genitals-female');
                    if (!rowGenMale || !rowGenFemale) {
                        return 'Ballard genitals criteria rows missing';
                    }
                    if (typeof window.updateBallardGenitalsVisibility === 'function') {
                        const sexInput = document.getElementById('neo_sex');
                        const origSex = sexInput ? sexInput.value : '';
                        if (sexInput) {
                            sexInput.value = 'Male';
                            window.updateBallardGenitalsVisibility();
                            if (rowGenMale.style.display === 'none' || rowGenFemale.style.display !== 'none') {
                                return 'Ballard male genitals visibility toggle failed';
                            }
                            sexInput.value = 'Female';
                            window.updateBallardGenitalsVisibility();
                            if (rowGenFemale.style.display === 'none' || rowGenMale.style.display !== 'none') {
                                return 'Ballard female genitals visibility toggle failed';
                            }
                            sexInput.value = 'Undetermined';
                            window.updateBallardGenitalsVisibility();
                            if (rowGenFemale.style.display === 'none' || rowGenMale.style.display === 'none') {
                                return 'Ballard undetermined genitals visibility failed to reflect both';
                            }
                            if (!rowGenMale.classList.contains('ballard-disabled-row') || !rowGenFemale.classList.contains('ballard-disabled-row')) {
                                return 'Ballard undetermined genitals rows should have disabled styling';
                            }
                            const compCount = document.getElementById('ballard-completed-count');
                            if (!compCount || !compCount.textContent.includes('/ 11')) {
                                return 'Ballard completed count should have target 11 for Undetermined sex';
                            }
                            const maleCell = rowGenMale.querySelector('.ballard-ref-cell');
                            if (maleCell) maleCell.click();
                            if (document.getElementById('ballard-input-genitals_male').value !== '') {
                                return 'Ballard male genitals should not be selectable when sex is Undetermined';
                            }
                            sexInput.value = origSex;
                            window.updateBallardGenitalsVisibility();
                        }
                    }

                    // Verify tab renamed to Newborn Aftercare Administration
                    const tabExamBtn = document.querySelector('.workspace-tab[data-tab="tab-exam"]');
                    if (!tabExamBtn || !tabExamBtn.textContent.includes('Newborn Aftercare Administration')) {
                        return 'Physical Exam & Aftercare tab not renamed to Newborn Aftercare Administration';
                    }

                    // Verify Structured PE removed and Reason for Admission retained
                    if (document.getElementById('neo_pe_general')) {
                        return 'Structured Physical Exam General Survey was not removed';
                    }
                    if (!document.getElementById('neo_nicu_reason') || !document.getElementById('neo_sex')) {
                        return 'Reason for Admission fields missing';
                    }

                    // Verify Patient Master Context field is cleanly removed
                    if (document.getElementById('neo_patient_demographics_display')) {
                        return 'neo_patient_demographics_display was not removed';
                    }

                    // Verify Screening Progress Notes card is cleanly removed
                    if (document.getElementById('screening-progress-notes-card')) {
                        return 'Screening Progress Notes card was not removed';
                    }
                    const saveRorBtn = document.getElementById('btn-save-ror');
                    if (saveRorBtn) {
                        saveRorBtn.click();
                    }

                    // Verify ROP button under B. Retinopathy of Prematurity (ROP) and click save
                    const ropCard = document.getElementById('section-card-rop');
                    if (!ropCard) return 'Section card for ROP missing in Screening tab';
                    const ropBtn = document.getElementById('btn-open-rop-screening');
                    if (!ropBtn) return 'btn-open-rop-screening missing under B. Retinopathy of Prematurity';
                    ropBtn.click();
                    // Verify Applicable select options (strictly Yes/No, no "Not Done") and freeze behavior
                    const ropAppSel = document.getElementById('neo_rop_applicable');
                    if (!ropAppSel) return 'neo_rop_applicable select missing';
                    const hasNotDone = Array.from(ropAppSel.options).some(o => o.value === 'Not Done' || o.text === 'Not Done');
                    if (hasNotDone) return 'neo_rop_applicable must not contain Not Done option';

                    // Verify Schedule Date label
                    const schedLabel = document.querySelector('label[for="neo_rop_schedule"]');
                    if (!schedLabel || !schedLabel.textContent.includes('Schedule Date')) {
                        return 'label for neo_rop_schedule must be Schedule Date';
                    }

                    // Verify freeze on "No"
                    ropAppSel.value = 'No';
                    ropAppSel.dispatchEvent(new Event('change'));
                    const saveRopBtn = document.getElementById('btn-save-rop');
                    if (saveRopBtn && !saveRopBtn.disabled) return 'btn-save-rop must be disabled when neo_rop_applicable is No';
                    const examDateInput = document.getElementById('neo_rop_exam_date');
                    if (examDateInput && !examDateInput.disabled) return 'neo_rop_exam_date must be disabled when neo_rop_applicable is No';

                    // Unfreeze on "Yes"
                    ropAppSel.value = 'Yes';
                    ropAppSel.dispatchEvent(new Event('change'));
                    if (saveRopBtn && saveRopBtn.disabled) return 'btn-save-rop must be enabled when neo_rop_applicable is Yes';
                    if (saveRopBtn) {
                        saveRopBtn.click();
                    }

                    // Verify ROP PDF Report Modal open and close and demographic auto-fill
                    const ropReportBtn = document.getElementById('btn-open-rop-report');
                    const ropModal = document.getElementById('ropScreeningReportModal');
                    if (ropReportBtn && ropModal) {
                        ropReportBtn.click();
                        if (window.getComputedStyle(ropModal).display === 'none') {
                            return 'ropScreeningReportModal failed to open on clicking btn-open-rop-report';
                        }
                        const pdfPtName = document.getElementById('pdf-rop-patient-name');
                        const pdfHrn = document.getElementById('pdf-rop-hospital-num');
                        const pdfExamDate = document.getElementById('pdf-rop-exam-date');
                        if (!pdfPtName || !pdfPtName.textContent.trim() || pdfPtName.textContent.trim() === '—') {
                            return 'pdf-rop-patient-name failed to auto-fill';
                        }
                        if (!pdfHrn || !pdfHrn.textContent.trim() || pdfHrn.textContent.trim() === '—') {
                            return 'pdf-rop-hospital-num failed to auto-fill';
                        }
                        if (!pdfExamDate || !pdfExamDate.textContent.trim() || pdfExamDate.textContent.trim() === '—') {
                            return 'pdf-rop-exam-date failed to auto-fill';
                        }
                        if (typeof window.closeRopReportModal === 'function') {
                            window.closeRopReportModal();
                            if (window.getComputedStyle(ropModal).display !== 'none') {
                                return 'ropScreeningReportModal failed to close';
                            }
                        }
                    }

                    // Verify Medical Futility dropdown has "Others" option
                    const futilitySel = document.getElementById('neo_kmc_futility');
                    if (!futilitySel) return 'neo_kmc_futility dropdown missing';
                    const hasOthers = Array.from(futilitySel.options).some(o => o.value === 'Others' || o.text === 'Others');
                    if (!hasOthers) return 'neo_kmc_futility does not include Others option';

                    // Verify Neonatal Diagnosis Progress Notes card exists and save reflects note
                    const dpCard = document.getElementById('diagnosis-progress-notes-card');
                    const dpList = document.getElementById('diagnosis-progress-notes-list');
                    if (!dpCard || !dpList) {
                        return 'Diagnosis Progress Notes card or list missing';
                    }
                    const saveDxBtn = document.getElementById('btn-save-neonatal-dx');
                    if (saveDxBtn) {
                        saveDxBtn.click();
                        if (!dpList.textContent.includes('Neonatal Diagnostic Assessment') && !dpList.textContent.includes('Initial Diagnostic Assessment') && !dpList.textContent.includes('Diagnosis')) {
                            return 'Neonatal Diagnosis save did not reflect in Progress Notes list';
                        }
                    }

                    // Verify Only Lubchenco and Fenton charts inside Neonate Module
                    if (document.getElementById('btn-chart-who') || document.getElementById('panel-chart-who')) {
                        return 'WHO Growth Chart should not be inside Neonate Clinical Module';
                    }
                    const lubBtn = document.getElementById('btn-chart-lub');
                    const fentonBtn = document.getElementById('btn-chart-fenton');
                    if (!lubBtn || !fentonBtn) {
                        return 'Lubchenco or Fenton Chart button missing in Neonate Clinical Module';
                    }
                    const openGrowthModBtn = document.getElementById('btn-open-growth-charts-module');
                    if (!openGrowthModBtn || !openGrowthModBtn.getAttribute('href').includes('Growth_Charts_Module.html')) {
                        return 'Link to Growth Charts Module missing in Neonate Clinical Module';
                    }
                }

                // Test Growth Charts Module (on Growth_Charts_Module.html)
                if (window.location.href.includes('Growth_Charts_Module.html')) {
                    const wfaBtn = document.getElementById('btn-who-wfa');
                    const lhfaBtn = document.getElementById('btn-who-lhfa');
                    const wflhBtn = document.getElementById('btn-who-wflh');
                    const bmifaBtn = document.getElementById('btn-who-bmifa');
                    const tannerTabBtn = document.getElementById('btn-tab-tanner');
                    if (!wfaBtn || !lhfaBtn || !wflhBtn || !bmifaBtn || !tannerTabBtn) {
                        return 'Growth Charts Module indicator buttons missing';
                    }
                    const svgContainer = document.getElementById('module-svg-container');
                    if (!svgContainer || !svgContainer.querySelector('.who-native-svg')) {
                        return 'Growth Charts Module native SVG missing';
                    }
                    const reportModalBtn = document.getElementById('btn-open-report-modal');
                    const reportModal = document.getElementById('whoGrowthReportModal');
                    if (reportModalBtn && reportModal) {
                        reportModalBtn.click();
                        if (!reportModal.classList.contains('open')) return 'Growth Assessment Report modal failed to open';
                        window.closeWhoGrowthReportModal();
                        if (reportModal.classList.contains('open')) return 'Growth Assessment Report modal failed to close';
                    }

                    // Test Tanner Staging Interactive Functionality
                    tannerTabBtn.click();
                    const tannerSection = document.getElementById('section-tanner-staging');
                    if (!tannerSection || tannerSection.style.display === 'none') {
                        return 'Tanner Staging section not visible after clicking tab';
                    }
                    const tannerTable = document.getElementById('tanner-matrix-table');
                    if (!tannerTable) return 'Tanner matrix table missing';

                    // Verify clinical illustrations exist in cells
                    const cellImgs = tannerTable.querySelectorAll('.tanner-cell-img');
                    if (!cellImgs || cellImgs.length < 10) return 'Tanner matrix cells must contain clinical illustrations';
                    
                    // Click Female Breast Stage 3 and Pubic Hair Stage 3
                    window.setTannerActiveScale('female');
                    const fCellB3 = document.querySelector('td.tanner-ref-cell[data-scale="scale1"][data-stage="3"]');
                    const fCellPH3 = document.querySelector('td.tanner-ref-cell[data-scale="scale2"][data-stage="3"]');
                    if (!fCellB3 || !fCellPH3) return 'Female Tanner stage 3 cells missing';
                    fCellB3.click();
                    fCellPH3.click();
                    let outputText = document.getElementById('tanner-output-text-display').textContent;
                    if (!outputText.includes('breast begins to become more elevated') || !outputText.includes('hair becomes more coarse and curly')) {
                        return 'Synthesized female Tanner description mismatch: ' + outputText;
                    }

                    // Test Male Scale Toggle and Scoring
                    const maleScaleBtn = document.getElementById('btn-tanner-scale-male');
                    if (!maleScaleBtn) return 'btn-tanner-scale-male missing';
                    maleScaleBtn.click();
                    const mCellG2 = document.querySelector('td.tanner-ref-cell[data-scale="scale1"][data-stage="2"]');
                    const mCellPH1 = document.querySelector('td.tanner-ref-cell[data-scale="scale2"][data-stage="1"]');
                    if (!mCellG2 || !mCellPH1) return 'Male Tanner cells missing';
                    mCellG2.click();
                    mCellPH1.click();
                    outputText = document.getElementById('tanner-output-text-display').textContent;
                    if (!outputText.includes('testicular volume between 1.6 and 6 ml') || !outputText.includes('No hair')) {
                        return 'Synthesized male Tanner description mismatch: ' + outputText;
                    }

                    // Verify Undetermined Protocol is removed (Tanner is strictly pediatric Male or Female)
                    if (document.getElementById('btn-tanner-scale-undetermined')) {
                        return 'btn-tanner-scale-undetermined should be removed; Tanner is pediatric binary';
                    }
                    const femaleScaleBtn = document.getElementById('btn-tanner-scale-female');
                    if (!femaleScaleBtn) return 'btn-tanner-scale-female missing';
                    femaleScaleBtn.click();
                    const fRows = tannerTable.querySelectorAll('tbody tr');
                    if (fRows.length !== 2) return 'Female protocol must render exactly 2 rows (breast and pubic hair)';

                    // If loaded patient is patient_neo_santos, verify sex is Male (Boy)
                    if (window.location.search.includes('patient=patient_neo_santos')) {
                        const sexInput = document.getElementById('growth-input-sex');
                        if (!sexInput || sexInput.value !== 'male') {
                            return 'patient_neo_santos should resolve sex to male';
                        }
                    }

                    // Switch back to WFA curve
                    wfaBtn.click();
                    if (tannerSection.style.display !== 'none') return 'Tanner section should be hidden when switching to WFA';
                }

                return 'OK';
            })()
            """
            try:
                eval_id = await send("Runtime.evaluate", {"expression": smoke_js, "returnByValue": True, "awaitPromise": True})
                t0 = time.time()
                while time.time() - t0 < 4.0:
                    try:
                        raw = await asyncio.wait_for(p_ws.recv(), timeout=0.2)
                        msg = json.loads(raw)
                        if msg.get("id") == eval_id:
                            res = msg.get("result", {}).get("result", {}).get("value")
                            if res and res != "OK":
                                errors.append(f"Interactive Smoke Test Failure: {res}")
                            break
                        elif msg.get("method") == "Runtime.exceptionThrown":
                            details = msg.get("params", {}).get("exceptionDetails", {})
                            errors.append(f"Interactive Smoke Test Exception: {details.get('text')} {details.get('exception', {}).get('description')}")
                    except (asyncio.TimeoutError, websockets.exceptions.ConnectionClosed):
                        pass
            except (websockets.exceptions.ConnectionClosed, Exception):
                pass

    # Close target
    try:
        b_ws = await robust_ws_connect(browser_ws)
        async with b_ws:
            close_msg = {"id": 1, "method": "Target.closeTarget", "params": {"targetId": target_id}}
            await b_ws.send(json.dumps(close_msg))
            await b_ws.recv()
    except Exception:
        pass

    return errors

async def run_scan():
    import tempfile
    tmp_profile = tempfile.mkdtemp()
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--no-sandbox",
        "--disable-gpu",
        f"--user-data-dir={tmp_profile}"
    ])

    try:
        version_data = None
        for _ in range(30):
            await asyncio.sleep(0.5)
            try:
                with urllib.request.urlopen("http://127.0.0.1:9222/json/version") as r:
                    version_data = json.loads(r.read().decode())
                    break
            except Exception:
                pass
        if not version_data:
            raise RuntimeError("Failed to connect to headless browser CDP")
        browser_ws = version_data["webSocketDebuggerUrl"]

        html_files = sorted(glob.glob(os.path.join(WORKSPACE_DIR, "*.html")))
        test_urls = []
        for hf in html_files:
            fname = os.path.basename(hf)
            file_url = f"file:///{hf.replace(os.sep, '/')}"
            test_urls.append((fname, file_url))
            if fname in ("dashboard.html", "dashboard_er_inpatient.html", "doctors_order_patient.html", "opd_record_patient.html", "Neonate_Clinical_Module.html", "doctors_order_er_admission.html", "OB_Gyne_Clinical_Module.html", "ams_restricted_antimicrobial.html", "Growth_Charts_Module.html"):
                test_urls.append((f"{fname}?patient=patient_op_carmela", f"{file_url}?patient=patient_op_carmela"))
                test_urls.append((f"{fname}?patient=patient_er_juan", f"{file_url}?patient=patient_er_juan"))
                test_urls.append((f"{fname}?patient=patient_op_juan", f"{file_url}?patient=patient_op_juan"))
                test_urls.append((f"{fname}?patient=patient_new_blank_1790299677880", f"{file_url}?patient=patient_new_blank_1790299677880"))
                test_urls.append((f"{fname}?patient=patient_ob_maria", f"{file_url}?patient=patient_ob_maria"))
                test_urls.append((f"{fname}?patient=patient_neo_santos", f"{file_url}?patient=patient_neo_santos"))

        results = {}
        print("Running Site-Wide Automated Quality Gate...")
        for name, url in test_urls:
            errs = await scan_single_target(browser_ws, url)
            results[name] = errs
            if errs:
                print(f"  [FAIL] {name}: {len(errs)} error(s)")
                for e in errs:
                    print(f"     -> {e}")
            else:
                print(f"  [PASS] {name}")

        print("\n" + "=" * 65)
        print("QUALITY GATE SUMMARY:")
        all_passed = True
        for name, errs in results.items():
            if errs:
                all_passed = False
                print(f"  [FAIL] {name:42}: {len(errs)} error(s)")
            else:
                print(f"  [PASS] {name:42}: OK")
        print("=" * 65)

        if all_passed:
            print(">>> ALL PAGES PASSED WITH ZERO CONSOLE ERRORS & CLEAN ASSETS. <<<")
            return 0
        else:
            print(">>> QUALITY GATE FAILED: RESOLVE THE ABOVE ERRORS BEFORE COMMITTING. <<<")
            return 1
    finally:
        proc.terminate()

def main():
    code = asyncio.run(run_scan())
    sys.exit(code)

if __name__ == "__main__":
    main()
