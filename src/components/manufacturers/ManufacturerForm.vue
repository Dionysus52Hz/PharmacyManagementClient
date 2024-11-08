<template>
   <div class="form">
      <form
         class="w-full space-y-6"
         @submit="onSubmit"
      >
         <FormField
            v-slot="{ componentField }"
            name="manufacturer_id"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mã hãng sản xuất</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mã hãng sản xuất"
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
               <FormLabel>Tên hãng sản xuất</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên hãng sản xuất"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="nation"
         >
            <FormItem v-auto-animate>
               <FormLabel>Quốc gia</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên quốc gia"
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

   import type { Manufacturer } from './schema';

   const formSchema = toTypedSchema(
      z.object({
         manufacturer_id: z
            .string({
               required_error: 'Mã hãng sản xuất không thể để trống',
            })
            .min(1, { message: 'Mã hãng sản xuất không thể để trống' }),
         name: z
            .string({
               required_error: 'Tên hãng sản xuất không thể để trống',
            })
            .min(1, { message: 'Mã hãng sản xuất không thể để trống' }),
         nation: z
            .string({
               required_error: 'Quốc gia không thể để trống',
            })
            .min(1, { message: 'Quốc gia không thể để trống' }),
      })
   );

   const props = defineProps<{
      defaultValues?: Manufacturer;
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
