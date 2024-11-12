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
                        <div class="relative items-center">
                           <Input
                              class="relative"
                              :type="
                                 passwordInputState === 'show'
                                    ? 'text'
                                    : 'password'
                              "
                              placeholder="Nhập mật khẩu"
                              v-bind="componentField"
                           />
                           <span
                              class="absolute end-0 inset-y-0 flex items-center justify-center px-3 cursor-pointer"
                           >
                              <Eye
                                 v-if="passwordInputState === 'show'"
                                 @click="passwordInputState = 'hide'"
                                 class="size-6 text-muted-foreground"
                              />
                              <EyeClosed
                                 v-if="passwordInputState === 'hide'"
                                 @click="passwordInputState = 'show'"
                                 class="size-6 text-muted-foreground"
                              />
                           </span>
                        </div>
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
                  name="phoneNumber"
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
                  Đăng ký
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

   import { useToast } from 'vue-toastification';
   import { useRouter } from 'vue-router';
   import { Eye, EyeClosed } from 'lucide-vue-next';
   import { ref } from 'vue';
   const passwordInputState = ref<'show' | 'hide'>('hide');

   const router = useRouter();

   const formSchema = toTypedSchema(
      z.object({
         username: z
            .string({ required_error: 'Tên đăng nhập không thể để trống' })
            .min(2, { message: 'Tên đăng nhập phải chứa ít nhất 2 ký tự' })
            .max(50, { message: 'Tên đăng nhập chứa tối đa 50 ký tự' }),
         password: z
            .string({ required_error: 'Mật khẩu không thể để trống' })
            .regex(
               /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
               {
                  message:
                     'Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một số và một ký tự đặc biệt',
               }
            ),
         fullname: z
            .string({ required_error: 'Họ và tên không thể để trống' })
            .min(2, { message: 'Họ và tên phải chứa ít nhất 2 ký tự' }),
         address: z
            .string({ required_error: 'Địa chỉ không thể để trống' })
            .min(6, { message: 'Địa chỉ phải chứa ít nhất 6 ký tự' }),
         phoneNumber: z
            .string({ required_error: 'Số điện thoại không thể để trống' })
            .regex(/^0[3579]\d{8}$/, {
               message:
                  'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và số thứ 2 là 3, 5, 7 hoặc 9)',
            }),
      })
   );

   const { handleSubmit } = useForm({
      validationSchema: formSchema,
   });

   const onSubmit = handleSubmit(async (values) => {
      try {
         const response = await fetch(
            'http://localhost:3001/api/user/register',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(values),
            }
         );
         const toast = useToast();

         const data = await response.json();
         console.log('dataRegister: ', data);
         if (!data.success) {
            toast.error(data.message);
            return;
         }
         toast.success('Đăng ký tài khoản thành công!');
         router.push('/login');
      } catch (error: any) {
         console.error('Error:', error);
         alert(error.message || 'Đăng ký thất bại.');
      }
   });
</script>

<style scoped></style>
