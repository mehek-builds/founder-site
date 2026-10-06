# The real photo the pixel build resolves into: same crop as pix.py, background
# removed with the Vision mask. usage: python3 cutout.py OUT.webp (repo root, after mask.swift)
import sys
from PIL import Image

COLS, ROWS = 96, 112
img = Image.open('public/headshot.jpg').convert('RGB')
mask = Image.open('/tmp/pixel-mask.png').convert('L')
top, bot, cx = 600, 1760, 712
H = bot - top
W = int(H * COLS / ROWS)
box = (cx - W // 2, top, cx - W // 2 + W, bot)
out = img.crop(box)
out.putalpha(mask.crop(box))
out = out.resize((COLS * 7, ROWS * 7), Image.Resampling.LANCZOS)
out.save(sys.argv[1], quality=88, method=6)
print(out.size)
