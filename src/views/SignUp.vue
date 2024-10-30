<template>
   <div class="grid grid-cols-2 gap-x-4 h-fit pt-[52px]">
      <div
         class="photo w-[500px] h-full rounded-lg place-self-end flex items-center"
      >
         <img
            src="../assets/images/Signup.png"
            alt=""
            class="object-cover"
         />
      </div>
      <div class="w-[360px] flex flex-col px-3 gap-y-8">
         <div class="form-title flex flex-col gap-y-2.5">
            <div
               class="logo bg-gray-200 w-[80px] aspect-square rounded-lg"
            ></div>
            <span class="font-semibold text-2xl">Chào mừng bạn. </span>
            <span>Đăng ký tài khoản mới</span>
         </div>

         <div class="form">
            <form
               class="w-full space-y-6"
               @submit="onSubmit"
            >
               <FormField
                  v-slot="{ componentField }"
                  name="username"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Tên đăng nhập</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="Nhập tên đăng nhập"
                           v-bind="componentField"
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               </FormField>

               <FormField
                  v-slot="{ componentField }"
                  name="password"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Mật khẩu</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="Nhập mật khẩu"
                           v-bind="componentField"
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               </FormField>

               <FormField
                  v-slot="{ componentField }"
                  name="fullname"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Họ và tên</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="Nhập họ và tên"
                           v-bind="componentField"
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               </FormField>

               <FormField
                  v-slot="{ componentField }"
                  name="address"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Địa chỉ</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="Nhập địa chỉ"
                           v-bind="componentField"
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               </FormField>

               <FormField
                  v-slot="{ componentField }"
                  name="phone"
               >
                  <FormItem v-auto-animate>
                     <FormLabel>Số điện thoại</FormLabel>

                     <FormControl>
                        <Input
                           type="text"
                           placeholder="Nhập số điện thoại"
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
                  Đăng nhập
               </Button>
            </form>

            <div
               class="alternative-option flex justify-center gap-x-2 text-sm mt-6"
            >
               <span>Đã có tài khoản?</span>
               <RouterLink
                  :to="{
                     name: 'login-view',
                  }"
               >
                  <span class="font-semibold">Đăng nhập</span>
               </RouterLink>
            </div>
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

   const formSchema = toTypedSchema(
      z.object({
         username: z
            .string({ required_error: 'Tên đăng nhập không thể để trống' })
            .min(2, { message: 'Tên đăng nhập phải chứa ít nhất 2 ký tự' })
            .max(50, { message: 'Tên đăng nhập chứa tối đa 50 ký tự' }),
         password: z
            .string({ required_error: 'Mật khẩu không thể để trống' })
            .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
         fullname: z
            .string({ required_error: 'Họ và tên không thể để trống' })
            .min(2, { message: 'Họ và tên phải chứa ít nhất 2 ký tự' }),
         address: z
            .string({ required_error: 'Địa chỉ không thể để trống' })
            .min(6, { message: 'Địa chỉ phải chứa ít nhất 6 ký tự' }),
         phone: z
            .string({ required_error: 'Số điện thoại không thể để trống' })
            .length(10, { message: 'Số điện thoại không hợp lệ' }),
      })
   );

   const { handleSubmit } = useForm({
      validationSchema: formSchema,
   });

   const onSubmit = handleSubmit((values) => {
      console.log(values);
   });
</script>

<style scoped></style>
