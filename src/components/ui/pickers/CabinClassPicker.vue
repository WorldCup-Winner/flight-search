<template>
    <div
        class="shadow-2xl flex flex-col bg-white rounded-t-3xl md:rounded-2xl
               w-full md:w-[200px] md:max-w-[85vw]"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 rounded-t-3xl md:rounded-t-2xl"
        >
            <span>艙等設定</span>
            <button
                class="md:hidden text-white hover:opacity-80 transition"
                @click="onClose"
                aria-label="關閉"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
            <div class="space-y-1">
                <button
                    v-for="cabinClass in cabinClassOptions"
                    :key="cabinClass"
                    class="w-full text-left px-4 py-2.5 rounded-lg transition-colors text-base"
                    :class="[
                        localSelectedClass === cabinClass
                            ? 'text-others-original bg-others-gray9'
                            : 'text-others-gray1 hover:bg-others-gray9'
                    ]"
                    @click="onClassClick(cabinClass)"
                >
                    {{ cabinClass }}
                </button>
            </div>
        </div>

        <!-- Footer: Mobile only -->
        <div
            class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10 rounded-t-[20px]"
            style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);"
        >
            <button
                class="w-full py-3 rounded-xl font-bold text-white transition bg-others-original hover:bg-others-hover"
                @click="onConfirm"
            >
                確認
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const cabinClassOptions = ['艙等不限', '經濟艙', '豪華經濟艙', '商務艙', '頭等艙']

const props = defineProps<{
    selectedClass: string
}>()

const emit = defineEmits<{
    (e: 'select', cabinClass: string): void
    (e: 'close'): void
}>()

const localSelectedClass = ref(props.selectedClass)

watch(() => props.selectedClass, (val) => {
    localSelectedClass.value = val
})

function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
}

function onClassClick(cabinClass: string) {
    localSelectedClass.value = cabinClass
    
    // Desktop: auto-close on selection
    if (!isMobile()) {
        emit('select', cabinClass)
        emit('close')
    }
}

function onConfirm() {
    emit('select', localSelectedClass.value)
    emit('close')
}

function onClose() {
    emit('close')
}
</script>

