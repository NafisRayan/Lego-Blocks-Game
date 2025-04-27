# Lego Blocks

A modern web application built with Next.js 15, React 19, and Three.js, featuring a robust UI component system and 3D capabilities.

## Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **3D Rendering:** Three.js with @react-three/fiber & @react-three/drei
- **Styling:** TailwindCSS with tailwindcss-animate
- **UI Components:** 
  - Radix UI primitives
  - shadcn/ui components
  - Custom components
- **State Management & Forms:**
  - React Hook Form
  - Zod for validation
- **Data Storage:** Vercel KV
- **Theme:** Dark/Light mode support via next-themes

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-v0-project
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         
│   ├── ui/            # Base UI components
│   ├── block/         # Block-related components
│   ├── scene/         # 3D scene components
│   ├── color-selector/# Color selection system
│   └── v0-blocks/     # Version 0 block components
├── lib/               
│   ├── actions/       # Server actions
│   └── utils/         # Utility functions
├── hooks/             # Custom React hooks
├── public/            # Static assets
└── styles/            # Global styles
```

## Features

- **3D Capabilities**
  - Three.js integration
  - Custom scene management
  - Build and erase modes
  - Lighting setup

- **UI Components**
  - Comprehensive component library
  - Accordion, Alert, Avatar
  - Dialog, Dropdown, Tooltip
  - Form elements
  - Navigation components
  - Charts and data visualization

- **Interactive Tools**
  - Color selector with history
  - Dimension controls
  - Mobile-responsive toolbar
  - Audio player
  - File controls

- **Developer Experience**
  - TypeScript support
  - ESLint configuration
  - PostCSS and TailwindCSS
  - Hot reload in development

## Development Tools

- TypeScript for type safety
- PostCSS for CSS processing
- TailwindCSS for styling
- ESLint for code quality
- Modern React features with React 19

## Requirements

- Node.js version 18 or higher
- npm or pnpm package manager

## License

Private - All rights reserved.

## Version

Current version: 0.1.0
