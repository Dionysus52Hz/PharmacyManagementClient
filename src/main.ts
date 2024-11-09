import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import router from '@/routes';
import { createPinia } from 'pinia';
import VCalendar from 'v-calendar';
import { yourMixin } from './mixins/yourMixin';

const app = createApp(App);
const pinia = createPinia();

app.mixin(yourMixin);
// Sử dụng VCalendar toàn cục
// app.use(VCalendar, {
//     firstDayOfWeek: 1, // Thứ hai là ngày đầu tuần
//     formats: {
//         // Định dạng ngày tháng (tùy chọn)
//         date: 'YYYY-MM-DD',
//         datetime: 'YYYY-MM-DD HH:mm',
//     },
// });

app.use(router).use(pinia).mount('#app');
