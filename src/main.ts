import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from '@/routes';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia).mount('#app');
