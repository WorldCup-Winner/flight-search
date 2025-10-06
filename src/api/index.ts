import axios from 'axios'

export function getAirlines() {
    return axios.get('https://galilee-flight-backend.pamis.dev/api/airline')
}

export function getLocations() {
    return axios.get('https://galilee-flight-backend.pamis.dev/api/location')
}

export function flightSearch(req: any) {
    return axios.post('https://galilee-flight-backend.pamis.dev/api/flight-search', req)
}