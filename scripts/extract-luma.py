"""Extract retained Luma source data and byte-identical fonts from origin.html.

This deliberately reads only the uploaded HTML. It does not fetch or execute it.
The grammar adapter in public/luma/language.js is authored separately.
"""
from pathlib import Path
import base64
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/luma"
source = (OUT / "origin.html").read_bytes()
assert hashlib.sha256(source).hexdigest() == "86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668"
html = source.decode("utf-8")
scripts = re.findall(r"<script([^>]*)>(.*?)</script>", html, re.S)
data = json.loads(scripts[0][1])
celestial = json.loads(scripts[2][1])
assert "luma-data" in scripts[0][0] and "celestial-data" in scripts[2][0]


def js(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


out = ["// Extracted by scripts/extract-luma.py from the retained uploaded artwork.\n"]
for name, value in [
    ("ALPHABET", "".join(x["letter"] for x in data["alphabet"]["letters"])),
    ("FEATURES", data["alphabet"]["featureOrder"]),
    ("LETTERS", data["alphabet"]["letters"]),
    ("LEXICON", data["lexicon"]["roots"]),
    ("GLYPHS", data["glyphs"]),
    ("NATIVE_SCRIPT", data["nativeScript"]),
    ("NUMERAL_SCRIPT", data["numeralScript"]),
    ("RATIO_NAMES", celestial["register"]["music"]["ratios"]),
    ("CATALOG_TO_SCENE", data["astronomy"]["catalogToSceneMatrixRows"]),
    ("PROVENANCE", {
        "source": "origin.html",
        "sourceSha256": hashlib.sha256(source).hexdigest(),
        "edition": "3.4",
        "alphabet": data["alphabet"]["name"],
        "codingConventions": data["alphabet"]["codingConventions"],
        "glyphRule": data["alphabet"]["glyphRule"],
        "featureCodeRule": data["alphabet"]["featureCodeRule"],
        "music": celestial["register"]["music"],
        "adaptation": "Anima's game grammar and physical constructions are new compositions using the unchanged Luma inventory."
    }),
]:
    out.append(f"export const {name} = {js(value)};\n")
out.append("export const RATIOS = Object.freeze([1,9/8,5/4,3/2,5/3]);\n")
out.append("export const ROOTS = Object.freeze(Object.keys(LEXICON));\n")
out.append("export const DICTIONARY = Object.freeze(ROOTS.flatMap(root => [...'aeiou'].map(ending => Object.freeze({word:root+ending,root,ending,gloss:LEXICON[root][ending],domain:LEXICON[root].domain,class:({a:'noun',e:'quality',i:'verb',o:'agent',u:'manner'})[ending]}))));\n")
(OUT / "data.js").write_text("".join(out), encoding="utf-8")

records = []

def walk(value, path="register"):
    if isinstance(value, dict):
        if "ast" in value:
            records.append({"path": path, **value})
        else:
            for key, child in value.items():
                walk(child, path + "/" + key)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            walk(child, path + "/" + str(i))


walk(celestial["register"])
assert len(records) == 41
(OUT / "source-register.json").write_text(json.dumps({
    "source": "origin.html#celestial-data",
    "sourceSha256": hashlib.sha256(source).hexdigest(),
    "records": records,
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

numbers = scripts[1][1].split("const LumaNumbers=(()=>{", 1)[1].split("\n})();", 1)[0]
names = numbers.rsplit("return {", 1)[1].split("}", 1)[0]
(OUT / "numbers.js").write_text(
    "// Exact numeral core extracted unchanged from the uploaded source.\n"
    + "export const LumaNumbers=(()=>{" + numbers + "\n})();\n"
    + "export const {" + names + "} = LumaNumbers;\n"
    + "export default LumaNumbers;\n", encoding="utf-8")

ttf = base64.b64decode(data["nativeFontTtf"].split(",", 1)[1])
woff = re.search(r"data:font/woff2;base64,([A-Za-z0-9+/=]+)", html)
assert woff is not None
woff2 = base64.b64decode(woff[1])
assert len(ttf) == 12812 and len(woff2) == 3300
(OUT / "Luma-Origin-Prefinal.ttf").write_bytes(ttf)
(OUT / "Luma-Origin-Prefinal.woff2").write_bytes(woff2)
print(json.dumps({"sourceBytes": len(source), "letters": len(data["alphabet"]["letters"]),
    "roots": len(data["lexicon"]["roots"]), "sourceAstRecords": len(records),
    "ttfSha256": hashlib.sha256(ttf).hexdigest(), "woff2Sha256": hashlib.sha256(woff2).hexdigest()}))
