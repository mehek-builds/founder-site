# Pixel portrait recipe

Builds `public/about/pixel-portrait.png` (96x112) for `components/PixelPortrait.tsx`. Run from the repo root:

```
swift scripts/pixel-portrait/mask.swift public/headshot.jpg /tmp/pixel-mask.png
python3 scripts/pixel-portrait/pix.py 96 112 40 public/about/pixel-portrait.png
python3 scripts/pixel-portrait/cutout.py public/about/portrait-photo.webp
```

1. `mask.swift`: on-device subject cutout via Apple Vision (the photo never leaves the machine).
2. `pix.py`: crops head and shoulders, light unsharp mask, mask-premultiplied box downsample (so the background never bleeds into edge pixels), then a 40-colour palette with no dithering. No hand touch-ups: they made it read as a cartoon.
3. `cutout.py public/about/portrait-photo.webp`: the real photo the build resolves into, same crop, background removed.
