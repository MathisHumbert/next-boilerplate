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

- **Next.js 16** with App Router (Turbopack)
- **Sanity CMS** for content management (separate workspace in `/sanity/`)
- **GSAP** with SplitText and ScrollTrigger plugins using `@gsap/react`
- **LocomotiveScroll** for smooth scrolling with ScrollTrigger proxy
- **next-transition-router** for smooth page transitions
- **Tempus** for animation timing loop
- **Nanostores** (`nanostores` + `@nanostores/react`) for reactive state management
- **TypeScript** throughout
- **Tailwind CSS v4** with PostCSS integration and custom utilities
- **clsx** for conditional class names
- **smooothy** for smooth carousel/slider
- **focus-trap-react** for accessibility in the menu
- **stats.js** for performance monitoring (development)

### State Management

Nanostores-based reactive state in `store/`:

- **`store/global.ts`** — global atoms:
  - `$isMenuOpened` - menu visibility
  - `$isPageVisible` - page visibility
  - `$locomotive` - LocomotiveScroll instance
  - `$areFontsLoaded` - font loading state
  - `$isAppMounted` - app mount state
  - `$deviceType` - `"phone" | "tablet" | "desktop"`
  - `$isMobile` - computed from deviceType
- **`store/responsive.ts`** — responsive values read from CSS variables (columns, gutter, font sizes, breakpoints), updated on resize

Custom event system via `EventEmitter` instance exported from `libs/utils.ts`.

### Animation System

Two layers of animation:

**1. CSS animations** (no React component needed) — triggered by adding `.is-inview` class via LocomotiveScroll:
- `data-animation="appear"` — fade in (1s)
- `data-animation="slide-up"` — slide up with optional opacity (0.6s)
- `data-animation="line"` — scale from origin (1.25s)
- `data-animation="text"` — text line reveal (1.5s)

**2. React animation component** in `app/(pages)/(animations)/`:
- `text-reveal.tsx` — GSAP SplitText reveal on scroll (props: `scrollPosition`, `scrollOffset`, `delay`, `rotate`, `ignoreFold`)

Complex animations (menu, accordion, transitions) are handled directly with GSAP in the component files.

### GSAP Configuration

- Custom GSAP setup in `components/gsap.tsx`
- Registers SplitText and ScrollTrigger plugins
- Disables default RAF — delegates to Tempus animation loop
- Clears scroll memory for manual scroll control
- Easing defined as CSS variables in `styles/root.css` (40+ easing functions)

### Sanity Integration

- Schema types in `sanity/schemaTypes/`
- Singleton documents (home, about, settings) with structured content
- Image optimization with `@sanity/image-url` via `urlForImage()` in `libs/sanity.ts`
- Data fetching: `getHomePageData()`, `getAboutPageData()`, `getSeoData()`
- Custom Sanity Studio structure in `sanity/structure.ts`
- Plugins: `singletonTools`, `structureTool`, `sanity-plugin-media`

### Component Architecture

- Pages use modular content blocks from Sanity, routed in `app/(pages)/(components)/content.tsx`
- Reusable UI components in `/components/`
- Page-specific components in `app/(pages)/(components)/`
- **No barrel exports** — direct imports from individual files
- **kebab-case naming** for all component files (e.g., `gsap.tsx`, `navigation.tsx`, `text-reveal.tsx`)
- Special Next.js files remain as `page.tsx` and `layout.tsx` per framework convention

### Hooks

Custom hooks in `hooks/`:
- `use-escape-keydown.ts` — Escape key listener with disabled flag
- `use-smooothy.tsx` — wraps smooothy carousel, uses Tempus for animation loop
- `use-horizontal-drag.tsx` — horizontal drag/scroll with mouse and touch support, smooth interpolation

### Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin (no traditional config file)
- CSS-first configuration using `@import "tailwindcss"` directive
- Modular CSS structure in `/styles/`:
  - `index.css` — main entry point (imports tailwindcss, root.css, global.css, tailwind.css)
  - `root.css` — CSS custom properties: colors, fonts, grid, z-index, 40+ easing functions, transition durations
  - `global.css` — base styles, scroll wrapper, animation keyframes and `[data-animation]` selectors
  - `tailwind.css` — imports all utility files from `styles/tailwind/`
  - `styles/tailwind/` subdirectory:
    - `colors.css` — bg/text/border utilities
    - `easing.css` — transition-timing and duration utilities, hover shorthands
    - `grid.css` — col widths, gaps, padding/margin by columns
    - `helpers.css` — `cover`, `img-cover`, `center`, `scroll-wrapper`
    - `typography.css` — `text-heading-l` (8rem) → `text-xs` (1.2rem)
    - `z-index.css` — `z-canvas` → `z-grid`

### Page Transitions

- `components/transition.tsx` wraps content in `TransitionRouter` (next-transition-router)
- Leave animation: GSAP fade out (0.5s), enter animation: fade in (0.5s delay + 0.5s)
- Waits for images to load before marking page as ready

### Key Patterns

- All interactive/animation components use `"use client"` directive
- State via nanostores atoms (`useStore` from `@nanostores/react`)
- Custom events via `events` (EventEmitter) from `libs/utils.ts`
- Direct imports from individual files (no barrel exports)
- Utility-first styling with Tailwind CSS custom utilities
- CSS variables for theming and consistent design tokens
- Tempus as unified animation timing loop (GSAP, stats.js, smooothy all integrate via Tempus)
