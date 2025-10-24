<template>
    <div class="relative bg-white rounded-2xl shadow-2xl w-[730px] max-w-[95vw] z-100">
        <!-- Title bar -->
        <div class="flex items-center bg-primary-gold text-white px-6 py-3 rounded-t-2xl text-[18px] font-semibold">
            <span>日期選擇</span>
            <button
                class="absolute right-6 text-white hover:opacity-80 z-10"
                @click="$emit('close')"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="px-6 py-5">
            <!-- Header -->
            <div class="relative mb-8 text-center text-[18px] leading-8 text-gray-500 font-semi">
                <div class="grid grid-cols-2 items-center">
                    <!-- Left month selector -->
                    <div class="flex justify-center items-center space-x-2">
                        <input
                            type="number"
                            v-model="editableYear"
                            @change="updateMonth(0)"
                            class="w-20 text-center border border-gray-300 rounded-lg px-1 py-0.5 text-gray-700"
                        />
                        <select
                            v-model="editableMonth"
                            @change="updateMonth(0)"
                            class="border border-gray-300 rounded-lg px-1 py-0.5 text-gray-700"
                        >
                            <option v-for="m in 12" :key="m" :value="m - 1">{{ m }}月</option>
                        </select>
                    </div>

                    <!-- Right month label (auto next month) -->
                    <div class="flex justify-center items-center space-x-2">
                        <input
                            type="number"
                            :value="rightYear"
                            disabled
                            class="w-20 text-center border border-gray-200 bg-gray-100 rounded-lg px-1 py-0.5 text-gray-500"
                        />
                        <input
                            type="text"
                            :value="rightMonth + 1 + '月'"
                            disabled
                            class="w-16 text-center border border-gray-200 bg-gray-100 rounded-lg px-1 py-0.5 text-gray-500"
                        />
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
                                        sameDay(cell.date, selectedDate) ? 'bg-others-original text-white' : 'text-others-gray7',
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
                                        sameDay(cell.date, selectedDate) ? 'bg-others-original text-white' : 'text-others-gray7',
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
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    modelValue?: Date
    min?: Date
    max?: Date
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: Date): void
    (e: 'apply', v: Date): void
    (e: 'close'): void
}>()

const selectedDate = ref<Date | null>(props.modelValue ?? null)
watch(() => props.modelValue, v => (selectedDate.value = v ?? null))

const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

function shift(delta: number) {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + delta, 1)
}

const editableYear = ref(currentMonth.value.getFullYear())
const editableMonth = ref(currentMonth.value.getMonth())
const dow = ['日', '一', '二', '三', '四', '五', '六']

const rightMonth = computed(() => (editableMonth.value + 1) % 12)
const rightYear = computed(() =>
    editableMonth.value === 11 ? editableYear.value + 1 : editableYear.value
)

function updateMonth(_: number) {
    currentMonth.value = new Date(editableYear.value, editableMonth.value, 1)
}
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
    emit('apply', selectedDate.value)
}

watch(currentMonth, (newVal) => {
    editableYear.value = newVal.getFullYear()
    editableMonth.value = newVal.getMonth()
})

</script>
