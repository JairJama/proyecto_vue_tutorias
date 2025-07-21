import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/home.css'
import './assets/css/index.css'
import './assets/css/dashboard.css'
import './assets/css/solicitar.css'
import './assets/css/HistorialEstudiante.css'
import './assets/css/dashboard-tutor.css'
import './assets/css/agenda-tutor.css'
import './assets/css/historial-tutor.css'

createApp(App).use(router).mount('#app')
