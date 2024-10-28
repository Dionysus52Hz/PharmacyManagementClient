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
   <SideNavigationMenu ref="sideNavigation"></SideNavigationMenu>
   <main
      class="ml-[var(--customMarginLeft)] h-dvh bg-white"
      :style="`--customMarginLeft:${marginLeftForMainTag}px`"
   >
      <router-view></router-view>
   </main>
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
   import SideNavigationMenu from '@/components/SideNavigationMenu.vue';
   import { onMounted, ref, useTemplateRef } from 'vue';
   const sideNavigationRef = useTemplateRef('sideNavigation');
   const marginLeftForMainTag = ref(0);

   onMounted(() => {
      marginLeftForMainTag.value =
         sideNavigationRef.value?.$el?.offsetWidth || 0;
      window.addEventListener('resize', () => {
         marginLeftForMainTag.value =
            sideNavigationRef.value?.$el?.offsetWidth || 0;
      });
   });
</script>

<style scoped></style>
