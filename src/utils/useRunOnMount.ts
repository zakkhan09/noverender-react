import { useEffect, useRef } from 'react'

export const useRunOnMount = (effect: () => void, cleanup?: () => void) => {
  const runOnce = useRef(true)
  useEffect(() => {
    if (runOnce.current) {
      effect()
      runOnce.current = false
    }
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [effect, cleanup])
}
