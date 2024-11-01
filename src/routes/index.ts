import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import AboutUs from '@/views/AboutUs.vue';
import Contacts from '@/views/Contacts.vue';
import SignUp from '@/views/SignUp.vue';
import Login from '@/views/Login.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import Medicine from '@/views/Medicine.vue';
import MedicineCategories from '@/views/MedicineCategories.vue';
import Suppliers from '@/views/Suppliers.vue';
import Manufactures from '@/views/Manufactures.vue';
import Customers from '@/views/Customers.vue';
import Employees from '@/views/Employees.vue';
import ReceivedNotes from '@/views/ReceivedNotes.vue';
import DeliveryNotes from '@/views/DeliveryNotes.vue';
import Statistics from '@/views/Statistics.vue';
import ImportData from '@/views/ImportData.vue';
import ExportData from '@/views/ExportData.vue';
import Account from '@/views/Account.vue';
import Settings from '@/views/Settings.vue';

const routes = [
   {
      path: '/',
      component: Home,
      name: 'home-view',
   },
   {
      path: '/about-us',
      component: AboutUs,
      name: 'about-us-view',
   },
   {
      path: '/contacts',
      component: Contacts,
      name: 'contacts-view',
   },

   {
      path: '/login',
      component: Login,
      name: 'login-view',
   },
   {
      path: '/signup',
      component: SignUp,
      name: 'signup-view',
   },
   {
      path: '/reset-password',
      component: ResetPassword,
      name: 'reset-password-view',
   },
   {
      path: '/medicine',
      component: Medicine,
      name: 'medicine-view',
   },
   {
      path: '/medicine-categories',
      component: MedicineCategories,
      name: 'medicine-categories-view',
   },
   {
      path: '/suppliers',
      component: Suppliers,
      name: 'suppliers-view',
   },
   {
      path: '/manufactures',
      component: Manufactures,
      name: 'manufactures-view',
   },
   {
      path: '/customers',
      component: Customers,
      name: 'customers-view',
   },
   {
      path: '/employees',
      component: Employees,
      name: 'employees-view',
   },
   {
      path: '/received-notes',
      component: ReceivedNotes,
      name: 'received-notes-view',
   },
   {
      path: '/delivery-notes',
      component: DeliveryNotes,
      name: 'delivery-notes-view',
   },
   {
      path: '/statistics',
      component: Statistics,
      name: 'statistics-view',
   },
   {
      path: '/import-data',
      component: ImportData,
      name: 'import-data-view',
   },
   {
      path: '/export-data',
      component: ExportData,
      name: 'export-data-view',
   },
   {
      path: '/account',
      component: Account,
      name: 'account-view',
   },
   {
      path: '/settings',
      component: Settings,
      name: 'settings-view',
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

export default router;
