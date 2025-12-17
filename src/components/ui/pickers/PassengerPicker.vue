<template>
    <div
        class="shadow-2xl flex flex-col bg-white rounded-t-3xl md:rounded-2xl
               w-full md:w-[328px] md:max-w-[85vw]"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 rounded-t-3xl md:rounded-t-2xl"
        >
            <span>人數</span>
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
        <div class="px-6 md:px-8 py-4">
            <!-- Adults -->
            <div class="flex items-center justify-between mb-3">
                <div class="text-others-gray1 text-base md:text-lg">成人 (12+)</div>
                <div class="flex items-center gap-3">
                    <button
                        @click="decrementAdults"
                        :disabled="localAdultCount <= 1"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50 transition"
                    >
                        <span class="text-3xl font-normal leading-none">−</span>
                    </button>
                    <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{ localAdultCount }}</span>
                    <button
                        @click="incrementAdults"
                        :disabled="localAdultCount >= 9"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50 transition"
                    >
                        <span class="text-3xl font-normal leading-none">+</span>
                    </button>
                </div>
            </div>

            <!-- Children -->
            <div class="flex items-center justify-between mb-4">
                <div class="text-others-gray1 text-base md:text-lg">孩童 (2-11)</div>
                <div class="flex items-center gap-3">
                    <button
                        @click="decrementChildren"
                        :disabled="localChildrenCount <= 0"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50 transition"
                    >
                        <span class="text-3xl font-normal leading-none">−</span>
                    </button>
                    <span class="text-xl text-others-gray1 min-w-[2rem] text-center">{{ localChildrenCount }}</span>
                    <button
                        @click="incrementChildren"
                        :disabled="localChildrenCount >= 8"
                        class="w-10 h-10 rounded-lg bg-others-gray2 flex items-center justify-center text-primary-gold hover:bg-others-gray3 disabled:opacity-50 transition"
                    >
                        <span class="text-3xl font-normal leading-none">+</span>
                    </button>
                </div>
            </div>

            <div class="text-sm text-others-gray5 text-left mb-6">
                如有嬰兒(&lt;2歲)同行，請洽票務人工訂位
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

const props = defineProps<{
    adultCount: number
    childrenCount: number
}>()

const emit = defineEmits<{
    (e: 'update', payload: { adults: number; children: number }): void
    (e: 'close'): void
}>()

const localAdultCount = ref(props.adultCount)
const localChildrenCount = ref(props.childrenCount)

watch(() => props.adultCount, (val) => {
    localAdultCount.value = val
})

watch(() => props.childrenCount, (val) => {
    localChildrenCount.value = val
})

function incrementAdults() {
    if (localAdultCount.value < 9) {
        localAdultCount.value++
        emitIfDesktop()
    }
}

function decrementAdults() {
    if (localAdultCount.value > 1) {
        localAdultCount.value--
        emitIfDesktop()
    }
}

function incrementChildren() {
    if (localChildrenCount.value < 8) {
        localChildrenCount.value++
        emitIfDesktop()
    }
}

function decrementChildren() {
    if (localChildrenCount.value > 0) {
        localChildrenCount.value--
        emitIfDesktop()
    }
}

function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
}

function emitIfDesktop() {
    // Desktop: emit on every change
    if (!isMobile()) {
        emit('update', {
            adults: localAdultCount.value,
            children: localChildrenCount.value
        })
    }
}

function onConfirm() {
    emit('update', {
        adults: localAdultCount.value,
        children: localChildrenCount.value
    })
    emit('close')
}

function onClose() {
    emit('close')
}
</script>

