#!/usr/bin/env python3
"""Draw the Open Graph card for the landing page.

Uses the site's own fonts (vendored in assets/fonts) so the card matches the page.
Run from the repo root: python3 scripts/make-og.py
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (11, 10, 8)
CREAM = (236, 231, 220)
GOLD = (212, 175, 55)
GOLD_LIT = (255, 246, 208)
MUTED = (145, 138, 123)
FADED = (108, 102, 90)

SERIF = "assets/fonts/InstrumentSerif-Regular.ttf"
SANS = "assets/fonts/IBMPlexSans.ttf"


def sans(size, weight=400):
    font = ImageFont.truetype(SANS, size)
    font.set_variation_by_axes([100, weight])
    return font


card = Image.new("RGB", (W, H), BG)

# Warm corner glow, mirroring the site's body gradient.
glow = Image.new("RGB", (W, H), BG)
gd = ImageDraw.Draw(glow)
for step in range(150, 0, -1):
    t = step / 150
    radius = int(820 * t)
    tint = (
        int(BG[0] + (34 - BG[0]) * (1 - t)),
        int(BG[1] + (28 - BG[1]) * (1 - t)),
        int(BG[2] + (17 - BG[2]) * (1 - t)),
    )
    gd.ellipse([140 - radius, -60 - radius, 140 + radius, -60 + radius], fill=tint)
card = Image.blend(card, glow, 0.9)
draw = ImageDraw.Draw(card)

title = ImageFont.truetype(SERIF, 96)
body = sans(26)
kicker = sans(19, 500)

draw.text((80, 88), "C H R O M E   E X T E N S I O N", font=kicker, fill=MUTED)

y = 176
draw.text((80, y), "They don't ", font=title, fill=CREAM)
offset = draw.textlength("They don't ", font=title)
draw.text((80 + offset, y), "can make", font=title, fill=FADED)
strike = draw.textlength("can make", font=title)
draw.line([(80 + offset, y + 74), (80 + offset + strike, y + 68)], fill=GOLD, width=3)

draw.text((80, y + 96), "mistakes. They make them.", font=title, fill=GOLD_LIT)

draw.text((80, 430), "Rewrites the ChatGPT and Claude disclaimer.", font=body, fill=MUTED)
draw.text((80, 468), "No hedging, one clown, a slow gold shimmer.", font=body, fill=MUTED)

draw.line([(80, 556), (1120, 556)], fill=(60, 52, 32), width=1)
draw.text((80, 578), "makes-mistakes  ·  free & open source", font=kicker, fill=MUTED)

clown = Image.open("assets/icon-source.png").convert("RGBA").resize((168, 168))
card.paste(clown, (950, 64), clown)

card.save("site/public/og.png", optimize=True)
print("site/public/og.png")
