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
          class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition">
          登入
        </button>
        <button
          class="px-4 py-1 w-[93px] h-[40px] rounded-md bg-white text-others-original border border-none hover:bg-others-gray2 hover:text-others-gray1 transition">
          註冊
        </button>
      </div>
    </div>
  </nav>
</template>