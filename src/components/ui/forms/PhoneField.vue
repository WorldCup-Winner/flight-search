<template>
  <div
    :class="[
      'inline-flex w-full rounded-[10px] border overflow-hidden',
      disabled ? 'border-gray-300 bg-gray-100' : 'border-primary-gold bg-white'
    ]"
    >
    <!-- Country code -->
    <div class="relative flex items-center shrink-0" ref="dropdownRef">
      <button
        type="button"
        @click.stop="isDropdownOpen = !isDropdownOpen"
        :disabled="disabled"
        :class="[
          'bg-transparent pl-3 pr-7 py-2.5 text-sm text-others-gray1 focus:outline-none',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        ]"
        aria-label="Country code"
      >
        {{ code }}
      </button>
      <!-- chevron -->
      <svg
        class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b6a697] transition-transform"
        :class="{ 'rotate-180': isDropdownOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
      </svg>
      <!-- Dropdown menu -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="isDropdownOpen && codes.length > 0"
            ref="dropdownMenuRef"
            class="fixed w-[200px] max-h-[240px] overflow-y-auto bg-white border border-primary-gold rounded-md shadow-lg z-[100]"
            :style="dropdownStyle"
          >
            <div
              v-for="c in codes"
              :key="c.countryCode"
              @click.stop="selectCode(c.value)"
              :class="[
                'px-3 py-2 text-sm text-others-gray1 cursor-pointer hover:bg-gray-100 transition-colors',
                code === c.value ? 'bg-gray-100 font-medium' : ''
              ]"
            >
              {{ c.label }}
            </div>
          </div>
        </Transition>
      </Teleport>
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
      @focus="$emit('focus', $event)"
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
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { getPhoneCodes } from '@/api'

// Types
interface PhoneCodeItem {
  countryCode: string
  countryNameZh: string
  phoneCountryCode: string
}

interface Code {
  label: string
  value: string
  countryCode: string
}

const props = defineProps<{
  modelValue?: string
  countryCode?: string
  placeholder?: string
  codes?: Code[]
  showEye?: boolean
  disabled?: boolean
  defaultVisible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:countryCode', v: string): void
  (e: 'update:showEye', v: boolean): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur'): void
}>()

// Default fallback codes
const DEFAULT_CODES: Code[] = [
  { label: '台灣 (+886)', value: '+886', countryCode: 'TW' },
  { label: '香港 (+852)', value: '+852', countryCode: 'HK' },
  { label: '日本 (+81)', value: '+81', countryCode: 'JP' },
  { label: '美國/加拿大 (+1)', value: '+1', countryCode: 'US' },
]

// State
const show = ref(props.defaultVisible ?? false)
const codes = ref<Code[]>([])
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownMenuRef = ref<HTMLElement | null>(null)
const code = ref(props.countryCode ?? '+886')

// Transform API data to Code format
function transformPhoneCodes(data: PhoneCodeItem[]): Code[] {
  return data
    .filter((item) => item.phoneCountryCode)
    .map((item, index) => ({
      label: `${item.countryNameZh || item.countryCode || ''} (${item.phoneCountryCode})`,
      value: item.phoneCountryCode,
      countryCode: item.countryCode || `CODE_${index}` // Ensure unique key for Vue
    }))
}

// Fetch phone codes from API
async function fetchPhoneCodes() {
  if (props.codes && props.codes.length > 0) {
    codes.value = props.codes
    return
  }

  try {
    const response = await getPhoneCodes()
    if (response.data?.head?.code === 0 && Array.isArray(response.data.data)) {
      codes.value = transformPhoneCodes(response.data.data)
    } else {
      codes.value = DEFAULT_CODES
    }
  } catch (error) {
    console.error('Failed to fetch phone codes:', error)
    codes.value = DEFAULT_CODES
  }
}

// Calculate dropdown position
const dropdownStyle = computed(() => {
  if (!dropdownRef.value || !isDropdownOpen.value) return {}
  
  const rect = dropdownRef.value.getBoundingClientRect()
  return {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  }
})

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (
    dropdownRef.value && 
    !dropdownRef.value.contains(target) &&
    dropdownMenuRef.value &&
    !dropdownMenuRef.value.contains(target)
  ) {
    isDropdownOpen.value = false
  }
}

// Select country code
function selectCode(value: string) {
  code.value = value
  isDropdownOpen.value = false
}

// Handle phone input
function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  const sanitized = target.value.replace(/[^\d]/g, '')
  target.value = sanitized
  emit('update:modelValue', sanitized)
}

// Computed
const placeholder = computed(() => props.placeholder ?? '請輸手機號碼')

// Watch for countryCode prop changes
watch(() => props.countryCode, (newCode) => {
  if (newCode) {
    code.value = newCode
  }
})

// Watch code changes and emit
watch(code, (value) => {
  emit('update:countryCode', value)
})

// Lifecycle
onMounted(async () => {
  await fetchPhoneCodes()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
