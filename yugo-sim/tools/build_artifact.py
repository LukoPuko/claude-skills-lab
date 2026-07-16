#!/usr/bin/env python3
"""Derive a self-contained single-file build (for a Claude Artifact / offline play)
from public/index.html: inline strings.js, drop the ES-module import and the external
background image, so the page has zero external dependencies (CSP-safe)."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "public" / "index.html").read_text()
strings = (root / "public" / "strings.js").read_text()

# strings.js -> inline `const STR = {...}`
strings_inline = strings.replace("export const STR", "const STR").strip()

# pull the <style> block and the <script type="module"> block
style = re.search(r"<style>(.*?)</style>", html, re.S).group(1)
script = re.search(r'<script type="module">(.*?)</script>', html, re.S).group(1)

# remove the import line and the external background loader; keep procedural fallback
script = re.sub(r'^\s*import \{ STR \} from "\./strings\.js";\s*$', "", script, flags=re.M)
script = re.sub(r'^\s*loadImg\("bg",.*?\);\s*$', "  // (background is procedural in the self-contained build)", script, flags=re.M)

out = f"""<style>
{style}
</style>
<canvas id="c"></canvas><div id="dev"></div>
<script>
{strings_inline}
{script}
</script>
"""
dist = root / "dist"
dist.mkdir(exist_ok=True)
(dist / "yugo-simulator.html").write_text(out)
print("wrote", dist / "yugo-simulator.html", len(out), "bytes")
