import { ref, onMounted, onBeforeUnmount } from 'vue'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes in milliseconds

/**
 * Composable for tracking user inactivity and showing WakeUp modal after 15 minutes
 * 
 * Tracks: mousemove, keydown, touchstart, scroll, click
 * Resets timer on any activity
 */
export function useInactivityTimeout() {
  const showWakeUp = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function resetTimer() {
    // Clear existing timer
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Don't set new timer if modal is already shown
    if (showWakeUp.value) {
      return
    }

    // Set new timer
    timeoutId = setTimeout(() => {
      showWakeUp.value = true
    }, INACTIVITY_TIMEOUT)
  }

  function closeModal() {
    showWakeUp.value = false
    resetTimer()
  }

  function handleActivity() {
    resetTimer()
  }

  onMounted(() => {
    // Start timer
    resetTimer()

    // Listen to user activity events
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('touchstart', handleActivity)
    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('click', handleActivity)
  })

  onBeforeUnmount(() => {
    // Clear timer
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Remove event listeners
    window.removeEventListener('mousemove', handleActivity)
    window.removeEventListener('keydown', handleActivity)
    window.removeEventListener('touchstart', handleActivity)
    window.removeEventListener('scroll', handleActivity)
    window.removeEventListener('click', handleActivity)
  })

  return {
    showWakeUp,
    closeModal
  }
}

