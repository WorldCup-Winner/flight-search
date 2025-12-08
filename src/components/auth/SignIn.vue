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
                                class="w-full px-5 py-2 border border-primary-gold rounded-md text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
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
                            <input v-model="form1.lastname" type="text" placeholder="姓氏"
                                class="w-[190px] px-5 py-2 border rounded-md border-primary-gold text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                            <input v-model="form1.firstname" type="text" placeholder="名字"
                                class="w-[190px] px-5 py-2 border rounded-md border-primary-gold text-others-gray1 focus:ring-2 focus:ring-others-original focus:outline-none" />
                        </div>
                    </div>
                    <div class="mb-4 w-full">
                        <label class="block mb-1 text-others-gray1 text-sm">手機號碼</label>
                        <div class="relative flex items-center justify-between gap-4">
                            <PhoneField v-model="form1.phone" v-model:countryCode="form1.code" :showEye="true" />
                            <button
                                v-if="!isCodeSent || codeLeftTime == 0"
                                class="flex-none inline-flex items-center justify-center w-fit whitespace-nowrap
                                    bg-others-original text-white px-5 py-2 rounded-[10px] hover:bg-others-hover transition"
                                @click="handleCodeSMS">
                                發送驗證簡訊
                            </button>
                            <button
                                v-else
                                class="flex-none inline-flex items-center justify-center w-fit whitespace-nowrap bg-primary-gold text-white px-5 py-2 rounded-[10px] hover:bg-primary-gold1 transition">
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
<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { sendSMS, verifySMS } from '@/api';

import PhoneField from '@/components/ui/PhoneField.vue'
import CodeField from '@/components/ui/CodeField.vue'

import { goPrivacy, goMemberPage } from '@/utils';

const emit = defineEmits(['close'])
const verificationCode = ref('')
const codeLeftTime = ref(300)
const timerRunning = ref(false)
const form = ref({
    username: '',
    password: ''
})
const form1 = ref({
    firstname: '',
    lastname: '',
    code: '+886',
    phone: ''
})

const showUsername = ref(false)
const showPassword = ref(false)
const activeTab = ref('login-member')
const isCodeSent = ref(false)
const smsId = ref('') // Store RET04 (SMS ID) from FA01B response
const agreed = ref(false)

const authStore = useAuthStore()
const toast = useToast()

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const toggleUsername = () => {
    showUsername.value = !showUsername.value
}

const handleLogin = async () => {
    // Check if it's guest purchase (訪客購買)
    if (activeTab.value === 'login-guest') {
        // Validate required fields
        if (!form1.value.firstname || !form1.value.lastname || !form1.value.phone) {
            toast.warning('請填寫完整的姓名和手機號碼')
            return
        }
        
        if (!isCodeSent.value) {
            toast.warning('請先發送驗證簡訊')
            return
        }
        
        if (!verificationCode.value) {
            toast.warning('請輸入驗證碼')
            return
        }
        
        if (!agreed.value) {
            toast.warning('請同意隱私權政策')
            return
        }
        
        // Call SMSCHK API
        try {
            const fullName = `${form1.value.lastname}${form1.value.firstname}`
            // For Taiwan (+886), send phone number as-is. For other countries, combine code and phone
            const phoneNumber = form1.value.code === '+886' 
                ? form1.value.phone 
                : `${form1.value.code.replace('+', '')}${form1.value.phone}`
            
            const response = await verifySMS({
                PAR01: phoneNumber, // Phone number
                PAR02: smsId.value, // SMS ID (RET04) from FA01B response
                PAR03: verificationCode.value, // SMS verification code
                PAR04: fullName // Full name (姓 + 名字)
            })
            
            const data = response.data
            
            if (data.status === '1' || data.status === 1) {
                // Success - proceed with guest authentication
                toast.success(data.msg || '驗證成功')
                // Set authenticated state with guest info
                authStore.setGuestInfo({
                    name: fullName,
                    firstName: form1.value.firstname,
                    lastName: form1.value.lastname,
                    phone: form1.value.phone,
                    countryCode: form1.value.code,
                    isMember: false,
                })
                emit('close')
            } else if (data.status === '0' || data.status === 0) {
                // Failed
                toast.warning(data.msg || '驗證失敗')
            } else {
                // Unknown status - show message anyway
                toast.info(data.msg || '驗證完成')
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '驗證失敗'
            toast.error(errorMsg)
            console.error('SMS verification error:', error)
        }
    } else {
        // Member login
        console.log('Login with:', form.value)
        try {
            const success = await authStore.login({
                "PAR01": form.value.username,
                "PAR02": form.value.password
            })
            // Only close dialog on success
            if (success) {
                emit('close')
            }
        } catch (error) {
            // Error already handled in authStore.login, just don't close dialog
            console.error('Login error:', error)
        }
    }
}

const handleCodeSMS = async () => {
    // Validate required fields
    if (!form1.value.firstname || !form1.value.lastname || !form1.value.phone) {
        toast.warning('請填寫完整的姓名和手機號碼')
        return
    }
    
    try {
        // For Taiwan (+886), send phone number as-is. For other countries, combine code and phone
        const phoneNumber = form1.value.code === '+886' 
            ? form1.value.phone 
            : `${form1.value.code.replace('+', '')}${form1.value.phone}`
        
        const response = await sendSMS({
            PAR02: phoneNumber, // Phone number
            PAR03: form1.value.lastname, // 姓
            PAR04: form1.value.firstname // 名字
        })
        
        const data = response.data
        
        if (data.status === '1' || data.status === 1) {
            // Success - store SMS ID and start countdown
            smsId.value = data.RET04 || ''
            isCodeSent.value = true
            toast.success(data.msg || '驗證簡訊已發送')
        } else if (data.status === '0' || data.status === 0) {
            // Failed - reset button state
            isCodeSent.value = false
            toast.warning(data.msg || '發送失敗')
        } else {
            // Unknown status - show message anyway
            toast.info(data.msg || '簡訊已發送')
        }
    } catch (error: any) {
        // On error, reset button state
        isCodeSent.value = false
        const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || '發送失敗'
        toast.error(errorMsg)
        console.error('SMS send error:', error)
    }
}

let timerId: ReturnType<typeof setInterval> | null = null
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
    if (timerId !== null) clearInterval(timerId);
    timerRunning.value = false;
  }
};

onUnmounted(() => {
  stopTimer(); // Clear the interval when the component is unmounted
});
</script>