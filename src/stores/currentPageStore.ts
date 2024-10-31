import { defineStore } from 'pinia';

export const useCurrentPageStore = defineStore('current-page', {
   state: () => {
      const storedCurrentPage = localStorage.getItem('currentPage');

      return {
         currentPage: storedCurrentPage ? JSON.parse(storedCurrentPage) : null,
      };
   },
   actions: {
      setCurrentPage(page: string) {
         this.currentPage = page;
         localStorage.setItem('currentPage', JSON.stringify(this.currentPage));
      },

      clearSelection() {
         this.currentPage = null;
         localStorage.removeItem('currentPage');
      },
   },
});
