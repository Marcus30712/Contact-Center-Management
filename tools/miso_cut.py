"""Cut Miso's profile and twelve expressions out of the source art.

Sources (made by Marcus Shim with Google Gemini) live in art/miso/. The
beige background is made transparent so the pictures sit well on light and
dark screens; app icons keep an opaque background.

Run from the repository root:  python3 tools/miso_cut.py
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'art' / 'miso'
OUT = ROOT / 'assets' / 'miso'
ICONS = ROOT / 'icons'

# Sheet layout: six columns split by thin lines, a label strip on top, two rows.
COLUMNS = [(0, 188), (196, 358), (367, 526), (533, 694), (703, 858), (868, 1024)]
ROWS = [(58, 296), (300, 572)]
NAMES = [
    ['smile', 'joy', 'sparkle', 'think', 'surprise', 'worry'],
    ['grin', 'proud', 'ponder', 'nervous', 'cheer', 'wink'],
]
BG_TOLERANCE = 18   # sum of channel differences; skin sits about 30 away
MIN_HOLE = 25       # enclosed background patches at least this big are cleared


def clear_background(rgb: np.ndarray) -> np.ndarray:
    """Return RGBA with the background (and enclosed background gaps) transparent."""
    bg = np.median(np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]), axis=0)
    near = np.abs(rgb.astype(int) - bg).sum(axis=2) < BG_TOLERANCE
    labels, count = ndimage.label(near)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    sizes = ndimage.sum(near, labels, range(1, count + 1))
    clear = np.zeros_like(near)
    for i, size in enumerate(sizes, start=1):
        if i in border or size >= MIN_HOLE:
            clear |= labels == i
    alpha = np.where(clear, 0, 255).astype(np.uint8)
    return np.dstack([rgb, alpha])


def crop_to_content(rgba: np.ndarray, pad: int = 4) -> np.ndarray:
    ys, xs = np.nonzero(rgba[:, :, 3])
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, rgba.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, rgba.shape[1])
    return rgba[y0:y1, x0:x1]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    sheet = np.array(Image.open(ART / 'expressions-source.png').convert('RGB'))
    cuts = {}
    for r, (y0, y1) in enumerate(ROWS):
        for c, (x0, x1) in enumerate(COLUMNS):
            cuts[NAMES[r][c]] = crop_to_content(clear_background(sheet[y0:y1, x0:x1]))
    # One canvas size for every expression, feet on the bottom edge, so the
    # character does not jump when the expression changes.
    width = max(a.shape[1] for a in cuts.values())
    height = max(a.shape[0] for a in cuts.values())
    for name, art in cuts.items():
        canvas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        canvas.paste(Image.fromarray(art), ((width - art.shape[1]) // 2, height - art.shape[0]))
        canvas.save(OUT / f'{name}.webp', quality=92, method=6)

    profile_rgb = np.array(Image.open(ART / 'profile-source.png').convert('RGB'))
    profile = Image.fromarray(crop_to_content(clear_background(profile_rgb)))
    profile.thumbnail((512, 512), Image.LANCZOS)
    profile.save(OUT / 'profile.webp', quality=92, method=6)

    # Icons: the head on the original cream background, opaque.
    source = Image.open(ART / 'profile-source.png').convert('RGB')
    head = source.crop((262, 96, 762, 596))
    for size in (192, 512):
        head.resize((size, size), Image.LANCZOS).save(ICONS / f'icon-{size}.png', optimize=True)
    # Maskable: launchers may crop to a circle, so keep the face in the middle 80%.
    bg = tuple(int(v) for v in np.array(source)[5, 5])
    mask = Image.new('RGB', (512, 512), bg)
    mask.paste(head.resize((400, 400), Image.LANCZOS), (56, 56))
    mask.save(ICONS / 'icon-maskable-512.png', optimize=True)
    head.resize((180, 180), Image.LANCZOS).save(ICONS / 'apple-touch-icon.png', optimize=True)


if __name__ == '__main__':
    main()
