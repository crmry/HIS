#!/usr/bin/env python3
"""
HIS Fast Component & Section Locator (Zero-Token-Waste Engine)
Usage:
  python .agents/skills/his-expert/scripts/locate.py <keyword-or-selector> [file]
Example:
  python .agents/skills/his-expert/scripts/locate.py addContinuousMedRow
  python .agents/skills/his-expert/scripts/locate.py id="floating-req-toolkit"
  python .agents/skills/his-expert/scripts/locate.py setDashboardReadOnly dashboard_er_inpatient.html
"""

import sys
import os
import re

# Ensure standard output can print Unicode characters on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

FILES_TO_CHECK = ["dashboard.html", "dashboard_er_inpatient.html"]

def locate_file(query, filepath, filename):
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filename}")
        return

    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    total_lines = len(lines)
    regex = re.compile(re.escape(query), re.IGNORECASE)

    matches = [idx + 1 for idx, line in enumerate(lines) if regex.search(line)]

    print(f"=== LOCATOR: '{query}' in {filename} (Total: {total_lines} lines) ===")
    if not matches:
        print(f"  No occurrences found.")
        return

    print(f"  Found {len(matches)} match(es) at line(s): {matches[:8]}{'...' if len(matches) > 8 else ''}")

    shown_ranges = []
    for line_num in matches[:3]:
        start = max(1, line_num - 2)
        end = min(total_lines, line_num + 3)
        if any(r[0] <= start and end <= r[1] for r in shown_ranges):
            continue
        shown_ranges.append((start, end))

        print(f"\n  [replace_file_content helper: StartLine={start}, EndLine={end}]")
        for i in range(start, end + 1):
            marker = ">>>" if i == line_num else "   "
            raw_line = lines[i-1].rstrip()
            print(f"  {marker} {i:5d}: {raw_line}")
    print()

def main():
    if len(sys.argv) < 2:
        print("Usage: python .agents/skills/his-expert/scripts/locate.py <query> [filename]")
        sys.exit(1)

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

    # Check if a specific file was passed as last argument
    target_files = []
    if len(sys.argv) > 2 and any(sys.argv[-1].endswith(ext) for ext in [".html", ".js", ".css", ".py"]):
        target_files = [sys.argv[-1]]
        query = " ".join(sys.argv[1:-1])
    else:
        target_files = FILES_TO_CHECK
        query = " ".join(sys.argv[1:])

    query = query.strip('"\'')

    for fn in target_files:
        fp = os.path.join(base_dir, fn)
        if not os.path.exists(fp):
            fp = fn
        locate_file(query, fp, fn)

if __name__ == "__main__":
    main()
