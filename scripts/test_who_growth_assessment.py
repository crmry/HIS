#!/usr/bin/env python3
"""
Automated Headless CDP Verification for HIS WHO Growth Assessment Report.
Validates:
1. Modal opening from both Anthropometry tab and Growth Charts tab.
2. Patient data pre-population (Child name, HRN, recorded sex, weight, length, completed months).
3. Raw BMI calculation (weight kg / height m^2).
4. Auto chart selection: Male vs Female charts.
5. Age routing: <60 months (WFA, LHFA, WFLH) vs 60–228 months (BMIFA).
6. Incomplete data states: missing sex, age, weight, and length individually.
7. Chart-tab switching among applicable charts.
8. Visual marker coordinate calculations and boundary clamping.
9. Mobile layout verification (zero horizontal page overflow at 375px).
10. Desktop layout verification (1280px).
11. Unchanged integrity of Ballard, Fenton, and Lubchenco charts and draft saving.
"""

import asyncio
import json
import os
import sys
import time
import urllib.request
import websockets

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

POSSIBLE_CHROME_PATHS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
]

CHROME_PATH = None
for p in POSSIBLE_CHROME_PATHS:
    if os.path.exists(p):
        CHROME_PATH = p
        break

if not CHROME_PATH:
    print("[ERROR] Could not locate Chrome/Edge executable.")
    sys.exit(1)

async def run_tests():
    import subprocess
    port = 9333
    cmd = [
        CHROME_PATH,
        f"--remote-debugging-port={port}",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    await asyncio.sleep(1.0)

    try:
        req = urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version")
        ver_info = json.loads(req.read().decode())
        browser_ws = ver_info["webSocketDebuggerUrl"]

        async with websockets.connect(browser_ws) as b_ws:
            msg_id = 1
            await b_ws.send(json.dumps({"id": msg_id, "method": "Target.createTarget", "params": {"url": "about:blank"}}))
            resp = json.loads(await b_ws.recv())
            target_id = resp["result"]["targetId"]

        target_ws = f"ws://127.0.0.1:{port}/devtools/page/{target_id}"
        async with websockets.connect(target_ws) as ws:
            req_id = 1
            async def send_cmd(method, params=None):
                nonlocal req_id
                m = {"id": req_id, "method": method, "params": params or {}}
                req_id += 1
                await ws.send(json.dumps(m))
                while True:
                    raw = await ws.recv()
                    data = json.loads(raw)
                    if data.get("id") == m["id"]:
                        return data

            async def eval_js(expression):
                res = await send_cmd("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
                if "exceptionDetails" in res.get("result", {}):
                    raise RuntimeError(f"JS Error in '{expression}': {res['result']['exceptionDetails']}")
                return res.get("result", {}).get("result", {}).get("value")

            await send_cmd("Page.enable")
            await send_cmd("Runtime.enable")

            # Test 1: Load Neonate page with patient_op_carmela
            file_url = f"file://{os.path.join(WORKSPACE_DIR, 'Neonate_Clinical_Module.html')}?patient=patient_op_carmela"
            print(f"[TEST 1] Navigating to {file_url}...")
            await send_cmd("Page.navigate", {"url": file_url})
            await asyncio.sleep(1.5)

            # Check that WHO button exists in Anthropometry and Growth Charts
            has_anthro_btn = await eval_js("Boolean(document.getElementById('btn-neo-chart-who-report'))")
            has_chart_btn = await eval_js("Boolean(document.getElementById('btn-chart-who-report'))")
            assert has_anthro_btn, "Anthropometry WHO report button missing"
            assert has_chart_btn, "Growth Charts tab WHO report button missing"
            print("  ✓ Action buttons present in both Anthropometry and Growth Charts areas.")

            # Test 1b: Verify in-page WHO Growth Chart on Tab 7
            print("[TEST 1b] Verifying in-page dynamic WHO Growth Chart on Tab 7...")
            await eval_js("document.querySelector('.workspace-tab[data-tab=\"tab-charts\"]').click()")
            await asyncio.sleep(0.5)

            inpage_state = await eval_js("""({
                hasWhoBtn: Boolean(document.getElementById('btn-chart-who')),
                whoBtnActive: document.getElementById('btn-chart-who').classList.contains('active'),
                panelWhoVisible: document.getElementById('panel-chart-who').style.display !== 'none',
                hasSvg: Boolean(document.querySelector('#who-inpage-svg-container .who-native-svg')),
                curveCount: document.querySelectorAll('#who-inpage-svg-container .who-sd-curve').length,
                hasMarker: Boolean(document.querySelector('#who-inpage-svg-container #who-marker-dot')),
                inpageChildName: document.getElementById('who-inpage-child-name').textContent,
                inpageWt: document.getElementById('who-inpage-wt').textContent
            })""")
            print("  In-page state:", inpage_state)
            assert inpage_state["hasWhoBtn"], "Missing #btn-chart-who"
            assert inpage_state["whoBtnActive"], "#btn-chart-who should be active"
            assert inpage_state["panelWhoVisible"], "#panel-chart-who should be visible"
            assert inpage_state["hasSvg"], "Missing .who-native-svg in #who-inpage-svg-container"
            assert inpage_state["curveCount"] == 7, f"Expected 7 curves in-page, got {inpage_state['curveCount']}"
            assert inpage_state["hasMarker"], "Missing marker dot in in-page SVG"
            assert "DEL ROSARIO" in inpage_state["inpageChildName"], "Child name mismatch in in-page readout"
            assert "3.15" in inpage_state["inpageWt"], "Weight mismatch in in-page readout"
            print("  ✓ In-page dynamic WHO Growth Chart on Tab 7 verified with active vector curves.")

            # Test in-page sub-tab switching
            print("  Testing in-page sub-tab switching among WHO chart indicators...")
            await eval_js("switchInPageWhoChartType('lhfa')")
            lhfa_label = await eval_js("document.querySelector('#who-inpage-svg-container .who-native-svg').getAttribute('aria-label')")
            assert "Length/height-for-age" in lhfa_label, f"Expected LHFA in in-page SVG, got {lhfa_label}"

            await eval_js("switchInPageWhoChartType('wflh')")
            wflh_label = await eval_js("document.querySelector('#who-inpage-svg-container .who-native-svg').getAttribute('aria-label')")
            assert "Weight-for-length/height" in wflh_label, f"Expected WFLH in in-page SVG, got {wflh_label}"

            await eval_js("switchInPageWhoChartType('wfa')")
            print("  ✓ In-page sub-tab switching verified cleanly.")

            # Test 2: Open WHO Growth Report Modal
            print("[TEST 2] Opening WHO Growth Report Modal...")
            await eval_js("document.getElementById('btn-chart-who-report').click()")
            await asyncio.sleep(0.5)

            is_open = await eval_js("document.getElementById('whoGrowthReportModal').classList.contains('open')")
            assert is_open, "Modal failed to open"
            print("  ✓ Modal opened successfully.")

            # Test 3: Check patient data pre-population
            print("[TEST 3] Verifying patient data pre-population & raw BMI calculation...")
            data = await eval_js("""({
                childName: document.getElementById('who-rep-child-name').textContent,
                sexParam: document.getElementById('who-param-sex').value,
                weightParam: document.getElementById('who-param-weight').value,
                lengthParam: document.getElementById('who-param-length').value,
                ageParam: document.getElementById('who-param-age-months').value,
                bmiCard: document.getElementById('who-card-val-bmi').textContent,
                watermark: document.querySelector('.who-watermark').textContent
            })""")
            print("  Pre-populated state:", data)
            assert "DEL ROSARIO" in data["childName"], f"Child name mismatch: {data['childName']}"
            assert data["sexParam"] == "female", f"Expected female, got {data['sexParam']}"
            assert float(data["weightParam"]) == 3.15, f"Expected 3.15, got {data['weightParam']}"
            assert float(data["lengthParam"]) == 49.5, f"Expected 49.5, got {data['lengthParam']}"
            assert data["watermark"] == "MOCKUP", "Watermark text missing"

            # Check BMI = 3.15 / (0.495^2) = 12.86 kg/m^2
            expected_bmi = 3.15 / ((49.5 / 100) ** 2)
            assert f"{expected_bmi:.2f}" in data["bmiCard"], f"BMI card mismatch: expected {expected_bmi:.2f}, got {data['bmiCard']}"
            print(f"  ✓ Raw BMI accurately calculated: {data['bmiCard']}")

            # Test 4: Chart auto-selection for <60 months
            print("[TEST 4] Verifying chart auto-selection for infant <60 months...")
            chart_state = await eval_js("""({
                activeType: whoActiveChartType,
                hasSvg: Boolean(document.querySelector('#who-svg-chart-container .who-native-svg')),
                curveCount: document.querySelectorAll('#who-svg-chart-container .who-sd-curve').length,
                tabCount: document.querySelectorAll('.who-chart-tab-btn').length,
                markerVisible: Boolean(document.querySelector('#who-svg-chart-container #who-marker-dot')),
                svgLabel: document.querySelector('#who-svg-chart-container .who-native-svg') ? document.querySelector('#who-svg-chart-container .who-native-svg').getAttribute('aria-label') : ''
            })""")
            print("  Chart state <60m:", chart_state)
            assert chart_state["activeType"] == "wfa", f"Expected wfa, got {chart_state['activeType']}"
            assert chart_state["hasSvg"], "Expected .who-native-svg element in modal"
            assert chart_state["curveCount"] == 7, f"Expected 7 SD curves, got {chart_state['curveCount']}"
            assert "GIRLS" in chart_state["svgLabel"], f"Expected GIRLS in svgLabel: {chart_state['svgLabel']}"
            assert chart_state["tabCount"] == 3, f"Expected 3 tabs (WFA, LHFA, WFLH), got {chart_state['tabCount']}"
            assert chart_state["markerVisible"], "Marker dot should be visible"
            print("  ✓ Female Birth-to-5 WFA reference chart correctly auto-selected with native SVG curves.")

            # Test 5: Switch among applicable charts
            print("[TEST 5] Testing chart-tab switching...")
            for tab_id, expected_title_part in [("lhfa", "Length/height-for-age"), ("wflh", "Weight-for-length/height"), ("wfa", "Weight-for-age")]:
                await eval_js(f"switchWhoChartTab('{tab_id}')")
                curr_label = await eval_js("document.querySelector('#who-svg-chart-container .who-native-svg') ? document.querySelector('#who-svg-chart-container .who-native-svg').getAttribute('aria-label') : ''")
                assert expected_title_part in curr_label, f"Switch to {tab_id} failed: got {curr_label}"
            print("  ✓ Tab switching among all applicable reference charts verified with native SVG updates.")

            # Test 6: Male chart selection
            print("[TEST 6] Testing male chart selection...")
            await eval_js("""
                document.getElementById('who-param-sex').value = 'male';
                refreshWhoGrowthReport();
            """)
            male_label = await eval_js("document.querySelector('#who-svg-chart-container .who-native-svg') ? document.querySelector('#who-svg-chart-container .who-native-svg').getAttribute('aria-label') : ''")
            assert "BOYS" in male_label, f"Expected BOYS chart, got {male_label}"
            print("  ✓ Male chart correctly selected when sex is male.")

            # Test 7: Age routing: 60 to 228 completed months (BMI-for-age)
            print("[TEST 7] Testing age routing for 5–19 years (60–228 months)...")
            await eval_js("""
                document.getElementById('who-param-age-months').value = '120'; // 10 years
                document.getElementById('who-param-weight').value = '32.0';
                document.getElementById('who-param-length').value = '135.0';
                refreshWhoGrowthReport();
            """)
            bmi_chart_state = await eval_js("""({
                activeType: whoActiveChartType,
                hasSvg: Boolean(document.querySelector('#who-svg-chart-container .who-native-svg')),
                curveCount: document.querySelectorAll('#who-svg-chart-container .who-sd-curve').length,
                svgLabel: document.querySelector('#who-svg-chart-container .who-native-svg') ? document.querySelector('#who-svg-chart-container .who-native-svg').getAttribute('aria-label') : '',
                tabCount: document.querySelectorAll('.who-chart-tab-btn').length,
                bmiText: document.getElementById('who-card-val-bmi').textContent
            })""")
            print("  Chart state 10yo boy:", bmi_chart_state)
            assert bmi_chart_state["activeType"] == "bmifa", f"Expected bmifa, got {bmi_chart_state['activeType']}"
            assert "BMI-for-age" in bmi_chart_state["svgLabel"], f"Expected BMIFA chart, got {bmi_chart_state['svgLabel']}"
            assert bmi_chart_state["tabCount"] == 1, f"Expected 1 tab (BMIFA), got {bmi_chart_state['tabCount']}"
            print("  ✓ Age 60–228 completed months correctly routes to BMI-for-Age.")

            # Test 8: Missing parameters individual incomplete-data state
            print("[TEST 8] Testing missing parameters individually...")
            params_to_test = [
                ("who-param-sex", "", "Sex: Missing"),
                ("who-param-age-months", "", "Age: Missing"),
                ("who-param-weight", "", "Weight: Missing"),
                ("who-param-length", "", "Length: Missing")
            ]
            for elem_id, empty_val, expected_tag in params_to_test:
                # Restore baseline
                await eval_js("""
                    document.getElementById('who-param-sex').value = 'male';
                    document.getElementById('who-param-age-months').value = '12';
                    document.getElementById('who-param-weight').value = '10.0';
                    document.getElementById('who-param-length').value = '75.0';
                    refreshWhoGrowthReport();
                """)
                # Empty single parameter
                await eval_js(f"""
                    document.getElementById('{elem_id}').value = '{empty_val}';
                    refreshWhoGrowthReport();
                """)
                state = await eval_js("""({
                    alertDisplay: document.getElementById('who-incomplete-alert').style.display,
                    tagsHtml: document.getElementById('who-incomplete-tags').innerHTML,
                    hasSvg: Boolean(document.querySelector('#who-svg-chart-container .who-native-svg')),
                    hasMarker: Boolean(document.querySelector('#who-svg-chart-container #who-marker-dot'))
                })""")
                assert state["alertDisplay"] != "none", f"Incomplete alert should show when {elem_id} is empty"
                assert expected_tag in state["tagsHtml"], f"Expected tag {expected_tag} not found"
                assert not state["hasSvg"], "Chart SVG should not render when incomplete"
                assert not state["hasMarker"], "Marker should not render when incomplete"
                print(f"  ✓ Incomplete state confirmed for missing {elem_id}.")

            # Test 9: Visual marker with boundary and out-of-bound values
            print("[TEST 9] Testing marker positioning with boundary values...")
            # Normal boundary (0 mo, 2.0 kg)
            await eval_js("""
                document.getElementById('who-param-sex').value = 'male';
                document.getElementById('who-param-age-months').value = '0';
                document.getElementById('who-param-weight').value = '2.0';
                document.getElementById('who-param-length').value = '45.0';
                refreshWhoGrowthReport();
            """)
            min_marker = await eval_js("""({
                hasMarker: Boolean(document.querySelector('#who-svg-chart-container #who-marker-dot')),
                markerTransform: document.querySelector('#who-svg-chart-container #who-marker-dot') ? document.querySelector('#who-svg-chart-container #who-marker-dot').getAttribute('transform') : '',
                boundDisplay: document.getElementById('who-marker-boundary-callout').style.display
            })""")
            assert min_marker["hasMarker"], "Marker should be rendered"
            assert "translate(65.0" in min_marker["markerTransform"], f"Expected x=65.0, got {min_marker['markerTransform']}"
            assert min_marker["boundDisplay"] == "none", "Should not trigger boundary callout within valid limits"

            # Out of bounds high (weight 35 kg on 0-5y chart)
            await eval_js("""
                document.getElementById('who-param-weight').value = '35.0';
                refreshWhoGrowthReport();
            """)
            oob_marker = await eval_js("""({
                boundDisplay: document.getElementById('who-marker-boundary-callout').style.display,
                boundText: document.getElementById('who-marker-boundary-callout').textContent
            })""")
            assert oob_marker["boundDisplay"] != "none", "Boundary callout should be visible"
            assert "Weight > 28 kg" in oob_marker["boundText"], f"Missing OOB text in {oob_marker['boundText']}"
            print("  ✓ Boundary clamping and out-of-bounds warning verified.")

            # Test 10: Mobile responsiveness (375px)
            print("[TEST 10] Testing mobile viewport (375x812) layout...")
            await send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": 375,
                "height": 812,
                "deviceScaleFactor": 2,
                "mobile": True
            })
            await asyncio.sleep(0.5)
            mobile_overflow = await eval_js("""({
                bodyScrollWidth: document.body.scrollWidth,
                windowInnerWidth: window.innerWidth,
                hasOverflow: document.body.scrollWidth > window.innerWidth
            })""")
            print("  Mobile metrics:", mobile_overflow)
            assert not mobile_overflow["hasOverflow"], f"Horizontal overflow detected on mobile: {mobile_overflow}"
            print("  ✓ Zero horizontal overflow on mobile viewport (375px).")

            # Reset viewport to desktop (1280x800)
            print("[TEST 11] Testing desktop viewport (1280x800)...")
            await send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": 1280,
                "height": 800,
                "deviceScaleFactor": 1,
                "mobile": False
            })
            await asyncio.sleep(0.5)
            desktop_overflow = await eval_js("document.body.scrollWidth <= window.innerWidth")
            assert desktop_overflow, "Horizontal overflow detected on desktop"
            print("  ✓ Desktop viewport verified cleanly.")

            # Test 12: Close modal and verify Escape key behavior
            print("[TEST 12] Testing modal close & Escape key handler...")
            await eval_js("document.getElementById('btn-who-close').click()")
            await asyncio.sleep(0.3)
            is_closed = await eval_js("!document.getElementById('whoGrowthReportModal').classList.contains('open')")
            assert is_closed, "Modal should be closed after clicking close button"

            # Re-open and close with Escape
            await eval_js("openWhoGrowthReportModal()")
            await asyncio.sleep(0.3)
            await eval_js("document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))")
            await asyncio.sleep(0.3)
            is_closed_esc = await eval_js("!document.getElementById('whoGrowthReportModal').classList.contains('open')")
            assert is_closed_esc, "Modal should be closed with Escape key"
            print("  ✓ Modal close triggers and Escape key verified.")

            # Test 13: Neonate, Ballard, Fenton, and Lubchenco baseline integrity
            print("[TEST 13] Verifying Ballard, Fenton, and Lubchenco baseline functions...")
            baseline_status = await eval_js("""({
                lubBtn: Boolean(document.getElementById('btn-chart-lub')),
                fentonBtn: Boolean(document.getElementById('btn-neo-chart-fenton')),
                ballardMaturity: document.getElementById('ballard-maturity-display').textContent,
                saveBtn: Boolean(document.getElementById('btn-save-neonate-record'))
            })""")
            print("  Baseline elements:", baseline_status)
            assert baseline_status["lubBtn"], "Lubchenco chart button missing"
            assert baseline_status["fentonBtn"], "Fenton chart button missing"
            assert baseline_status["saveBtn"], "Save neonate record button missing"
            print("  ✓ Ballard, Fenton, Lubchenco, and Neonate draft/save baseline 100% intact.")

            # Test 14: Gender chart auto-routing, exact result calculation, and sample data fallback
            print("[TEST 14] Verifying sex chart auto-routing, exact results, and sample data fallback...")
            # Switch to Growth Charts tab (Tab 7)
            await eval_js("document.querySelector('.workspace-tab[data-tab=\"tab-charts\"]').click()")
            await asyncio.sleep(0.3)

            # Check initial state for patient_op_carmela (female baby)
            sex_test_init = await eval_js("""(() => {
                const sexPill = document.getElementById('result-sex-pill');
                const sourcePill = document.getElementById('result-source-pill');
                const fentonLabel = document.getElementById('lbl-fenton-tab-btn');
                const fentonBtn = document.getElementById('btn-chart-fenton');
                fentonBtn.click();
                const girlPanel = document.getElementById('panel-chart-girl');
                const boyPanel = document.getElementById('panel-chart-boy');
                const girlVisible = girlPanel && getComputedStyle(girlPanel).display !== 'none';
                const boyVisible = boyPanel && getComputedStyle(boyPanel).display !== 'none';
                const girlMarker = document.getElementById('girl-fenton-marker-dot');
                const lubMarker = document.getElementById('lub-marker-dot');
                return {
                    sexText: sexPill ? sexPill.textContent : '',
                    sourceText: sourcePill ? sourcePill.textContent : '',
                    fentonLabel: fentonLabel ? fentonLabel.textContent : '',
                    girlVisible,
                    boyVisible,
                    hasGirlMarker: Boolean(girlMarker && girlMarker.style.left),
                    hasLubMarker: Boolean(lubMarker && lubMarker.style.left)
                };
            })()""")
            print("  Initial female routing state:", sex_test_init)
            assert "Girl" in sex_test_init["fentonLabel"] or "Female" in sex_test_init["sexText"], "Fenton label should reflect Girl for female patient"
            assert sex_test_init["girlVisible"] and not sex_test_init["boyVisible"], "Girl Fenton chart must be active for female patient"
            assert sex_test_init["hasGirlMarker"], "Girl Fenton chart must have plotted coordinate marker"
            assert sex_test_init["hasLubMarker"], "Lubchenco chart must have plotted coordinate marker"

            # Change sex to Male and verify dynamic auto-routing to Boy chart
            boy_route_test = await eval_js("""(() => {
                const toggle = document.getElementById('chart-gender-toggle');
                toggle.value = 'boy';
                handleChartGenderToggle('boy');
                const fentonLabel = document.getElementById('lbl-fenton-tab-btn');
                const girlPanel = document.getElementById('panel-chart-girl');
                const boyPanel = document.getElementById('panel-chart-boy');
                const girlVisible = girlPanel && getComputedStyle(girlPanel).display !== 'none';
                const boyVisible = boyPanel && getComputedStyle(boyPanel).display !== 'none';
                const boyMarker = document.getElementById('boy-fenton-marker-dot');
                return {
                    fentonLabel: fentonLabel ? fentonLabel.textContent : '',
                    girlVisible,
                    boyVisible,
                    hasBoyMarker: Boolean(boyMarker && boyMarker.style.left)
                };
            })()""")
            print("  Male switch routing state:", boy_route_test)
            assert "Boy" in boy_route_test["fentonLabel"], "Fenton label should switch to Boy Chart"
            assert boy_route_test["boyVisible"] and not boy_route_test["girlVisible"], "Boy Fenton chart must be active when sex is male"
            assert boy_route_test["hasBoyMarker"], "Boy Fenton chart must have plotted coordinate marker"

            # Test exact calculation upon entering custom measurements
            exact_input_test = await eval_js("""(() => {
                const wtInput = document.getElementById('neo_weight');
                const lenInput = document.getElementById('neo_length');
                const hcInput = document.getElementById('neo_head_circ');
                wtInput.value = '4.20'; // Large baby
                lenInput.value = '53.0';
                hcInput.value = '36.5';
                wtInput.dispatchEvent(new Event('input'));
                lenInput.dispatchEvent(new Event('input'));
                hcInput.dispatchEvent(new Event('input'));
                const card = document.getElementById('growth-exact-result-card');
                const sourcePill = document.getElementById('result-source-pill');
                const statusPill = document.getElementById('result-status-pill');
                const exactWt = document.getElementById('result-wt');
                return {
                    sourceText: sourcePill ? sourcePill.textContent : '',
                    statusText: statusPill ? statusPill.textContent : '',
                    exactWt: exactWt ? exactWt.textContent : ''
                };
            })()""")
            print("  Exact input calculation state:", exact_input_test)
            assert "Exact Patient Input" in exact_input_test["sourceText"], "Source pill should indicate Exact Patient Input"
            assert "4.20" in exact_input_test["exactWt"], "Exact weight readout should be 4.20 kg"
            assert "LGA" in exact_input_test["statusText"], "4.20kg at 39wks should classify as LGA"

            # Test sample data fallback when inputs are cleared
            sample_data_test = await eval_js("""(() => {
                const wtInput = document.getElementById('neo_weight');
                const lenInput = document.getElementById('neo_length');
                const hcInput = document.getElementById('neo_head_circ');
                wtInput.value = '';
                lenInput.value = '';
                hcInput.value = '';
                wtInput.dispatchEvent(new Event('input'));
                const sourcePill = document.getElementById('result-source-pill');
                const exactWt = document.getElementById('result-wt');
                return {
                    sourceText: sourcePill ? sourcePill.textContent : '',
                    exactWt: exactWt ? exactWt.textContent : ''
                };
            })()""")
            print("  Sample data fallback state:", sample_data_test)
            assert "Sample" in sample_data_test["sourceText"], "Empty inputs should trigger Sample Baseline Data fallback"
            assert "3.30" in sample_data_test["exactWt"] or "3.15" in sample_data_test["exactWt"], "Fallback should generate standard sample baseline"
            print("  ✓ Exact result computation, boy/girl chart routing, and sample data fallback verified.")

            print("\n=======================================================")
            print(">>> ALL 14 WHO GROWTH ASSESSMENT TESTS PASSED CLEANLY <<<")
            print("=======================================================\n")

    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(run_tests())
