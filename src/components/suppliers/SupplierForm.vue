<template>
   <div class="form">
      <form
         class="w-full space-y-6"
         @submit="onSubmit"
      >
         <FormField
            v-slot="{ componentField }"
            name="supplier_id"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mã nhà cung cấp</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mã nhà cung cấp"
                     v-bind="componentField"
                     :disabled="props.disabledInput"
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
               <FormLabel>Tên nhà cung cấp</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên nhà cung cấp"
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
            name="representative"
         >
            <FormItem v-auto-animate>
               <FormLabel>Người đại diện</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên người đại diện"
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

   import type { Supplier } from './schema';

   const formSchema = toTypedSchema(
      z.object({
         supplier_id: z
            .string({
               required_error: 'Mã nhà cung cấp không thể để trống',
            })
            .min(1, { message: 'Mã nhà cung cấp không thể để trống' }),
         name: z
            .string({
               required_error: 'Tên nhà cung cấp không thể để trống',
            })
            .min(1, { message: 'Tên nhà cung cấp không thể để trống' }),
         address: z
            .string({
               required_error: 'Địa chỉ không thể để trống',
            })
            .min(1, { message: 'Địa chỉ không thể để trống' }),
         representative: z
            .string({
               required_error: 'Người đại diện không thể để trống',
            })
            .min(1, { message: 'Người đại diện không thể để trống' }),
      })
   );

   const props = defineProps<{
      defaultValues?: Supplier;
      disabledInput?: boolean;
   }>();

   const { handleSubmit, resetForm } = useForm({
      validationSchema: formSchema,
      initialValues: props.defaultValues || null,
   });

   const emit = defineEmits({
      sendValue: (payload) => {
         if (payload) return true;
         else return false;
      },
   });

   const onSubmit = handleSubmit((values) => {
      console.log(values);
      emit('sendValue', values);
   });

   defineExpose({
      onSubmit,
      resetForm,
   });
</script>
