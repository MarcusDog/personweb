import { copyFor } from '../lib/copy'
import type { Language, ProjectEntry } from '../types/content'

interface ProjectVisualProps {
  project: ProjectEntry
  language: Language
  compact?: boolean
}

export function ProjectVisual({ project, language, compact = false }: ProjectVisualProps) {
  return (
    <div
      className={`project-visual project-visual--${project.slug} ${
        compact ? 'project-visual-compact' : 'project-visual-full'
      }`}
      aria-hidden="true"
    >
      <div className="project-visual-grid" />
      <div className="project-visual-node project-visual-node-primary" />
      <div className="project-visual-node project-visual-node-secondary" />
      <div className="project-visual-node project-visual-node-tertiary" />
      <div className="project-visual-track project-visual-track-horizontal" />
      <div className="project-visual-track project-visual-track-vertical" />
      <div className="project-visual-window project-visual-window-left">
        <p className="project-visual-kicker">
          {project.year} / {copyFor(language, project.category)}
        </p>
        <p className="project-visual-title">{copyFor(language, project.title)}</p>
      </div>
      <div className="project-visual-window project-visual-window-right">
        <p className="project-visual-caption">{copyFor(language, project.subtitle)}</p>
        <div className="project-visual-tags">
          {project.capabilities.slice(0, compact ? 2 : 3).map((item) => (
            <span key={item.en}>{copyFor(language, item)}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
