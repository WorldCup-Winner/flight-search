<template>
    <div class="flex flex-col items-center justify-center bg-white">
        <div class="bg-white rounded-t-2xl border-b-0 px-[40px] py-[30px] w-[500px] border-2 border-primary-gold">
            <!-- Tabs -->
            <div class="flex gap-4">
                <button @click="activeTab = 'login-member'" class="flex-1 py-2 rounded-md"
                    :class="[activeTab === 'login-member' ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1']">
                    會員登入
                </button>
                <button @click="activeTab = 'login-guest'" class="flex-1 py-2 rounded-md"
                    :class="[activeTab === 'login-guest' ? 'text-white bg-primary-gold' : 'bg-others-gray4 text-others-gray1']">
                    訪客購買
                </button>
            </div>
        </div>
        <div class="bg-white rounded-b-2xl px-[40px] py-[30px] w-[500px] border-2 border-primary-gold">
            <div v-if="activeTab === 'login-member'">
                <form @submit.prevent="handleLogin" class="flex flex-col items-center">
                    <!-- 身分證號 -->
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">身分證號 / 外籍人士護照號碼</label>
                        <div class="relative flex items-center">
                            <input v-model="form.username"  :type="showUsername ? 'text' : 'password'" placeholder="H12156689"
                                class="w-full px-5 py-2 border rounded-md border-primary-gold text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <button type="button" class="absolute right-2 mx-0 text-others-gray1"
                                @click="toggleUsername">
                                <div v-if="showUsername">
                                    <!-- Login dialog -->
                                    <img src="@/assets/imgs/icon-eye1.svg" />
                                </div>
                                <div v-else>
                                    <!-- Signup dialog -->
                                    <img src="@/assets/imgs/icon-eye2.svg" />
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- 密碼 -->
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">密碼</label>
                        <div class="relative flex items-center">
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="......."
                                class="w-full px-5 py-2 border border-primary-gold rounded-md tracking-[10px] text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <button type="button" class="absolute right-2 mx-0 text-others-gray1"
                                @click="togglePassword">
                                <div v-if="showPassword">
                                    <!-- Login dialog -->
                                    <img src="@/assets/imgs/icon-eye1.svg" />
                                </div>
                                <div v-else>
                                    <!-- Signup dialog -->
                                    <img src="@/assets/imgs/icon-eye2.svg" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <!-- Submit -->
                    <button type="submit"
                        class="w-[150px] mx-auto bg-others-original text-white py-2 rounded-md hover:bg-others-hover transition">
                        登入
                    </button>
                    <!-- Footer text -->
                    <p class="mt-4 text-sm text-others-gray1">
                        若您曾參加過加利利旅行社團體即為會員，可利用會員登入進行訂購。
                        若忘記密碼，可至「
                        <span href="#" class="text-others-original cursor-pointer" @click="goMemberPage">會員專區</span>
                        」使用查詢。
                    </p>
                </form>
            </div>
            <div v-else>
                <form @submit.prevent="handleLogin" class="flex flex-col items-center">
                    <!-- 身分證號 -->
                    <div class="mb-4 w-full">
                        <p class="block mb-1 text-others-original text-sm">訪客購買需先驗證手機，或切換至會員登入頁籤進行登入</p>
                        <p class="block mb-3 text-others-original text-sm">非本國籍請輸入護照英文拼音</p>
                        <label class="block mb-1 text-others-gray1 text-sm">您的姓名</label>
                        <div class="relative flex flex-row justify-between">
                            <input v-model="form.firstname" type="text" placeholder="姓氏"
                                class="w-[190px] px-5 py-2 border rounded-md border-primary-gold text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <input v-model="form.lastname" type="text" placeholder="名字"
                                class="w-[190px] px-5 py-2 border rounded-md border-primary-gold text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                        <p class="block mb-1 text-others-gray1 text-sm">非本國籍請輸入護照英文拼音</p>
                    </div>
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">手機號碼</label>
                        <div class="relative flex items-center justify-between gap-4">
                            <PhoneField v-model="phone" v-model:countryCode="code" :showEye="true" />
                            <button
                                v-if="!isCodeSent"
                                class="flex-none inline-flex items-center justify-center w-fit whitespace-nowrap
                                    bg-others-original text-white px-5 py-2 rounded-[10px] hover:bg-others-hover transition"
                                @click="isCodeSent = true">
                                發送驗證簡訊
                            </button>
                            <button
                                v-else
                                class="flex-none inline-flex items-center justify-center w-fit whitespace-nowrap
                                    bg-primary-gold text-white px-5 py-2 rounded-[10px] hover:bg-primary-gold1 transition">
                                等待{{codeLeftTime}}秒
                            </button>
                        </div>
                    </div>
                    <div v-if="isCodeSent" class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">驗證碼</label>
                        <div class="relative flex items-center justify-between gap-4">
                            <CodeField v-model="verificationCode" />
                        </div>
                    </div>
                    
                    <div class="flex w-full gap-2 items-start text-sm text-slate-600 select-none">                        
                        <label class="flex mt-[3px]  items-center cursor-pointer relative">
                            <input type="checkbox" checked
                                class="peer w-4 h-4 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-[1px] border-primary-gold checked:bg-primary-gold"
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
                        <!-- Footer text -->
                        <div class="flex flex-row w-full mb-4">
                            <span class="text-h6 text-others-gray1 md:text-h6-d">
                                我已閱讀
                            </span>
                            <span class="text-h6 text-others-original cursor-pointer md:text-h6-d" @click="goPrivacy">「隱私權政策」</span>
                            <span class="text-h6 text-others-gray1 md:text-h6-d">
                                並同意其內容
                            </span>
                        </div>
                    </div>
                    <!-- Submit -->
                    <button type="submit"
                        class="w-[150px] mx-auto bg-others-original text-white py-2 rounded-md hover:bg-others-hover transition">
                        送出
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onUnmounted } from 'vue';

import PhoneField from '@/components/ui/PhoneField.vue'
import CodeField from '@/components/ui/CodeField.vue'

import { goPrivacy, goMemberPage } from '@/utils';

const phone = ref('')
const code  = ref('+886')
const verificationCode = ref('')
const codeLeftTime = ref(300)
const timerRunning = ref(false)

const form = ref({
    username: '',
    password: ''
})

const showUsername = ref(false)
const showPassword = ref(false)
const activeTab = ref('login-member')
const isCodeSent = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const toggleUsername = () => {
    showUsername.value = !showUsername.value
}

const handleLogin = () => {
    console.log('Login with:', form.value)
    // Your login logic here
}

let timerId = null
watch(isCodeSent, (newVal) => {
  if (newVal) {
    codeLeftTime.value = 300;
    startTimer();
  } else {
    stopTimer();
  }
});

const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true;
    timerId = setInterval(() => {
      if (codeLeftTime.value > 0) {
        codeLeftTime.value --;
      } else {
        stopTimer();
      }
    }, 1000);
  }
};

const stopTimer = () => {
  if (timerRunning.value) {
    clearInterval(timerId);
    timerRunning.value = false;
  }
};

onUnmounted(() => {
  stopTimer(); // Clear the interval when the component is unmounted
});
</script>