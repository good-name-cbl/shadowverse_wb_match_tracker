# Color & Theme Skill

## Purpose
Guide color palette selection to create cohesive, emotionally resonant aesthetic identities. Avoid predictable, timid color schemes in favor of bold, deliberate choices inspired by specific cultural or design references.

## Core Principles

### 1. Avoid Generic AI Aesthetics
**Don't default to:**
- Purple gradients on white backgrounds
- Evenly-distributed pastel palettes
- Safe, corporate blue-gray schemes
- Predictable complementary color wheels

### 2. Commit to an Aesthetic Identity
Draw inspiration from specific sources:
- **IDE Themes**: Dracula, Nord, Tokyo Night, Monokai, Solarized
- **Cultural Aesthetics**: Cyberpunk neon, Japanese minimalism, Brutalist concrete
- **Nature**: Desert sunset, ocean depths, forest twilight
- **Art Movements**: Bauhaus, Swiss design, Memphis design

### 3. Dominant Colors with Sharp Accents
Structure palettes with purpose:
- **1 Dominant color**: 60-70% of the interface
- **1 Secondary color**: 20-30% supporting role
- **1-2 Accent colors**: 5-10% for highlights and CTAs
- Avoid equal distribution of colors

### 4. Use CSS Variables for Consistency
Define colors once, use everywhere:
```css
:root {
  /* Primary palette */
  --color-primary: #2D4059;
  --color-secondary: #EA5455;
  --color-accent: #F07B3F;

  /* Semantic colors */
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #666666;

  /* State colors */
  --color-success: #2ECC71;
  --color-error: #E74C3C;
  --color-warning: #F39C12;
  --color-info: #3498DB;
}
```

## Color Palette Strategies

### Strategy 1: Monochromatic with Punch
- Base: Shades of a single hue (5-7 variations)
- Accent: One contrasting color for emphasis
- Example: Navy blues (100-900) + Electric yellow accent

### Strategy 2: Analogous Harmony
- Choose 2-3 adjacent colors on the color wheel
- Use varying saturation and brightness
- Example: Teal → Blue → Purple gradient

### Strategy 3: Dark Mode First
- Design for dark backgrounds
- Use deep, rich colors instead of pure black
- Bright accents pop more dramatically
- Example: #1A1A2E background + #16213E surface + #0F3460 elements + #E94560 accents

### Strategy 4: Cultural Reference
- **Cyberpunk**: Neon pink/cyan on dark backgrounds
- **Japanese**: Indigo, vermillion, gold on cream/white
- **Nordic**: Cool grays, muted blues, whites
- **Desert**: Terracotta, sand, sage, burnt orange

## Implementation Guidelines

### Color Contrast
- Ensure WCAG AA compliance (4.5:1 for text, 3:1 for UI)
- Test readability on both light and dark backgrounds
- Use tools: https://contrast-ratio.com

### Gradient Usage
- Linear gradients: 2-3 colors maximum
- Radial gradients: Create depth and focus
- Mesh gradients: Modern, organic feel
```css
background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
```

### Color Application by Element Type
- **Backgrounds**: Dominant color or gradient
- **Buttons/CTAs**: Accent color with hover state
- **Text**: High contrast, semantic meaning
- **Borders**: Subtle, lighter variants of primary
- **Shadows**: Tinted with primary color (not gray)

### Dark Mode Considerations
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #121212;
    --color-surface: #1E1E1E;
    --color-text-primary: #E0E0E0;
    --color-text-secondary: #A0A0A0;
  }
}
```

## Examples for This Project

### Option 1: Gaming Dark Theme (Tokyo Night inspired)
```css
:root {
  --color-bg-primary: #1A1B26;
  --color-bg-secondary: #24283B;
  --color-accent-primary: #7AA2F7;  /* Blue */
  --color-accent-secondary: #BB9AF7; /* Purple */
  --color-success: #9ECE6A;         /* Green - for wins */
  --color-error: #F7768E;           /* Red - for losses */
}
```

### Option 2: Card Game Elegance (Dark + Gold)
```css
:root {
  --color-bg-primary: #0D1117;
  --color-bg-secondary: #161B22;
  --color-accent-primary: #C9A663;  /* Gold */
  --color-accent-secondary: #8B5CF6; /* Purple */
  --color-border: #30363D;
}
```

### Option 3: High Contrast Modern
```css
:root {
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F5F5;
  --color-accent-primary: #0066FF;  /* Vivid blue */
  --color-accent-secondary: #FF3366; /* Hot pink */
  --color-text: #000000;
}
```

## Color Psychology for Match Tracker

- **Wins/Success**: Green, gold, or cyan (positive, achievement)
- **Losses/Error**: Red or orange (attention, caution)
- **Stats/Info**: Blue or purple (analytical, calm)
- **Deck Selection**: Distinct colors per class (already defined in constants.ts)
- **Backgrounds**: Deep, immersive colors (engagement, focus)

## Tips for Shadowverse Theme

Shadowverse has a dark fantasy aesthetic. Consider:
- Deep purples and blues (mystical)
- Gold/bronze accents (card game luxury)
- Dark backgrounds (immersive)
- Class-specific colors already defined - build around those
