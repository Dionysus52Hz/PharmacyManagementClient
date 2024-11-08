<template>
   <div class="form">
      <form
         class="w-full space-y-6"
         @submit="onSubmit"
      >
         <FormField
            v-slot="{ componentField }"
            name="medicine_id"
         >
            <FormItem v-auto-animate>
               <FormLabel>Mã thuốc</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập mã thuốc"
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
               <FormLabel>Tên thuốc</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập tên thuốc"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="manufacturer_id"
         >
            <FormItem>
               <FormLabel>Hãng sản xuất</FormLabel>

               <Select v-bind="componentField">
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn hãng sản xuất" />
                     </SelectTrigger>
                  </FormControl>

                  <SelectContent class="max-h-[240px]">
                     <SelectGroup>
                        <SelectItem value="est">
                           Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                           Central Standard Time (CST)
                        </SelectItem>
                        <SelectItem value="mst">
                           Mountain Standard Time (MST)
                        </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="supplier_id"
         >
            <FormItem>
               <FormLabel>Nhà cung cấp</FormLabel>

               <Select v-bind="componentField">
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn nhà cung cấp" />
                     </SelectTrigger>
                  </FormControl>

                  <SelectContent class="max-h-[240px]">
                     <SelectGroup>
                        <SelectItem value="est">
                           Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                           Central Standard Time (CST)
                        </SelectItem>
                        <SelectItem value="mst">
                           Mountain Standard Time (MST)
                        </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="effects"
         >
            <FormItem v-auto-animate>
               <FormLabel>Công dụng</FormLabel>

               <FormControl>
                  <Input
                     type="text"
                     placeholder="Nhập công dụng"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ componentField }"
            name="category_id"
         >
            <FormItem>
               <FormLabel>Loại thuốc</FormLabel>

               <Select v-bind="componentField">
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thuốc" />
                     </SelectTrigger>
                  </FormControl>

                  <SelectContent class="max-h-[240px]">
                     <SelectGroup>
                        <SelectItem value="est">
                           Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                           Central Standard Time (CST)
                        </SelectItem>
                        <SelectItem value="mst">
                           Mountain Standard Time (MST)
                        </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>

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
   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';
   import { Input } from '@/components/ui/input';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';

   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import * as z from 'zod';

   import type { Medicine } from './schema';

   const formSchema = toTypedSchema(
      z.object({
         medicine_id: z
            .string({
               required_error: 'Mã thuốc không thể để trống',
            })
            .min(1, { message: 'Mã thuốc không thể để trống' }),
         name: z
            .string({
               required_error: 'Tên thuốc không thể để trống',
            })
            .min(1, { message: 'Mã thuốc không thể để trống' }),
         manufacturer_id: z.string({
            required_error: 'Vui lòng chọn hãng sản xuất',
         }),
         supplier_id: z.string({
            required_error: 'Vui lòng chọn nhà cung cấp',
         }),
         effects: z
            .string({
               required_error: 'Công dụng không thể để trống',
            })
            .min(1, { message: 'Công dụng không thể để trống' }),
         category_id: z.string({
            required_error: 'Vui lòng chọn loại thuốc',
         }),
      })
   );

   const props = defineProps<{
      defaultValues?: Medicine;
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
