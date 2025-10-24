import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

export function getAirlines() {
    return axios.get(`${API_URL}/airline`)
}

export function getLocations() {
    return axios.get(`${API_URL}/location`)
}

export function getNationality() {
    return axios.get(`${API_URL}/nationality`)
}

export function flightSearch(req: any) {
    return axios.post(`${API_URL}/flight-search`, req)
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

export function signIn(req: any) {
    return axios.post(`${API_URL}/Liyi/FA011`, req)
}

export function sendSMS(req: any) {
    return axios.post(`${API_URL}/Liyi/FA01B`, req)
}

export function LiyiPAYTYPE(req: any) {
    return axios.post(`${API_URL}/Liyi/PAYTYPE`, req)
}

export function LiyiFP02(req: any) {
    return axios.post(`${API_URL}/Liyi/FP02`, req)
}

export function LiyiFP03(req: any) {
    return axios.post(`${API_URL}/Liyi/FP03`, req)
}

export function LiyiFP03R(req: any) {
    return axios.post(`${API_URL}/Liyi/FP03R`, req)
}

export function LiyiFP04(req: any) {
    return axios.post(`${API_URL}/Liyi/FP04`, req)
}