import { motion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRef } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  parallaxStrength?: number
}

/**
 * 滚动视差容器组件
 * - 子元素以不同速度滚动，产生深度感
 * - parallaxStrength: 视差强度（0-1，默认 0.3）
 * - offsetStart/End: 视差效果开始/结束位置（0-1，相对于整个页面）
 */
export function ParallaxSection({
  children,
  className = '',
  parallaxStrength = 0.3,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * parallaxStrength, -100 * parallaxStrength])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 1], [1 + parallaxStrength * 0.1, 1 - parallaxStrength * 0.1])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, opacity, scale }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

interface ParallaxBackgroundProps {
  children?: ReactNode
  className?: string
  speed?: number
}

/**
 * 背景视差层 - 用于背景元素以较慢速度滚动
 */
export function ParallaxBackground({ children, className = '', speed = 0.5 }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed])

  return (
    <motion.div ref={ref} style={{ y }} className={`absolute inset-0 will-change-transform ${className}`}>
      {children}
    </motion.div>
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  strength?: number
}

/**
 * 视差图片组件 - 图片在容器中产生滚动位移效果
 */
export function ParallaxImage({ src, alt, className = '', strength = 0.4 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [80 * strength, -80 * strength])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover will-change-transform"
        loading="lazy"
      />
    </div>
  )
}
