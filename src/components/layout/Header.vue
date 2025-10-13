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
        <div :class="[linkCls, 'flex items-center cursor-pointer']" @click="isOpenBookingSearch = true">
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
        </div>
        <div :class="[linkCls, 'flex items-center cursor-pointer']">
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
        </div>

        <div v-if="authStore.name == null || authStore.name == undefined" class="space-x-6">
          <button
            class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
            @click="openDialog('signin')"
          >
            登入
          </button>
          <button
            class="px-4 py-1 w-[93px] h-[40px] rounded-md border border-none hover:bg-others-gray2 hover:text-others-gray1 transition"
            :class="[isOrderPage ? 'bg-others-gray4 text-others-gray1' : 'bg-white text-others-original']"
            @click="openDialog('signup')"
          >
            註冊
          </button>
        </div>
        <div v-else class="space-x-6 flex items-center">
          <div :class="[linkCls, 'flex items-center cursor-pointer']">
            <span class="material-icons text-sm mr-1">
              <div
                  class="w-8 h-8
                      [mask-image:url('@/assets/imgs/icon-avatar.svg')] 
                      [mask-repeat:no-repeat]
                      [mask-position:center]
                      [mask-size:contain]
                      [-webkit-mask-image:url('@/assets/imgs/icon-avatar.svg')]"
                  :class="[isOrderPage ? 'bg-others-gray4' : 'bg-white']"
                  >
              </div>
            </span>
            Hi, {{ authStore.name }}
          </div>
          <button
            class="px-4 py-1 w-[93px] h-[40px] rounded-md border border-none hover:bg-others-gray2 hover:text-others-gray1 transition"
            :class="[isOrderPage ? 'bg-others-gray4 text-others-gray1' : 'bg-white text-others-gray1']"
            @click="handleLogout"
          >
            登出
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="activeDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
           @click.self="closeDialog">
        <div class="bg-white rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] shadow-lg px-[90px] py-[60px] relative">
          <SignIn v-if="activeDialog === 'signin'" @close="closeDialog" />
          <SignUp v-else-if="activeDialog === 'signup'" />
        </div>
      </div>
    </Transition>
  </nav>
  <Transition name="fade">
    <BookingSearch :open="isOpenBookingSearch" @close="isOpenBookingSearch = false" />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"
import BookingSearch from '@/components/ui/BookingSearch.vue'


import Header from "@/assets/imgs/header-logo.svg"
import Header1 from "@/assets/imgs/header-logo-1.svg"

const authStore = useAuthStore()

const activeDialog = ref(null)
const isOpenBookingSearch = ref(false)

const openDialog = (type: any) => { activeDialog.value = type }
const closeDialog = () => { activeDialog.value = null }

// --- Route-aware styling ---
const route = useRoute()
const router = useRouter()

// Match "/order" and any sub-paths like "/order/123"
const isOrderPage = computed(() => {
  const p = route.path.toLowerCase()
  return p === '/booking' || p.startsWith('/booking/') || p.startsWith('/booking-search-result') || p === '/404-page'
})

// Text color for links based on background
const linkCls = computed(() =>
  isOrderPage.value ? 'text-others-gray1 hover:text-others-gray2' : 'text-white hover:text-gray-200'
)

const handleLogout = () => {
  authStore.logout()
  router.push("/")
}

</script>
<style>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }

.fade-enter-from,
.fade-leave-to { opacity: 0; }
.icon-gray { filter: grayscale(1) brightness(1.2); } /* bump brightness as needed */
</style>
