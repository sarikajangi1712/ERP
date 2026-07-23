# UI/UX Design Specifications & System Brief
## Mini ERP + CRM Operations Portal

---

## 1. Design Vision & Aesthetic Direction
The **Mini ERP + CRM Operations Portal** is designed as a modern, high-density, enterprise-grade web application. The design aesthetic blends **sleek dark mode glassmorphism** with **clean, crisp high-contrast light mode options**, offering superior readability, visual elegance, dynamic hover feedback, smooth micro-animations (Framer Motion), and responsive layout performance.

---

## 2. Color System & Design Tokens

### Light Mode Palette
```css
:root {
  --bg-primary: #F8FAFC;         /* Slate 50 */
  --bg-secondary: #FFFFFF;       /* Pure White */
  --bg-card: #FFFFFF;
  --border-color: #E2E8F0;      /* Slate 200 */
  --text-primary: #0F172A;      /* Slate 900 */
  --text-secondary: #475569;    /* Slate 600 */
  --text-muted: #94A3B8;        /* Slate 400 */
  
  --brand-primary: #3B82F6;     /* Blue 500 */
  --brand-hover: #2563EB;       /* Blue 600 */
  --accent-emerald: #10B981;    /* Emerald 500 */
  --accent-amber: #F59E0B;      /* Amber 500 */
  --accent-rose: #EF4444;       /* Rose 500 */
  --accent-indigo: #6366F1;     /* Indigo 500 */
}
```

### Dark Mode Palette (Default Core Palette)
```css
.dark {
  --bg-primary: #0B0F19;         /* Rich Obsidian */
  --bg-secondary: #111827;       /* Gray 900 */
  --bg-card: rgba(17, 24, 39, 0.7); /* Glassmorphic Overlay */
  --border-color: #1F2937;        /* Gray 800 */
  --text-primary: #F9FAFB;        /* Gray 50 */
  --text-secondary: #9CA3AF;      /* Gray 400 */
  --text-muted: #6B7280;          /* Gray 500 */

  --brand-primary: #3B82F6;       /* Vibrant Electric Blue */
  --brand-hover: #60A5FA;         /* Blue 400 */
  --accent-emerald: #10B981;      /* Emerald Green */
  --accent-amber: #F59E0B;        /* Warm Amber */
  --accent-rose: #F43F5E;         /* Vivid Crimson */
  --accent-indigo: #818CF8;       /* Indigo Glow */
}
```

---

## 3. Typography & Spacing Grid

### Font Family
- **Primary Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
- **Monospace Font (SKU, Barcode, Currency, GSTIN)**: `JetBrains Mono`, `Fira Code`, monospace.

### Type Scale
- **Display 1 (Dashboard KPI)**: `32px / 2.25rem`, Weight: 700 (Bold)
- **Heading 1 (Page Title)**: `24px / 1.5rem`, Weight: 700 (Bold)
- **Heading 2 (Section Title)**: `18px / 1.125rem`, Weight: 600 (Semi-bold)
- **Body Large**: `16px / 1rem`, Weight: 400 (Regular) / 500 (Medium)
- **Body Regular**: `14px / 0.875rem`, Weight: 400 (Regular)
- **Caption / Meta**: `12px / 0.75rem`, Weight: 500 (Medium)

---

## 4. Reusable Component Specifications

### 4.1 Stats Cards (KPI Widget)
- **Visual Design**: Subtle top border accent glow matching status color (Blue, Emerald, Amber, Crimson).
- **Hover Behavior**: Translates upward `-2px` with expanded drop-shadow (`shadow-lg`).
- **Content**: Icon container (20% opacity background), Label text (muted), Numeric Metric (Large bold), Dynamic trend indicator pill (`+12.4% vs last month`).

### 4.2 Modern Data Tables
- **Header**: Sticky top, muted text uppercase with sort icons (`ChevronUp`, `ChevronDown`).
- **Row**: Alternating background tints, hover highlight with smooth transition (`transition-colors duration-150`).
- **Cell**: Aligned numeric data to right, text data to left, status badges centered.
- **Pagination Footer**: Page size selector (`10`, `25`, `50`), page range status (`Showing 1-10 of 142`), next/prev controls.

### 4.3 Status Badges & Chips
- `CONFIRMED` / `ACTIVE` / `IN_STOCK`: Emerald green pill with soft green background (`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`).
- `PENDING` / `DRAFT` / `LOW_STOCK`: Amber pill (`bg-amber-500/10 text-amber-400 border border-amber-500/20`).
- `CANCELLED` / `INACTIVE` / `OUT_OF_STOCK`: Rose red pill (`bg-rose-500/10 text-rose-400 border border-rose-500/20`).

### 4.4 Form Controls & Inputs
- **Text Inputs**: Full-width, floating focus ring (`focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500`), subtle dark border.
- **Dropdowns / Selects**: Custom styled with Lucide `ChevronDown`, clean options menu matching theme card background.
- **Validation Feedback**: Red border glow for invalid fields, inline error caption below input.

---

## 5. Micro-Animations & Motion Design (Framer Motion)
- **Page Route Transitions**: Fade-in and slide-up animation (`initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}`).
- **Modal Drawers**: Slide-in from right overlay with backdrop blur (`backdrop-blur-sm`).
- **Toast Notifications**: Slide-in from top-right corner with auto-dismiss progress bar.

---

## 6. Accessibility & Responsiveness
- **Contrast Ratios**: Strictly WCAG 2.2 AA compliant (minimum contrast ratio of 4.5:1 for body text).
- **Responsive Layout**:
  - Desktop (`> 1280px`): Full sidebar navigation, 4-column KPI cards layout.
  - Tablet (`768px - 1279px`): Collapsible compact icon sidebar, 2-column KPI cards layout.
  - Mobile (`< 767px`): Off-canvas mobile menu drawer, single-column stacked layout, scrollable data tables.
