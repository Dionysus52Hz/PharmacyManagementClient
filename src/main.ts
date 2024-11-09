import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from '@/routes';
import { createPinia } from 'pinia';
import VCalendar from 'v-calendar';
import { yourMixin } from './mixins/yourMixin';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
const pinia = createPinia();

app.mixin(yourMixin);
app.use(Toast);

app.use(router).use(pinia).mount('#app');
