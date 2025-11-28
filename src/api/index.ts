import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

export function getAirlines() {
    return axios.get(`${API_URL}/airline`)
}

export function getLocations() {
    return axios.get(`${API_URL}/location-city`)
}

export function flightSearch(req: any) {
    return axios.post(`${API_URL}/flight-search`, req)
}

export function signIn(req: any) {
    return axios.post(`${API_URL}/Liyi/FA01`, req)
}

export function sendSMS(req: any) {
    return axios.post(`${API_URL}/Liyi/FA01B`, req)
}

export function getAirlineAlliance() {
    return axios.get(`${API_URL}/airline-alliance/airlines`)
}

export function fareRule(req: any) {
    return axios.post(`${API_URL}/fare-rule`, req)
}

export function booking(req: any) {
    return axios.post(`${API_URL}/booking`, req)
}

export function getSupportedPaymentTypes(totalAmount: number) {
    return axios.post(`${API_URL}/Liyi/PAYTYPE`, { totalAmount })
}

// 建立付款單
export function createPayment(req: any) {
    return axios.post(`${API_URL}/Liyi/FP03`, req)
}

// 查詢付款結果
export function queryPaymentResult(req: any) {
    return axios.post(`${API_URL}/Liyi/FP03R`, req)
}

// 查詢訂單 (FP04)
export function queryOrder(orderNumber: string, mobileNumber: string) {
    return axios.post(`${API_URL}/Liyi/FP04`, {
        PAR01: orderNumber,
        PAR02: mobileNumber,
        from_ip: '',
        from_url: window.location.href
    })
}

// 瀏覽訂單 (FP02)
export function viewOrder(orderNumber: string, uniqId: string, passengerSequence?: string) {
    return axios.post(`${API_URL}/Liyi/FP02`, {
        PAR01: orderNumber,
        PAR02: uniqId,
        PAR03: passengerSequence || '',
        from_ip: '',
        from_url: window.location.href
    })
}

// 取得國碼清單
export function getPhoneCodes() {
    return axios.get(`${API_URL}/nationality/phone-codes`)
}

// 地點自動完成搜尋
export function getLocationAutocomplete(keyword: string) {
    return axios.get(`${API_URL}/location-autocomplete`, {
        params: { keyword }
    })
}

export function getNationality() {
    return axios.get(`${API_URL}/nationality`)
}