# 🧱 Lego Blocks

A modern web-based 3D Lego simulation game built with **Next.js 15**, **React 19**, and **Three.js**. Create, modify, and explore virtual Lego structures using an elegant UI and immersive 3D environment.

<p align="center"> <img src="https://github.com/NafisRayan/Lego-Blocks-Game/blob/main/public/Lego%20Simulation.png" alt="Lego Blocks Simulation Image" width="860" /> </p>

---

## 🚀 Tech Stack

* **Framework:** Next.js `15.2.4`
* **Language:** TypeScript
* **3D Engine:** [Three.js](https://threejs.org/) via `@react-three/fiber` & `@react-three/drei`
* **Styling:** TailwindCSS + `tailwindcss-animate`
* **UI Components:**

  * Radix UI primitives
  * [shadcn/ui](https://ui.shadcn.com/) components
  * Custom-built elements
* **Forms & Validation:**

  * React Hook Form
  * Zod
* **Theme Support:** Dark & Light mode via `next-themes`
* **Data Storage:** Vercel KV

---

## 📦 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/NafisRayan/Lego-Blocks-Game.git
   cd Lego-Blocks-Game
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧰 Available Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Build production application |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint for code quality  |

---

## 🗂 Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Entry page
├── components/
│   ├── ui/              # Base UI components
│   ├── block/           # Block logic components
│   ├── scene/           # 3D scene management
│   ├── color-selector/  # Color selection system
│   └── v0-blocks/       # Initial block prototypes
├── lib/
│   ├── actions/         # Server-side logic
│   └── utils/           # Utility functions
├── hooks/               # Custom React hooks
├── public/              # Static files
└── styles/              # Global styles
```

---

## ✨ Features

### 🔧 3D Simulation

* Fully interactive 3D Lego environment
* Build and erase blocks in real-time
* Scene lighting & camera controls

### 🧩 UI Components

* Dialogs, dropdowns, tooltips
* Navigation, forms, accordions
* Visual components for mobile & desktop

### 🎨 Interactive Tools

* Color selector with history
* Dimension input controls
* Responsive toolbar
* Audio integration & file tools

### 🛠 Developer Experience

* Strong type safety with TypeScript
* ESLint for consistent code quality
* TailwindCSS for rapid UI building
* Hot module reloading

---

## 🛑 Requirements

* Node.js **v18+**
* npm or pnpm

---

## 📝 License

**Private** — All rights reserved.

---

## 🔖 Version

**Current release:** `0.1.0`
