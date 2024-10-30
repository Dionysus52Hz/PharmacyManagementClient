<template>
   <nav
      class="bg-white w-full h-[80px] flex justify-between items-center px-6 fixed"
   >
      <div class="logo-container flex items-center gap-x-2.5">
         <div class="logo bg-gray-300 h-10 aspect-square rounded"></div>

         <p class="app-name text-lg font-semibold">App Name</p>
      </div>

      <NavigationMenu>
         <NavigationMenuList class="gap-x-2.5">
            <NavigationMenuItem v-for="item in navigationMenuItems">
               <RouterLink
                  :to="{
                     name: item.view,
                  }"
               >
                  <NavigationMenuLink
                     href="#"
                     :class="navigationMenuTriggerStyle()"
                     class="font-semibold"
                  >
                     {{ item.title }}
                  </NavigationMenuLink>
               </RouterLink>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>

      <div class="authentication-container flex items-center gap-x-2.5">
         <RouterLink
            :to="{
               name: 'signup-view',
            }"
         >
            <Button
               variant="ghost"
               class="gap-x-2 font-semibold"
            >
               <KeyRound class="h-5 w-5" />
               Đăng ký
            </Button>
         </RouterLink>

         <RouterLink
            :to="{
               name: 'login-view',
            }"
         >
            <Button class="gap-x-2 font-semibold">
               <LogIn class="h-5 w-5" />
               Đăng nhập
            </Button>
         </RouterLink>
      </div>
   </nav>
</template>

<script setup lang="ts">
   import {
      NavigationMenu,
      NavigationMenuItem,
      NavigationMenuLink,
      NavigationMenuList,
      navigationMenuTriggerStyle,
   } from '@/components/ui/navigation-menu';
   import { KeyRound, LogIn } from 'lucide-vue-next';
   import { Button } from '@/components/ui/button';

   const navigationMenuItems: { title: string; view: string }[] = [
      {
         title: 'Trang chủ',
         view: 'home-view',
      },
      {
         title: 'Giới thiệu',
         view: 'about-us-view',
      },
      {
         title: 'Liên hệ',
         view: 'contacts-view',
      },
   ];
</script>
