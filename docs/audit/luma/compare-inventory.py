#!/usr/bin/env python3
"""Compare recovered supporting files with the surviving pre-cleanup inventory.

Hash equality proves byte identity, not semantic reading or runtime behavior.
"""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[3]
folder = root / 'docs/audit/luma'
old = json.loads((folder / 'pre-cleanup-file-inventory.json').read_text())
rows = []
for source in old:
    path = root / source['path']
    current = path.read_bytes() if path.is_file() else None
    digest = hashlib.sha256(current).hexdigest() if current is not None else None
    rows.append({
        **source,
        'currentBytes': len(current) if current is not None else None,
        'currentSha256': digest,
        'status': 'missing' if current is None else 'identical' if digest == source['sha256'] else 'changed',
    })
report = {
    'schema': 'anima-luma-recovery-comparison-1',
    'scope': 'Current byte comparison against the surviving earlier supporting-file inventory; not a fresh reading certificate.',
    'count': len(rows),
    'summary': {kind: sum(row['status'] == kind for row in rows) for kind in ['identical', 'changed', 'missing']},
    'files': rows,
}
(folder / 'recovery-comparison.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report['summary']))
