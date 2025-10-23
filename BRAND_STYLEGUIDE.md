# 🪶 LeanSubs Brand Styleguide – Calm Precision

## Brand Essence
Minimal, trustworthy, and calm SaaS brand for tracking subscriptions and memberships.
**Tone**: Clean, effortless, professional with a hint of personality.

## 🎨 Color Palette

### Primary Colors
| Role | HEX | Usage |
|------|-----|-------|
| **Primary** | `#4CA9FF` | Soft sky blue — friendly and modern. Main brand color for CTAs, links, and primary actions |
| **Secondary** | `#B794F4` | Lavender — adds calm sophistication. Used for accents and secondary elements |
| **Accent / Dark** | `#334155` | Slate gray — stable, neutral base. Body text and dark UI elements |

### Status Colors
| Role | HEX | Usage |
|------|-----|-------|
| **Success** | `#22C55E` | Spring green — for active or renewed subscription states |
| **Warning** | `#FDBA74` | Apricot orange — for expiring or caution states |
| **Danger** | `#F87171` | Coral red — for errors or cancellations |

### Background Colors
| Role | HEX | Usage |
|------|-----|-------|
| **Light** | `#F1F5F9` | Mist gray — main background, subtle sections |
| **Dark** | `#0F172A` | Graphite — body text or dark mode base |

## 🔤 Typography

### Fonts
- **Primary Font**: **Poppins** (modern, smooth sans-serif)
  - Used for: Headings, titles, logo
  - Weights: 400, 500, 600, 700

- **Secondary Font**: **IBM Plex Sans** (clean, readable)
  - Used for: Body text, descriptions, UI elements
  - Weights: 400, 500, 600

### Font Import
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

### Typography Scale
```css
/* Headings - Poppins */
h1: 3.5rem / 700 weight
h2: 2.5rem / 700 weight
h3: 2rem / 600 weight
h4: 1.5rem / 600 weight

/* Body - IBM Plex Sans */
body: 1rem / 400 weight
large: 1.25rem / 400 weight
small: 0.875rem / 400 weight
```

## 🧱 UI Component Guidelines

### Spacing & Layout
- Container max-width: `1280px`
- Section padding: `4rem` (desktop), `2rem` (mobile)
- Component spacing: `1rem` - `2rem`
- Generous whitespace between sections

### Border Radius
- Default: `0.75rem` (12px)
- Small elements: `0.5rem` (8px)
- Large cards: `1rem` (16px)
- Extra large: `1.25rem` (20px)

### Shadows
Subtle shadows with low opacity:
```css
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
base: 0 1px 3px 0 rgba(0, 0, 0, 0.05)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.05)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05)
```

### Borders
- Minimal borders: `1px solid #E2E8F0`
- Border color for dark mode: `#334155`
- Use borders sparingly, prefer shadows

### Buttons
- Primary button: `#4CA9FF` background, white text
- Hover state: Slight lift (`translateY(-2px)`) + shadow increase
- Smooth transitions: `0.2s ease-in-out`
- Border radius: `0.75rem`
- Padding: `0.75rem 2rem` (medium), `1rem 2.5rem` (large)

### Cards
- White background (`#FFFFFF`)
- Subtle border: `1px solid #E2E8F0`
- Border radius: `0.75rem`
- Shadow: `base` or `md`
- Hover: Lift effect + shadow increase + accent border color

### Icons
- Recommended: **Lucide** or **Heroicons**
- Size: 1rem - 1.5rem for inline, 2rem+ for feature icons
- Color: Match text color or brand colors

## 🌤️ Design Mood

**Think**: Stripe dashboard meets Notion calmness
- Professional yet relaxed
- Gentle contrast
- Clean whitespace
- Smooth interactions
- Minimal visual noise

## 🎯 Component Examples

### Feature Cards
- Icon in colored background circle/square
- Clear heading (Poppins, 600)
- Description text (IBM Plex Sans, 400)
- Hover effect with subtle lift

### Status Badges
- Success: Green background (`#22C55E`)
- Warning: Orange background (`#FDBA74`)
- Danger: Red background (`#F87171`)
- Small, rounded, subtle shadow

### Form Inputs
- Border: `1px solid #E2E8F0`
- Focus state: Border color to `#4CA9FF`, subtle shadow
- Border radius: `0.75rem`
- Padding: `0.75rem 1rem`

## 🌗 Dark Mode

### Dark Mode Colors
- Background: `#0F172A` (Graphite)
- Card background: `#1e293b` (Accent 800)
- Text: `#f1f5f9` (Light gray)
- Muted text: `#94a3b8` (Accent 400)
- Borders: `#334155` (Accent 700)

### Dark Mode Strategy
- Invert light/dark values
- Keep brand colors vibrant
- Reduce contrast slightly for comfort
- Use darker shadows

## 📐 Accessibility

- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text
- Focus indicators visible on all interactive elements
- Keyboard navigation support
- ARIA labels where needed

## 🚀 Implementation Notes

### Chakra UI Theme Tokens
All colors, fonts, shadows, and radii are configured in `src/theme.ts`:
- Colors: `brand.*`, `secondary.*`, `accent.*`, `success.*`, `warning.*`, `danger.*`
- Fonts: `heading`, `body`
- Radii: `sm`, `md`, `lg`, `xl`, `2xl`
- Shadows: `sm`, `base`, `md`, `lg`, `xl`

### Using Brand Colors
```tsx
// Primary button
<Button backgroundColor="brand.400" color="white">Click me</Button>

// Success badge
<Badge backgroundColor="success.500" color="white">Active</Badge>

// Card with accent border on hover
<Box borderColor="accent.200" _hover={{ borderColor: "brand.400" }}>...</Box>
```

---

**Last Updated**: October 23, 2025
**Version**: 1.0

