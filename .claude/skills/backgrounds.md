# Backgrounds Skill

## Purpose
Guide background design to create atmosphere and depth rather than defaulting to solid colors. Use CSS gradients, geometric patterns, and contextual effects to add visual interest and support the overall aesthetic.

## Core Principles

### 1. Avoid Flat Defaults
**Don't settle for:**
- Plain white backgrounds
- Single solid colors
- Generic gray (#F5F5F5)
- Lifeless, uninspiring surfaces

### 2. Create Atmosphere and Depth
**Use instead:**
- Layered CSS gradients
- Subtle geometric patterns
- Contextual visual effects
- Depth through color variations

### 3. Match the Overall Aesthetic
Backgrounds should reinforce the design identity:
- **Gaming/Tech**: Dark with neon accents, grid patterns
- **Professional**: Subtle gradients, soft textures
- **Playful**: Bold gradients, organic shapes
- **Minimal**: Gentle color shifts, negative space

## Background Techniques

### Technique 1: Gradient Backgrounds

#### Simple Linear Gradients
```css
background: linear-gradient(
  135deg,
  #667EEA 0%,
  #764BA2 100%
);
```

#### Multi-Color Gradients
```css
background: linear-gradient(
  to bottom right,
  #1A1A2E 0%,
  #16213E 50%,
  #0F3460 100%
);
```

#### Radial Gradients (Spotlight Effect)
```css
background: radial-gradient(
  circle at top right,
  rgba(139, 92, 246, 0.3) 0%,
  transparent 50%
);
```

#### Mesh Gradients (Modern, Organic)
```css
background:
  radial-gradient(at 20% 30%, #667EEA 0px, transparent 50%),
  radial-gradient(at 80% 70%, #764BA2 0px, transparent 50%),
  radial-gradient(at 50% 50%, #F093FB 0px, transparent 50%),
  #1A1A2E;
```

### Technique 2: Geometric Patterns

#### Grid Pattern
```css
background-image:
  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
background-size: 50px 50px;
background-color: #1A1A2E;
```

#### Dot Pattern
```css
background-image: radial-gradient(
  circle,
  rgba(255, 255, 255, 0.1) 1px,
  transparent 1px
);
background-size: 20px 20px;
background-color: #0F0F0F;
```

#### Diagonal Lines
```css
background: repeating-linear-gradient(
  45deg,
  #1A1A2E,
  #1A1A2E 10px,
  #16213E 10px,
  #16213E 20px
);
```

### Technique 3: Layered Depth

#### Gradient + Pattern Combo
```css
.background {
  background-color: #0D1117;
  background-image:
    radial-gradient(at 20% 30%, rgba(106, 90, 205, 0.2) 0px, transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
}
```

#### Multi-Layer Gradients
```css
.background {
  background:
    linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%),
    radial-gradient(circle at top right, #667EEA, transparent),
    radial-gradient(circle at bottom left, #764BA2, transparent),
    #1A1A2E;
}
```

### Technique 4: Noise/Texture

#### CSS Noise (Using SVG)
```css
.background {
  background-color: #1A1A2E;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
}
```

### Technique 5: Animated Backgrounds

#### Subtle Gradient Animation
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-bg {
  background: linear-gradient(270deg, #667EEA, #764BA2, #F093FB);
  background-size: 600% 600%;
  animation: gradientShift 15s ease infinite;
}
```

#### Floating Orbs (Using Pseudo-Elements)
```css
.orb-background::before,
.orb-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
}

.orb-background::before {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.3);
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.orb-background::after {
  width: 400px;
  height: 400px;
  background: rgba(236, 72, 153, 0.2);
  bottom: -150px;
  left: -150px;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(50px, 50px); }
}
```

## Context-Specific Background Strategies

### Dark Mode Backgrounds
```css
:root {
  --bg-primary: #0D1117;      /* Main background */
  --bg-secondary: #161B22;    /* Cards, elevated surfaces */
  --bg-tertiary: #21262D;     /* Hover states */
  --bg-accent: rgba(139, 92, 246, 0.1); /* Highlighted sections */
}
```

### Light Mode Backgrounds
```css
:root {
  --bg-primary: #FAFAFA;      /* Main background */
  --bg-secondary: #FFFFFF;    /* Cards, elevated surfaces */
  --bg-tertiary: #F5F5F5;     /* Hover states */
  --bg-accent: rgba(139, 92, 246, 0.05); /* Highlighted sections */
}
```

### Section-Specific Backgrounds

#### Hero Section
```css
.hero {
  background:
    radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2), transparent 70%),
    linear-gradient(180deg, #0D1117 0%, #161B22 100%);
}
```

#### Card/Surface
```css
.card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Stats Section
```css
.stats {
  background:
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url('/pattern.svg');
  background-attachment: fixed;
}
```

## Examples for Match Tracker

### Option 1: Dark Gaming Theme
```css
body {
  background:
    radial-gradient(circle at 20% 20%, rgba(122, 162, 247, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(187, 154, 247, 0.1) 0%, transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    #1A1B26;
  background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
}
```

### Option 2: Card Game Elegance
```css
body {
  background:
    linear-gradient(180deg, #0D1117 0%, #16213E 50%, #0F3460 100%);
  position: relative;
}

body::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(201, 166, 99, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}
```

### Option 3: Clean with Depth
```css
.main-container {
  background: linear-gradient(
    to bottom,
    #FAFAFA 0%,
    #F0F0F0 100%
  );
}

.stats-card {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.9)),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
```

### Option 4: Deck-Class Based
```css
/* Change background tint based on selected deck's class */
.class-elf {
  background: radial-gradient(circle at top, rgba(34, 139, 34, 0.1), transparent);
}
.class-royal {
  background: radial-gradient(circle at top, rgba(218, 165, 32, 0.1), transparent);
}
.class-witch {
  background: radial-gradient(circle at top, rgba(138, 43, 226, 0.1), transparent);
}
/* etc. for each class */
```

## Performance Tips

1. **Use CSS over Images**: Gradients and patterns are smaller and scale infinitely
2. **Limit Blur Effects**: `backdrop-filter: blur()` is expensive; use sparingly
3. **Optimize SVG Patterns**: Inline small SVGs, external large ones
4. **Fixed Backgrounds**: Use `background-attachment: fixed` carefully (can cause jank)
5. **GPU Acceleration**: Animate with `transform` and `opacity`, not background-position

## Accessibility Considerations

```css
/* Ensure sufficient contrast for text over backgrounds */
.text-over-gradient {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    background-attachment: scroll !important;
  }
}
```

## Quick Reference: Background Layers

```css
/* Template for complex backgrounds */
.complex-background {
  background:
    /* Top layer: accent glow */
    radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2), transparent 60%),

    /* Middle layer: pattern */
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),

    /* Bottom layer: base gradient */
    linear-gradient(180deg, #1A1B26 0%, #16213E 100%);

  background-size:
    100% 100%,
    40px 40px,
    40px 40px,
    100% 100%;
}
```

Remember: Backgrounds should enhance the content, not overpower it. Subtlety is key.
