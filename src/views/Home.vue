<template>
   <div class="grid grid-cols-[auto_1fr] py-[52px] px-[108px] gap-x-4">
      <div class="grid gap-y-6 max-w-[580px]">
         <h1 class="font-bold text-[82px] leading-snug">
            Manage work<br />
            more easily <br />with our tools.
         </h1>
         <p class="font-semibold text-2xl">Smart sites, managed right.</p>
         <Button
            class="max-w-[240px] mt-4"
            @click="
               router.push({
                  name: 'login-view',
               })
            "
         >
            <LogIn class="w-5 h-5 mr-2" />
            Đăng nhập ngay
         </Button>
      </div>
      <div>
         <img
            src="../assets/images/HomepageImage.png"
            alt=""
         />
      </div>
   </div>
</template>

<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import { LogIn } from 'lucide-vue-next';
   import { useRouter } from 'vue-router';
   const router = useRouter();
</script>

<style scoped></style>
