import { defineStore } from 'pinia'
import axios from 'axios'
import { sendSMS, signIn, getMemberInfo } from '@/api'
import { useToast } from 'vue-toastification'

export interface UserInfo {
    name: string | null
    firstName?: string
    lastName?: string
    phone?: string
    countryCode?: string
    email?: string
    gender?: number | string // 1 or "1" = 男, 2 or "2" = 女, 0 or "0" = 未提供
    isMember?: boolean // true for member, false for guest
    memberId?: string // 會員編號 (RET01/MEA01)
    memberAccount?: string // 會員帳號/身份證號 (RET02/MEA02)
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
                memberId: undefined,
                memberAccount: undefined,
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
                // Step 1: Call FA01 (member login)
                const { data } = await signIn(req)
                console.log('FA01 response:', data)

                if (data.status == '1' || data.status === 1) {
                    // FA01 Response fields:
                    // RET01: 會員編號 (Member ID)
                    // RET02: 會員帳號(身份證號) (Member Account/ID Number)
                    // RET03: 會員姓名 (Member Name)
                    // RET04: 是否為首次登入:Y/N (Is First Login)
                    // RET05: 會員手機號碼 (Member Phone Number)
                    // RET09: 榮鬱會員註記:Y/N (VIP Member Flag)
                    // RET10: 帳號驗證碼 (Account Verification Code)
                    
                    // Step 2: Call FA03 to get detailed member info
                    try {
                        const fa03Response = await getMemberInfo({
                            PAR01: data.RET01, // 會員編號
                            PAR02: data.RET02, // 會員帳號(身份證號)
                            PAR03: data.RET10  // 帳號驗證碼
                        })
                        
                        const fa03Data = fa03Response.data
                        console.log('FA03 response:', fa03Data)
                        
                        if (fa03Data.status == '1' || fa03Data.status === 1) {
                            // FA03 Response fields:
                            // MEA01: 會員編號 (Member ID)
                            // MEA02: 身份證號 (ID Number)
                            // MEA04: 中文姓 (Chinese Surname)
                            // MEA05: 中文名 (Chinese Given Name)
                            // MEA06: 性別 (Gender: 1.男, 2.女, 0.未提供)
                            // MEA07: 客戶姓名 (Customer Name)
                            // MEA09: 生日 (Birthday: YYYY-MM-DD)
                            // MEA10: 手機 (Phone)
                            // MEA11: 市話#分機 (Landline#Extension)
                            // MEA12: Email
                            
                            const fullName = fa03Data.MEA07 || data.RET03 || ''
                            const userInfo: UserInfo = {
                                name: fullName, // MEA07: 客戶姓名 (fallback to RET03)
                                firstName: fa03Data.MEA05 || '', // MEA05: 中文名
                                lastName: fa03Data.MEA04 || '', // MEA04: 中文姓
                                phone: fa03Data.MEA10 || data.RET05 || '', // MEA10: 手機 (fallback to RET05)
                                countryCode: '+886', // Default to Taiwan
                                email: fa03Data.MEA12 || '', // MEA12: Email
                                gender: fa03Data.MEA06 !== undefined ? fa03Data.MEA06 : undefined, // MEA06: 性別
                                isMember: true,
                                memberId: data.RET01 || fa03Data.MEA01 || '', // 會員編號
                                memberAccount: data.RET02 || fa03Data.MEA02 || '', // 會員帳號/身份證號
                            }
                            this.user = userInfo
                            localStorage.setItem('userInfo', JSON.stringify(userInfo))
                            toast.success(`${data.msg || '登入成功'}`)
                        } else {
                            // FA03 failed, but FA01 succeeded - use FA01 data only
                            const fullName = data.RET03 || ''
                            let firstName = ''
                            let lastName = ''
                            if (fullName) {
                                const nameParts = fullName.trim().split(/\s+/)
                                if (nameParts.length >= 2) {
                                    lastName = nameParts[0]
                                    firstName = nameParts.slice(1).join(' ')
                                } else if (fullName.length >= 2) {
                                    lastName = fullName.charAt(0)
                                    firstName = fullName.slice(1)
                                } else {
                                    firstName = fullName
                                }
                            }
                            
                            const userInfo: UserInfo = {
                                name: fullName,
                                firstName: firstName,
                                lastName: lastName,
                                phone: data.RET05 || '',
                                countryCode: '+886',
                                email: '',
                                gender: undefined,
                                isMember: true,
                                memberId: data.RET01 || '',
                                memberAccount: data.RET02 || '',
                            }
                            this.user = userInfo
                            localStorage.setItem('userInfo', JSON.stringify(userInfo))
                            toast.warning(`${fa03Data.msg || '取得會員資訊失敗，但已成功登入'}`)
                        }
                    } catch (fa03Error: any) {
                        // FA03 error - use FA01 data only
                        console.error('FA03 error:', fa03Error)
                        const fullName = data.RET03 || ''
                        let firstName = ''
                        let lastName = ''
                        if (fullName) {
                            const nameParts = fullName.trim().split(/\s+/)
                            if (nameParts.length >= 2) {
                                lastName = nameParts[0]
                                firstName = nameParts.slice(1).join(' ')
                            } else if (fullName.length >= 2) {
                                lastName = fullName.charAt(0)
                                firstName = fullName.slice(1)
                            } else {
                                firstName = fullName
                            }
                        }
                        
                        const userInfo: UserInfo = {
                            name: fullName,
                            firstName: firstName,
                            lastName: lastName,
                            phone: data.RET05 || '',
                            countryCode: '+886',
                            email: '',
                            gender: undefined,
                            isMember: true,
                            memberId: data.RET01 || '',
                            memberAccount: data.RET02 || '',
                        }
                        this.user = userInfo
                        localStorage.setItem('userInfo', JSON.stringify(userInfo))
                        toast.warning(`${data.msg || '登入成功，但無法取得完整會員資訊'}`)
                    }
                } else if (data.status == '0' || data.status === 0) {
                    toast.warning(`${data.msg || '登入失敗'}`)
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
                memberId: undefined,
                memberAccount: undefined,
            }
            localStorage.removeItem('userInfo')
        },
    },
})
