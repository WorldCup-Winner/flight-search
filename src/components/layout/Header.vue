<template>
  <nav class="fixed top-0 left-0 w-full bg-black/30 z-50 h-[80px] flex items-center px-[120px]">
    <div class="mx-auto flex justify-between w-full">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <!-- Replace with your logo -->
        <img src="/logo.png" alt="GalileeTours" class="h-8 w-auto" />
        <div class="flex flex-col leading-tight">
          <h3 class="text-h3a text-white md:text-h3a-d font-light">GalileeTours</h3>
          <h4 class="text-h4a text-white md:text-h4a-d font-light">加利利旅行社</h4>
        </div>
      </div>

      <!-- Menu -->
      <div class="flex items-center space-x-6">
        <!-- Normal links -->
        <a href="#" class="text-white hover:text-gray-200 flex items-center">
          <span class="material-icons text-sm mr-1"><img src="@/assets/imgs/icon-search.png" /></span>
          訂單查詢
        </a>
        <a href="#" class="text-white hover:text-gray-200 flex items-center">
          <span class="material-icons text-sm mr-1"><img src="@/assets/imgs/icon-search.png" /></span>
          客服中心
        </a>

        <!-- Buttons -->
        <button
          class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
          @click="openDialog('signin')">
          登入
        </button>
        <button
          class="px-4 py-1 w-[93px] h-[40px] rounded-md bg-white text-others-original border border-none hover:bg-others-gray2 hover:text-others-gray1 transition"
          @click="openDialog('signup')">
          註冊
        </button>
      </div>
    </div>
    <!-- Modal -->
    <transition name="fade">
      <div v-if="activeDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        @click.self="closeDialog">
        <div
          class="bg-white rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] shadow-lg px-[90px] py-[60px] relative">
          <!-- Show Login or Signup -->
          <SignIn v-if="activeDialog === 'signin'" />
          <SignUp v-else-if="activeDialog === 'signup'" />
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="js">
import { ref } from 'vue'
import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"

const activeDialog = ref(null) // "signin" | "signup" | null

const openDialog = (type) => {
  activeDialog.value = type
}

const closeDialog = () => {
  activeDialog.value = null
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>