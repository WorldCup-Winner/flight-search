<template>
  <nav
    :class="[
      'fixed top-0 left-0 w-full z-50 h-[80px] flex items-center px-[120px]',
      isOrderPage ? 'bg-white' : 'bg-black/30'
    ]"
  >
    <div class="mx-auto flex justify-between w-full">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center space-x-2">
        <div class="flex items-center space-x-2">
          <img :src="isOrderPage ? Header1 : Header" alt="GalileeTours" class="h-8 w-auto" />
        </div>
      </RouterLink>

      <!-- Menu -->
      <div class="flex items-center space-x-6">
        <!-- Normal links -->
        <a href="#" :class="[linkCls, 'flex items-center']">
          <span class="material-icons text-sm mr-1">
            <div
                class="w-8 h-8
                    [mask-image:url('@/assets/imgs/icon-search.svg')] 
                    [mask-repeat:no-repeat] 
                    [mask-position:center] 
                    [mask-size:contain] 
                    [-webkit-mask-image:url('@/assets/imgs/icon-search.svg')]"
                :class="[isOrderPage ? 'bg-others-gray4' : 'bg-white']"
                >
            </div>
          </span>
          訂單查詢
        </a>
        <a href="#" :class="[linkCls, 'flex items-center']">
          <span class="material-icons text-sm mr-1">
            <div
                class="w-8 h-8
                    [mask-image:url('@/assets/imgs/icon-search.svg')] 
                    [mask-repeat:no-repeat]
                    [mask-position:center]
                    [mask-size:contain]
                    [-webkit-mask-image:url('@/assets/imgs/icon-search.svg')]"
                :class="[isOrderPage ? 'bg-others-gray4' : 'bg-white']"
                >
            </div>
          </span>
          客服中心
        </a>

        <!-- Buttons -->
        <button
          class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
          @click="openDialog('signin')"
        >
          登入
        </button>
        <button
          class="px-4 py-1 w-[93px] h-[40px] rounded-md border border-none hover:bg-others-gray2 hover:text-others-gray1 transition"
          :class="[isOrderPage ? 'bg-others-gray4 text-black' : 'bg-white text-others-original']"
          @click="openDialog('signup')"
        >
          註冊
        </button>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="activeDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
           @click.self="closeDialog">
        <div class="bg-white rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] shadow-lg px-[90px] py-[60px] relative">
          <SignIn v-if="activeDialog === 'signin'" />
          <SignUp v-else-if="activeDialog === 'signup'" />
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="js">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"

import Header from "@/assets/imgs/header-logo.svg"
import Header1 from "@/assets/imgs/header-logo-1.svg"

const activeDialog = ref(null)

const openDialog = (type) => { activeDialog.value = type }
const closeDialog = () => { activeDialog.value = null }

// --- Route-aware styling ---
const route = useRoute()
// Match "/order" and any sub-paths like "/order/123"
const isOrderPage = computed(() => {
  const p = route.path.toLowerCase()
  return p === '/order' || p.startsWith('/order/') || p === '/404-page'
})

// Text color for links based on background
const linkCls = computed(() =>
  isOrderPage.value ? 'text-others-gray1 hover:text-others-gray2' : 'text-white hover:text-gray-200'
)

</script>

<style>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }

.fade-enter-from,
.fade-leave-to { opacity: 0; }
.icon-gray { filter: grayscale(1) brightness(1.2); } /* bump brightness as needed */
</style>
