<template>
  <div class="bg-white my-6 rounded-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] px-10 py-8 w-full">
      <h2 class="font-semibold text-others-gray1">付款方式</h2>
      <div class="grid grid-cols-12 py-6 gap-12">
        <div class="col-span-12 md:col-span-3 w-full space-y-4">
            <button @click="paymentMethod = 1" class="w-full py-2 rounded-md"
                :class="[paymentMethod === 1 ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1']">
                信用卡
            </button>
            <button @click="paymentMethod = 2" class="w-full py-2 rounded-md"
                :class="[paymentMethod === 2 ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1']">
                LINE Pay
            </button>
        </div>
        <div class="col-span-12 md:col-span-9 w-full space-y-8">
            <div v-if="paymentMethod === 1">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">信用卡選擇與付款設定</h2>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <div class="flex gap-5" role="radiogroup" aria-label="信用卡選擇與">
                            <div class="relative">
                                <input
                                    id="card-1"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType"
                                    :value="1"
                                    v-model="cardType"
                                    />
                                <label
                                    for="card-1"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    台新卡
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="card-2"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType"
                                    :value="2"
                                    v-model="cardType"
                                    />
                                <label
                                    for="card-2"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    聯邦卡
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="card-3"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType"
                                    :value="3"
                                    v-model="cardType"
                                    />
                                <label
                                    for="card-3"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    其他銀行
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="card-4"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType"
                                    :value="4"
                                    v-model="cardType"
                                    />
                                <label
                                    for="card-4"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    美國運通/海外卡(國外發行的信用卡)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <div class="flex gap-5" role="radiogroup" aria-label="付款設定">
                            <div class="relative">
                                <input
                                    id="method-1"
                                    class="peer sr-only"
                                    type="radio"
                                    name="methodType"
                                    :value="1"
                                    v-model="methodType"
                                    />
                                <label
                                    for="method-1"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    一次付清
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="method-2"
                                    class="peer sr-only"
                                    type="radio"
                                    name="methodType"
                                    :value="2"
                                    v-model="methodType"
                                    />
                                <label
                                    for="method-2"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    分期付款
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="methodType === 2" class="flex flex-row items-center mt-5 gap-5">
                        <div class="flex gap-5" role="radiogroup" aria-label="分期付款">
                            <div class="relative">
                                <input
                                    id="phase-1"
                                    class="peer sr-only"
                                    type="radio"
                                    name="phaseType"
                                    :value="1"
                                    v-model="phaseType"
                                    />
                                <label
                                    for="phase-1"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    ３期
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="phase-2"
                                    class="peer sr-only"
                                    type="radio"
                                    name="phaseType"
                                    :value="2"
                                    v-model="phaseType"
                                    />
                                <label
                                    for="phase-2"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    ６期
                                </label>
                            </div>
                            <div class="relative">
                                <input
                                    id="phase-3"
                                    class="peer sr-only"
                                    type="radio"
                                    name="phaseType"
                                    :value="3"
                                    v-model="phaseType"
                                    />
                                <label
                                    for="phase-3"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    ９期
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="methodType === 1" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">付款注意事項</h2>
                    <div class="space-y-2 mt-4">
                        <p class="text-others-gray1">1. 銀行規定，分期刷卡退費需整筆全額刷退，若該筆訂單已產生手續費或違約金，先向您收取後，方能辦理分期全額退款作業。</p>
                        <p class="text-others-gray1">2. 付款方式確認後將無法修改，訂購前請慎選付款方式。</p>
                        <p class="text-others-gray1">3. 確定付款後，看到授權成功的書面才算是完成刷卡付款。</p>
                        <p class="text-others-gray1">4. 本功能只接受VISA、MASTER CARD、JCB，除此之外請用傳真刷卡。</p>
                        <p class="text-others-gray1">5. 為降低被盜刷之風險、維護網路交易安全，本網已提供支援網路交易3D驗證。</p>
                        <p class="text-others-gray1">6. 按下「確定付款，後，請勿關閉畫面，直到「信用卡授權成功」 的畫面出現後，刷卡付款程序才完成。</p>
                    </div>
                </div>
                <div v-if="methodType === 2" class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">分期付款說明</h2>
                    <div class="space-y-2 mt-4">
                        <p class="text-others-gray1">1. 美國運通/海外卡(國外發行的信用卡) 【不提供】分期付款，請改選一次付清，或選擇其他卡別。</p>
                        <p class="text-others-gray1">2. 分期刷卡限【3期 / 6期】台新、富邦、玉山、華南、第一、星展、聯邦銀行【10期】台新、玉山、星展、花旗銀行之信用卡。</p>
                        <p class="text-others-gray1">3. 分期試算金額僅供參考，實際金額以銀行扣款為準</p>
                    </div>
                </div>
            </div>
            <div v-if="paymentMethod === 2">
                <div class="w-full border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">付款設定</h2>
                    <div class="flex flex-row items-center mt-5 gap-5">
                        <div class="flex gap-5" role="radiogroup" aria-label="付款設定">
                            <div class="relative">
                                <input
                                    id="card-1"
                                    class="peer sr-only"
                                    type="radio"
                                    name="cardType1"
                                    :value="1"
                                    v-model="cardType1"
                                    />
                                <label
                                    for="card-1"
                                    class="flex items-center justify-between min-w-[80px] px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
                                            bg-divider-soft text-primary-gold transition-color duration-200
                                            before:content-[''] before:w-4 before:h-4 before:rounded-full before:border-2 before:border-primary-gold before:mr-2 before:bg-transparent
                                            peer-checked:before:bg-others-original peer-checked:before:border-none">
                                    台新卡
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-4 border-others-gray8 border-2 rounded-[10px] p-6">
                    <h2 class="font-bold text-primary-gold">付款說明</h2>
                    <div class="space-y-2 mt-4">
                        <p class="text-others-gray1">將轉跳至LINE Pay專屬收款介面，可使用LINE Point，恕不適用銀行的刷卡分期、停車或滿額贈品、優惠行程等相關活動，詳情請洽發卡銀行。</p>
                    </div>
                </div>
            </div>
            <button
                v-if="paymentMethod === 1"
                class="px-4 py-1 w-[60%] h-[60px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                @click="emit('update:step', 4)"
                >
                使用信用卡付款
            </button>
            <button
                v-if="paymentMethod === 2"
                class="px-4 py-1 w-[60%] h-[60px] rounded-md border-none bg-others-original text-white hover:bg-others-hover transition"
                @click="emit('update:step', 4)"
                >
                使用 LINE Pay 付款
            </button>
        </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const paymentMethod = ref(1)
const cardType = ref(1)
const methodType = ref(1)
const phaseType = ref(1)
const cardType1 = ref(1)

const emit = defineEmits<{
    (e: 'update:step', v: number): void
}>()

</script>