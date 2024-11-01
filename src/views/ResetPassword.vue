<template>
   <div class="grid grid-cols-2 gap-x-4 h-fit pt-[52px]">
      <div
         class="photo w-[420px] rounded-lg flex items-center place-self-end h-full"
      >
         <img
            src="../assets/images/ForgotPassword.png"
            alt=""
            class="object-cover object-center"
         />
      </div>

      <div
         v-if="!showVerificationCodeForm"
         class="w-[360px] flex flex-col px-3 gap-y-8"
      >
         <div class="form-title flex flex-col gap-y-2.5">
            <div
               class="logo bg-gray-200 w-[80px] aspect-square rounded-lg"
            ></div>
            <span class="font-semibold text-2xl">Đặt lại mật khẩu. </span>
            <span>Nhập địa chỉ email bạn dùng để đăng ký</span>
         </div>

         <div class="enter-email-form">
            <form
               class="w-full space-y-6"
               @submit="onSubmitEmailForm"
            >
               <FormField
                  v-slot="{ componentField }"
                  name="email"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Email</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="example@gmail.com"
                           v-bind="componentField"
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               </FormField>

               <Button
                  type="submit"
                  class="w-full"
               >
                  Đặt lại mật khẩu
               </Button>
            </form>

            <RouterLink
               :to="{
                  name: 'login-view',
               }"
            >
               <Button
                  variant="ghost"
                  class="w-full gap-x-2 mt-2"
               >
                  <ArrowLeft class="w-5 h-5" /> Trở lại đăng nhập
               </Button>
            </RouterLink>
         </div>
      </div>

      <div
         v-if="showVerificationCodeForm"
         class="w-[360px] flex flex-col px-3 gap-y-8"
      >
         <div class="form-title flex flex-col gap-y-2.5">
            <div
               class="logo bg-gray-200 w-[80px] aspect-square rounded-lg"
            ></div>
            <span class="font-semibold text-2xl">Nhập mã xác nhận. </span>
            <span
               >Chúng tôi đã gửi một mã xác nhận đến địa chỉ
               <strong>{{ userEmail }}</strong>
            </span>
         </div>

         <div class="verification-code-form">
            <VerificationCodeForm></VerificationCodeForm>

            <Button
               variant="ghost"
               class="w-full gap-x-2 mt-2"
               @click="showVerificationCodeForm = false"
            >
               <ArrowLeft class="w-5 h-5" /> Quay lại
            </Button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import {
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
   } from '@/components/ui/form';
   import { Input } from '@/components/ui/input';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';
   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import * as z from 'zod';
   import { ArrowLeft } from 'lucide-vue-next';
   import { ref } from 'vue';
   import VerificationCodeForm from '@/components/VerificationCodeForm.vue';

   const emailFormSchema = toTypedSchema(
      z.object({
         email: z
            .string({ required_error: 'Email không thể để trống' })
            .min(1, { message: 'Email không thể để trống' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
      })
   );

   const emailForm = useForm({
      validationSchema: emailFormSchema,
   });

   const showVerificationCodeForm = ref(false);
   const userEmail = ref('');
   const onSubmitEmailForm = emailForm.handleSubmit((values) => {
      console.log(values);
      userEmail.value = values?.email;
      showVerificationCodeForm.value = true;
   });
</script>

<style scoped></style>
