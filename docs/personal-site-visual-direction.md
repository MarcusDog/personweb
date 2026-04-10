# Personal Site Visual Direction

## 1. Source Set

This direction was rebuilt from the inspiration roundup in Eagle's article and the award-oriented platforms it points to, especially Awwwards, FWA, Httpster, One Page Love, Land-book, and adjacent reference galleries.

Primary source set:

- https://cn.eagle.cool/blog/post/best-websites-designers-love-for-finding-design-inspirations
- https://www.awwwards.com/websites/
- https://www.cssdesignawards.com/sites/qualia-creative/34392/
- https://thefwa.com/upload/pdf/FWA_MOTD_may24_b7f9.pdf

What the Eagle article contributed:

- a map of inspiration-platform types rather than a single style
- a useful split between award galleries, layout archives, interaction-led references, and practical UI collections
- a reminder that inspiration should be filtered by applicability rather than novelty alone

What the award references contributed:

- Awwwards: the strongest work treats the first viewport as a singular art-directed field
- CSS Design Awards / Qualia Creative: fullscreen minimalism works when UI chrome is reduced and type carries the hierarchy
- FWA: motion-led work earns attention when interaction feels authored, not ornamental

## 2. Award-Work Deconstruction

### Pattern A: Poster First, Interface Second

Observed across Awwwards galleries and multiple award-oriented showcases:

- the first viewport usually has one dominant visual idea
- type scale and spatial tension do more work than component count
- motion supports presence and pacing rather than acting as a feature list

Translation into this site:

- keep the first screen as a poster-like field
- let the name mark dominate
- push metadata into smaller monospaced rails and panels
- avoid dashboard-card behavior on the homepage

### Pattern B: Fullscreen Minimalism With Few UI Interruptions

Observed in CSS Design Awards' `Qualia Creative`, described there as a fullscreen minimal agency site without distracting UI/UX elements, tagged `fullscreen`, `minimal`, and `typographic`.

Translation into this site:

- reduce navigation weight
- keep large empty zones in the hero
- make the content modules feel structural rather than decorative
- let headline, copy measure, and rails define the interface

### Pattern C: Motion as Atmosphere

Observed in FWA-recognized work and motion-led galleries referenced in Eagle's article:

- movement tends to be ambient, low-amplitude, and compositional
- the page feels alive because of light, drift, and pull, not because many objects move at once

Translation into this site:

- use long-cycle ambient motion in the background
- keep hover transitions in the 200–300ms range
- let interactive surfaces sharpen slightly on hover rather than exploding into transformation

## 3. Ten Cross-Disciplinary Inspirations

These are translations of temperament and method only. No original composition, palette, layout combination, or typographic treatment is copied.

1. Saul Bass  
   Inspiration: graphic reduction, directional cuts, title-card authority  
   Inspiration -> Web implementation: accent bars, decisive diagonals, and chapter-like page entry moments

2. Josef Muller-Brockmann  
   Inspiration: hidden grid rigor  
   Inspiration -> Web implementation: strict alignment underneath the page, with selected headings and cards allowed to break vertical rhythm

3. Massimo Vignelli  
   Inspiration: system clarity and typographic command  
   Inspiration -> Web implementation: fewer scales, stronger labeling, less decorative copy, and infrastructural navigation

4. Matisse  
   Inspiration: cut-out energy and softened edge relationships  
   Inspiration -> Web implementation: colored planes and rounded fields that feel cut into the page rather than layered like generic gradients

5. Rothko  
   Inspiration: large emotional color fields  
   Inspiration -> Web implementation: broad ambient tonal changes and restrained glow fields that alter temperature without hurting readability

6. Zaha Hadid  
   Inspiration: momentum through flow and tension  
   Inspiration -> Web implementation: curved rails, directional movement paths, and a sense that the page is pulling forward

7. Tadao Ando  
   Inspiration: silence, concrete restraint, light as structure  
   Inspiration -> Web implementation: blank space that behaves as architecture, thin rules, and calm transitions instead of loud widgets

8. Dieter Rams  
   Inspiration: reduction to essentials  
   Inspiration -> Web implementation: obvious interactive targets, state clarity, minimal chrome, and no fake complexity

9. Naoto Fukasawa  
   Inspiration: quiet usefulness and tactile neutrality  
   Inspiration -> Web implementation: soft material surfaces, low-friction interaction, and components that feel inevitable instead of expressive for their own sake

10. Refik Anadol  
    Inspiration: computational atmosphere and fluid perception  
    Inspiration -> Web implementation: moving highlight fields and subtle procedural ambient motion behind static reading surfaces

## 4. Hard Constraints Applied

### Layout

- asymmetrical split hero
- hidden grid discipline underneath each section
- deliberate vertical offsets on selected modules
- oversized display type with controlled line measures

### Color

- warm editorial ground
- high-recognition vermilion accent
- amber secondary glow
- graphite and ink for primary contrast
- no purple or default blue as a primary signal

### Form

- curved rails
- rectangular and circular planes in tension
- modular panels with restrained glass surfaces
- visible rule structure and subtle grain-like layering

### Motion

- hover and state transitions: 200–300ms
- ambient motion: long-cycle and low-amplitude
- `prefers-reduced-motion` preserved

### Semantics

- header / main / section / nav / footer remain intact
- monospaced numeric system for serials and labels
- variable font axis used for UI labels
- symbols and codes kept minimal

## 5. Interaction and Visual System

### Page Structure

- Home
  A poster-like hero, an asymmetric three-entry grid, an active research-lines field, and a contact bridge
- Projects
  One featured anchor followed by calmer archive rows
- Journal
  Search + filter + long-form reading
- About
  Portrait rail plus method archive panel
- Contact
  Large invitation panel plus protocol-like contact rows

### Components

- site header
- hero poster field
- glass panel
- modular panel
- entry module
- signal card
- portrait panel
- page intro panel
- contact row
- reading tools

### State Model

- Default
  Quiet, high-contrast, sparse chrome, visible structure
- Hover
  220–280ms lift, subtle brightening, accent line reveal, stronger edge definition
- Active
  Navigation underline, stronger font-weight axis, persistent highlight where needed
- Disabled
  Lower contrast, no animation emphasis
- Error
  Existing not-found page with high legibility and clear exit
- Empty
  Journal empty state with calm text and no dramatic chrome
- Loading
  Minimal textual fallback, reduced visual noise, motion-safe

### Accessibility

- click targets remain at or above 44x44 where interactive
- reduced-motion path preserved
- contrast kept above decorative layers
- reading width constrained, especially for Chinese
- keyboard navigation and skip link preserved

### Motion Spec

- micro interactions: 220ms to 280ms
- entrance motion: 600ms to 800ms, ease-out
- ambient motion: 14s to 24s cycles
- no layout-jumping animations

### Responsive Breakpoint Strategy

- mobile: poster-first, single-column, remove decorative overlap
- tablet: preserve asymmetry through stagger and rebalancing
- desktop: full asymmetric composition with visible rails and offset modules

## 6. Design Tokens

### Color

- `--color-paper`: warm editorial ground
- `--color-paper-deep`: denser structural field
- `--color-ink`: main type and nav
- `--color-soft-ink`: body copy
- `--color-muted`: metadata
- `--color-accent`: vermilion brand accent
- `--color-accent-bright`: brighter accent for highlights
- `--color-accent-amber`: warm secondary energy
- `--color-graphite`: dark neutral for high-contrast surfaces

### Typography

- display: `Cormorant Garamond` with `Noto Serif SC`
- body: `Noto Serif SC`
- ui: `Roboto Flex`
- mono / numerics: `IBM Plex Mono`
- CJK body rules: tighter measure, higher line-height, strict line-break

### Grid

- 7xl content shell
- asymmetric desktop columns
- staggered secondary modules
- narrow reading widths for body copy

### Spacing

- hero and page-intro padding: large outer rhythm
- section rhythm: 4.5rem to 5.75rem
- component rhythm: 0.8rem to 1.6rem
- cards and modular panels: 1rem to 1.6rem internal padding

## 7. Key Wireframes

### Home

- left: massive name mark, serial chip, statement, actions
- right: narrow working-scope protocol panel
- background: planes, curve rail, grid
- below: three signal modules with stagger

### About

- top: quiet page intro panel
- left rail: portrait block
- right: large method statement panel
- below: four modular cards describing recurring themes and site purpose

### Contact

- top: large invitation panel with protocol code
- below: stacked contact rows with serial numbers and utility clarity

## 8. What Was Applied In Code

Implemented in the current site:

- variable-font UI layer using `Roboto Flex`
- monospaced numbering system using `IBM Plex Mono`
- vermilion / amber accent system
- stronger asymmetric module layout on the homepage
- modular panel system reused across Home / About / Contact
- industrial serial language for hero, about, and contact
- additional planes, rails, and ambient motion in the hero
- preserved semantic HTML, reduced-motion behavior, and touch target sizing
