<!-- components/RangeDatePicker.vue -->
<template>
    <div class="bg-white rounded-2xl shadow-2xl w-[730px] max-w-[95vw]">
        <!-- Title bar -->
        <div class="bg-primary-gold text-white px-6 py-3 rounded-t-2xl text-[18px] font-semibold">
            日期選擇
        </div>

        <div class="px-6 py-5">
            <!-- Header: titles centered, arrows aligned -->
            <div class="relative mb-8">
                <!-- 2-col titles, each centered above its month -->
                <div class="grid grid-cols-2 items-center">
                    <div class="text-center text-[18px] leading-8 font-semi text-gray-500">
                        {{ monthLabel(leftMonth) }}
                    </div>
                    <div class="text-center text-[18px] leading-8 font-semi text-gray-500">
                        {{ monthLabel(rightMonth) }}
                    </div>
                </div>

                <!-- nav arrows pinned to edges, vertically centered to the header row -->
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
                        <div v-for="(week, wi) in getGrid(leftMonth)" :key="wi" class="grid grid-cols-7 gap-0">
                            <div v-for="(cell, di) in week" :key="di" class="relative h-14">
                                <!-- Range background -->
                                <div v-if="cell.inMonth && isBetween(cell.date, start, end)"
                                    class="absolute h-14 pt-1.5 top-0  inset-y-2 inset-x-0 bg-others-gray6" :class="[
                                        sameDay(cell.date, start) ? 'rounded-l-xl' : '',
                                        sameDay(cell.date, end) ? 'rounded-r-xl' : '',
                                        di === 0 ? 'rounded-l-xl' : '',
                                        di === 6 ? 'rounded-r-xl' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, start) ? 'rounded-r-xl' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, end) ? 'rounded-l-xl' : ''
                                    ]" />
                                <!-- Day button -->
                                <button v-if="cell.inMonth"
                                    class="relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors"
                                    :class="[
                                        'text-gray-600',
                                        sameDay(cell.date, start) || sameDay(cell.date, end)
                                            ? 'bg-others-original text-white'
                                            : '',
                                        isDisabled(cell.date) ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer',
                                        isTwoConsecutiveDays() && sameDay(cell.date, start) ? 'rounded-r-none' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, end) ? 'rounded-l-none' : ''
                                    ]" :disabled="isDisabled(cell.date)" @click="onPick(cell.date)">
                                    {{ cell.date.getDate() }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT MONTH -->
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
                        <div v-for="(week, wi) in getGrid(rightMonth)" :key="wi" class="grid grid-cols-7 gap-0">
                            <div v-for="(cell, di) in week" :key="di" class="relative h-14">
                                <!-- Range background -->
                                <div v-if="cell.inMonth && isBetween(cell.date, start, end)"
                                    class="absolute h-14 pt-1.5 top-0  inset-y-2 inset-x-0 bg-others-gray6" :class="[
                                        sameDay(cell.date, start) ? 'rounded-l-xl' : '',
                                        sameDay(cell.date, end) ? 'rounded-r-xl' : '',
                                        di === 0 ? 'rounded-l-xl' : '',
                                        di === 6 ? 'rounded-r-xl' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, start) ? 'rounded-r-none' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, end) ? 'rounded-l-none' : ''

                                    ]" />
                                <!-- Day button -->
                                <button v-if="cell.inMonth"
                                    class="relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors"
                                    :class="[
                                        'text-others-gray1',
                                        sameDay(cell.date, start) || sameDay(cell.date, end)
                                            ? 'bg-others-original text-white'
                                            : '',
                                        isDisabled(cell.date) ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer',
                                        isTwoConsecutiveDays() && sameDay(cell.date, start) ? 'rounded-r-none' : '',
                                        isTwoConsecutiveDays() && sameDay(cell.date, end) ? 'rounded-l-none' : ''
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
import { computed, ref, watch } from 'vue'

type Range = { start: Date | null; end: Date | null }

const props = defineProps<{
    start?: Date | null
    end?: Date | null
    min?: Date | null
    max?: Date | null
}>()

const emit = defineEmits<{
    (e: 'update:start', v: Date | null): void
    (e: 'update:end', v: Date | null): void
    (e: 'apply', v: Range): void
}>()

const start = ref<Date | null>(props.start ?? null)
const end = ref<Date | null>(props.end ?? null)
const min = computed(() => props.min ?? null)
const max = computed(() => props.max ?? null)

watch(() => props.start, v => (start.value = v ?? null))
watch(() => props.end, v => (end.value = v ?? null))

const today = new Date()
const leftMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const rightMonth = computed(
    () => new Date(leftMonth.value.getFullYear(), leftMonth.value.getMonth() + 1, 1)
)

function shift(delta: number) {
    leftMonth.value = new Date(leftMonth.value.getFullYear(), leftMonth.value.getMonth() + delta, 1)
}

function monthLabel(d: Date) {
    return `${d.getFullYear()}年 ${d.getMonth() + 1}月`
}

function isBefore(a: Date, b: Date) {
    const dateA = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const dateB = new Date(b.getFullYear(), b.getMonth(), b.getDate())
    return dateA.getTime() < dateB.getTime()
}
function isAfter(a: Date, b: Date) {
    const dateA = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const dateB = new Date(b.getFullYear(), b.getMonth(), b.getDate())
    return dateA.getTime() > dateB.getTime()
}
function inBounds(d: Date) {
    if (min.value && isBefore(d, min.value)) return false
    if (max.value && isAfter(d, max.value)) return false
    return true
}

function onPick(d: Date) {
    if (!inBounds(d)) return
    if (!start.value || (start.value && end.value)) {
        start.value = d
        end.value = null
        emit('update:start', start.value)
        emit('update:end', null)
    } else if (start.value && !end.value) {
        if (isBefore(d, start.value)) {
            end.value = start.value
            start.value = d
        } else {
            end.value = d
        }
        emit('update:start', start.value)
        emit('update:end', end.value)
    }
}

function clear() {
    start.value = null
    end.value = null
    emit('update:start', null)
    emit('update:end', null)
}

function apply() {
    emit('apply', { start: start.value, end: end.value })
}

/* ---- calendar helpers ---- */
const dow = ['日', '一', '二', '三', '四', '五', '六']

function getGrid(month: Date) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const startOffset = first.getDay()
    const startDate = new Date(first)
    startDate.setDate(first.getDate() - startOffset)

    const days: { date: Date; inMonth: boolean }[] = []
    for (let i = 0; i < 31; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        const inMonth = d.getMonth() === first.getMonth()
        days.push({ date: d, inMonth })
    }
    return Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7))
}

function sameDay(a?: Date | null, b?: Date | null) {
    if (!a || !b) return false
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

function isBetween(d: Date, a?: Date | null, b?: Date | null) {
    if (!a || !b) return false
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const s = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
    const e = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
    return t >= s && t <= e
}

function isDisabled(d: Date) {
    if (min.value && isBefore(d, min.value)) return true
    if (max.value && isAfter(d, max.value)) return true
    return false
}

function isTwoConsecutiveDays() {
    if (!start.value || !end.value) return false
    const diffTime = Math.abs(end.value.getTime() - start.value.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
}
</script>