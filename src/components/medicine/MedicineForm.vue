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
                     :disabled="props.disabledInput"
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
                        <SelectItem
                           v-for="manufacturer in manufacturersSelection"
                           :value="manufacturer.manufacturer_id"
                        >
                           {{
                              manufacturer.manufacturer_id +
                              ' - ' +
                              manufacturer.name
                           }}
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
                        <SelectItem
                           v-for="supplier in suppliersSelection"
                           :value="supplier.supplier_id"
                        >
                           {{ supplier.supplier_id + ' - ' + supplier.name }}
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
                        <SelectItem
                           v-for="category in medicineCategoriesSelection"
                           :value="category.category_id"
                        >
                           {{ category.category_id + ' - ' + category.name }}
                        </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ value }"
            name="quantity"
         >
            <FormItem v-auto-animate>
               <FormLabel>Số lượng</FormLabel>

               <NumberField
                  class="gap-2"
                  :min="1"
                  :model-value="value"
                  @update:model-value="
                     (v) => {
                        if (v) {
                           setFieldValue('quantity', v);
                        } else {
                           setFieldValue('quantity', undefined);
                        }
                     }
                  "
               >
                  <NumberFieldContent>
                     <NumberFieldDecrement />
                     <FormControl>
                        <NumberFieldInput />
                     </FormControl>
                     <NumberFieldIncrement />
                  </NumberFieldContent>
               </NumberField>

               <FormMessage />
            </FormItem>
         </FormField>

         <FormField
            v-slot="{ value }"
            name="price"
         >
            <FormItem v-auto-animate>
               <FormLabel>Giá</FormLabel>

               <NumberField
                  class="gap-2"
                  :min="1"
                  :model-value="value"
                  @update:model-value="
                     (v) => {
                        if (v) {
                           setFieldValue('price', v);
                        } else {
                           setFieldValue('price', undefined);
                        }
                     }
                  "
               >
                  <NumberFieldContent>
                     <NumberFieldDecrement />
                     <FormControl>
                        <NumberFieldInput />
                     </FormControl>
                     <NumberFieldIncrement />
                  </NumberFieldContent>
               </NumberField>

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
   import {
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
   } from '@/components/ui/number-field';
   import { Input } from '@/components/ui/input';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';

   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import * as z from 'zod';
   import { onMounted, ref } from 'vue';

   import type { Medicine } from './schema';
   import type { Manufacturer } from '@/components/manufacturers/schema';
   import type { Supplier } from '@/components/suppliers/schema';
   import type { MedicineCategory } from '@/components/medicine-categories/schema';
   import { excelToJson } from '@/utils/data';

   const manufacturersSelection = ref<Manufacturer[]>([]);
   const suppliersSelection = ref<Supplier[]>([]);
   const medicineCategoriesSelection = ref<MedicineCategory[]>([]);

   async function getManufacturersData(): Promise<Manufacturer[]> {
      return await excelToJson(excelURL, 'Manufacturers');
   }
   async function getSuppliersData(): Promise<Supplier[]> {
      return await excelToJson(excelURL, 'Suppliers');
   }
   async function getMedicineCategoriesData(): Promise<MedicineCategory[]> {
      return await excelToJson(excelURL, 'Medicine_Categories');
   }

   const excelURL = 'src/Database.xlsx';
   onMounted(async () => {
      manufacturersSelection.value = await getManufacturersData();
      suppliersSelection.value = await getSuppliersData();
      medicineCategoriesSelection.value = await getMedicineCategoriesData();

      console.log(manufacturersSelection.value);
      console.log(suppliersSelection.value);
   });

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
         quantity: z
            .number({
               required_error: 'Số lượng không thể để trống',
               invalid_type_error: 'Số lượng không hợp lệ',
            })
            .min(1, { message: 'Số lượng phải lớn hơn 0' }),
         price: z
            .number({
               required_error: 'Đơn giá không thể để trống',
               invalid_type_error: 'Đơn giá không hợp lệ',
            })
            .min(1, { message: 'Đơn giá phải lớn hơn 0' }),
      })
   );

   const props = defineProps<{
      defaultValues?: Medicine;
      disabledInput?: boolean;
   }>();

   const { handleSubmit, setFieldValue, resetForm } = useForm({
      validationSchema: formSchema,
      initialValues: props.defaultValues || null,
   });

   const emit = defineEmits({
      sendValue: (payload) => {
         if (payload) return true;
         else return false;
      },
   });

   const onSubmit = handleSubmit(async (values) => {
      emit('sendValue', values);
   });

   defineExpose({
      onSubmit,
      resetForm,
   });
</script>
