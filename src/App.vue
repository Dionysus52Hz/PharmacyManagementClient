<template>
   <Sheet>
      <SheetTrigger as-child>
         <Button
            variant="outline"
            class="lg:hidden"
         >
            Open
         </Button>
      </SheetTrigger>
      <SheetContent
         side="left"
         class="w-[20%]"
      >
         <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
               Make changes to your profile here. Click save when you're done.
            </SheetDescription>
         </SheetHeader>

         <SheetFooter>
            <SheetClose as-child>
               <Button type="submit"> Save changes </Button>
            </SheetClose>
         </SheetFooter>
      </SheetContent>
   </Sheet>

   <Header></Header>

   <SideNavigationMenu
      ref="sideNavigation"
      v-if="isLoggedIn"
   ></SideNavigationMenu>

   <AppBar
      v-if="isLoggedIn"
      class="ml-[var(--customMarginLeft)] bg-white"
      :style="`--customMarginLeft:${marginLeftForMainTag}px`"
   ></AppBar>

   <main
      class="ml-[220px] h-dvh bg-white pt-[80px]"
      :style="`--customMarginLeft:${marginLeftForMainTag}px`"
   >
      <router-view></router-view>
   </main>
   <Toaster />
</template>

<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import {
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
   } from '@/components/ui/sheet';
   import Toaster from '@/components/ui/toast/Toaster.vue';
   import SideNavigationMenu from '@/components/SideNavigationMenu.vue';
   import AppBar from '@/components/AppBar.vue';
   import Header from '@/components/Header.vue';
   import {
      computed,
      onBeforeMount,
      onMounted,
      ref,
      useTemplateRef,
      watch,
   } from 'vue';
   import {
      onBeforeRouteLeave,
      onBeforeRouteUpdate,
      useRoute,
   } from 'vue-router';
   import { useCurrentPageStore } from './stores/currentPageStore';

   const sideNavigationRef = useTemplateRef('sideNavigation');
   const marginLeftForMainTag = ref(220);
   const route = useRoute();
   const isLoggedIn = computed(() => {
      return (
         route.name !== 'home-view' &&
         route.name !== 'about-us-view' &&
         route.name !== 'contacts-view' &&
         route.name !== 'signup-view' &&
         route.name !== 'login-view' &&
         route.name !== 'reset-password-view'
      );
   });

   onMounted(() => {
      marginLeftForMainTag.value =
         sideNavigationRef.value?.$el?.offsetWidth || 0;
      window.addEventListener('resize', () => {
         marginLeftForMainTag.value =
            sideNavigationRef.value?.$el?.offsetWidth || 0;
      });
   });

   const currentPageStore = useCurrentPageStore();
   watch(route, (newRoute) => {
      if (newRoute.name) {
         currentPageStore.setCurrentPage(newRoute.name as string);
      }
      if (
         newRoute.name === 'home-view' ||
         newRoute.name === 'about-us-view' ||
         newRoute.name === 'contacts-view' ||
         newRoute.name === 'signup-view' ||
         newRoute.name === 'login-view' ||
         newRoute.name === 'reset-password-view'
      ) {
         marginLeftForMainTag.value = 0;
      } else {
         console.log(newRoute.name);
         marginLeftForMainTag.value =
            sideNavigationRef.value?.$el?.offsetWidth || 0;
         window.addEventListener('resize', () => {
            marginLeftForMainTag.value =
               sideNavigationRef.value?.$el?.offsetWidth || 0;
         });
      }
   });
</script>

<style scoped></style>
