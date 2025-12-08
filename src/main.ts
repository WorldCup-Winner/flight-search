import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import solid icon pack and add it to the Library */
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
})

// 初始化 auth store 並設置 token 過期監聽器
const authStore = useAuthStore()
authStore.setupTokenExpirationListener()

app.mount('#app')
