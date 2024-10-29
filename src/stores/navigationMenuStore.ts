import { defineStore } from 'pinia';

type MenuState = {
   menuGroup: string | null;
   menuItem: string | null;
};

export const useNavigationMenuStore = defineStore('navigation-menu', {
   state: (): { selectedMenuState: MenuState } => {
      const storedMenuState = localStorage.getItem('selectedMenuState');

      return {
         selectedMenuState: storedMenuState
            ? JSON.parse(storedMenuState)
            : {
                 menuGroup: null,
                 menuItem: null,
              },
      };
   },
   actions: {
      setSelectedMenuState(menuState: MenuState) {
         this.selectedMenuState = menuState;
         localStorage.setItem(
            'selectedMenuState',
            JSON.stringify(this.selectedMenuState)
         );
      },

      clearSelection() {
         this.selectedMenuState = {
            menuGroup: null,
            menuItem: null,
         };
         localStorage.removeItem('selectedMenuState');
      },
   },
});
