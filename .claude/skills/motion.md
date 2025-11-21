# Motion Skill

## Purpose
Guide animation and micro-interaction design to create delightful, orchestrated moments that maximize visual impact. Focus on strategic, meaningful motion rather than scattered effects.

## Core Principles

### 1. Orchestrated Over Scattered
**Key Philosophy:**
"One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions throughout the interface."

- Concentrate visual interest at critical user interaction moments
- Avoid animating everything
- Create memorable "hero moments"

### 2. CSS-First Approach
**Priority order:**
1. **CSS animations** (HTML/vanilla contexts) - performant, simple
2. **Framer Motion** (React contexts) - declarative, powerful
3. **GSAP** (complex sequences only) - overkill for most cases

### 3. Animation-Delay for Staggering
Create cascading effects that guide the eye:
```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 100ms; }
.item:nth-child(3) { animation-delay: 200ms; }
```

## Animation Types & Use Cases

### Page Load Animations
**When:** User first arrives or navigates to a new view
**How:** Staggered fade-ins, slide-ins from consistent direction

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-element {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0; /* Start invisible */
}
```

### Hover States
**When:** User explores interactive elements
**How:** Subtle scale, color, or shadow changes

```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

### Data Entry/Form Interactions
**When:** User inputs data or triggers actions
**How:** Feedback animations confirming the action

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.error-input {
  animation: shake 0.4s ease;
}
```

### State Transitions
**When:** Content changes (loading → loaded, empty → filled)
**How:** Smooth opacity/height transitions

```css
.fade-transition {
  transition: opacity 0.3s ease, max-height 0.3s ease;
}
```

## Timing & Easing

### Duration Guidelines
- **Micro-interactions**: 100-200ms (hover, click feedback)
- **Small elements**: 200-400ms (buttons, icons)
- **Medium elements**: 400-600ms (cards, modals)
- **Large elements**: 600-1000ms (page sections, hero content)
- **Never exceed**: 1000ms (users lose patience)

### Easing Functions
```css
/* Natural, realistic motion */
ease-out: /* Fast start, slow end - entering elements */
ease-in: /* Slow start, fast end - exiting elements */
ease-in-out: /* Smooth both ends - moving elements */

/* Custom cubic-bezier for brand personality */
cubic-bezier(0.4, 0.0, 0.2, 1): /* Material Design */
cubic-bezier(0.25, 0.46, 0.45, 0.94): /* Smooth ease */
```

## React/Framer Motion Patterns

### Staggered List Animation
```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### Modal/Dialog Entrance
```tsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  {modalContent}
</motion.div>
```

## Performance Considerations

### What to Animate (GPU-Accelerated)
✅ **Safe to animate:**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (use sparingly)

❌ **Avoid animating:**
- `width`, `height` (causes reflow)
- `top`, `left`, `right`, `bottom` (use `transform` instead)
- `margin`, `padding` (causes reflow)

### Force GPU Acceleration
```css
.animated-element {
  will-change: transform, opacity;
  /* Remove after animation completes */
}
```

### Reduce Motion for Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Strategic Animation Moments for Match Tracker

### 1. Hero Moment: Match Recorded
When user submits a match result:
```tsx
// Success animation with staggered reveal
- Checkmark icon (scale + rotate)
- Success message (fade in)
- Updated stats (count up animation)
- Match added to history (slide in from top)
```

### 2. Page Load: Stats Section
When viewing statistics:
```tsx
// Orchestrated reveal of data
- Overall stats card (fade + slide up, delay: 0ms)
- Class stats grid (stagger each class, delay: 100ms per item)
- Charts/graphs (draw animation, delay: 400ms)
```

### 3. Deck Selection
When choosing a deck:
```tsx
// Visual feedback
- Selected deck: scale(1.05) + glow effect
- Other decks: opacity(0.5)
- Smooth transition: 200ms ease-out
```

### 4. Tab Switching
When changing between Decks/Matches/Stats:
```tsx
// Content transition
- Exit: fade out + slide left (200ms)
- Enter: fade in + slide right (300ms, delay: 150ms)
```

### 5. Error States
When form validation fails:
```tsx
// Attention-grabbing but not annoying
- Input shake animation (400ms)
- Error message fade in (200ms)
- Border color transition (300ms)
```

## Implementation Checklist

- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Create animation constants file for reusable variants
- [ ] Add `prefers-reduced-motion` media query
- [ ] Test performance on low-end devices
- [ ] Ensure animations don't block user interaction
- [ ] Add loading states for async operations
- [ ] Use `AnimatePresence` for exit animations
- [ ] Consider spring physics for natural feel

## Example: Reusable Animation Variants

```typescript
// utils/animations.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300 }
  }
};
```

## Remember

- **Less is more**: One great animation beats many mediocre ones
- **Context matters**: Match animation to the action's importance
- **Guide the eye**: Use motion to direct attention
- **Never block**: Animations should enhance, not hinder
- **Test on devices**: What feels good on desktop may be laggy on mobile
