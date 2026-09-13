#!/usr/bin/env python3
"""Reproduce structural checks of the preserved upload; does not certify reading."""
from __future__ import annotations

import base64
import hashlib
import io
import json
import math
from pathlib import Path
import re
import struct
import wave

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
ORIGIN = ROOT / "public/luma/origin.html"
EXPECTED = "86f7c110a82587eb50f302def2261b5ae9b431a41cdabf46b8f48a6c7a8f0668"


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def walk(value, path=""):
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, f"{path}.{key}" if path else key)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, f"{path}[{index}]")


def main():
    raw = ORIGIN.read_bytes()
    assert sha(raw) == EXPECTED, "The upload bytes changed; do not silently rewrite provenance"
    text = raw.decode("utf-8")
    blocks = list(re.finditer(r"<script\b([^>]*)>([\s\S]*?)</script\s*>", text, re.I))
    assert len(blocks) == 7
    scripts = [{"index": index, "attributes": match[1].strip(),
                "characters": len(match[2]), "utf8Bytes": len(match[2].encode()),
                "sha256": sha(match[2].encode()),
                "kind": "json" if "application/json" in match[1] else "executable"}
               for index, match in enumerate(blocks)]
    luma = json.loads(blocks[0][2])
    celestial = json.loads(blocks[2][2])
    tree = {"luma": luma, "celestial": celestial}
    values = list(walk(tree))
    numbers = [(p, v) for p, v in values if isinstance(v, (float, int)) and not isinstance(v, bool)]
    assert all(math.isfinite(v) for _, v in numbers)
    letters = luma["alphabet"]["letters"]
    assert "".join(x["letter"] for x in letters) == "aeioupbmfwtdnslkghry"
    assert len(letters) == 20 and len(luma["lexicon"]["roots"]) == 180
    for index, row in enumerate(letters):
        assert row["ordinal"] == index
        assert len(row["featureVector"]) == 16
        assert set(row["featureVector"]) <= {0, 1}
        assert row["featureCode"] == sum(bit << i for i, bit in enumerate(row["featureVector"]))
        assert row["musicalPair"] == [index // 5, index % 5]
    roots = luma["lexicon"]["roots"]
    forms = [(root + suffix, row[suffix]) for root, row in roots.items() for suffix in "aeiou"]
    assert len(forms) == len({word for word, _ in forms}) == 900

    audio = []
    data_uris = [(p, v) for p, v in values if isinstance(v, str) and v.startswith("data:")]
    for path, uri in data_uris:
        mime, encoded = uri.split(",", 1)
        data = base64.b64decode(encoded, validate=True)
        if "audio" not in mime:
            continue
        with wave.open(io.BytesIO(data), "rb") as wav:
            width, channels, rate, frames = wav.getsampwidth(), wav.getnchannels(), wav.getframerate(), wav.getnframes()
            pcm = wav.readframes(frames)
        assert width == 2 and channels == 1 and rate == 24000
        samples = struct.unpack("<" + "h" * (len(pcm) // 2), pcm)
        audio.append({"path": path, "bytes": len(data), "sha256": sha(data),
                      "sampleWidthBytes": width, "channels": channels, "sampleRateHz": rate,
                      "frames": frames, "sampleCount": len(samples),
                      "minSample": min(samples), "maxSample": max(samples),
                      "sampleRms": math.sqrt(sum(x * x for x in samples) / len(samples))})
    membrane = luma["membrane"]
    grid_values = []
    for scene in membrane["scenes"]:
        grid = scene["rms_displacement_m"]
        assert len(grid) == 53 and all(len(row) == 65 for row in grid)
        grid_values.extend(value for row in grid for value in row)
        assert all(value >= 0 and math.isfinite(value) for row in grid for value in row)
    assert len(grid_values) == 51675
    assert len(audio) == 16

    history_values = list(walk({k: celestial[k] for k in ["western", "alchemy", "jyotisha", "solarTerms", "sources"]}))
    history_strings = [(p, v) for p, v in history_values if isinstance(v, str)]
    distinct = {v for _, v in history_strings}
    register = [p for p, value in walk(celestial["register"], "register")
                if isinstance(value, dict) and "latin" in value and "ast" in value]
    assert len(register) == 41
    jyotisha = celestial["jyotisha"]
    assert len(jyotisha["nakshatras"]) == 27
    assert sum(len(row["padas"]) for row in jyotisha["nakshatras"]) == 108
    assert len(jyotisha["selectedNamingVariants"]) == 19
    assert all(row["traditionalPictorialEmblem"] is None for row in jyotisha["nakshatras"])
    report = {
        "schema": "anima-luma-source-structure-1",
        "scope": "Fresh deterministic structural and byte checks. Counts do not prove semantic reading, historical truth, pronunciation, listening, or rendered visual quality.",
        "source": {"path": "public/luma/origin.html", "uploadedName": "Luma_Origin_Living_Artwork(2).html",
                   "utf8Bytes": len(raw), "unicodeCodepoints": len(text), "sha256": sha(raw)},
        "scripts": scripts,
        "json": {"numericValuesVisited": len(numbers), "allNumbersFinite": True,
                 "lumaKeys": list(luma), "celestialKeys": list(celestial)},
        "language": {"alphabet": "".join(x["letter"] for x in letters), "letters": len(letters),
                     "featuresPerLetter": 16, "roots": len(roots), "dictionaryForms": len(forms),
                     "nativeLetters": len(luma["nativeScript"]["letters"]),
                     "compactDigits": len(luma["numeralScript"]["digits"]),
                     "sourceRegisterRecords": len(register), "registerPaths": register},
        "celestialReferences": {"stringOccurrences": len(history_strings), "distinctStringValues": len(distinct),
                                "distinctStringCharacters": sum(map(len, distinct)),
                                "sourceRecords": len(celestial["sources"]), "nakshatras": 27,
                                "padas": 108, "selectedNamingDifferences": 19, "solarTerms": len(celestial["solarTerms"]["terms"]),
                                "historicalAccessRecordsAreInherited": True},
        "membrane": {"scenes": len(membrane["scenes"]), "rows": 53, "columns": 65,
                     "valuesVisited": len(grid_values), "minimum": min(grid_values), "maximum": max(grid_values),
                     "meaning": membrane["quantity"]},
        "audio": {"recordings": len(audio), "totalSamplesVisited": sum(row["sampleCount"] for row in audio), "files": audio},
    }
    target = OUT / "source-structure.json"
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"sourceSha256": sha(raw), "output": str(target.relative_to(ROOT)), "numbers": len(numbers),
                      "audioFiles": len(audio), "audioSamples": report["audio"]["totalSamplesVisited"],
                      "registerRecords": len(register), "historicalStrings": len(history_strings)}))


if __name__ == "__main__":
    main()
