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
                        <div class="relative">
                            <input v-model="form.username" type="text" placeholder="H12156689"
                                class="w-full px-5 py-2 border rounded-md focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <span class="absolute right-3 top-2.5 text-others-gray1">
                                <i class="fas fa-eye"></i>
                            </span>
                        </div>
                    </div>

                    <!-- 密碼 -->
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">密碼</label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="......."
                                class="w-full px-5 py-2 border rounded-md tracking-[10px] text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <button type="button" class="absolute right-2 top-1 text-others-gray1"
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
                    <p class="mt-4 text-xs text-others-gray1 leading-relaxed">
                        若您曾參加過加利利旅行社團體即為會員，可利用會員登入進行訂購。
                        若忘記密碼，可至
                        <a href="#" class="text-primary-goal underline">會員專區</a>
                        使用查詢。
                    </p>
                </form>
            </div>
            <div v-else>
                <form @submit.prevent="handleLogin" class="flex flex-col items-center">
                    <!-- 身分證號 -->
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">您的姓名</label>
                        <div class="relative flex flex-row justify-between">
                            <input v-model="form.firstname" type="text" placeholder="姓氏"
                                class="w-[190px] px-5 py-2 border rounded-md focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <input v-model="form.lastname" type="text" placeholder="名字"
                                class="w-[190px] px-5 py-2 border rounded-md focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                    </div>
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">手機號碼</label>
                        <div class="relative flex items-center justify-between gap-4">
                            <PhoneField v-model="phone" v-model:countryCode="code" />
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
                                {{'等待 276 秒'}}
                            </button>
                        </div>
                    </div>
                    <div v-if="isCodeSent" class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">驗證碼</label>
                        <div class="relative flex items-center justify-between gap-4">
                            <CodeField v-model="phone" v-model:countryCode="code" />
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
                                {{'等待 276 秒'}}
                            </button>
                        </div>
                    </div>
                    <!-- Footer text -->
                    <div class="flex flex-row w-full mb-4">
                        <span class="text-h6 text-others-gray1 md:text-h6-d">
                            我已閱讀
                        </span>
                        <span class="text-h6 text-others-original md:text-h6-d">「隱私權政策」</span>
                        <span class="text-h6 text-others-gray1 md:text-h6-d">
                            並同意其內容
                        </span>
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
import { ref } from 'vue'

import PhoneField from '@/components/ui/forms/PhoneField.vue'

const phone = ref('')
const code  = ref('+886')

const form = ref({
    username: '',
    password: ''
})

const showPassword = ref(false)
const activeTab = ref('login-member')
const isCodeSent = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = () => {
    console.log('Login with:', form.value)
    // Your login logic here
}
</script>