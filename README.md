# LeanSubs

**Subscription Management Made Simple**

LeanSubs is a modern SaaS platform designed for gym owners and subscription-based businesses to effortlessly manage their operations. Track memberships, monitor sessions, and document member progress all in one place.

## Features

- 🔄 **Subscription Tracking** - Manage customer subscriptions, renewals, and payments
- 📅 **Session Management** - Track member attendance and session history
- 📈 **Member Progress** - Document progress, experiences, and achievements
- 🎨 **Modern UI** - Beautiful, responsive interface built with Chakra UI v3
- 🌙 **Dark Mode** - Full dark mode support
- 🪶 **Calm Design** - Professional brand with Stripe meets Notion aesthetics

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Chakra UI v3** - Component library with theming
- **Yarn** - Package management

## Getting Started

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev
```

### Build

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## Project Structure

```
leansubs/
├── src/
│   ├── components/     # React components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── theme.ts        # Chakra UI theme configuration
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vite.config.ts      # Vite config
```

## Brand Styleguide

LeanSubs follows a **Calm Precision** design philosophy. See `BRAND_STYLEGUIDE.md` for complete details.

### Quick Reference
- **Primary Color**: `#4CA9FF` (Soft sky blue)
- **Secondary Color**: `#B794F4` (Lavender)
- **Typography**: Poppins (headings) + IBM Plex Sans (body)
- **Border Radius**: `0.75rem`
- **Design Mood**: Stripe dashboard meets Notion calmness

## Development Guidelines

- Use functional components (not React.FC)
- Use `function` keyword for components
- Follow RORO pattern (Receive an Object, Return an Object)
- Use path aliases (@/components) for imports
- Implement proper error handling
- Mobile-first responsive design
- Follow brand styleguide for all UI components

## License

MIT

