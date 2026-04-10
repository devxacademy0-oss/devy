# Design System Strategy: The Neural Synth

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Neural Synth."** 

We are moving away from the "standard tech dashboard" and toward a high-end editorial experience that feels like a premium terminal for the next generation of engineers. The aesthetic avoids the fatigue of generic SaaS by utilizing **intentional asymmetry**, **chromatic depth**, and **layered translucency**. 

Instead of a rigid, boxed-in grid, we utilize "breathing layouts." Elements should feel like they are floating in a deep-space vacuum, organized by gravitational pull (visual weight) rather than physical containers. We break the template look by overlapping typography across image boundaries and using dramatic shifts in type scale to create a rhythmic, sophisticated flow.

## 2. Colors & Surface Architecture
This system relies on a high-contrast, dark-mode-first philosophy. The palette is anchored in deep obsidian tones, punctuated by high-energy neon pulses.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established solely through:
*   **Background Color Shifts:** Moving from `surface` (#0a0e14) to `surface-container-low` (#0f141a).
*   **Tonal Transitions:** Using subtle gradients to suggest the end of one content block and the start of another.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface tiers to define importance:
*   **Base:** `surface` (#0a0e14) for the main viewport background.
*   **Nesting:** Place a `surface-container-lowest` card inside a `surface-container-low` section to create a "sunken" effect, or a `surface-container-highest` element on a `surface` background to create "lift."

### The "Glass & Gradient" Rule
To achieve the "futuristic" requirement, all floating elements (modals, dropdowns, specialized chat widgets) must use **Glassmorphism**. Apply `surface-container` colors at 60-80% opacity combined with a `backdrop-blur` (20px–40px). 

**Signature Textures:** Use a subtle linear gradient for primary CTAs, transitioning from `primary` (#c799ff) to `primary-container` (#bc87fe) at a 135-degree angle. This prevents the "flat" look and adds a sense of light-source directionality.

## 3. Typography: Editorial Tech
We pair two distinct sans-serifs to create a "System Architect" vibe.

*   **Display & Headlines (Space Grotesk):** This is our "Tech Brutalist" voice. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create an authoritative, futuristic impact.
*   **Body & Labels (Manrope):** Our "Functional" voice. Manrope provides high legibility for complex programming concepts. 
*   **Hierarchy Strategy:** Use "Size-Contrast." Pair a massive `display-md` headline with a tiny, all-caps `label-md` in `secondary` (#4af8e3) to create a sophisticated, high-end editorial rhythm.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural lines or heavy shadows.

*   **The Layering Principle:** Stack containers. An inner chat bubble uses `surface-variant` while the chat container uses `surface-container-high`. This creates natural separation.
*   **Ambient Shadows:** For floating components, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft "glow-absence" rather than a dark stain.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Neon Glow:** For high-priority elements, apply a `drop-shadow` using the `secondary` (#4af8e3) color with a 15px blur at 30% opacity to simulate a neon light tube.

## 5. Components

### Glowing Buttons (CTA)
*   **Primary:** Background `primary` (#c799ff), text `on_primary` (#440080). On hover, add a `box-shadow` glow of the same color. Radius: `md` (0.375rem).
*   **Secondary (Neon):** Background `transparent`, border `2px` using `secondary` (#4af8e3), text `secondary`. 
*   **Tertiary:** Ghost style using `on_surface_variant` text with no background.

### Course Cards
*   **Structure:** No borders. Use `surface-container-low`.
*   **Image:** Use a `0.25rem` (sm) corner radius.
*   **Interaction:** On hover, the card should shift to `surface-container-high` and the `secondary` accent glow should appear at the bottom edge (2px height).

### Specialized Chat Bot Widget
*   **Interface:** Full Glassmorphism. `surface-container-highest` at 70% opacity.
*   **Input Field:** Use `surface-container-lowest` as a "sunken" field. No border. 
*   **AI Response:** Use a subtle `primary_container` gradient background to distinguish the bot from the user's `surface-variant` message bubbles.

### Input Fields
*   **Style:** Minimalist. Only a bottom "Ghost Border" or a fully filled `surface-container-low` box.
*   **Focus State:** The bottom border transforms into a `secondary` (#4af8e3) neon line with a subtle 4px outer glow.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., 80px left, 120px right) to create an editorial feel.
*   **Do** use `secondary` (#4af8e3) sparingly for "data-points" or "active states" to maintain its neon impact.
*   **Do** use large amounts of negative space between course categories to imply premium quality.

### Don't:
*   **Don't** use standard "Card-on-Grey" layouts. Everything should be layered within the deep blue/purple spectrum.
*   **Don't** use 100% white (#FFFFFF). Always use `on_surface` (#f1f3fc) to reduce eye strain and maintain the "sleek" dark-mode aesthetic.
*   **Don't** use sharp 90-degree corners. Even the "futuristic" look requires the subtle `0.25rem` (DEFAULT) radius to feel modern and user-friendly.
*   **Don't** use dividers. If two items need separation, increase the vertical spacing using the `1.5rem` or `2rem` scale.