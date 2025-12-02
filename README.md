# Next.js Boilerplate

A modern boilerplate built with Next.js 15, Sanity CMS, and GSAP animations. Perfect for agencies, portfolios, and interactive websites.

## Features

- **Next.js 15** with App Router and TypeScript
- **Sanity CMS** integration with structured content management
- **GSAP** animations with custom components (LineReveal, SlideUp, Appear, TextReveal)
- **Lenis** smooth scrolling
- **Tempus** for optimized animation timing
- Responsive design with SCSS styling
- SEO optimization with dynamic metadata
- Performance optimized with preloader and transitions

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Sanity Studio

```bash
cd sanity
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to access the Sanity Studio.

## Project Structure

```
app/(pages)/
├── (animations)/        # Reusable GSAP animation components
├── (components)/        # Page-specific components
├── home/               # Home page
└── about/              # About page

components/             # Global reusable components
libs/                  # Utilities and configurations
sanity/                # Sanity CMS configuration and schemas
styles/                # SCSS styling organized by type
```

## Animation System

The project includes a custom animation system built on GSAP:

- **LineReveal**: Scale-based reveal animations
- **SlideUp**: Slide up with optional opacity fade
- **Appear**: Simple fade-in animations
- **TextReveal**: Text-specific reveal effects

All animation components support scroll triggers, delays, and page load detection.

## Content Management

Sanity CMS provides:

- Structured page content with flexible blocks
- SEO management with fallback settings
- Image optimization and management
- Singleton documents for global settings

## Build & Deploy

```bash
npm run build
npm run start
```

Configure your environment variables and deploy to your preferred platform.
