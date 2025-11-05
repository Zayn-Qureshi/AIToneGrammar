# AI Writing Assistant - Design Guidelines

## Design Approach
**System-Based Approach**: Drawing from productivity tools like Notion, Grammarly, and Linear for a clean, distraction-free writing experience that prioritizes functionality and clarity.

**Core Principles**:
- Minimal distraction: Let content and corrections take center stage
- Clear visual hierarchy: Distinguish between input, corrections, and metadata
- Immediate feedback: Corrections and tone analysis should feel instant and unobtrusive
- Professional polish: Enterprise-grade appearance for credibility

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Micro spacing (gaps, padding): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16

**Container Structure**:
- Main container: `max-w-4xl mx-auto` (optimal reading/writing width)
- Vertical padding: `py-12` on desktop, `py-8` on mobile
- Component gaps: `gap-6` between major sections

---

## Typography

**Font Stack**: 
- Primary (UI): Inter or DM Sans (Google Fonts) - 400, 500, 600 weights
- Editor Text: System monospace or JetBrains Mono for code-like clarity

**Type Scale**:
- Page Title: text-3xl font-semibold
- Section Headers: text-xl font-medium
- Body/Editor: text-base leading-relaxed
- Labels/Metadata: text-sm font-medium
- Tone Indicator: text-lg font-semibold

---

## Component Library

### Text Editor Area
- Large textarea with `rounded-xl` corners
- Border treatment: subtle border that becomes prominent on focus
- Minimum height: 60vh to give ample writing space
- Padding: `p-6` for comfortable text entry
- Line height: `leading-relaxed` (1.625) for readability

### Grammar Error Highlights
- Red wavy underline beneath errors (CSS: `border-bottom: 2px wavy`)
- Semi-transparent highlight background on hover
- Tooltip popup on click/hover with:
  - Error description (text-sm)
  - Suggested correction (text-base font-medium)
  - "Apply" button (compact size)

### Tone Indicator Bar
- Positioned above editor
- Full-width horizontal bar with rounded ends
- Height: `h-2` with `rounded-full`
- Display tone label beside bar (e.g., "Tone: Formal")
- Bar colors referenced via CSS classes only (no color values in guidelines)

### Action Buttons
- Primary "Check Text" button: Large, prominent, `rounded-lg`, `px-8 py-3`
- Secondary "Copy Corrected Text": Outline style, `rounded-lg`, `px-6 py-2`
- Loading state: Replace text with spinner animation

### Correction Tooltips
- `rounded-lg` container with `p-4`
- Drop shadow for elevation
- Arrow pointer to highlighted text
- Max width: `max-w-xs`
- Smooth fade-in animation (150ms)

---

## Page Structure

**Single-Page Layout**:

1. **Header** (h-16):
   - App title/logo (left): "AI Writing Assistant" with small icon
   - Theme toggle (right): Sun/moon icon button
   - Centered horizontally in `max-w-4xl` container

2. **Stats Bar** (optional):
   - Character count, word count
   - Horizontal layout with `gap-4`
   - Text: text-sm

3. **Tone Indicator Section**:
   - Full-width bar with label
   - Margin: `mb-6`

4. **Editor Container**:
   - Takes majority of vertical space
   - Bordered card with `rounded-xl`
   - Contains textarea

5. **Action Bar** (below editor):
   - Flex row with `gap-4`
   - "Check Text" button (primary, left)
   - "Copy Corrected Text" (right)
   - Center-aligned on mobile, left-aligned on desktop

6. **Results Section** (appears after check):
   - List of corrections with counts
   - Compact cards showing error types
   - Grid: `grid-cols-2` on desktop, `grid-cols-1` on mobile

---

## Interaction Patterns

**Error Display Flow**:
1. User clicks "Check Text"
2. Loading spinner replaces button text
3. Errors appear with underlines
4. Tone bar fills/updates
5. User hovers/clicks error → tooltip appears

**Tooltip Behavior**:
- Appears 100ms after hover
- Dismisses on click outside or ESC key
- "Apply" button updates text inline

**Copy Function**:
- One-click copy to clipboard
- Button text changes to "Copied!" for 2 seconds
- Subtle checkmark icon appears

---

## Responsive Behavior

**Desktop (lg+)**:
- Editor width: `max-w-4xl`
- Buttons: Horizontal layout
- Stats: Inline display

**Mobile (base)**:
- Full-width editor with `px-4` margins
- Buttons: Stack vertically with `gap-2`
- Stats: Vertical list
- Reduced padding throughout

---

## Loading States

**While Checking**:
- Disable textarea (reduced opacity)
- Show animated pulse on "Check Text" button
- Small "Analyzing..." text below editor

---

## Accessibility Notes

- All interactive elements have focus rings
- Tooltips are keyboard-navigable
- ARIA labels on correction tooltips
- High contrast between text and error highlights
- Focus trap in tooltip when opened via keyboard

---

**No Images Required**: This is a pure utility application focused on text editing and analysis. No hero images or decorative graphics needed.