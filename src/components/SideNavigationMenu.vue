<template>
   <aside
      class="bg-[#fafafa] fixed top-0 h-dvh w-[20%] min-w-[288px] lg:block flex flex-col"
   >
      <div
         class="bg-inherit fixed w-[20%] min-w-[288px] p-6 flex gap-x-[10px] items-center"
      >
         <div class="logo bg-slate-300 w-6 aspect-square rounded"></div>
         <span class="text-sm font-bold">Untitled UI</span>
      </div>

      <div class="menu-items-container overflow-y-auto mt-[72px] h-full">
         <div
            class="menu-items-group p-4 pt-0 text-gray-500 flex flex-col gap-y-1"
            v-for="(group, groupIndex) in MENU_ITEMS"
         >
            <p
               class="menu-items-group-title uppercase font-bold text-xs px-2 py-1"
            >
               {{ group.title }}
            </p>

            <ul>
               <li
                  class="menu-item flex items-center gap-x-2.5 p-2 cursor-pointer rounded-lg font-medium"
                  v-for="(item, itemIndex) in group.items"
                  :key="itemIndex"
                  :class="{
                     'text-black font-semibold bg-gray-200':
                        selectedGroupIndex === groupIndex &&
                        selectedItemIndex === itemIndex,
                  }"
                  @click="
                     setSelected(groupIndex, itemIndex),
                        changeView(item.view),
                        navigationMenuStore.setSelectedMenuState({
                           menuGroup: group.title,
                           menuItem: item.text,
                        })
                  "
               >
                  <component
                     :is="item.icon"
                     class="h-5"
                  ></component>
                  <p class="text-sm">{{ item.text }}</p>
               </li>
            </ul>
         </div>
      </div>
   </aside>
</template>

<script setup lang="ts">
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { MENU_ITEMS } from '@/utils/constants';
   import { useNavigationMenuStore } from '@/stores/navigationMenuStore';

   const navigationMenuStore = useNavigationMenuStore();
   const selectedGroupIndex = ref(-1);
   const selectedItemIndex = ref(-1);
   const setSelected = (groupIndex: number, itemIndex: number) => {
      selectedGroupIndex.value = groupIndex;
      selectedItemIndex.value = itemIndex;
   };

   const router = useRouter();
   const changeView = (viewName: string) => {
      router.push({
         name: viewName,
      });
   };
</script>

<style scoped>
   .menu-items-container::-webkit-scrollbar {
      width: 8px;
   }

   .menu-items-container::-webkit-scrollbar-track {
      padding: 10px;
      background: transparent;
   }

   .menu-items-container::-webkit-scrollbar-thumb {
      background: #e7e5e4;
      border-radius: 20px;
   }

   .menu-items-container::-webkit-scrollbar-thumb:hover {
      background: #e7e5e4;
   }
</style>
