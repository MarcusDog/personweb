import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useRef } from 'react'

import { cn } from '../lib/utils'

interface HomeScrollSectionProps extends PropsWithChildren {
  className?: string
  glowClassName?: string
  frameClassName?: string
}

export function HomeScrollSection({
  children,
  className,
  glowClassName,
  frameClassName,
}: HomeScrollSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Cinematic: enters from below (scale up, subtle tilt), exits by receding (scale down, fade)
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.78, 1], [0, 1, 1, 0.52])
  const y = useTransform(scrollYProgress, [0, 0.16, 0.88, 1], [96, 0, 0, -48])
  const scale = useTransform(scrollYProgress, [0, 0.16, 0.8, 1], [0.9, 1, 1, 0.94])
  const rotateX = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [3, 0, 0, -0.5])
  const glowOpacity = useTransform(scrollYProgress, [0.08, 0.26, 0.72, 0.94], [0, 1, 0.85, 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [48, -32])

  return (
    <div ref={ref} style={{ perspective: '1400px' }}>
      <motion.section
        className={cn('home-scroll-section relative', className)}
        style={shouldReduceMotion ? undefined : { opacity, y, scale, rotateX, transformOrigin: 'center top' }}
      >
        <motion.div
          aria-hidden="true"
          className={cn('home-scroll-glow', glowClassName)}
          style={shouldReduceMotion ? undefined : { opacity: glowOpacity, y: glowY }}
        />
        <div className={cn('home-scroll-frame relative z-[1]', frameClassName)}>
          <div aria-hidden="true" className="home-scroll-scaffold">
            <span className="home-scroll-scaffold-line home-scroll-scaffold-line-top" />
            <span className="home-scroll-scaffold-line home-scroll-scaffold-line-bottom" />
            <span className="home-scroll-scaffold-line home-scroll-scaffold-line-vertical" />
          </div>
          {children}
        </div>
      </motion.section>
    </div>
  )
}
