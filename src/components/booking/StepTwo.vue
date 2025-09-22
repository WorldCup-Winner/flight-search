<template>
    <div class="max-w-6xl w-full py-6">
        <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 md:col-span-9 w-full items-center justify-between">
                <div class="relative mt-[0px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] w-full">
                    <div class="w-ful flex items-center gap-2 bg-white text-others-gray7 text-[17px] rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-4 font-bold">
                        <span>台北</span>
                        <img src="@/assets/imgs/arrow-both.svg" />
                        <span>東京</span>
                    </div>
                    <div class="px-20 py-10">
                        <div class="relative w-full mb-10">
                            <div class="space-x-10 mb-10">
                                <span class="px-5 py-3 rounded-[15px] rounded-br-none text-white bg-others-original">去程</span>
                                <span class="text-others-gray7 text-[15px]">8月27日 週三 飛行時間 3h20m</span>
                            </div>
                            <div class="ml-[130px]">
                                <div v-for="(seg, i) in departure.segments" :key="i">
                                    <div class="grid grid-cols-12 gap-4">
                                        <!-- left dates/times -->
                                        <div class="flex items-center flex-col justify-between col-span-12 md:col-span-2">
                                            <div class="flex flex-row items-center justify-between gap-6">
                                                <div class="font-bold text-others-gray7">{{ seg.dep.time }}</div>
                                            </div>
                                            <div class="flex items-center justify-between gap-6">
                                                <div class="font-bold text-others-gray7">{{ seg.arr.time }}</div>
                                            </div>
                                        </div>
                                        <!-- vertical line w/ dots (hidden on mobile) -->
                                        <div class="hidden relative md:block">
                                            <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                            <div class="w-[3px] h-full bg-others-gray3"></div>
                                            <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                        </div>

                                        <!-- right info -->
                                        <div class="col-span-12 md:col-span-9 space-y-2">
                                            <div class="font-bold text-others-gray7">
                                                {{ seg.dep.airportName }}{{ seg.dep.terminal ? ' ' + seg.dep.terminal : '' }}
                                            </div>
                                            <div class="flex items-center gap-2 text-others-gray1">
                                                <img v-if="seg.carrier?.logo" :src="seg.carrier.logo" :alt="seg.carrier?.name"
                                                    class="w-5 h-5 object-contain" />
                                                <span class="font-semibold">
                                                    {{ seg.flightNo ? seg.flightNo : seg.carrier?.code }}
                                                </span>
                                                <span class="text-others-gray1"> {{ seg.carrier?.name }} </span>
                                                <span class="text-others-gray1"> {{ seg.equipment ? ' ' + seg.equipment : '' }}</span>
                                            </div>
                                            <div class="font-bold text-others-gray7">
                                                {{ seg.arr.airportName }}{{ seg.arr.terminal ? ' ' + seg.arr.terminal : '' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="relative w-full">
                            <div class="space-x-10 mb-10">
                                <span class="px-5 py-3 rounded-[15px] rounded-br-none text-white bg-others-original">回程</span>
                                <span class="text-others-gray7 text-[15px]">8月27日 週三 飛行時間 3h20m</span>
                            </div>
                            <div class="ml-[130px]">
                                <div v-for="(seg, i) in departure.segments" :key="i">
                                    <div class="grid grid-cols-12 gap-4">
                                        <!-- left dates/times -->
                                        <div class="flex items-center flex-col justify-between col-span-12 md:col-span-2">
                                            <div class="flex flex-row items-center justify-between gap-6">
                                                <div class="font-bold text-others-gray7">{{ seg.dep.time }}</div>
                                            </div>
                                            <div class="flex items-center justify-between gap-6">
                                                <div class="font-bold text-others-gray7">{{ seg.arr.time }}</div>
                                            </div>
                                        </div>
                                        <!-- vertical line w/ dots (hidden on mobile) -->
                                        <div class="hidden relative md:block">
                                            <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                            <div class="w-[3px] h-full bg-others-gray3"></div>
                                            <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                                        </div>

                                        <!-- right info -->
                                        <div class="col-span-12 md:col-span-9 space-y-2">
                                            <div class="font-bold text-others-gray7">
                                                {{ seg.dep.airportName }}{{ seg.dep.terminal ? ' ' + seg.dep.terminal : '' }}
                                            </div>
                                            <div class="flex items-center gap-2 text-others-gray1">
                                                <img v-if="seg.carrier?.logo" :src="seg.carrier.logo" :alt="seg.carrier?.name"
                                                    class="w-5 h-5 object-contain" />
                                                <span class="font-semibold">
                                                    {{ seg.flightNo ? seg.flightNo : seg.carrier?.code }}
                                                </span>
                                                <span class="text-others-gray1"> {{ seg.carrier?.name }} </span>
                                                <span class="text-others-gray1"> {{ seg.equipment ? ' ' + seg.equipment : '' }}</span>
                                            </div>
                                            <div class="font-bold text-others-gray7">
                                                {{ seg.arr.airportName }}{{ seg.arr.terminal ? ' ' + seg.arr.terminal : '' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="departure.fareOptions != undefined"
                        class="relative grid grid-cols-12 gap-4 p-5 border-b last:border-b-0 border-others-gray3 bg-others-gray2">
                        <div class="col-span-12 md:col-span-3 text-others-gray1 font-bold flex items-center justify-center">
                            {{ departure.fareOptions[0].cabin }}
                        </div>
                        <ul class="col-span-12 md:col-span-9 space-y-2">
                            <li v-for="(n, i) in departure.fareOptions[0].notes" :key="i" class="flex items-center gap-2 text-others-gray1">
                                <img :src="noteIcon(n.type, n.icon)" />
                                <span class="text-[14px]">
                                {{ n.text }}
                                </span>
                            </li>
                        </ul>
                        <button class="absolute top-[150px] right-[40px] w-[200px] h-[40px] text-white bg-others-original rounded-[10px] text-[14px] cursor-pointer" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</button>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">會員 / 訪客登入</p>
                    <div class="flex flex-row justify-between gap-5 items-center text-others-gray1 pt-8">
                        <p>若您曾參加過加利利旅行社團體即為會員，可利用會員登入進行訂購；非會員亦可使用訪客身分，完成手機號碼認證即可下單。 </p>
                        <button
                            class="px-4 py-1 w-[93px] h-[40px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                            @click="openDialog('signin')">
                            登入
                        </button>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">旅客名單</p>
                    <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1 pt-8">
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">姓氏</label>
                            <input 
                                type="text" 
                                placeholder="英文姓 例：PENG"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">名字</label>
                            <input 
                                type="text" 
                                placeholder="英文名 例：DAKUAI"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">性別</label>
                            <input 
                                type="text" 
                                placeholder="請選擇"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">出生日期</label>
                            <input 
                                type="text" 
                                placeholder="請選擇"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-3 mb-4">
                            <label class="block mb-1 text-others-gray1">國籍</label>
                            <input 
                                type="text" 
                                placeholder="TW台灣"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-16 py-8 w-full">
                    <p class="absolute left-[40px] top-[20px] text-primary-gold font-bold">主要聯絡人</p>
                    <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1 pt-8">
                        <div class="relative grid-cols-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">聯絡人姓名</label>
                            <input 
                                type="text" 
                                placeholder="必填"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">+886</label>
                            <input 
                                type="text" 
                                placeholder="英文名 例：DAKUAI"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <div class="relative grid-cols-12 md:col-span-4 mb-4">
                            <label class="block mb-1 text-others-gray1">必填</label>
                            <input 
                                type="text" 
                                placeholder="請選擇"
                                class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
                    <p class="text-primary-gold font-bold">代收轉付收據</p>
                    <p class="mb-1 text-others-gray1 pt-4">旅遊業依法開立「代收轉付收據」，不另開統一發票，付款後以email提供。</p>
                    <p class="mb-1 text-others-original">若行程取消或更動，為保障消費者權益，同意授權本公司代為處理銷貨退回或折讓證明單。</p>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <p class="text-others-gray1">是否開立抬頭或統編？</p>
                        <div class="flex gap-5" role="radiogroup" aria-label="是否索取發票">
                            <div class="relative">
                                <input
                                    id="receipt-no"
                                    class="peer sr-only"
                                    type="radio"
                                    name="receipt"
                                    :value="false"
                                    v-model="isReceipt"
                                    />
                                <label
                                    for="receipt-no"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    否
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="receipt-yes"
                                    class="peer sr-only"
                                    type="radio"
                                    name="receipt"
                                    :value="true"
                                    v-model="isReceipt"
                                    />
                                <label
                                    for="receipt-yes"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    是
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="isReceipt">
                        <div class="grid grid-cols-12 justify-between gap-x-5 items-center text-others-gray1 pt-4">
                            <div class="relative grid-cols-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">公司名稱</label>
                                <input 
                                    type="text" 
                                    placeholder="請填公司全名"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                            <div class="relative grid-cols-12 md:col-span-6 mb-4">
                                <label class="block mb-1 text-others-gray1">統一編號</label>
                                <input 
                                    type="text" 
                                    placeholder="請填統一編號"
                                    class="w-full px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-row items-center mt-5 gap-5">
                            <p class="text-others-gray1">收據內容摘要</p>
                            <div class="flex gap-5" role="radiogroup" aria-label="收據內容摘要">
                                <div class="relative">
                                    <input
                                        id="summary-no"
                                        class="peer sr-only"
                                        type="radio"
                                        name="summary"
                                        :value="false"
                                        v-model="isSummary"
                                        />
                                    <label
                                        for="summary-no"
                                        class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                                bg-divider-soft text-primary-gold transition-color duration-200
                                                before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                                peer-checked:before:bg-others-original peer-checked:before:border-none">
                                        列出航班資訊
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        id="summary-yes"
                                        class="peer sr-only"
                                        type="radio"
                                        name="summary"
                                        :value="true"
                                        v-model="isSummary"
                                        />
                                    <label
                                        for="summary-yes"
                                        class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                                bg-divider-soft text-primary-gold transition duration-200
                                                before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                                peer-checked:before:bg-others-original peer-checked:before:border-none">
                                        僅開立「機票款」三個字
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative mt-[20px] bg-white rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
                    <p class="text-primary-gold font-bold">特殊協力事項</p>
                    <p class="block mb-1 text-others-gray1 pt-4">若您有特殊餐、輪椅等特殊需求，加利利旅遊將代為轉達，實際供應依航空公司為準，敬請見諒。</p>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <p class="text-others-gray1">是否有特殊需求？</p>
                        <div class="flex gap-5" role="radiogroup" aria-label="是否有特殊需求">
                            <div class="relative">
                                <input
                                    id="special-need-no"
                                    class="peer sr-only"
                                    type="radio"
                                    name="special-need"
                                    :value="false"
                                    v-model="isSpecialNeed"
                                    />
                                <label
                                    for="special-need-no"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    否
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="special-need-yes"
                                    class="peer sr-only"
                                    type="radio"
                                    name="special-need"
                                    :value="true"
                                    v-model="isSpecialNeed"
                                    />
                                <label
                                    for="special-need-yes"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    是
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="!isSpecialNeed">
                        <textarea  
                            placeholder="需求內容"
                            class="w-full h-[80px] mt-4 px-4 py-2 border rounded-md border-primary-gold focus:ring-2 focus:ring-others-original focus:outline-none" />
                    </div>
                </div>
            </div>
            <div class="col-span-12 md:col-span-3 rounded-[10px] bg-white p-6 drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] md:p-4 w-full h-fit">
                <div class="space-y-3">
                    <!-- Header total -->
                    <div class="flex items-baseline justify-between text-primary-gold font-semibold">
                        <span>{{ titleLabel }}</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(total) }}
                        </div>
                    </div>
                    <!-- Line items -->
                    <div
                        v-for="(line, idx) in lines"
                        :key="idx"
                        class="flex justify-between text-others-gray1"
                        >
                        <span>{{ line.label }}</span>
                        <div class="flex items-end">
                            {{ currency }} {{ formatPrice(line.amount) }} x {{ line.qty ?? 1 }}
                        </div>
                    </div>

                    <div class="my-2 border-t border-slate-200" />
                    <!-- Payable total -->
                    <div class="flex items-baseline justify-between">
                        <span class="text-primary-gold font-semibold">{{ totalLabel }}</span>
                        <div class="flex items-end font-bold text-others-original">
                            <div class="text-[12px] pr-1">{{ currency }}</div>
                            <div class="text-[24px] leading-none">
                                {{ formatPrice(total) }}
                            </div>
                        </div>
                    </div>

                    <!-- Agreement -->
                    <div class="mt-2 flex gap-2 items-start text-sm text-slate-600 select-none">                        
                        <label class="flex items-center cursor-pointer relative">
                        <input type="checkbox" checked
                            class="mt-[1px] peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
                            id="check" v-model="agreed" />
                            <span
                                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" stroke-width="1">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                        <span>
                            我已閱讀「
                            <span class="text-others-original cursor-pointer hover:text-others-hover" @click="isOpenBookingInstruction = true">訂購須知</span>
                            」含個資聲明）並同意其內容
                        </span>
                    </div>
                </div>
                <!-- Submit button -->
                <button
                    class="mt-6 w-full rounded-[10px] bg-others-original py-3 font-semibold text-white hover:bg-others-hover disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="!agreed"
                    @click="emitSubmit"
                    >
                    送出訂單
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
    </div>
    <Transition name="fade">
        <WakeUp v-if="isOpenWakeUp" v-model:step="step" />
    </Transition>
    <Transition name="fade">
        <BookingInstruction :open="isOpenBookingInstruction" @close="isOpenBookingInstruction = false" />
    </Transition>
    <Transition name="fade">
        <BaggageInfoAndFeeRule :open="sharedValue.isOpenBaggageInfoAndFeeRule" @close="sharedValue.isOpenBaggageInfoAndFeeRule = false" />
    </Transition>
</template>
<script setup lang="ts">
import { provide, inject, computed, ref } from 'vue'
import { formatPrice, makeDirect, noteIcon, noteTextClass, toDuration } from '@/utils'

import Airline_1 from '@/assets/imgs/airlines/airline-1.png'

import SignIn from "@/components/auth/SignIn.vue"
import SignUp from "@/components/auth/SignUp.vue"
import WakeUp from "@/components/ui/WakeUp.vue"
import BookingInstruction from '@/components/ui/BookingInstruction.vue'
import BaggageInfoAndFeeRule from '@/components/ui/BaggageInfoAndFeeRule.vue'

import type { CardRow } from '@/utils/types'

// Same type as grandparent
interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false
})

function updateValue(val: SharedData) {
  sharedValue.value = val
}

function openBaggageInfoAndFeeRule() {
  updateValue?.({ isOpenBaggageInfoAndFeeRule: true})
}


// Provide the updater function
provide<(val: SharedData) => void>('updateValue', updateValue)

type Line = {
    label: String
    amount: number
    qty: number
}

const props = defineProps({
    currency: { type: String, default: 'TWD' },
    locale: { type: String, default: 'zh-TW' },
    titleLabel: { type: String, default: '成人機票總額' },
    totalLabel: { type: String, default: '應付總額' },
    termsUrl: { type: String, default: '#' },
    lines: {
        type: Array<Line>,
        default: () => ([
            { label: '成人票價', amount: 7174, qty: 1 },
            { label: '稅與費用', amount: 1589, qty: 1 }
        ])
    },
})

const step = defineModel('step')

const activeDialog = ref(null)
const isReceipt = ref(false)
const isSummary = ref(false)
const isSpecialNeed = ref(false)
const isOpenWakeUp = ref(false)
const isOpenBookingInstruction = ref(false)


const departure = ref<CardRow>(
    makeDirect('JAL', '加加航空', Airline_1, '06:45', '11:00', 195, 5799, { fare: true }),
)

const openDialog = (type: any) => { activeDialog.value = type }
const closeDialog = () => { activeDialog.value = null }

const emit = defineEmits<{
    (e: 'submit', payload: {
        total: number
        currency: String
        lines: Array<Line>
    }): void
}>()

const agreed = ref(false)
const total:any = computed(() => {
    return props.lines.reduce((sum: number, l: Line) => sum + (Number(l.amount) * (Number(l.qty ?? 1))), 0)
})
const currency = computed(() => props.currency ?? 'TWD')

function emitSubmit () {
    // emit('submit', { total: total.value, currency: props.currency, lines: props.lines })
    // step.value = 3
    isOpenWakeUp.value = true
}

window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>