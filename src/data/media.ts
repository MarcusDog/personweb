/**
 * Editorial image map — all images stored locally under /public/editorial/
 * Directions per materials-guide.md: brushed metal, paper texture,
 * minimal architectural surfaces, warm glass/light reflections.
 * Forbidden: night cityscape, programmer desk, space/chip, neon HUD.
 */
export const editorialMedia = {
  // Karesansui zen sand garden — sandy cream tones, meditative patterns
  zenRock: '/editorial/zen-rock.jpg',

  // Warm amber wall with organic cracks — like a Chinese ink landscape
  inkWall: '/editorial/ink-wall.jpg',

  // Warm paper / parchment layers
  paper: '/editorial/paper-texture.jpg',

  // Brushed industrial mesh with warm backlight
  brushedMetal: '/editorial/brushed-metal.jpg',

  // Tadao Ando minimal concrete wall
  concreteMinimal: '/editorial/concrete-minimal.jpg',
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
}
