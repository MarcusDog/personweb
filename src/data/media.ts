export const editorialMedia = {
  hero:
    'https://images.pexels.com/photos/16068775/pexels-photo-16068775.jpeg?cs=srgb&dl=pexels-sasi-tha-16068775.jpg&fm=jpg',
  architecture:
    'https://images.pexels.com/photos/7078719/pexels-photo-7078719.jpeg?cs=srgb&dl=pexels-laura-tancredi-7078719.jpg&fm=jpg',
  goldTexture:
    'https://images.pexels.com/photos/21031387/pexels-photo-21031387.jpeg?cs=srgb&dl=pexels-robert-clark-504241532-21031387.jpg&fm=jpg',
}

export const projectMediaBySlug: Record<string, string> = {
  'signal-ops-agent': editorialMedia.hero,
  'studio-publishing-loop': editorialMedia.architecture,
  'partner-brief-agent': editorialMedia.goldTexture,
  'research-memory-index': editorialMedia.architecture,
}
