<template>
    <div class="flex flex-col items-center justify-center bg-white">
        <div class="bg-white rounded-t-2xl border-b-0 px-[40px] py-[30px] w-[500px] border-2 border-primary-gold">
            <div class="flex gap-4">
                <button class="flex-1 py-2 rounded-md text-white bg-primary-gold">
                    會員登入
                </button>
                <button class="flex-1 py-2 rounded-md bg-others-gray4 text-others-gray1">
                    訪客購買
                </button>
            </div>
        </div>
        <div class="bg-white rounded-b-2xl px-[40px] py-[30px] w-[500px] border-2 border-primary-gold">
            <h6 class="text-h6 text-others-original mb-4 md:text-h6-d">訪客購買需先驗證手機，或切換至會員登入頁籤進行登入非本國籍請輸入護照英文拼音</h6>
            <form @submit.prevent="handleLogin" class="flex flex-col items-center">
                <div class="mb-4 w-full">
                    <label class="block mb-1 text-others-gray1 text-sm">您的姓名</label>
                    <div class="relative flex flex-row justify-between text-others-gray1">
                        <input v-model="form.firstname" type="text" placeholder="姓氏"
                            class="w-[190px] px-5 py-2 border rounded-md focus:ring-2 focus:ring-others-original focus:outline-none" />
                        <input v-model="form.lastname" type="text" placeholder="名字"
                            class="w-[190px] px-5 py-2 border rounded-md focus:ring-2 focus:ring-others-original focus:outline-none" />
                    </div>
                </div>

                <div class="mb-4 w-full">
                    <label class="block mb-1 text-others-gray1 text-sm">手機號碼</label>
                    <div class="relative flex flex-row justify-between">
                        <div class="relative">
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="......."
                                class="px-5 py-2 border rounded-md tracking-[10px] text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <button type="button" class="absolute right-2 top-1 text-others-gray1"
                                @click="togglePassword">
                                <div v-if="showPassword">
                                    <img src="@/assets/imgs/icon-eye1.svg" />
                                </div>
                                <div v-else>
                                    <img src="@/assets/imgs/icon-eye2.svg" />
                                </div>
                            </button>
                        </div>

                        <button
                            class="bg-others-original text-white px-5 py-2 rounded-md hover:bg-others-hover transition">
                            發送驗證簡訊
                        </button>
                    </div>
                </div>

                <div class="flex flex-row w-full mb-4">
                    <span class="text-h6 text-others-gray1 md:text-h6-d">
                        我已閱讀
                    </span>
                    <span class="text-h6 text-others-original md:text-h6-d">「隱私權政策」</span>
                    <span class="text-h6 text-others-gray1 md:text-h6-d">
                        並同意其內容
                    </span>
                </div>

                <button type="submit"
                    class="w-[150px] mx-auto bg-others-original text-white py-2 rounded-md hover:bg-others-hover transition">
                    送出
                </button>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const form = ref({
    username: '',
    password: ''
})

const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = () => {
    console.log('Login with:', form.value)
    // Your login logic here
}
</script>