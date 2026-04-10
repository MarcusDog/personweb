# Personal Website Design Spec

Date: 2026-03-29
Project: Personal website for XiaoTian Aya / BemsZzz
Status: Approved for implementation planning

## Goal

Design a premium bilingual personal website for `小天Aya｜BemsZzz` that feels closer to an editorial cover and a long-lived personal publication than a standard portfolio or resume site.

The site should:

- establish a strong first impression through typography, restraint, and motion
- present the identity of a researcher, learner, and AI explorer
- support long-term growth across projects, journal entries, about content, and contact paths
- avoid generic startup, SaaS, and stock-portfolio visual language

## Positioning

This website is not:

- a standard portfolio grid
- a resume website
- a landing page with conversion-heavy CTA blocks
- a blog theme with a decorative homepage

This website is:

- a personal publication
- a curated archive of work, notes, and ongoing study
- a bilingual research-oriented identity site
- a design-led, code-driven interface where typography is the main visual system

Core identity framing:

- primary public name: `小天Aya`
- secondary identity: `BemsZzz`
- core role framing: `Researcher / Learner / AI Explorer`

## Experience Thesis

The homepage should feel like a cover.

Interior pages should feel quieter, more readable, and more systematic.

The overall experience should combine:

- Nathan Smith's typographic intensity
- Apple's restraint and polish
- the durable content structure of research and journal-driven personal sites

The site should rely primarily on code-driven visual atmosphere rather than photography. If imagery is used, it should appear sparingly and in controlled placements, not as the primary engine of the experience.

## Design Principles

1. Typography is the hero.
2. The first screen establishes mood, not completeness.
3. Every page should have one dominant job.
4. Motion should create presence, not spectacle.
5. Interior pages must become calmer as content depth increases.
6. The system must be extensible for future projects, notes, essays, and archives.
7. Personal assets should appear as controlled signals, not as oversized profile content.

## Information Architecture

Version 1 includes five primary pages and two detail templates:

- `Home`
- `Projects`
- `Project Detail`
- `Journal`
- `Article Detail`
- `About`
- `Contact`

Future-compatible expansions should be supported by the structure even if not fully surfaced in v1:

- archive / older work
- tags or filters for projects
- categories for writing
- "now" or "currently studying"
- bilingual toggle behavior refinement

## Global System

### Language

The site is bilingual: Chinese and English.

Guidelines:

- bilingual capability should be real, not decorative
- do not overload the homepage with translation mechanics
- interior pages may expose language switching more explicitly
- Chinese and English typography must both feel intentional and premium

### Navigation

Primary navigation should remain minimal:

- Projects
- Journal
- About
- Contact

Behavior:

- navigation must feel like part of the composition, not a utility bar
- links should use refined hover states rather than loud button styling
- the homepage nav may appear lighter and more editorial than on inner pages

### Layout

The layout system should be open and spacious.

Rules:

- no dashboard-style card mosaics
- no crowded hero blocks
- no heavy boxed containers by default
- use spacing, scale, rhythm, and dividers before relying on cards
- allow asymmetry where it strengthens the cover feeling

## Page-by-Page Direction

### Home

Purpose:

- create first impression
- establish identity
- open pathways into the rest of the site

Structure:

1. `Cover`
2. `Selected Openings`
3. `Current Signals`
4. `Closing Contact`

#### Home: Cover

This is the most important screen in the system.

Content:

- oversized `小天Aya`
- lighter secondary `BemsZzz`
- split identity lines such as:
  - Researcher
  - Learner
  - AI Explorer
- minimal nav
- subtle supporting statement

Behavior:

- cover should feel like a poster or editorial title page
- the title should be large enough to dominate the viewport
- movement should be slow, refined, and deliberate
- the page should feel alive through typography and spatial motion, not through loud media

Interaction direction:

- typography-led motion
- selective masking / reveal
- light parallax or layered drift
- restrained hover feedback
- a small amount of structural "data atmosphere" in the background

Explicitly avoid:

- project cards in the first screen
- profile-photo hero
- logo cloud, stats strip, chip collections
- generic startup headline + paragraph + buttons formula

#### Home: Selected Openings

Instead of generic teaser cards, this section should present three elegant entry points:

- Projects
- Journal
- About

These should feel like chapter openings rather than product modules.

#### Home: Current Signals

This section introduces current themes without becoming a feed.

Examples:

- what is currently being studied
- what is currently being built
- what is currently being written or questioned

Keep to 2-4 items only.

#### Home: Closing Contact

The homepage should close quietly.

This area should feel like the back page of a publication:

- one short invitation
- email / selected links
- minimal visual weight

### Projects

Purpose:

- act as a curated index of work
- provide a stable long-term archive for finished and ongoing projects

Visual direction:

- more systematic than the homepage
- still elegant and editorial
- no noisy portfolio masonry

Content pattern per project:

- title
- year
- type
- one-sentence description
- optional status or archive signal

Rules:

- do not give every project equal visual weight
- allow featured vs secondary hierarchy
- archive older or lighter work cleanly

### Project Detail

Purpose:

- explain what a project is
- explain why it matters
- show enough process or system thinking to feel authored

Suggested structure:

1. Title + one-line definition
2. Context / why it was made
3. Key visual or interface capture
4. Process / thinking / structure
5. Related notes or continuation paths

Asset guidance:

- sparse, intentional visuals only
- the user-provided page illustration may appear here if contextually appropriate
- do not clutter project pages with decorative imagery

### Journal

Purpose:

- become the long-term living core of the site
- support notes, essays, fragments, and future study logs

The journal should feel like field notes, not a conventional blog archive.

Compatible content modes:

- essays
- notes
- fragments

Version 1 may expose these under one unified journal index while keeping the system ready for later differentiation.

### Article Detail

Purpose:

- provide the quietest reading experience in the site

Visual direction:

- most Apple-like page in the system
- minimal chrome
- calm margins
- strong hierarchy
- excellent reading rhythm

Structure:

1. category / meta
2. title
3. short standfirst or intro
4. article body
5. optional language switch

Rules:

- no distracting side UI
- no ornamental motion during reading
- no loud visual modules inserted into the body by default

### About

Purpose:

- explain the person behind the site
- reveal interests, themes, and motivations
- feel personal without becoming a resume dump

Suggested content:

- who XiaoTian Aya / BemsZzz is
- what topics are repeatedly returned to
- why this website exists
- how learning, making, and writing are connected
- selected external links

Asset guidance:

- small personal avatar can be used as a stamp
- the user-provided illustration is especially suitable here
- these assets should deepen personality, not overpower layout

### Contact

Purpose:

- provide a quiet but definite closing point

Suggested content:

- email
- GitHub
- social media
- short invitation line

Visual direction:

- very restrained
- feels like a final page, not a conversion block

## Visual Language

### Typography

The visual system should use a dual typography structure:

- expressive display typography for major titles and cover moments
- restrained, highly readable text typography for body copy and longer reading

Requirements:

- Chinese and English must both feel premium
- cover-scale titles must hold up at very large sizes
- body text must be comfortable for journal reading

Typography should create:

- cover intensity on the homepage
- catalog clarity on index pages
- reading calm on article pages

### Color

Use a warm, restrained palette.

Base colors:

- ivory
- oat
- parchment
- pale stone
- graphite
- ink black
- soft brown-gray supporting tones

Rules:

- no bright accent color by default
- luxury comes from tonal control, not from saturation
- visual hierarchy should rely heavily on value contrast and spacing

### Surfaces

Surfaces should feel like refined paper, quiet panels, and soft editorial layers.

Rules:

- avoid thick borders and heavy container UI
- use thin dividers, spacious grouping, and subtle tonal panels
- default to open composition before enclosed cards

## Motion System

Primary motion model:

- `Typography Motion` as the main language
- a small amount of `Data Atmosphere` as secondary support

### Typography Motion

Use:

- large-scale reveal on load
- soft mask transitions
- measured scroll-linked movement
- refined hover transitions
- section entry pacing that feels confident and slow

Do not use:

- noisy bounce interactions
- attention-seeking looping effects
- motion that competes with reading

### Data Atmosphere

Use very lightly:

- faint grid lines
- coordinates, indexes, or numbering
- subtle structural overlays
- minimal signal-like markers

These elements should suggest a research or systems mindset without becoming "AI-themed decoration."

If the page reads as obviously "techy" or "sci-fi", the treatment has gone too far.

## Imagery Policy

Primary direction: image-light, code-first visual system.

The site should not depend on photography to feel premium.

If imagery is used:

- homepage: use little or none
- journal: occasional paper / note / fragment support
- projects: sparing contextual imagery
- about: personal assets allowed in controlled placement

### Approved personal assets

- avatar image: use as a small identity mark, not a hero portrait
- selected personal illustration: suitable for About or selective detail-page placement

### Avoid

- generic stock workspace imagery
- lifestyle tech shots with little conceptual value
- full-bleed profile-photo hero treatment
- multiple competing images on a single screen

## Content Voice

Tone should be:

- intelligent
- restrained
- reflective
- direct

Avoid:

- startup slogans
- fake grandeur
- over-explaining the homepage
- overly cute or casual UI copy

The site should sound like a thoughtful person who builds, studies, and writes over time.

## Implementation Constraints

The implementation should preserve these priorities:

1. homepage typography and motion quality
2. interior page calmness
3. long-term extensibility for content
4. bilingual support
5. disciplined use of personal assets

Do not regress into:

- generic component-heavy UI
- dashboard-like layouts
- image-led homepage composition
- arbitrary accent colors
- motion for motion's sake

## Success Criteria

The design is successful if:

- the homepage feels memorable without relying on imagery
- the site feels premium and intentional within seconds
- the interior pages become quieter and easier to read
- the system can grow with more projects and journal content
- the site feels personal, not templated
- the user can continue adding content without breaking the aesthetic

## Recommended Next Step

Use this document as the source spec for implementation planning.

The implementation plan should translate this design into:

- page routes and templates
- typography system
- color tokens
- motion rules
- content schema
- asset placement rules
- responsive behavior
