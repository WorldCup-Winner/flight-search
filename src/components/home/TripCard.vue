<script setup lang="ts">
defineProps<{
  title: string
  desc: string
  img: string
}>()
</script>

<template>
  <div class="bg-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow hover:shadow-lg overflow-hidden">
    <img :src="img" alt="" class="h-80 w-full object-cover" />
    <div class="p-4">
      <h3 class="font-semibold mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ desc }}</p>
    </div>
  </div>
</template>
