<template>
  <Teleport to="body">
    <transition name="fade">
      <div 
        v-if="open" 
        class="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-0 lg:p-4"
        @click.self="emit('close')"
      >
        <!-- Modal card -->
        <div
          class="bg-white w-full h-full lg:w-auto lg:h-auto lg:max-w-[900px] lg:max-h-[85vh] flex flex-col overflow-hidden lg:rounded-[15px] lg:shadow-2xl"
          @click.stop
        >
          <!-- Mobile Header (only on mobile) -->
          <div class="flex items-center justify-between px-4 py-4 bg-primary-gold border-b border-others-gray4 flex-shrink-0 lg:hidden">
            <span class="text-xl font-bold text-white">姓名填寫範例</span>
            <button
              @click="emit('close')"
              class="text-white hover:text-others-original transition-colors p-1"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          
          <div class="flex-1 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
            <h1 class="text-[30px] hidden md:block md:mb-4 text-others-gray1">姓名填寫範例</h1>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <!-- Section 1: 一般護照 -->
              <div class="flex flex-col">
                <h3 class="text-lg font-bold text-primary-gold mb-4">一般護照</h3>
                
                <!-- Example fields -->
                <div class="flex flex-col gap-2 mb-4">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-others-gray7">姓 Surname</span>
                    <span class="text-sm font-bold text-others-original">LEE</span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap md:mb-7">
                    <span class="text-sm font-semibold text-others-gray7">名 Given Name</span>
                    <span class="text-sm font-bold text-others-original">DA-MING</span>
                    <span class="border border-others-original text-others-original text-xs px-2 py-1 rounded whitespace-nowrap">
                      請勿輸入符號或空格
                    </span>
                  </div>
                </div>
                
                <!-- Passport image -->
                <img 
                  src="@/assets/imgs/passort-male.png" 
                  alt="passport example male" 
                  class="w-full rounded drop-shadow mb-16 md:mb-0" 
                />
              </div>

              <!-- Section 2: 無區分姓名的護照 -->
              <div class="flex flex-col">
                <h3 class="text-lg font-bold text-primary-gold mb-4">無區分姓名的護照</h3>
                
                <!-- Example fields -->
                <div class="flex flex-col gap-2 mb-4">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-others-gray7">姓 Surname</span>
                    <span class="text-sm font-bold text-others-original">Fatima</span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-others-gray7">名 Given Name</span>
                    <span class="text-sm font-bold text-others-original">男生填 MR</span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-others-gray7">名 Given Name 女生填</span>
                    <span class="text-sm font-bold text-others-original">MS</span>
                    <span class="border border-others-original text-others-original text-xs px-2 py-1 rounded whitespace-nowrap">
                      請勿輸入符號或空格
                    </span>
                  </div>
                </div>
                
                <!-- Passport image -->
                <img 
                  src="@/assets/imgs/passport-female.png" 
                  alt="passport example female" 
                  class="w-full rounded drop-shadow" 
                />
              </div>
            </div>
          </div>

          <!-- Footer with button (Desktop only) -->
          <div class="hidden lg:flex items-center justify-center px-8 py-4 flex-shrink-0">
            <button
              @click="emit('close')"
              class="w-full max-w-[200px] bg-others-original text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-others-hover transition-colors"
            >
              了解
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ 
  open: boolean 
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

