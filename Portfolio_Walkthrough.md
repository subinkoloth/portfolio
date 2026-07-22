<style>
  body {
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
    color: #37352f;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #ffffff;
  }
  h1 {
    font-size: 2.2em;
    font-weight: 700;
    margin-top: 1.8em;
    margin-bottom: 0.4em;
    color: #37352f;
    border-bottom: 1px solid rgba(55, 53, 47, 0.09);
    padding-bottom: 8px;
  }
  h2 {
    font-size: 1.6em;
    font-weight: 600;
    margin-top: 1.6em;
    margin-bottom: 0.4em;
    color: #37352f;
  }
  h3 {
    font-size: 1.2em;
    font-weight: 600;
    margin-top: 1.4em;
    margin-bottom: 0.4em;
    color: #37352f;
  }
  p {
    margin-top: 0;
    margin-bottom: 1em;
    color: #37352f;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 1em;
    padding-left: 26px;
  }
  li {
    margin-bottom: 0.4em;
  }
  hr {
    border: none;
    border-bottom: 1px solid rgba(55, 53, 47, 0.09);
    margin: 2em 0;
  }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    background: rgba(135, 131, 120, 0.15);
    color: #eb5757;
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-size: 85%;
  }
  pre {
    background: #f7f6f3;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    border: 1px solid rgba(55, 53, 47, 0.09);
    margin: 1.27em 0;
  }
  pre code {
    background: transparent;
    color: #37352f;
    padding: 0;
    font-size: 90%;
  }
  .callout {
    display: flex;
    padding: 16px;
    background: #f7f6f3;
    border-radius: 4px;
    border: 1px solid rgba(55, 53, 47, 0.09);
    margin: 1.25em 0;
    align-items: center;
    gap: 12px;
  }
  .callout-emoji {
    font-size: 1.2em;
  }
</style>

# Development Specifications & System Architecture Guide
## Subin Koloth - Portfolio Workspace Manual
*Expert Mentorship Walkthrough & Code Diagnostics Audit*

---

## 🗺️ 1. High-Level Overview

This project is a high-performance personal developer portfolio website designed to showcase your full-stack engineering expertise, featured applications, and active skill networks. It introduces visual feedback layers, combining responsive glassmorphic cards and motion-based viewport deformations to create an engaging experience for recruiters and developers.

Instead of displaying passive text URLs to users, the platform coordinates multiple embedded mini-applications inside a responsive Bento Grid. The **Movie Search Console** operates as a high-speed index tool utilizing edge-cached query speeds. The **DineFlow POS Panel** coordinates restaurant operations through an active table grid. The **Expense Tracker** provides real-time transaction ledgers, while the **Roll Dice Game** uses physics-based calculations to simulate interactive dice rolling.

The user flow begins as the landing page initializes. This setup starts the Lenis Smooth Scroll engine, which overrides default mechanical browser scrolling with fluid, smoothed physics. As the visitor moves their pointer, a custom glow cursor trails the mouse, responding to interactive elements. Scrolling down brings the visitor to the Bento Grid project panel, where hovering over a card triggers a custom drop shadow and scales the background image. Clicking a project card opens a side-by-side specs popup. The left column lists the title, tech stack badges, and launch links, while the right column summarizes specifications. Visitors can navigate to the connect page to submit message inquiries directly to the developer.

---

## 💻 2. The Tech Stack

The software stack runs on **React 18** and **Vite** to deliver fast updates. React splits the layouts into reusable files like menus, cards, and modal systems. Vite serves the development environment using Hot Module Replacement (HMR) to compile changes instantly.

**TypeScript** ensures type safety across props, variables, and data collections, catching mismatched parameters at compile time. **Framer Motion** drives the motion layer, managing spring physics and modal transitions. **Tailwind CSS** handles responsive grid structures, absolute margins, padding coordinates, and glassmorphic styling, while the **Lenis** library manages scroll velocity vectors and scroll easing. The application uses the **React Context API** to share table statuses and cooking ticket queues across DineFlow POS sub-pages.

The AI chose this stack because it supports modular, client-side execution. The DineFlow POS sub-app relies on table state changes. Standardizing state through Context and `useReducer` prevents state collisions and synchronizes waiter screens, kitchen displays, and billing terminals. Framer Motion simplifies binding mouse movements to gradients, keeping rendering speeds locked at a native 60 FPS. Lastly, running the dashboard through local contexts and client caches (LocalStorage) means reviewers can run the entire site locally without setting up databases or Docker containers.

---

## 🛠️ 3. Feature-to-Component Mapping

Below is the directory map linking major features to the source code:

The main page layout and scroll velocity tracking is handled inside `src/pages/Index.tsx` which manages scroll skew angles. The custom cursor tracker is located inside `src/components/CustomCursor.tsx` which syncs pointer actions to spring coordinates. The bento grid project catalog is managed inside `src/components/LiveProjects.tsx` which renders project card displays and handles detailed popup modals. Technology skill networks are arranged inside `src/components/Skills.tsx` while message intake forms are managed in `src/components/Connect.tsx`. The DineFlow POS system logic is located inside `src/components/DineFlow/RestaurantContext.jsx` which distributes table occupancies and cooking tickets.

---

## 🔄 4. Step-by-Step Execution Flow

This walkthrough traces the lifecycle of the **Page Scroll Warp Skew Feature** when a visitor scrolls down the page:

1. **User Action:** The visitor scrolls the mouse wheel or touches a trackpad.
2. **Scroll Event Capture:** The **Lenis** engine intercepts the event and computes smooth easing coordinates.
3. **Velocity Callback:** In `src/pages/Index.tsx`, the scroll event broadcasts speed numbers to the `scrollVelocity` MotionValue target:
   ```javascript
   lenis.on('scroll', (e) => {
     scrollVelocity.set(e.velocity);
   });
   ```
4. **Math Easing Interpolation:** The `useTransform` utility translates scroll velocity numbers to coordinate degrees:
   ```javascript
   const skewY = useTransform(scrollVelocity, [-20, 20], [-1.5, 1.5]);
   const scale = useTransform(scrollVelocity, (v) => 1 - Math.min(0.02, Math.abs(v) * 0.0005));
   ```
5. **DOM Render Update:** The updated properties are applied to the primary container: `<motion.main style={{ skewY, scale }}>`, warping and scale-stretching the entire viewport dynamically.

---

## 🔬 5. Code Deep-Dive (Key Parts Reviewed)

### Code Block 1: Custom Cursor Trail Follower (`CustomCursor.tsx`)
```typescript
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed w-6 h-6 border border-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: cursorX, y: cursorY }}
      />
    </>
  );
}
```
* **Coordinate Mapping:** Employs mouse listeners to update reactive x/y coordinate variables in real-time.
* **Spring Mechanics:** Wraps raw values in `useSpring` to eliminate rigid tracking, adding smooth, physical momentum and easing to the custom cursor container.

### Code Block 2: Grid Mockup Cover Images (`LiveProjects.tsx`)
```typescript
<div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
  <img 
    src={project.image} 
    alt={project.title} 
    className="w-full h-full object-cover opacity-20 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700 ease-out"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
</div>
```
* **Image Layering:** Embeds the project image as a background layer (`z-0`) inside the card container.
* **Parallax Scale Effect:** Applies `group-hover:scale-105` and `group-hover:opacity-35`, letting the image smoothly scale up and brighten on hover.
* **Gradient Overlay:** Uses a dark gradient layer on top of the image to maintain readable text contrast.

### Code Block 3: Eased Lenis Loop Hook (`Index.tsx`)
```javascript
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
}, []);
```
* **Smooth Inertial Physics:** Uses an exponential ease-out function rather than standard rigid browser scroll actions.
* **Request Animation Frame:** Calls `lenis.raf(time)` recursively inside `requestAnimationFrame`, binding physics calculations directly to the browser's render repaint cycle.

---

## 🚀 6. Areas for Improvement

* **Dynamic Code-Splitting (Vite Optimization):**
  * **Shortcoming:** Importing components statically in `Index.tsx` bundles all project views into a single bundle, leading to file chunks larger than 500kB.
  * **Refactoring:** Use React lazy-loading (`React.lazy()`) and `<Suspense>` loaders to defer loading heavy components until they are needed:
    ```typescript
    const LiveProjects = React.lazy(() => import('./components/LiveProjects'));
    ```
* **Backend Database Integration (DineFlow POS):**
  * **Shortcoming:** Relying on LocalStorage means data is lost if the browser cache is cleared.
  * **Refactoring:** Set up a database like PostgreSQL and a Prisma ORM backend to persist states securely.
* **Server-Side Validation Engine:**
  * **Shortcoming:** Pricing calculations and discount code validations run on the client side, making the app vulnerable to client-side price tampering.
  * **Refactoring:** Move calculations to a secure Node/Express backend.
* **Form Spam Prevention:**
  * **Shortcoming:** The Connect form uses basic input variables without verification, leaving it vulnerable to bots.
  * **Refactoring:** Embed a captcha system (like Cloudflare Turnstile) to block spam submissions.
