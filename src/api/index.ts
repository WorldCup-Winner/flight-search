import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

// 建立 axios instance
const apiClient = axios.create({
    baseURL: API_URL
})

// Token 管理
export interface TokenInfo {
    tokenType: string
    accessToken: string
    refreshToken: string
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback)
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach(callback => callback(token))
    refreshSubscribers = []
}

export function getStoredTokens(): TokenInfo | null {
    const tokenStr = localStorage.getItem('authTokens')
    if (!tokenStr) return null
    try {
        return JSON.parse(tokenStr)
    } catch {
        return null
    }
}

export function setStoredTokens(tokens: TokenInfo) {
    localStorage.setItem('authTokens', JSON.stringify(tokens))
}

export function clearStoredTokens() {
    localStorage.removeItem('authTokens')
}

// Request interceptor: 自動附加 JWT token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokens = getStoredTokens()
        if (tokens?.accessToken) {
            config.headers.Authorization = `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor: 處理 401 錯誤，自動刷新 token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        
        // 如果是 401 錯誤且不是刷新 token 的請求
        if (error.response?.status === 401 && !originalRequest._retry) {
            // 排除登入和刷新 token 的請求
            if (originalRequest.url?.includes('/Liyi/FA01') || 
                originalRequest.url?.includes('/token/refresh')) {
                return Promise.reject(error)
            }
            
            const tokens = getStoredTokens()
            if (!tokens?.refreshToken) {
                // 沒有 refresh token，清除登入狀態
                clearStoredTokens()
                return Promise.reject(error)
            }
            
            if (isRefreshing) {
                // 已經在刷新中，等待刷新完成
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        resolve(apiClient(originalRequest))
                    })
                })
            }
            
            originalRequest._retry = true
            isRefreshing = true
            
            try {
                const { data } = await axios.post(`${API_URL}/token/refresh`, {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                })
                
                // 假設 refresh 回傳新的 tokens
                const newTokens: TokenInfo = {
                    tokenType: data.tokenType || tokens.tokenType || 'Bearer',
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken || tokens.refreshToken
                }
                setStoredTokens(newTokens)
                
                isRefreshing = false
                onTokenRefreshed(newTokens.accessToken)
                
                originalRequest.headers.Authorization = `${newTokens.tokenType} ${newTokens.accessToken}`
                return apiClient(originalRequest)
            } catch (refreshError) {
                isRefreshing = false
                clearStoredTokens()
                // 可以在這裡觸發登出事件
                window.dispatchEvent(new CustomEvent('auth:token-expired'))
                return Promise.reject(refreshError)
            }
        }
        
        return Promise.reject(error)
    }
)

// ============ 公開 API (不需要 Auth) ============

export function getAirlines() {
    return apiClient.get('/airline')
}

export function getLocations() {
    return apiClient.get('/location-city')
}

export function flightSearch(req: any) {
    return apiClient.post('/flight-search', req)
}

// 登入 API - 不需要 Auth，但會回傳 tokens
export function signIn(req: any) {
    return axios.post(`${API_URL}/Liyi/FA01`, req)
}

export function getAirlineAlliance() {
    return apiClient.get('/airline-alliance/airlines')
}

export function fareRule(req: any) {
    return apiClient.post('/fare-rule', req)
}

export function booking(req: any) {
    return apiClient.post('/booking', req)
}

export function getSupportedPaymentTypes(totalAmount: number) {
    return apiClient.post('/Liyi/PAYTYPE', { totalAmount })
}

// 取得國碼清單
export function getPhoneCodes() {
    return apiClient.get('/nationality/phone-codes')
}

// 地點自動完成搜尋
export function getLocationAutocomplete(keyword: string) {
    return apiClient.get('/location-autocomplete', {
        params: { keyword }
    })
}

export function getNationality() {
    return apiClient.get('/nationality')
}

// ============ 需要 Auth 的 API ============

// 讀取會員資料 (Auth)
export function getMemberInfo(req: any) {
    return apiClient.post('/Liyi/FA03', req)
}

// 發送簡訊 (Auth - FA01B 首次登入手機碼驗證簡訊發送)
export function sendSMS(req: any) {
    return apiClient.post('/Liyi/FP01B', req)
}

// 驗證簡訊 (Auth)
export function verifySMS(req: any) {
    return apiClient.post('/Liyi/SMSCHK', req)
}

// 建立付款單 (Auth)
export function createPayment(req: any) {
    return apiClient.post('/Liyi/FP03', req)
}

// 查詢付款結果 (Auth)
export function queryPaymentResult(req: any) {
    return apiClient.post('/Liyi/FP03R', req)
}

// 查詢訂單 (FP04) (Auth)
export function queryOrder(orderNumber: string, mobileNumber: string) {
    return apiClient.post('/Liyi/FP04', {
        PAR01: orderNumber,
        PAR02: mobileNumber,
        from_ip: '',
        from_url: window.location.href
    })
}

// 瀏覽訂單 (FP02) (Auth)
export function viewOrder(orderNumber: string, uniqId: string, passengerSequence?: string) {
    return apiClient.post('/Liyi/FP02', {
        PAR01: orderNumber,
        PAR02: uniqId,
        PAR03: passengerSequence || '',
        from_ip: '',
        from_url: window.location.href
    })
}

// ============ Token 管理 API ============

// 更新 Token (Auth)
export function refreshToken(accessToken: string, refreshTokenValue: string) {
    return axios.post(`${API_URL}/token/refresh`, {
        accessToken,
        refreshToken: refreshTokenValue
    })
}

// 登出 - 移除 Refresh Token (Auth)
export function revokeToken() {
    return apiClient.post('/token/revoke')
}

// 導出 apiClient 供其他地方使用
export { apiClient }
