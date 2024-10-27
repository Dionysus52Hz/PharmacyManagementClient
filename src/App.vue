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
   <SideNavigationMenu></SideNavigationMenu>
   <!-- <Medicine></Medicine> -->
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
   import Medicine from '@/views/Medicine.vue';
</script>

<style scoped></style>
