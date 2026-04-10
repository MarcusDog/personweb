/**
 * Editorial image map — all images stored locally under /public/editorial/
 * Directions per materials-guide.md: brushed metal, paper texture,
 * minimal architectural surfaces, warm glass/light reflections.
 * Forbidden: night cityscape, programmer desk, space/chip, neon HUD.
 */
export const editorialMedia = {
  // Hero right-panel texture (dark fluid abstract painting)
  hero: '/editorial/dark-fluid.jpg',

  // Minimal concrete / architectural surfaces
  architecture: '/editorial/concrete-arch.jpg',
  concreteMinimal: '/editorial/concrete-minimal.jpg',

  // Warm interior — light and material surfaces
  warmInterior: '/editorial/warm-interior.jpg',

  // Warm paper / parchment texture
  paper: '/editorial/paper-texture.jpg',

  // Gold textile close-up (warm metallic)
  goldTexture: '/editorial/gold-texture.jpg',

  // Brushed metal surface
  brushedMetal: '/editorial/brushed-metal.jpg',

  // Soft warm bokeh / light reflections
  warmBokeh: '/editorial/warm-bokeh.jpg',
  lightBokeh: '/editorial/light-bokeh.jpg',

  // Dark abstract (secondary hero option / deep panel background)
  darkAbstract: '/editorial/dark-abstract.jpg',
}

// Ordered project screenshots for About gallery and Home about section
export const showcaseImages = [
  '/project-images/ainews/1.png',
  '/project-images/ainews/4.png',
  '/project-images/ainews/7.png',
  '/project-images/learningbydoing/1.png',
  '/project-images/learningbydoing/4.png',
  '/project-images/learningbydoing/8.png',
]

export const projectMediaBySlug: Record<string, string> = {
  'ainews-platform': '/project-images/ainews/1.png',
  'learningbydoing-ai-studio': '/project-images/learningbydoing/8.png',
  'studio-publishing-loop': '/editorial/concrete-arch.jpg',
  'partner-brief-agent': '/editorial/gold-texture.jpg',
  'research-memory-index': '/editorial/brushed-metal.jpg',
}
