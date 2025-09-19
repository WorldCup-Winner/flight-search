<template>
    <div
      class="min-h-screen w-full bg-[#F5F4F2] py-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="mx-auto max-w-[1200px] px-4">
        <div class="grid grid-cols-12 gap-6">
          <!-- Sidebar -->
          <aside class="col-span-12 md:col-span-3">
            <div class="rounded-2xl bg-white shadow-2xl p-4">
              <div class="skel h-6 w-40 rounded-md mb-4"></div>
              <div class="skel h-4 w-56 rounded mb-3"></div>
              <div class="skel h-4 w-48 rounded mb-6"></div>
  
              <div class="skel h-3 w-24 rounded mb-2"></div>
              <div class="skel h-8 w-full rounded-xl mb-3"></div>
              <div class="skel h-8 w-[85%] rounded-xl mb-3"></div>
              <div class="skel h-8 w-[70%] rounded-xl mb-5"></div>
  
              <div class="skel h-3 w-20 rounded mb-2"></div>
              <div class="skel h-24 w-full rounded-xl mb-3"></div>
              <div class="skel h-4 w-5/6 rounded mb-2"></div>
              <div class="skel h-4 w-2/3 rounded"></div>
            </div>
          </aside>
  
          <!-- Main list -->
          <section class="col-span-12 md:col-span-9 space-y-4">
            <!-- Header blocks -->
            <div class="rounded-2xl bg-white shadow-2xl p-4">
              <div class="skel h-6 w-2/3 rounded-md mb-3"></div>
              <div class="skel h-10 w-full rounded-xl"></div>
            </div>
  
            <!-- Repeating rows -->
            <div
              v-for="n in rows"
              :key="n"
              class="rounded-2xl bg-white shadow-2xl p-4"
            >
              <div class="flex items-center gap-4">
                <div class="skel h-10 w-10 rounded-lg shrink-0"></div>
  
                <div class="flex-1 grid grid-cols-12 gap-3">
                  <div class="col-span-12 md:col-span-6 space-y-2">
                    <div class="skel h-4 w-5/6 rounded"></div>
                    <div class="skel h-4 w-2/3 rounded"></div>
                  </div>
                  <div class="hidden md:block md:col-span-3 space-y-2">
                    <div class="skel h-4 w-3/4 rounded"></div>
                    <div class="skel h-4 w-1/2 rounded"></div>
                  </div>
                  <div class="hidden md:block md:col-span-3">
                    <div class="skel h-8 w-full rounded-xl"></div>
                  </div>
                </div>
  
                <div class="md:hidden w-16">
                  <div class="skel h-8 w-full rounded-xl"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    rows?: number
  }>()
  
  const rows = props.rows ?? 9
  </script>
  
  <style scoped>
  /* Soft shimmer using your palette (base #EEE9E4, highlight #FFFFFF66) */
  .skel {
    position: relative;
    overflow: hidden;
    background: #EEE9E4;
  }
  .skel::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    animation: shimmer 1.4s ease-in-out infinite;
  }
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
  </style>
  