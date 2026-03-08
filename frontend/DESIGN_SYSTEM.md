# Design System — Learn English

Design tokens and guidelines for the Learn English app.  
Inspired by [Language Learning App (Figma Community)](https://www.figma.com/design/rTERVkcLfKPfNqK5NVRKEW/Language-Learning-App--Community-?node-id=320-31967).

---

## Color Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `background.primary` | `#1E1E2A` | Main app background |
| `background.secondary` | `#252532` | AppBar, headers |
| `background.surface` | `#2D2D3A` | Cards, inputs |
| `background.card` | `#353542` | Elevated surfaces |

### Primary (Purple)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary.main` | `#6E39D0` | Buttons, links, focus |
| `primary.light` | `#8B5CF6` | Hover states |
| `primary.dark` | `#5B21B6` | Active/pressed |
| `primary.gradient` | Purple → Pink | Hero sections, CTAs |

### Secondary (Teal)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary.main` | `#00C8C8` | Secondary actions, progress |
| `secondary.light` | `#22D3D3` | Hover |
| `secondary.dark` | `#0891B2` | Active |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `text.primary` | `#FFFFFF` | Headings, primary content |
| `text.secondary` | `#A1A1AA` | Descriptions, labels |
| `text.disabled` | `#71717A` | Disabled elements |

### Semantic
| Token | Hex |
|-------|-----|
| `success` | `#22C55E` |
| `warning` | `#F59E0B` |
| `error` | `#EF4444` |
| `info` | `#3B82F6` |

---

## Typography

**Font family:** Poppins (Google Fonts)

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 36px | 700 | Page titles |
| H2 | 30px | 700 | Section headers |
| H3 | 24px | 600 | Subsections |
| H4 | 20px | 600 | Card titles |
| Body 1 | 16px | 400 | Main content |
| Body 2 | 14px | 400 | Descriptions |
| Caption | 12px | 400 | Labels, hints |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps |
| `sm` | 8px | Between related elements |
| `md` | 16px | Section padding |
| `lg` | 24px | Card padding |
| `xl` | 32px | Section margins |
| `2xl` | 48px | Large sections |

---

## Border Radius

| Token | Value |
|-------|-------|
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |

---

## Layout Principles

- **Mobile-first:** Design for small screens, scale up
- **Card-based:** Group content in rounded cards
- **Full-width elements:** Inputs and primary buttons span container
- **Consistent padding:** Use spacing tokens
- **Split layout (desktop):** Form + branding panel for auth screens

---

## Usage

```jsx
import { colors } from './theme/designTokens';

// In sx prop
sx={{ bgcolor: colors.background.surface }}
sx={{ color: colors.primary.main }}

// Or use MUI theme (preferred)
sx={{ bgcolor: 'background.surface' }}
sx={{ color: 'primary.main' }}
```
