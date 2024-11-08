<template>
   <div class="form">
      <form
         class="w-full space-y-6"
         @submit="onSubmit"
      >
         <FormField
            v-slot="{ componentField }"
            name="category_id"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mã loại thuốc</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mã loại thuốc"
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
               <FormLabel>Tên loại thuốc</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên loại thuốc"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="description"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mô tả</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mô tả"
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

   import type { MedicineCategory } from './schema';

   const formSchema = toTypedSchema(
      z.object({
         category_id: z
            .string({
               required_error: 'Mã loại thuốc không thể để trống',
            })
            .min(1, { message: 'Mã loại thuốc không thể để trống' }),
         name: z
            .string({
               required_error: 'Tên loại thuốc không thể để trống',
            })
            .min(1, { message: 'Tên loại thuốc không thể để trống' }),
         description: z
            .string({
               required_error: 'Mô tả không thể để trống',
            })
            .min(1, { message: 'Mô tả không thể để trống' }),
      })
   );

   const props = defineProps<{
      defaultValues?: MedicineCategory;
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
