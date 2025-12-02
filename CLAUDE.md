# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js production bundle
- `npm run lint` - Run ESLint

**Sanity CMS:**

- `cd sanity && npm run dev` - Start Sanity Studio
- `cd sanity && npm run build` - Build Sanity Studio
- `cd sanity && npm run deploy` - Deploy Sanity Studio

## Architecture

This is a Next.js 15 boilerplate with Sanity CMS integration and GSAP animations.

### Key Libraries & Stack

- **Next.js 15** with App Router
- **Sanity CMS** for content management (separate workspace in `/sanity/`)
- **GSAP** with custom animation components using `@gsap/react`
- **Lenis** for smooth scrolling
- **next-transition-router** for smooth page transitions
- **Tempus** for animation timing
- **TypeScript** throughout
- **Tailwind CSS v4** with PostCSS integration and custom utilities
- **clsx** for conditional class names

### State Management

- **Global Store**: Context-based store (`libs/store.tsx`) manages:
  - Menu state (`isMenuOpened`)
  - Page visibility (`isPageVisible`)
  - Lenis instance and readiness
  - Font loading state
- **Window Events**: Custom provider (`libs/events.tsx`) for centralized window event handling

### Animation System

Custom animation components in `app/(pages)/(animations)/`:

- `appear.tsx` - Fade in animations
- `line-reveal.tsx` - Scale reveal animations
- `slide-up.tsx` - Slide up with optional opacity
- `text-reveal.tsx` - Text reveal animations

All use consistent patterns:

- `useGSAP` hooks for GSAP integration
- Scroll trigger support with `target` prop
- Page load vs scroll-based animations
- TypeScript interfaces for props

### GSAP Configuration

- Custom GSAP setup in `components/Gsap.tsx`
- Registers SplitText and ScrollTrigger plugins
- Integrates with Tempus for consistent timing
- Custom easing functions in `libs/easing.ts`

### Sanity Integration

- Schema types in `sanity/schemaTypes/`
- Singleton documents (home, about, settings) with structured content
- Image optimization with `@sanity/image-url`
- SEO data fetching with `getSeoData()` function

### Component Architecture

- Pages use modular content blocks from Sanity
- Reusable UI components in `/components/`
- Page-specific components in `app/(pages)/(components)/`
- Layout components (navigation, menu, footer, wrapper) with GSAP animations
- **No barrel exports** - direct imports from individual files
- **kebab-case naming** for all component files (e.g., `gsap.tsx`, `navigation.tsx`, `line-reveal.tsx`)
- Special Next.js files remain as `page.tsx` and `layout.tsx` per framework convention

### Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin (no traditional config file)
- CSS-first configuration using `@import "tailwindcss"` directive
- Modular CSS structure in `/styles/`:
  - `index.css` - Main entry point importing all stylesheets
  - `reset.css` - CSS reset
  - `root.css` - CSS custom properties (variables)
  - `global.css` - Global styles
  - `tailwind.css` - Custom Tailwind utilities using `@layer utilities`
- Custom utilities include:
  - Grid system with responsive column widths and gutters
  - Color utilities using CSS variables (`--color-white`, `--color-black`)
  - Typography sizes (`text-heading-l`, `text-heading`, `text-l`, `text-base`, `text-s`, `text-xs`)
  - Easing utilities (`ease-in-out`, `ease-expo-in-out`, `ease-out`, `ease-expo-out`)
  - Z-index layers (`z-canvas`, `z-content`, `z-navigation`, `z-menu`, `z-preloader`, `z-grid`)
  - Helper utilities (`cover`, `image`, `center`, `scroll-wrapper`)

### Page Transitions

- **next-transition-router** for smooth page transitions between routes
- Integrated with GSAP for animated transitions
- Event-driven architecture coordinating page visibility and animations

### Key Patterns

- All client components use `"use client"` directive
- Animation components accept `ReactElement` children with ref forwarding
- Consistent TypeScript interfaces for all component props
- Custom hooks for window events and smooth scrolling
- Direct imports from individual files (no barrel exports)
- Utility-first styling with Tailwind CSS custom utilities
- CSS variables for theming and consistent design tokens
