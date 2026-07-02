# Lunex Displays — Design System

## 1. Brand direction
Dark cinematic showroom: **black stage, orange energy**. The site should feel like
standing in front of a glowing LED wall in a dark venue. Positioning: *affordable but
trustworthy* — orange carries energy/value (action color), near-black carries
authority/premium. Orange is rationed: CTAs, accents, glows. Large surfaces stay black.

## 2. Color tokens (CSS custom properties in `css/styles.css`)
Legacy note: accent vars are named `--gold` for historical reasons — they hold the
brand ORANGE. Never bypass tokens with raw hex in components.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0b0b0d` | page background (near-black, slightly warm) |
| `--bg-2` | `#121215` | elevated band / alt section |
| `--bg-3` / `--panel` | `#17171b` | cards, panels, forms |
| `--navy` | `#060607` | deepest band: footer, gateway backdrop |
| `--fg` | `#f4f1ec` | primary text (warm white) |
| `--muted` | `#aaa49b` | secondary text |
| `--faint` | `#75706a` | tertiary/labels |
| `--gold` | `#ff7a1f` | PRIMARY ORANGE — CTAs, accents, links-hover |
| `--gold-2` | `#ffa04d` | light orange (gradient start, glows) |
| `--gold-deep` | `#e05e00` | deep orange (gradient end, emphasis text) |
| `--line` / `--hair` | `#26262b` | borders, dividers |
| `--glass` | `#1c1c21` | tinted chip/icon backgrounds |
| `--glass-brd` | `#2f2f36` | chip borders |
| Error | `#ff6b5e` | form invalid / error text |
| Stars | `#ffb84d` | rating stars (warm, near-orange) |
| WhatsApp FAB | `#2bd167→#0e8f5b` | keep green — recognition trumps theming |

Gradients: CTA `linear-gradient(100deg, --gold-2, --gold)`; bridge band
`#0b0b0d → #2a1204 → #4a1e05` with orange radial glow; blob RGB channels
(gradient-anim) use 255,122,31 / 255,160,77 / 224,94,0 / 255,183,77 / 204,84,0.

## 3. Typography
Inter (existing). Display 800 tight tracking; body 16px/1.6. No changes — hierarchy
already correct. Eyebrows: uppercase, `.18em` tracking, orange.

## 4. Spacing & layout
Container 1200px; sections `clamp(64px,10vh,120px)`; radius 9–16px; unchanged.

## 5. Component rules (psychology notes)
- **CTA buttons**: orange gradient + orange glow shadow — the only loud element per
  viewport. Ghost buttons: transparent dark w/ light border.
- **Trust strip** (`.proof`, `.badge`, `.tcard`): keep high-contrast warm-white on
  black; stars `#ffb84d`; these earn the "trustworthy" half.
- **Scarcity chip** (`.scarcity`): orange pulse dot — urgency, use once per page.
- **Pricing** (`.product__price`): white bold numbers on dark = transparent pricing,
  "From $X" microcopy stays visible (affordability cue).
- **Promo bar**: deep-orange→orange gradient, white 800-weight text.
- **Forms**: inputs `#101014`, border `--line`, focus ring orange + 3px soft orange
  halo. Error `#ff6b5e`.
- **Footer/gateway**: `--navy` #060607 anchor band.

## 6. Motion
Existing easing `cubic-bezier(.22,.61,.36,1)`; GPU-composited transforms/opacity only;
`prefers-reduced-motion` honored. Hover-lift −2/−6px + orange border/glow.

## 7. Accessibility floors
Body text ≥ 4.5:1 on all surfaces (warm-white on #0b0b0d passes). Orange `#ff7a1f`
on black ≈ 7:1 — safe for text; never place white text on light-orange fills below
18px. Focus-visible ring: 2px orange, 3px offset — never remove.
