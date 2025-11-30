import { defineStore } from 'pinia'
import axios from 'axios'
import { sendSMS, signIn } from '@/api'
import { useToast } from 'vue-toastification'

export interface UserInfo {
    name: string | null
    firstName?: string
    lastName?: string
    phone?: string
    countryCode?: string
    email?: string
    gender?: 'male' | 'female'
    isMember?: boolean // true for member, false for guest
}

export const useAuthStore = defineStore('auth', {
    state: (): { user: UserInfo; loading: boolean; error: string | null } => {
        const storedUser = localStorage.getItem('userInfo')
        return {
            user: storedUser ? JSON.parse(storedUser) : {
                name: null,
                firstName: undefined,
                lastName: undefined,
                phone: undefined,
                countryCode: undefined,
                email: undefined,
                gender: undefined,
                isMember: undefined,
            },
            loading: false,
            error: null,
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.user.name,
        isMember: (state) => state.user.isMember === true,
        isGuest: (state) => state.user.isMember === false,
        // Backward compatibility: expose name directly
        name: (state) => state.user.name,
    },

    actions: {
        async login(req: any) {
            const toast = useToast()
            this.loading = true
            this.error = null

            try {
                const { data } = await signIn(req)
                console.log(data)

                if (data.status == '1') {
                    // Member login - store user data from API response
                    // API Response fields:
                    // RET01: 會員編號 (Member ID)
                    // RET02: 會員帳號(身份證號) (Member Account/ID Number)
                    // RET03: 會員姓名 (Member Name)
                    // RET04: 是否為首次登入:Y/N (Is First Login)
                    // RET05: 會員手機號碼 (Member Phone Number)
                    // RET09: 榮鬱會員註記:Y/N (VIP Member Flag)
                    // RET10: 帳號驗證碼 (Account Verification Code)
                    
                    const fullName = data.RET03 || ''
                    // Parse Chinese name: typically format is "姓 名" or "姓氏名字"
                    // For simplicity, we'll split by space or take first char as last name
                    let firstName = ''
                    let lastName = ''
                    if (fullName) {
                        const nameParts = fullName.trim().split(/\s+/)
                        if (nameParts.length >= 2) {
                            lastName = nameParts[0] // First part is usually surname
                            firstName = nameParts.slice(1).join(' ') // Rest is given name
                        } else if (fullName.length >= 2) {
                            // If no space, assume first character is surname
                            lastName = fullName.charAt(0)
                            firstName = fullName.slice(1)
                        } else {
                            firstName = fullName
                        }
                    }
                    
                    const userInfo: UserInfo = {
                        name: fullName, // RET03: 會員姓名
                        firstName: firstName,
                        lastName: lastName,
                        phone: data.RET05 || '', // RET05: 會員手機號碼
                        countryCode: '+886', // Default to Taiwan, not provided in API
                        email: '', // Not provided in API response
                        gender: undefined, // Not provided in API response
                        isMember: true,
                    }
                    this.user = userInfo
                    localStorage.setItem('userInfo', JSON.stringify(userInfo))
                    toast.success(`${data.msg}`)
                } else if (data.status == '0') {
                    toast.warning(`${data.msg}`)
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed'
                toast.error(this.error)
                console.log(err)
            } finally {
                this.loading = false
            }
        },
        
        setGuestInfo(userInfo: UserInfo) {
            this.user = { ...userInfo, isMember: false }
            localStorage.setItem('userInfo', JSON.stringify(this.user))
        },
        async sendSMS(req: any) {
            this.loading = true
            this.error = null

            try {
                const { data } = await sendSMS(req)
                console.log(data)

            } catch (err: any) {
                this.error = err.response?.data?.message || 'Sending SMS failed'
                console.log(err)
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.user = {
                name: null,
                firstName: undefined,
                lastName: undefined,
                phone: undefined,
                countryCode: undefined,
                email: undefined,
                gender: undefined,
                isMember: undefined,
            }
            localStorage.removeItem('userInfo')
        },
    },
})
