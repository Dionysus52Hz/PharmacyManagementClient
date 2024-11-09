<template>
   <div class="form">
      <form
         class="w-full space-y-6"
         @submit="onSubmit"
      >
         <FormField
            v-slot="{ componentField }"
            name="customer_id"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mã khách hàng</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mã khách hàng"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="name"
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
      </form>
   </div>
</template>

<script setup lang="ts">
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

   import type { Customer } from './schema';

   const formSchema = toTypedSchema(
      z.object({
         customer_id: z
            .string({
               required_error: 'Mã khách hàng không thể để trống',
            })
            .min(1, { message: 'Mã khách hàng không thể để trống' }),
         name: z
            .string({
               required_error: 'Họ và tên không thể để trống',
            })
            .min(1, { message: 'Họ và tên không thể để trống' }),
         address: z
            .string({
               required_error: 'Địa chỉ không thể để trống',
            })
            .min(1, { message: 'Địa chỉ không thể để trống' }),
         phone: z
            .string({
               required_error: 'Số điện thoại không thể để trống',
            })
            .min(1, { message: 'Số điện thoại không thể để trống' }),
      })
   );

   const props = defineProps<{
      defaultValues?: Customer;
   }>();

   const { handleSubmit } = useForm({
      validationSchema: formSchema,
      initialValues: props.defaultValues || null,
   });

   const onSubmit = handleSubmit((values) => {
      console.log(values);
   });

   defineExpose({
      onSubmit,
   });
</script>
