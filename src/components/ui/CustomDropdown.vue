<template>
  <div class="relative" ref="dropdownRef">
    <button @click="isOpen = !isOpen"
      class="flex items-center justify-between min-w-[200px] bg-[#F5F4F2] text-[#8B7355] px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#F0EFE9] transition-colors duration-200">
      <span>{{ selectedValue }}</span>
      <svg class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="currentColor"
        viewBox="0 0 12 12">
        <path d="M6 9L2 4h8l-4 5z" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
      <div v-for="(item, index) in options" :key="index" @click="selectItem(item)"
        class="px-4 py-3 text-sm text-[#8B7355] hover:bg-[#F5F4F2] cursor-pointer transition-colors duration-150"
        :class="{ 'bg-[#F5F4F2]': item === selectedValue }">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  defaultValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// State
const isOpen = ref(false)
const selectedValue = ref(props.defaultValue)
const dropdownRef = ref(null)

// Methods
const selectItem = (item) => {
  selectedValue.value = item
  isOpen.value = false
  emit('update:modelValue', item)
  emit('change', item)
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
