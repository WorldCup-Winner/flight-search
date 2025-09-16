<template>
  <nav class="fixed top-0 left-0 w-full bg-black/30 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <!-- Replace with your logo -->
        <img src="/logo.png" alt="GalileeTours" class="h-8 w-auto" />
        <div class="flex flex-col leading-tight">
          <span class="text-white">GalileeTours</span>
          <span class="text-white">加利利旅行社</span>
        </div>
      </div>

      <!-- Menu -->
      <div class="flex items-center space-x-6">
        <!-- Normal links -->
        <a href="#" class="text-white hover:text-gray-200 flex items-center">
          <span class="material-icons text-sm mr-1"
            ><img src="@/assets/imgs/icon-search.png"
          /></span>
          訂單查詢
        </a>
        <a href="#" class="text-white hover:text-gray-200 flex items-center">
          <span class="material-icons text-sm mr-1"
            ><img src="@/assets/imgs/icon-search.png"
          /></span>
          客服中心
        </a>

        <!-- Buttons -->
        <button
          class="px-4 py-1 rounded-md bg-btn-confirm text-white hover:bg-orange-600 transition"
        >
          登入
        </button>
        <button
          class="px-4 py-1 rounded-md bg-white text-btn-confirm border border-orange-400 hover:bg-gray-100 transition"
        >
          註冊
        </button>
      </div>
    </div>
  </nav>
</template>