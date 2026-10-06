# Pixelate the cut-out headshot into a COLS x ROWS RGBA grid.
# usage: python3 pix.py COLS ROWS COLORS OUT.png   (run from the repo root, after mask.swift)
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

COLS, ROWS, COLORS, OUT = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
img = Image.open('public/headshot.jpg').convert('RGB')
mask = Image.open('/tmp/pixel-mask.png').convert('L')

# Head and shoulders, centred on the face.
top, bot, cx = 600, 1760, 712
H = bot - top
W = int(H * COLS / ROWS)
box = (cx - W // 2, top, cx - W // 2 + W, bot)
img, mask = img.crop(box), mask.crop(box)

# A little crispness before the downsample so features survive it.
img = img.filter(ImageFilter.UnsharpMask(radius=6, percent=60, threshold=2))
img = ImageEnhance.Contrast(img).enhance(1.06)
img = ImageEnhance.Color(img).enhance(1.08)

# Premultiply by the mask so the hallway never bleeds into edge pixels.
a = np.asarray(img).astype(float) / 255
m = np.asarray(mask).astype(float) / 255
pre = Image.fromarray((a * m[..., None] * 255).astype(np.uint8))
small = np.asarray(pre.resize((COLS, ROWS), Image.Resampling.BOX)).astype(float)
cover = np.asarray(mask.resize((COLS, ROWS), Image.Resampling.BOX)).astype(float) / 255
filled = cover > 0.5
rgb = np.where(filled[..., None], small / np.maximum(cover, 1e-3)[..., None], 0)
rgb = np.clip(rgb, 0, 255).astype(np.uint8)

# Limited palette, no dithering: reads as pixel art, keeps real skin tones.
q = Image.fromarray(rgb).quantize(colors=COLORS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
out = np.zeros((ROWS, COLS, 4), np.uint8)
out[..., :3] = np.asarray(q.convert('RGB'))
out[..., 3] = np.where(filled, 255, 0)
Image.fromarray(out, 'RGBA').save(OUT)
prev = Image.new('RGBA', (COLS, ROWS), (240, 237, 229, 255))
prev.alpha_composite(Image.fromarray(out, 'RGBA'))
prev.resize((COLS * 6, ROWS * 6), Image.Resampling.NEAREST).save(OUT.replace('.png', '-preview.png'))
print(filled.sum())
