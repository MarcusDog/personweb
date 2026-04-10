import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PRELUDE_SESSION_KEY = 'personweb-prelude-seen'

export function Prelude() {
  const shouldReduceMotion = useReducedMotion()
  const location = useLocation()
  const [visible, setVisible] = useState(() => {
    if (location.pathname !== '/') return false
    return sessionStorage.getItem(PRELUDE_SESSION_KEY) !== 'true'
  })

  useEffect(() => {
    if (location.pathname !== '/') {
      setVisible(false)
      return
    }

    if (sessionStorage.getItem(PRELUDE_SESSION_KEY) === 'true') {
      setVisible(false)
      return
    }

    setVisible(true)
    sessionStorage.setItem(PRELUDE_SESSION_KEY, 'true')
    const timeout = window.setTimeout(
      () => setVisible(false),
      shouldReduceMotion ? 40 : 3000,
    )

    return () => window.clearTimeout(timeout)
  }, [location.pathname, shouldReduceMotion])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_26%_0%,rgba(200,158,80,0.24),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(140,90,32,0.18),transparent_28%),linear-gradient(180deg,#090806_0%,#16120e_100%)]"
          aria-hidden="true"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 -left-1/3 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(235,211,160,0.22),transparent)] blur-3xl"
              animate={
                shouldReduceMotion ? { opacity: 0.18 } : { x: ['0%', '200%'], opacity: [0.12, 0.28, 0.12] }
              }
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-6 text-center"
          >
            <p className="brand-display balance text-4xl leading-tight text-[var(--home-text)] md:text-6xl">
              嗨，这里是小天 Aya。
            </p>
            <p className="mt-6 brand-ui text-xs uppercase tracking-[0.34em] text-[rgba(242,231,212,0.72)] md:text-sm">
              Hey — I'm Tian. Welcome.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
