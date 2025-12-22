<template>
  <Teleport to="body">
    <!-- Multi-trip: Full modal like DatePicker -->
    <transition name="fade-scale">
      <div
        v-if="open && activeTab === 'multi'"
        class="fixed inset-0 z-[120] bg-black/40 md:hidden overflow-hidden"
        @click.self="$emit('close')"
      >
        <div class="flex flex-col h-full w-full bg-white overflow-hidden shadow-2xl">
          <!-- Modal Header -->
          <div class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0 z-20">
            <span>機票搜尋</span>
            <button
              class="text-white hover:opacity-80 transition"
              @click="$emit('close')"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- SearchPanel Content -->
          <div class="flex-1 overflow-y-auto min-h-0 px-4 py-4">
            <SearchPanel
              :active-tab="activeTab"
              :restored-params="restoredParams"
              instance-id="search-modal"
              :hide-title="true"
              @update:activeTab="$emit('update:activeTab', $event)"
              @roundtrip-search="$emit('roundtrip-search', $event)"
              @oneway-search="$emit('oneway-search', $event)"
              @multi-search="$emit('multi-search', $event)"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- One-way / Round-trip: Bottom sheet like LocationPicker -->
    <transition name="fade-scale">
      <div
        v-if="open && (activeTab === 'oneway' || activeTab === 'roundtrip')"
        class="fixed inset-0 z-[120] bg-black/40 md:hidden overflow-hidden"
        @click.self="$emit('close')"
      >
        <div class="flex items-end justify-center min-h-full p-0">
          <div class="shadow-2xl flex flex-col bg-white w-full h-[60vh] rounded-t-3xl">
            <!-- Modal Header -->
            <div class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between sticky top-0 z-20 rounded-t-3xl">
              <span>機票搜尋</span>
              <button
                class="text-white hover:opacity-80 transition"
                @click="$emit('close')"
                aria-label="關閉"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- SearchPanel Content -->
            <div class="flex-1 overflow-y-auto min-h-0 px-4 py-4">
              <SearchPanel
                :active-tab="activeTab"
                :restored-params="restoredParams"
                instance-id="search-modal"
                :hide-title="true"
                @update:activeTab="$emit('update:activeTab', $event)"
                @roundtrip-search="$emit('roundtrip-search', $event)"
                @oneway-search="$emit('oneway-search', $event)"
                @multi-search="$emit('multi-search', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import SearchPanel from '@/components/home/SearchPanel.vue'

type TripTab = 'oneway' | 'roundtrip' | 'multi'

defineProps<{
  open: boolean
  activeTab: TripTab
  restoredParams?: any | null
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'update:activeTab', value: TripTab): void
  (e: 'roundtrip-search', payload: any): void
  (e: 'oneway-search', payload: any): void
  (e: 'multi-search', payload: any): void
}>()
</script>

<style scoped>
/* subtle entrance for the modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all .15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>

