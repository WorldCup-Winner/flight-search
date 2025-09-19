<script setup lang="ts">
defineProps<{
  title: string
  desc: string
  img: string
}>()
</script>

<template>
  <div
    class="bg-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl drop-shadow-[0px_4px_30px_rgba(0,0,0,0.05)] hover:drop-shadow-[0px_4px_30px_rgba(0,0,0,0.25)] overflow-hidden">
    <img :src="img" alt="" class="h-60 w-full object-cover" />
    <div class="px-[40px] py-[30px]">
      <h3 class="font-semibold text-h4 mb-2 md:text-h4-d">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ desc }}</p>
    </div>
  </div>
</template>
