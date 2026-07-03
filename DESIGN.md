# Lunex Displays — Design System

## 1. Brand direction
Clean white catalog, **orange gradient energy**. Bright, organized, trustworthy —
white surfaces + tight bold Inter headings carry clarity; orange gradients carry
action (CTAs, accent words, the bridge band). The FILM HERO stays dark by design
(space footage); everything after it is light. Dark footer anchors the page.

## 2. Color tokens (CSS custom properties in `css/styles.css`)
Legacy note: accent vars are named `--gold` for historical reasons — they hold the
brand ORANGE. Never bypass tokens with raw hex in components.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#ffffff` | page background (white) |
| `--bg-2` | `#faf7f2` | warm off-white alt section |
| `--bg-3` / `--panel` | `#ffffff` | cards, panels, forms |
| `--navy` | `#141210` | dark band: footer, gateway backdrop (neutral, NOT brown) |
| `--fg` | `#1a1613` | primary text (near-black) |
| `--muted` | `#6b6259` | secondary text |
| `--faint` | `#998f84` | tertiary/labels |
| `--gold` | `#f26b0f` | PRIMARY ORANGE — CTAs, accents |
| `--gold-2` | `#ff9a3d` | light orange (gradient start) |
| `--gold-deep` | `#cc5200` | deep orange (gradient end, TEXT-SAFE accent on white) |
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
