<template>
    <div class="bg-white rounded-2xl shadow-2xl w-[730px] max-w-[95vw]">
        <!-- Title bar -->
        <div class="bg-primary-gold text-white px-6 py-3 rounded-t-2xl text-[18px] font-semibold">
            日期選擇
        </div>

        <div class="px-6 py-5">
            <!-- Header -->
            <div class="relative mb-8 text-center text-[18px] leading-8 text-gray-500 font-semi">

                <div class="grid grid-cols-2 items-center">
                    <div class="text-center text-[18px] leading-8 font-semi text-gray-500">
                        {{ monthLabel(currentMonth) }}
                    </div>
                    <div class="text-center text-[18px] leading-8 font-semi text-gray-500">
                        {{ monthLabel1(currentMonth) }}
                    </div>
                </div>

                <button @click="shift(-1)"
                    class="w-[36px] h-[36px] absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-others-gray2 text-primary-gold hover:bg-others-gray4 transition transform scale-y-[-1]"
                    aria-label="previous month">
                    <img src="@/assets/imgs/arrow-right.svg" alt="Swap Arrow" class="transform rotate-180" />
                </button>

                <button @click="shift(1)"
                    class="w-[36px] h-[36px] absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-others-gray2 text-primary-gold hover:bg-others-gray4 transition"
                    aria-label="next month">
                    <img src="@/assets/imgs/arrow-right.svg" alt="Swap Arrow" />
                </button>
            </div>

            <!-- Two months side-by-side -->
            <div class="grid grid-cols-2 gap-12">
                <!-- LEFT MONTH -->
                <div class="w-full">
                    <!-- DOW header -->
                    <div class="grid grid-cols-7 text-center mb-4 text-[16px] leading-none">
                        <div v-for="(d, i) in dow" :key="d" class="tracking-wide h-8 flex items-center justify-center"
                            :class="i === 0 || i === 6 ? 'text-others-original' : 'text-others-gray1'">
                            {{ d }}
                        </div>
                    </div>

                    <!-- Weeks -->
                    <div class="space-y-0.5">
                        <div v-for="(week, wi) in getGrid(currentMonth)" :key="wi" class="grid grid-cols-7 gap-0">
                            <div v-for="(cell, di) in week" :key="di" class="relative h-14">
                                <button v-if="cell.inMonth"
                                    class="relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors"
                                    :class="[
                                        sameDay(cell.date, selectedDate) ? 'bg-others-original text-white' : 'text-gray-600',
                                        isDisabled(cell.date) ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
                                    ]" :disabled="isDisabled(cell.date)" @click="onPick(cell.date)">
                                    {{ cell.date.getDate() }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right MONTH -->
                <div class="w-full">
                    <!-- DOW header -->
                    <div class="grid grid-cols-7 text-center mb-4 text-[16px] leading-none">
                        <div v-for="(d, i) in dow" :key="d" class="tracking-wide h-8 flex items-center justify-center"
                            :class="i === 0 || i === 6 ? 'text-others-original' : 'text-others-gray1'">
                            {{ d }}
                        </div>
                    </div>

                    <!-- Weeks -->
                    <div class="space-y-0.5">
                        <div v-for="(week, wi) in getGrid(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, currentMonth.getDay()))"
                            :key="wi" class="grid grid-cols-7 gap-0">
                            <div v-for="(cell, di) in week" :key="di" class="relative h-14">
                                <button v-if="cell.inMonth"
                                    class="relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors"
                                    :class="[
                                        sameDay(cell.date, selectedDate) ? 'bg-others-original text-white' : 'text-gray-600',
                                        isDisabled(cell.date) ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
                                    ]" :disabled="isDisabled(cell.date)" @click="onPick(cell.date)">
                                    {{ cell.date.getDate() }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue?: Date | null
    min?: Date | null
    max?: Date | null
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: Date | null): void }>()

const selectedDate = ref<Date | null>(props.modelValue ?? null)
watch(() => props.modelValue, v => (selectedDate.value = v ?? null))

const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

function shift(delta: number) {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + delta, 1)
}
function monthLabel(d: Date) {
    return `${d.getFullYear()}年 ${d.getMonth() + 1}月`
}
function monthLabel1(d: Date) {
    if (d.getMonth() >= 11) return `${d.getFullYear()}年 1月`
    return `${d.getFullYear()}年 ${d.getMonth() + 2}月`
}
const dow = ['日', '一', '二', '三', '四', '五', '六']

function getGrid(month: Date) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const startOffset = first.getDay()
    const startDate = new Date(first)
    startDate.setDate(first.getDate() - startOffset)

    const days: { date: Date; inMonth: boolean }[] = []
    for (let i = 0; i < 42; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        days.push({ date: d, inMonth: d.getMonth() === first.getMonth() })
    }
    return Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7))
}

function sameDay(a?: Date | null, b?: Date | null) {
    if (!a || !b) return false
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}
function isDisabled(d: Date) {
    if (props.min && d < props.min) return true
    if (props.max && d > props.max) return true
    return false
}
function onPick(d: Date) {
    if (isDisabled(d)) return
    selectedDate.value = d
    emit('update:modelValue', selectedDate.value)
}
</script>
