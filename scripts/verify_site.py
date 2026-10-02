#!/usr/bin/env python3
"""
CLMMRH HIS — Automated Headless Quality Gate
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

async def scan_single_target(browser_ws, file_url):
    async with websockets.connect(browser_ws) as b_ws:
        msg_id = 1
        create_msg = {"id": msg_id, "method": "Target.createTarget", "params": {"url": "about:blank"}}
        await b_ws.send(json.dumps(create_msg))
        resp = json.loads(await b_ws.recv())
        target_id = resp["result"]["targetId"]

    target_ws = f"ws://127.0.0.1:9222/devtools/page/{target_id}"
    errors = []

    async with websockets.connect(target_ws) as p_ws:
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
            except asyncio.TimeoutError:
                if loaded and time.time() - t0 > 1.0:
                    break

        # Interactive component smoke tests for dashboard/updated pages
        if any(p in file_url for p in ("dashboard.html",)):
            smoke_js = """
            (async () => {
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

                // Test Examination Request modal & close button
                const examBtn = document.getElementById('floating-btn-exam') || document.getElementById('floating-btn-lab');
                if (!examBtn) return 'Button floating-btn-exam not found';
                examBtn.click();
                const clModal = document.getElementById('clinical-request-modal');
                if (!clModal || window.getComputedStyle(clModal).display === 'none') return 'Clinical request modal failed to open';
                const clCloseBtn = document.getElementById('close-request-modal');
                if (!clCloseBtn) return 'Close button close-request-modal not found';
                clCloseBtn.click();
                if (window.getComputedStyle(clModal).display !== 'none' || clModal.classList.contains('open')) return 'Clinical modal failed to close via close button';

                // Test Escape key dismissal
                examBtn.click();
                if (window.getComputedStyle(clModal).display === 'none') return 'Clinical modal failed to reopen';
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                if (window.getComputedStyle(clModal).display !== 'none' || clModal.classList.contains('open')) return 'Clinical modal failed to close via Escape key';

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
                const obTabLink = document.querySelector('a[href="#hx-gyn"]');
                if (obTabLink) {
                    obTabLink.click();
                    const obViewContainer = document.getElementById('ob-view-container');
                    if (!obViewContainer) return 'OB view container not found in #hx-gyn';
                    const scoreEl = document.getElementById('ob-view-score-main');
                    if (!scoreEl || !scoreEl.textContent.trim()) return 'OB view score element empty or missing';
                    const obBadge = document.getElementById('ob-view-status-badge');
                    if (!obBadge) return 'OB view status badge missing in #hx-gyn';
                }

                // Test Specialized Clinical Forms unified launcher list
                if (window.location.href.includes('dashboard.html')) {
                    const dashletForms = document.getElementById('dashlet-specialized-forms');
                    if (!dashletForms) return 'dashlet-specialized-forms not found';
                    const obModBtn = document.getElementById('btn-open-obgyne-module');
                    const neoModBtn = document.getElementById('btn-open-neonate-module');
                    const growthBtn = document.getElementById('btn-open-growth-chart');
                    if (!obModBtn) return 'btn-open-obgyne-module missing in specialized forms';
                    if (!neoModBtn) return 'btn-open-neonate-module missing in specialized forms';
                    if (!growthBtn) return 'btn-open-growth-chart missing in specialized forms';
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
                const floatingObBtn = document.getElementById('floating-btn-obgyne');
                if (!floatingObBtn) return 'floating-btn-obgyne not found in requisition pad';

                // Verify Progress Notes dashlet has been completely removed from Physician Dashboard
                if (window.location.href.includes('dashboard.html')) {
                    const pnRow = document.getElementById('row-progress-notes');
                    const pnDashlet = document.getElementById('dashlet-progress-notes');
                    if (pnRow || pnDashlet) {
                        return 'Progress Notes dashlet should be completely removed from dashboard.html';
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
                }

                if (window.location.href.includes('doctors_order_patient.html')) {
                    if (typeof window.getEncounterProgressNotes !== 'function') {
                        return 'getEncounterProgressNotes not defined on window in doctors_order_patient.html';
                    }
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
                }

                // Test Neonate viewable summary in Medical History (#hx-neo tab in dashboard.html)
                const neoTabLink = document.querySelector('a[href="#hx-neo"]');
                if (neoTabLink) {
                    neoTabLink.click();
                    const neoViewContainer = document.getElementById('neo-view-container');
                    if (!neoViewContainer) return 'Neonate view container not found in #hx-neo';
                    const sumType = document.getElementById('neo-view-sum-type');
                    if (!sumType || !sumType.textContent.trim()) return 'Neonate classification element empty or missing in #hx-neo';
                    const neoBadge = document.getElementById('neo-view-status-badge');
                    if (!neoBadge) return 'Neonate view status badge missing in #hx-neo';
                }

                // Test Neonate Growth Chart Modal with Patient Gender Baseline
                if (window.location.href.includes('dashboard.html')) {
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

                // Test Fenton baseline button on Neonate_Clinical_Module.html
                if (window.location.href.includes('Neonate_Clinical_Module.html')) {
                    const neoFentonBtn = document.getElementById('btn-neo-chart-fenton');
                    const fentonLabel = document.getElementById('btn-neo-chart-fenton-label');
                    if (neoFentonBtn && fentonLabel) {
                        neoFentonBtn.click();
                        const tabCharts = document.getElementById('tab-charts');
                        if (!tabCharts || window.getComputedStyle(tabCharts).display === 'none') {
                            return 'Clicking btn-neo-chart-fenton did not switch to tab-charts';
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
                }

                return 'OK';
            })()
            """
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
                except asyncio.TimeoutError:
                    pass

    # Close target
    async with websockets.connect(browser_ws) as b_ws:
        close_msg = {"id": 1, "method": "Target.closeTarget", "params": {"targetId": target_id}}
        await b_ws.send(json.dumps(close_msg))
        await b_ws.recv()

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
        for _ in range(15):
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
            if fname in ("dashboard.html", "doctors_order_patient.html", "opd_record_patient.html", "Neonate_Clinical_Module.html"):
                test_urls.append((f"{fname}?patient=patient_op_juan", f"{file_url}?patient=patient_op_juan"))
                test_urls.append((f"{fname}?patient=patient_new_blank_1790299677880", f"{file_url}?patient=patient_new_blank_1790299677880"))

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
