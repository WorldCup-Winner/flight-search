<template>
    <div
        class="shadow-2xl flex flex-col
               w-full h-full bg-white
               md:bg-white md:w-[730px] md:max-w-[95vw] md:h-auto md:rounded-2xl"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 md:rounded-t-2xl"
        >
            <span>日期選擇</span>
            <!-- Close button: visible only on mobile -->
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

        <!-- Mobile: Sticky header with DOW + first month label -->
        <div class="md:hidden sticky top-[52px] z-10 bg-others-gray9 px-4 pt-4 pb-4">
            <!-- DOW row -->
            <div class="grid grid-cols-7 text-center text-[16px] leading-none">
                <div
                    v-for="(d, i) in dow"
                    :key="d"
                    class="tracking-wide h-8 flex items-center justify-center"
                    :class="i === 0 || i === 6 ? 'text-others-original' : 'text-others-gray1'"
                >
                    {{ d }}
                </div>
            </div>
            <!-- First month label -->
            <div v-if="allMonths.length > 0" class="text-center text-[18px] leading-8 font-semibold text-gray-500 mt-2">
                {{ monthLabel(allMonths[0]) }}
            </div>
        </div>

        <!-- Content area -->
        <div class="flex-1 overflow-y-auto px-4 md:px-6 md:py-5">
            <!-- Desktop: Navigation header with arrows -->
            <div class="hidden md:block relative mb-8">
                <div class="grid grid-cols-2 items-center">
                    <div class="text-center text-[18px] leading-8 font-semibold text-gray-500">
                        {{ monthLabel(leftMonth) }}
                    </div>
                    <div class="text-center text-[18px] leading-8 font-semibold text-gray-500">
                        {{ monthLabel(rightMonth) }}
                    </div>
                </div>

                <button
                    @click="shift(-1)"
                    class="w-9 h-9 absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-others-gray2 text-primary-gold hover:bg-others-gray4 transition"
                    aria-label="上個月"
                >
                    <img src="@/assets/imgs/arrow-right.svg" alt="Previous" class="transform rotate-180" />
                </button>

                <button
                    @click="shift(1)"
                    class="w-9 h-9 absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-others-gray2 text-primary-gold hover:bg-others-gray4 transition"
                    aria-label="下個月"
                >
                    <img src="@/assets/imgs/arrow-right.svg" alt="Next" />
                </button>
            </div>

            <!-- Desktop: Two months side-by-side (with DOW headers) -->
            <div class="hidden md:grid grid-cols-2 gap-12">
                <div v-for="month in [leftMonth, rightMonth]" :key="month.getTime()" class="w-full">
                    <!-- DOW header for desktop -->
                    <div class="grid grid-cols-7 text-center mb-4 text-[16px] leading-none">
                        <div
                            v-for="(d, i) in dow"
                            :key="d"
                            class="tracking-wide h-8 flex items-center justify-center"
                            :class="i === 0 || i === 6 ? 'text-others-original' : 'text-others-gray1'"
                        >
                            {{ d }}
                        </div>
                    </div>
                    <!-- Month days -->
                    <MonthDays
                        :month="month"
                        :start="localStart"
                        :end="localEnd"
                        :min="min"
                        :max="max"
                        @pick="onPick"
                    />
                </div>
            </div>

            <!-- Mobile: Vertical scrolling months -->
            <div class="md:hidden space-y-6">
                <!-- First month (days only, label is in sticky header) -->
                <div v-if="allMonths.length > 0">
                    <MonthDays
                        :month="allMonths[0]"
                        :start="localStart"
                        :end="localEnd"
                        :min="min"
                        :max="max"
                        @pick="onPick"
                    />
                </div>
                <!-- Remaining months (with labels) -->
                <div v-for="month in allMonths.slice(1)" :key="month.getTime()">
                    <div class="text-center text-[18px] leading-8 font-semibold text-gray-500 mb-4">
                        {{ monthLabel(month) }}
                    </div>
                    <MonthDays
                        :month="month"
                        :start="localStart"
                        :end="localEnd"
                        :min="min"
                        :max="max"
                        @pick="onPick"
                    />
                </div>
            </div>
        </div>

        <!-- Footer: Mobile only -->
        <div
            class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10"
            style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);"
        >
            <!-- Row 1: Labels -->
            <div class="grid grid-cols-2 gap-4 mb-1">
                <span class="text-sm text-others-gray5">去程</span>
                <span class="text-sm text-others-gray5">回程</span>
            </div>
            <!-- Row 2: Date values -->
            <div class="grid grid-cols-2 gap-4 mb-4">
                <span class="text-base text-others-gray1">{{ formatDateDisplay(localStart) }}</span>
                <span class="text-base text-others-gray1">{{ formatDateDisplay(localEnd) }}</span>
            </div>
            <!-- Row 3: Full width button -->
            <button
                class="w-full py-3 rounded-xl font-bold text-white transition"
                :class="canConfirm ? 'bg-others-original hover:bg-others-hover' : 'bg-gray-300 cursor-not-allowed'"
                :disabled="!canConfirm"
                @click="onConfirm"
            >
                確認
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineComponent, h } from 'vue'

/* ============================================
   Constants
   ============================================ */
const dow = ['日', '一', '二', '三', '四', '五', '六']

/* ============================================
   Props & Emits
   ============================================ */
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
    (e: 'close'): void
}>()

/* ============================================
   Local State
   ============================================ */
const localStart = ref<Date | null>(props.start ?? null)
const localEnd = ref<Date | null>(props.end ?? null)

watch(() => props.start, v => (localStart.value = v ?? null))
watch(() => props.end, v => (localEnd.value = v ?? null))

const min = computed(() => props.min ?? null)
const max = computed(() => props.max ?? null)

const today = new Date()
const leftMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const rightMonth = computed(() => 
    new Date(leftMonth.value.getFullYear(), leftMonth.value.getMonth() + 1, 1)
)

/* ============================================
   Computed
   ============================================ */
const allMonths = computed(() => {
    const months: Date[] = []
    const startMonth = min.value 
        ? new Date(min.value.getFullYear(), min.value.getMonth(), 1)
        : new Date(today.getFullYear(), today.getMonth(), 1)
    const endMonth = max.value
        ? new Date(max.value.getFullYear(), max.value.getMonth(), 1)
        : new Date(today.getFullYear(), today.getMonth() + 12, 1)
    
    let current = new Date(startMonth)
    while (current <= endMonth) {
        months.push(new Date(current))
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    }
    return months
})

const canConfirm = computed(() => localStart.value && localEnd.value)

/* ============================================
   Methods
   ============================================ */
function shift(delta: number) {
    leftMonth.value = new Date(
        leftMonth.value.getFullYear(),
        leftMonth.value.getMonth() + delta,
        1
    )
}

function monthLabel(d: Date) {
    return `${d.getFullYear()}年 ${d.getMonth() + 1}月`
}

function formatDateDisplay(d: Date | null): string {
    if (!d) return '請選擇日期'
    const dayOfWeek = dow[d.getDay()]
    return `${d.getFullYear()} / ${d.getMonth() + 1} / ${d.getDate()} (${dayOfWeek})`
}

function isBefore(a: Date, b: Date) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime() <
           new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
}

function isAfter(a: Date, b: Date) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime() >
           new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
}

function inBounds(d: Date) {
    if (min.value && isBefore(d, min.value)) return false
    if (max.value && isAfter(d, max.value)) return false
    return true
}

function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
}

function onPick(d: Date) {
    if (!inBounds(d)) return

    if (!localStart.value || (localStart.value && localEnd.value)) {
        localStart.value = d
        localEnd.value = null
        emit('update:start', localStart.value)
        emit('update:end', null)
    } else if (localStart.value && !localEnd.value) {
        if (isBefore(d, localStart.value)) {
            localEnd.value = localStart.value
            localStart.value = d
        } else {
            localEnd.value = d
        }
        emit('update:start', localStart.value)
        emit('update:end', localEnd.value)

        if (!isMobile()) {
            emit('apply', { start: localStart.value, end: localEnd.value })
        }
    }
}

function onConfirm() {
    if (localStart.value && localEnd.value) {
        emit('apply', { start: localStart.value, end: localEnd.value })
    }
}

function onClose() {
    emit('close')
}

/* ============================================
   Helper Functions for MonthDays
   ============================================ */
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

function isTwoConsecutiveDays(start: Date | null, end: Date | null) {
    if (!start || !end) return false
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
}

/* ============================================
   MonthDays Component (days only, no DOW header)
   ============================================ */
const MonthDays = defineComponent({
    name: 'MonthDays',
    props: {
        month: { type: Date, required: true },
        start: { type: [Date, null] as any, default: null },
        end: { type: [Date, null] as any, default: null },
        min: { type: [Date, null] as any, default: null },
        max: { type: [Date, null] as any, default: null }
    },
    emits: ['pick'],
    setup(props, { emit }) {
        const grid = computed(() => getGrid(props.month))

        return () => h('div', { class: 'space-y-0.5' },
            grid.value.map((week, wi) =>
                h('div', { key: wi, class: 'grid grid-cols-7 gap-0' },
                    week.map((cell, di) => {
                        const isStart = sameDay(cell.date, props.start)
                        const isEnd = sameDay(cell.date, props.end)
                        const inRange = cell.inMonth && isBetween(cell.date, props.start, props.end)
                        const disabled = isDisabled(cell.date)
                        const twoConsec = isTwoConsecutiveDays(props.start, props.end)

                        return h('div', { key: di, class: 'relative h-14' }, [
                            inRange && h('div', {
                                class: [
                                    'absolute h-14 pt-1.5 top-0 inset-y-2 inset-x-0 bg-others-gray6',
                                    isStart ? 'rounded-l-xl' : '',
                                    isEnd ? 'rounded-r-xl' : '',
                                    di === 0 ? 'rounded-l-xl' : '',
                                    di === 6 ? 'rounded-r-xl' : '',
                                    twoConsec && isStart ? 'rounded-r-xl' : '',
                                    twoConsec && isEnd ? 'rounded-l-xl' : ''
                                ].filter(Boolean).join(' ')
                            }),
                            cell.inMonth && h('button', {
                                class: [
                                    'relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors',
                                    'text-others-gray7',
                                    (isStart || isEnd) ? 'bg-others-original text-white' : '',
                                    disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer',
                                    twoConsec && isStart ? 'rounded-r-none' : '',
                                    twoConsec && isEnd ? 'rounded-l-none' : ''
                                ].filter(Boolean).join(' '),
                                disabled,
                                onClick: () => !disabled && emit('pick', cell.date)
                            }, cell.date.getDate())
                        ])
                    })
                )
            )
        )
    }
})
</script>
