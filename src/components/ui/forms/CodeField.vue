<template>
  <div
    class="inline-flex w-full rounded-[10px] border bg-white
           border-primary-gold overflow-hidden"
  >
    <!-- Verification code prefix from FP01B RET06 -->
    <template v-if="prefix">
      <div class="relative flex items-end">
        <p
          class="appearance-none bg-transparent pl-7 pr-3 py-2.5 text-sm
                 text-others-gray1 focus:outline-none"
        >
          {{ prefix }}-
        </p>
      </div>

      <!-- Divider -->
      <div class="w-px bg-primary-gold" aria-hidden="true"></div>
    </template>

    <!-- Phone input -->
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      class="min-w-0 flex-1 px-5 py-2 text-sm text-others-gray1 focus:outline-none"
      aria-label="Verification Code"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  prefix?: string // FP01B RET06 驗證碼前綴
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const show = ref(false)

const placeholder = props.placeholder ?? '請輸入驗證碼4位數字'

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  // keep digits, spaces, and dashes; trim leading spaces
  const sanitized = target.value.replace(/[^\d\s-]/g, '').replace(/^\s+/, '')
  emit('update:modelValue', sanitized)
}
</script>
