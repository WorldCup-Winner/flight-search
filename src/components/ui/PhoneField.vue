<template>
  <div
    class="inline-flex w-full rounded-[10px] border bg-white
           border-primary-gold overflow-hidden"
  >
    <!-- Country code -->
    <div class="relative flex items-center">
      <select
        v-model="code"
        class="appearance-none bg-transparent pl-3 pr-7 py-2.5 text-sm
               text-others-gray1 focus:outline-none cursor-pointer"
        aria-label="Country code"
      >
        <option v-for="c in codes" :key="c.value" :value="c.value">
          {{ c.label }}
        </option>
      </select>
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
      @input="onInput"
      class="min-w-0 flex-1 px-5 py-2 text-sm text-others-gray1 focus:outline-none"
      aria-label="Phone number"
    />

    <!-- Eye toggle -->
    <button
      type="button"
      @click="show = !show"
      class="px-1 text-primary-gold hover:text-primary-gold1 focus:outline-none"
      :aria-pressed="show ? 'true' : 'false'"
      :aria-label="show ? 'Hide number' : 'Show number'"
    >
      <img 
        v-if="show"
        src="@/assets/imgs/icon-eye1.svg" />
      <img 
        v-else
        src="@/assets/imgs/icon-eye2.svg" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'

type Code = { label: string; value: string }

const props = defineProps<{
  modelValue?: string
  countryCode?: string
  placeholder?: string
  codes?: Code[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:countryCode', v: string): void
}>()

const show = ref(false)
const codes: Code[] = props.codes ?? [
  { label: '+886', value: '+886' }, // Taiwan
  { label: '+852', value: '+852' }, // Hong Kong
  { label: '+81',  value: '+81'  }, // Japan
  { label: '+1',   value: '+1'   }, // US/CA
]

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
