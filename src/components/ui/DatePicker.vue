<template>
    <div
        :class="[
            'shadow-2xl flex flex-col bg-white',
            props.compact
                ? 'w-full h-[70vh] md:w-[560px] md:max-w-[90vw] md:h-auto md:rounded-2xl'
                : 'w-full h-full md:w-[730px] md:max-w-[95vw] md:h-auto md:rounded-2xl'
        ]"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 md:rounded-t-2xl"
        >
            <span>日期選擇</span>
            <!-- Close button: visible on both mobile and desktop -->
            <button
                class="text-white hover:opacity-80 transition"
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
            <!-- Desktop: Year selector & Navigation header -->
            <div class="hidden md:block">
                <!-- Year Selector -->
                <div class="mb-4 flex justify-center gap-8">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-others-gray1 font-medium">快速選擇年份：</label>
                        <select 
                            :value="currentMonth.getFullYear()" 
                            @change="onYearChange($event)"
                            class="px-3 py-1.5 border border-primary-gold rounded-md text-others-gray7 focus:ring-2 focus:ring-others-original focus:outline-none cursor-pointer"
                        >
                            <option v-for="year in yearOptions" :key="year" :value="year">
                                {{ year }}年
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Navigation header with arrows -->
                <div class="relative mb-8">
                    <div
                        :class="props.singleMonth ? 'flex items-center justify-center' : 'grid grid-cols-2 items-center'"
                    >
                        <div class="text-center text-[18px] leading-8 font-semibold text-gray-500">
                            {{ monthLabel(leftMonth) }}
                        </div>
                        <div
                            v-if="!props.singleMonth"
                            class="text-center text-[18px] leading-8 font-semibold text-gray-500"
                        >
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

                <!-- Desktop: One or two months (with DOW headers) -->
                <div :class="props.singleMonth ? 'grid grid-cols-1 gap-12' : 'grid grid-cols-2 gap-12'">
                    <div
                        v-for="month in (props.singleMonth ? [leftMonth] : [leftMonth, rightMonth])"
                        :key="month.getTime()"
                        class="w-full"
                    >
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
                            :selected="localSelected"
                            :min="min"
                            :max="max"
                            @pick="onPick"
                        />
                    </div>
                </div>
            </div>

            <!-- Mobile: Vertical scrolling months -->
            <div class="md:hidden space-y-6">
                <!-- Year Selector for Mobile -->
                <div class="mb-4 flex justify-center">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-others-gray1 font-medium">快速選擇年份：</label>
                        <select 
                            :value="currentMonth.getFullYear()" 
                            @change="onYearChange($event)"
                            class="px-3 py-1.5 border border-primary-gold rounded-md text-others-gray7 focus:ring-2 focus:ring-others-original focus:outline-none cursor-pointer"
                        >
                            <option v-for="year in yearOptions" :key="year" :value="year">
                                {{ year }}年
                            </option>
                        </select>
                    </div>
                </div>
                
                <!-- Single month mode: only current month -->
                <template v-if="props.singleMonth">
                    <MonthDays
                        :month="leftMonth"
                        :selected="localSelected"
                        :min="min"
                        :max="max"
                        @pick="onPickMobile"
                    />
                </template>

                <!-- Default: multiple months -->
                <template v-else>
                    <!-- First month (days only, label is in sticky header) -->
                    <div v-if="allMonths.length > 0">
                        <MonthDays
                            :month="allMonths[0]"
                            :selected="localSelected"
                            :min="min"
                            :max="max"
                            @pick="onPickMobile"
                        />
                    </div>
                    <!-- Remaining months (with labels) -->
                    <div v-for="month in allMonths.slice(1)" :key="month.getTime()">
                        <div class="text-center text-[18px] leading-8 font-semibold text-gray-500 mb-4">
                            {{ monthLabel(month) }}
                        </div>
                        <MonthDays
                            :month="month"
                            :selected="localSelected"
                            :min="min"
                            :max="max"
                            @pick="onPickMobile"
                        />
                    </div>
                </template>
            </div>
        </div>

        <!-- Footer: Mobile only -->
        <div
            class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10"
            style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);"
        >
            <!-- Row 1: Label -->
            <div class="mb-1">
                <span class="text-sm text-others-gray5">日期</span>
            </div>
            <!-- Row 2: Date value -->
            <div class="mb-4">
                <span class="text-base text-others-gray1">{{ formatDateDisplay(localSelected) }}</span>
            </div>
            <!-- Row 3: Full width button -->
            <button
                class="w-full py-3 rounded-xl font-bold text-white transition"
                :class="localSelected ? 'bg-others-original hover:bg-others-hover' : 'bg-gray-300 cursor-not-allowed'"
                :disabled="!localSelected"
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
const props = defineProps<{
    modelValue?: Date | null
    min?: Date | null
    max?: Date | null
    // When true, show only one month (used for birthday calendar in StepTwo)
    singleMonth?: boolean
    // When true, use a smaller dialog size (e.g., for birthday picker)
    compact?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: Date): void
    (e: 'apply', v: Date): void
    (e: 'close'): void
}>()

/* ============================================
   Local State
   ============================================ */
const localSelected = ref<Date | null>(props.modelValue ?? null)

watch(() => props.modelValue, v => (localSelected.value = v ?? null))

const min = computed(() => props.min ?? null)
const max = computed(() => props.max ?? null)

const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const leftMonth = computed(() => currentMonth.value)
const rightMonth = computed(() => 
    new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
)

/* ============================================
   Computed
   ============================================ */
const yearOptions = computed(() => {
    const currentYear = today.getFullYear()
    // For birth dates, we need a wide range. If min is set, use it; otherwise go back 100 years
    // If max is set, use it; otherwise use current year
    const minYear = min.value ? min.value.getFullYear() : (currentYear - 100)
    const maxYear = max.value ? max.value.getFullYear() : currentYear
    
    const years: number[] = []
    for (let year = maxYear; year >= minYear; year--) {
        years.push(year)
    }
    return years
})

const allMonths = computed(() => {
    const months: Date[] = []
    
    // Determine start and end months
    let startMonth: Date
    let endMonth: Date
    
    const currentMonthStart = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
    
    if (min.value && max.value) {
        // Both min and max are set - use them, but ensure currentMonth is included
        const minMonth = new Date(min.value.getFullYear(), min.value.getMonth(), 1)
        const maxMonth = new Date(max.value.getFullYear(), max.value.getMonth(), 1)
        
        // If currentMonth is within min-max range, show around currentMonth
        if (currentMonthStart >= minMonth && currentMonthStart <= maxMonth) {
            startMonth = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 12, 1)
            if (startMonth < minMonth) startMonth = minMonth
            endMonth = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 12, 1)
            if (endMonth > maxMonth) endMonth = maxMonth
        } else {
            startMonth = minMonth
            endMonth = maxMonth
        }
    } else if (min.value) {
        // Only min is set - show from min, but center around currentMonth if possible
        const minMonth = new Date(min.value.getFullYear(), min.value.getMonth(), 1)
        startMonth = minMonth
        endMonth = max.value 
            ? new Date(max.value.getFullYear(), max.value.getMonth(), 1)
            : new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 12, 1)
    } else if (max.value) {
        // Only max is set - show months around currentMonth, but don't exceed max
        const maxMonth = new Date(max.value.getFullYear(), max.value.getMonth(), 1)
        startMonth = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 12, 1)
        endMonth = maxMonth < currentMonthStart ? maxMonth : 
                   (new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 12, 1) > maxMonth ? maxMonth : 
                    new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 12, 1))
    } else {
        // Neither min nor max is set - show 24 months around currentMonth
        startMonth = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 12, 1)
        endMonth = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 12, 1)
    }
    
    let current = new Date(startMonth)
    while (current <= endMonth) {
        months.push(new Date(current))
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    }
    return months
})

/* ============================================
   Methods
   ============================================ */
function shift(delta: number) {
    currentMonth.value = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + delta,
        1
    )
}

function onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const year = parseInt(target.value, 10)
    currentMonth.value = new Date(year, currentMonth.value.getMonth(), 1)
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

function isDisabled(d: Date) {
    if (min.value && isBefore(d, min.value)) return true
    if (max.value && isAfter(d, max.value)) return true
    return false
}

function onPick(d: Date) {
    if (isDisabled(d)) return
    localSelected.value = d
    emit('update:modelValue', d)
    emit('apply', d)
}

function onPickMobile(d: Date) {
    if (isDisabled(d)) return
    localSelected.value = d
    emit('update:modelValue', d)
}

function onConfirm() {
    if (localSelected.value) {
        emit('apply', localSelected.value)
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

/* ============================================
   MonthDays Component (days only, no DOW header)
   ============================================ */
const MonthDays = defineComponent({
    name: 'MonthDays',
    props: {
        month: { type: Date, required: true },
        selected: { type: [Date, null] as any, default: null },
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
                        const isSelected = sameDay(cell.date, props.selected)
                        const disabled = isDisabled(cell.date)

                        return h('div', { key: di, class: 'relative h-14' }, [
                            cell.inMonth && h('button', {
                                class: [
                                    'relative z-[1] mx-auto flex h-14 w-full items-start pt-1.5 justify-center rounded-xl transition-colors',
                                    isSelected ? 'bg-others-original text-white' : 'text-others-gray7',
                                    disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
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
