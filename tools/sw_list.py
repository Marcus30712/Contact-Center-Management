"""Write sw.js: the offline worker with the list of files to keep and a version.

Run from the repository root after changing any page file:
    python3 tools/sw_list.py
agent-lifecycle/tests/sw.test.js fails if the list or version is out of date.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {'.git', 'node_modules', 'docs', 'art', 'tools', '.superpowers', '.worktrees', 'tests', 'scripts'}
KEEP = ('.html', '.js', '.css', '.webp', '.png', '.webmanifest')


def runtime_files(folder: Path = ROOT) -> list:
    out = []
    for path in sorted(folder.iterdir(), key=lambda p: p.name):
        if path.is_dir():
            if path.name not in SKIP_DIRS:
                out += runtime_files(path)
            continue
        rel = path.relative_to(ROOT).as_posix()
        if path.name.endswith(KEEP) and rel != 'sw.js' and not rel.endswith('.test.js'):
            out.append(rel)
    return out


def main() -> None:
    files = runtime_files()
    digest = hashlib.sha256()
    for rel in files:
        digest.update(rel.encode())
        digest.update((ROOT / rel).read_bytes())
    version = digest.hexdigest()[:12]
    folders = [f[: -len('index.html')] or './' for f in files if f.endswith('index.html')]
    precache = sorted(files + folders)
    template = (ROOT / 'tools' / 'sw.template.js').read_text(encoding='utf-8')
    body = template.replace('__VERSION__', version).replace('__PRECACHE__', json.dumps(precache, indent=2))
    (ROOT / 'sw.js').write_text(body, encoding='utf-8')
    print(f'sw.js: {len(precache)} entries, version {version}')


if __name__ == '__main__':
    main()
