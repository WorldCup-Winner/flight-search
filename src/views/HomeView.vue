<template>
  <main>
    <HeroSection />
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'
// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>