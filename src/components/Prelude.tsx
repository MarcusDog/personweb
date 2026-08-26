import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PRELUDE_SESSION_KEY = 'personweb-prelude-seen'

export function Prelude() {
  const shouldReduceMotion = useReducedMotion()
  const location = useLocation()
  const [sessionSeen, setSessionSeen] = useState(
    () => sessionStorage.getItem(PRELUDE_SESSION_KEY) === 'true',
  )
  const visible = location.pathname === '/' && !sessionSeen

  useEffect(() => {
    if (!visible) {
      return
    }

    sessionStorage.setItem(PRELUDE_SESSION_KEY, 'true')
    const timeout = window.setTimeout(
      () => setSessionSeen(true),
      shouldReduceMotion ? 40 : 2000,
    )

    return () => window.clearTimeout(timeout)
  }, [shouldReduceMotion, visible])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_26%_0%,rgba(200,158,80,0.50),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(140,90,32,0.45),transparent_28%),linear-gradient(180deg,#2a2418_0%,#3a3020_100%)]"
          aria-hidden="true"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 -left-1/3 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(235,211,160,0.45),transparent)] blur-3xl"
              animate={
                shouldReduceMotion ? { opacity: 0.30 } : { x: ['0%', '200%'], opacity: [0.22, 0.50, 0.22] }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-6 text-center"
          >
            <p className="brand-display balance text-4xl leading-tight text-[var(--home-text)] md:text-6xl">
              小天Aya
            </p>
            <p className="mt-5 brand-ui text-sm font-medium text-[rgba(242,231,212,0.85)] md:text-base">
              AI systems builder · Independent developer
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
