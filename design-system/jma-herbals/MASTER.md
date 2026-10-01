# JMA Herbals — Design System (Master)

Source of truth for the landing page. Page files in `pages/` override this file.

The design-system search in the ui-ux-pro-max skill returned palettes that did not fit
(enterprise red/blue, luxury black/gold). Colors are therefore taken from the product
packaging: logo green, gold caps and one label color per tea. Typography uses the skill's
wellness pairing (Lora + Raleway). The motion and density settings are the skill's
Standard (5/10) and Spacious (3/10).

## Color tokens (defined in `app/globals.css` under `@theme`)

| Token | Hex | Use |
|---|---|---|
| `background` | `#FBF8F1` | Page background (warm cream) |
| `surface` | `#FFFFFF` | Cards |
| `foreground` | `#1A2A1E` | Body text |
| `muted` | `#F2EDE1` | Tinted section background |
| `muted-foreground` | `#56645A` | Secondary text (≥4.5:1 on background) |
| `border` | `#E4DDCB` | Hairlines, card borders |
| `primary` | `#1F5A2E` | Brand green: primary buttons, links |
| `primary-hover` | `#17461F` | Hover state for primary |
| `on-primary` | `#FFFFFF` | Text on primary |
| `accent` | `#D9A21B` | Gold from the jar caps: highlights, badges |
| `on-accent` | `#1C1705` | Text on accent |
| `ring` | `#1F5A2E` | Focus ring |

Product label colors (used only for per-product accents):
`tea-rose #B8394A`, `tea-lavender #6A5AA6`, `tea-bluepea #463C8E`, `tea-hibiscus #7A1F2B`,
`tea-lemon #C9A400`, `tea-nettle #2E6B3A`, `tea-ginger #9C7443`, `tea-raspberry #C0612B`.

## Typography
- Headings: **Lora** (600/700), tight tracking, `text-balance`
- Body: **Raleway** (400/500/600), 16px base, line-height 1.6
- Scale: 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60

## Spacing & shape
- Spacious: section padding `py-20 md:py-28`, container `max-w-6xl px-4 sm:px-6`
- Radius: `rounded-xl` controls, `rounded-3xl` cards, `rounded-full` pills
- Shadows: soft, green-tinted (`shadow-[0_8px_30px_-12px_rgb(31_90_46/0.25)]`)

## Motion (Framer Motion, via `LazyMotion` + `m`)
- Scroll reveal: fade + 16px rise, 0.45s, `[0.22, 1, 0.36, 1]`, stagger 0.06s
- Hover: 150–250ms, lift 2–4px; never animate width/height
- `MotionConfig reducedMotion="user"` is always on

## Rules
- SVG icons only, no emoji icons
- Touch targets ≥ 44×44px; visible focus rings
- Photos are JPGs on white backgrounds: place them on `surface` cards or use `mix-blend-multiply` on cream
- Mobile-first; check at 375 / 768 / 1024 / 1440
