<template>
  <div
    :class="[
      'inline-flex w-full rounded-[10px] border overflow-hidden',
      disabled ? 'border-gray-300 bg-gray-100' : 'border-primary-gold bg-white'
    ]"
    >
    <!-- Country code -->
    <div class="relative flex items-center shrink-0">
      <select
        v-model="code"
        :disabled="disabled"
        :class="[
          'appearance-none bg-transparent pl-3 pr-7 py-2.5 text-sm text-others-gray1 focus:outline-none w-[100px] text-transparent',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        ]"
        style="text-shadow: 0 0 0 transparent;"
        aria-label="Country code"
      >
        <option v-for="c in codes" :key="c.value" :value="c.value" class="text-others-gray1" style="text-shadow: none;">
          {{ c.label }}
        </option>
      </select>
      <!-- 顯示層：只顯示選中的國碼 -->
      <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-others-gray1">
        {{ code }}
      </div>
      <!-- chevron -->
      <svg
        class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b6a697]"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
      </svg>
    </div>

    <!-- Divider -->
    <div class="w-px bg-primary-gold" aria-hidden="true"></div>

    <!-- Phone input -->
    <input
      :type="show ? 'text' : 'password'"
      inputmode="tel"
      autocomplete="tel"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
      @blur="$emit('blur')"
      :class="[
        'min-w-0 flex-1 px-5 py-2 text-sm text-others-gray1 focus:outline-none',
        disabled ? 'cursor-not-allowed opacity-60 bg-gray-100' : ''
      ]"
      aria-label="Phone number"
    />

    <!-- Eye toggle -->
    <button
      v-if="showEye"
      type="button"
      @click="show = !show"
      class="px-3 py-2 text-primary-gold hover:opacity-80 focus:outline-none transition"
      :aria-pressed="show ? 'true' : 'false'"
      :aria-label="show ? 'Hide number' : 'Show number'"
    >
      <svg 
        v-if="show"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <svg 
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

type Code = { label: string; value: string }

const props = defineProps<{
  modelValue?: string
  countryCode?: string
  placeholder?: string
  codes?: Code[]
  showEye?: boolean
  disabled?: boolean
  defaultVisible?: boolean // If true, phone number is visible by default
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:countryCode', v: string): void
  (e: 'update:showEye', v: boolean): void
  (e: 'blur'): void
}>()

const show = ref(props.defaultVisible ?? false) // Start with visible if defaultVisible is true, otherwise hidden

// 使用 computed 讓 codes 能響應 props 的變化
const codes = computed<Code[]>(() => props.codes ?? [
  { label: '台灣 (+886)', value: '+886' },
  { label: '香港 (+852)', value: '+852' },
  { label: '日本 (+81)', value: '+81' },
  { label: '美國/加拿大 (+1)', value: '+1' },
])

const code = ref(props.countryCode ?? '+886')

watch(code, v => emit('update:countryCode', v))

const placeholder = props.placeholder ?? '請輸手機號碼'

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // keep digits, spaces, and dashes; trim leading spaces
  const sanitized = target.value.replace(/[^\d\s-]/g, '').replace(/^\s+/, '')
  emit('update:modelValue', sanitized)
}
</script>
