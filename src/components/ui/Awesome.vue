<script setup lang="ts">

const openPrivacy = () => {
  window.open('https://www.galilee.com.tw/Privacy', '_blank', 'noopener,noreferrer')
}

</script>

<template>
    <div class="absolute left-[50%] top-[60%] -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 items-center bg-white gap-6 rounded-[10px] shadow-mddrop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] px-20 py-8 w-[80%] md:w-[1000px]">
        <img class="col-span-12 md:col-span-3 w-[80%] h-[80%]" src="@/assets/imgs/icon-awesome.svg" />
        <div class="col-span-12 md:col-span-9 flex flex-col justify-between gap-3">
            <h3 class="text-others-gray1 text-h3 md:text-h3-d">隱私權聲明</h3>
            <p class="text-others-gray1">
                為提供您最佳的網站使用體驗，本網站使用Cookie以改善我們的網頁，作為技術、分析、行銷之用，繼續使用本網站表示您同意我們使用Cookie。進一步的資訊可閱讀我們 
                <span class="text-others-original">隱私權政策</span>
                說明。
            </p>
            <button
                class="w-[98px] h-[40px] rounded-[10px] bg-others-original text-white font-bold hover:bg-others-hover"
                @click="openPrivacy">
                接受
            </button>
        </div>
    </div>
</template>