import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

export function useFlightModals() {
  const isMobileModalOpen = ref(false)
  const isFlightInfoModalOpen = ref(false)

  let savedScrollY = 0
  let scrollLocked = false

  function lockBodyScroll() {
    if (scrollLocked) return
    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    scrollLocked = true
  }

  function unlockBodyScroll() {
    if (!scrollLocked) return
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY)
      savedScrollY = 0
      scrollLocked = false
    })
  }

  watch(isMobileModalOpen, (isOpen) => {
    if (isOpen) {
      lockBodyScroll()
    } else if (!isFlightInfoModalOpen.value) {
      unlockBodyScroll()
    }
  })

  watch(isFlightInfoModalOpen, (isOpen) => {
    // Don't lock scroll for inline modal (it's embedded in card, not overlay)
    // if (isOpen) {
    //   lockBodyScroll()
    // } else if (!isMobileModalOpen.value) {
    //   unlockBodyScroll()
    // }
  })

  onBeforeUnmount(() => {
    if (isMobileModalOpen.value || isFlightInfoModalOpen.value) {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScrollY)
        savedScrollY = 0
      })
    }
  })

  function handleMobileFlightInfo() {
    isMobileModalOpen.value = false
    nextTick(() => {
      isFlightInfoModalOpen.value = true
    })
  }

  return {
    isMobileModalOpen,
    isFlightInfoModalOpen,
    handleMobileFlightInfo
  }
}

