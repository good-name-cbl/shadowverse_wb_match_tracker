# Typography Skill

## Purpose
Guide font selection and typography decisions to create visually distinctive and high-quality interfaces. Avoid generic, overused fonts in favor of beautiful, unique, and interesting typefaces.

## Core Principles

### 1. Avoid Generic Fonts
**Never use these overused fonts:**
- Inter
- Roboto
- Arial
- Helvetica
- San Francisco

### 2. Choose Distinctive Typefaces
Select fonts that signal quality and visual interest. Organize by aesthetic category:

**Editorial & Elegant:**
- Playfair Display
- Crimson Text
- Libre Baskerville
- Cormorant Garamond

**Modern & Geometric:**
- Space Grotesk
- Outfit
- Manrope
- DM Sans

**Tech & Code:**
- JetBrains Mono
- Fira Code
- IBM Plex Mono
- Source Code Pro

**Display & Unique:**
- Syne
- Unbounded
- Cabinet Grotesk
- Sentient

### 3. High Contrast Pairings
Use extreme weight variations rather than subtle differences:
- Pair font weights 100/200 with 800/900
- Avoid mid-range weights (400-600) for important hierarchies
- Create visual impact through dramatic contrast

### 4. Font Pairing Strategies
Combine typefaces from different categories:
- Display fonts + Monospace (e.g., Syne + JetBrains Mono)
- Serif + Geometric Sans (e.g., Playfair Display + Space Grotesk)
- Modern Sans + Tech Mono (e.g., Manrope + Fira Code)

### 5. Loading Fonts
Use Google Fonts for easy integration:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Or use Next.js Font Optimization:
```typescript
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '700'],
  variable: '--font-space-grotesk'
});
```

## Implementation Guidelines

### Type Scale
Establish a clear hierarchy with distinct sizes:
- Headings: Use large, bold weights (700-900)
- Body: Use readable sizes (16-18px) with moderate weights (300-400)
- Captions: Use smaller sizes (12-14px) but maintain readability

### Line Height
- Headings: Tighter line-height (1.1-1.3)
- Body text: Comfortable reading (1.5-1.7)
- Code: Monospace optimized (1.4-1.6)

### Letter Spacing
- Display type: Slightly tighter (-0.02em to -0.05em)
- All caps: Wider spacing (0.05em to 0.1em)
- Body: Default or slightly loose (0 to 0.01em)

## Examples for This Project

For the Shadowverse match tracker:
- **Primary Display**: Space Grotesk or Syne (for deck names, headings)
- **Body Text**: Manrope or Outfit (for stats, descriptions)
- **Data/Numbers**: JetBrains Mono or Fira Code (for match records, statistics)

This creates a modern, gaming-appropriate aesthetic while maintaining readability.
