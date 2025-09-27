<template>
    <div class="mt-[100px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] p-8 px-32 w-full mx-auto max-w-6xl">
        <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">訂購流程</p>
        <div class="grid grid-cols-12 items-center px-32">
            <div class="flex flex-col items-center justify-center col-span-12 md:col-span-3">
                <h1 class="text-others-gray10 text-[56px] font-bold russo">01</h1>
                <p class="text-others-gray1 font-semibold noto">選擇商品</p>
            </div>
            <div class="flex flex-col items-center justify-center col-span-12 md:col-span-3">
                <div class="flex flex-col items-center justify-center" :class="[step == 2 ? 'border-[2.35px] border-primary-gold rounded-[10px] w-[120px] h-[120px]' : '']">
                    <h1 class="text-[56px] font-bold russo" :class="[step === 2 ? 'text-others-original' : 'text-others-gray10']">02</h1>
                    <p class="font-semibold" :class="[step === 2 ? 'text-primary-gold' : 'text-others-gray1']">填寫資料</p>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center col-span-12 md:col-span-3">
                <div class="flex flex-col items-center justify-center" :class="[step == 3 ? 'border-[2.35px] border-primary-gold rounded-[10px] w-[120px] h-[120px]' : '']">
                    <h1 class="text-[56px] font-bold russo" :class="[step === 3 ? 'text-others-original' : (step > 3 ? 'text-others-gray10' : 'text-others-gray2')]">03</h1>
                    <p class="font-semibold" :class="[step === 3 ? 'text-primary-gold' : 'text-others-gray1']">付款方式</p>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center col-span-12 md:col-span-3">
                <div class="flex flex-col items-center justify-center" :class="[step == 4 ? 'border-[2.35px] border-primary-gold rounded-[10px] w-[120px] h-[120px]' : '']">
                    <h1 class="text-[56px] font-bold russo" :class="[step === 4 ? 'text-others-original' : (step > 4 ? 'text-others-gray10' : 'text-others-gray2')]">04</h1>
                    <p class="font-semibold" :class="[step === 4 ? 'text-primary-gold' : 'text-others-gray1']">訂單完成</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    step: number
}>()

const step = computed(() => props.step)
</script>