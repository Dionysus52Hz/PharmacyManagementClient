<template>
   <nav
      class="h-[80px] px-9 py-6 flex items-center justify-between fixed inset-x-0 z-50"
   >
      <Breadcrumb>
         <BreadcrumbList class="font-semibold">
            <BreadcrumbItem>
               <div
                  class="home-logo bg-gray-200 h-6 aspect-square rounded"
               ></div>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
               <BreadcrumbLink as-child>
                  <a href="#">{{ selectedMenuState.menuGroup }}</a>
               </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
               <BreadcrumbPage>
                  {{ selectedMenuState.menuItem }}
               </BreadcrumbPage>
            </BreadcrumbItem>
         </BreadcrumbList>
      </Breadcrumb>

      <div class="account flex gap-x-2.5 items-center">
         <div class="avatar bg-gray-200 w-8 aspect-square rounded-lg"></div>

         <p class="text-sm font-semibold">Ngo Trong Phuc</p>
      </div>
   </nav>
</template>

<script setup lang="ts">
   import {
      Breadcrumb,
      BreadcrumbEllipsis,
      BreadcrumbItem,
      BreadcrumbLink,
      BreadcrumbList,
      BreadcrumbPage,
      BreadcrumbSeparator,
   } from '@/components/ui/breadcrumb';
   import { computed } from 'vue';
   import { useNavigationMenuStore } from '@/stores/navigationMenuStore';

   const navigationMenuStore = useNavigationMenuStore();
   const selectedMenuState = computed(() => {
      return navigationMenuStore.selectedMenuState;
   });
</script>

<style scoped></style>
