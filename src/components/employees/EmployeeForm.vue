<template>
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
                     :disabled="props.disabledInput"
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
                     placeholder="Nguyễn Văn A"
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
                     placeholder="Số nhà, tên đường, quận,..."
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
                     placeholder="0xxxxxxxxx"
                     v-bind="componentField"
                  />
               </FormControl>

               <FormMessage />
            </FormItem>
         </FormField>

         <!-- <FormField
            v-slot="{ componentField }"
            name="role"
         >
            <FormItem>
               <FormLabel>Quyền hạn</FormLabel>

               <Select v-bind="componentField">
                  <FormControl>
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn quyền cho tài khoản" />
                     </SelectTrigger>
                  </FormControl>

                  <SelectContent class="max-h-[240px]">
                     <SelectGroup>
                        <SelectItem value="admin"> Quản lý </SelectItem>

                        <SelectItem value="staff"> Nhân viên </SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>

               <FormMessage />
            </FormItem>
         </FormField> -->
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

   import type { Employee } from './schema';
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
         username: z
            .string({
               required_error: 'Tên đăng nhập không thể để trống',
            })
            .min(1, { message: 'Tên đăng nhập không thể để trống' }),
         fullname: z
            .string({
               required_error: 'Họ và tên không thể để trống',
            })
            .min(1, { message: 'Họ và tên không thể để trống' }),
         address: z
            .string({
               required_error: 'Địa chỉ không thể để trống',
            })
            .min(1, { message: 'Địa chỉ không thể để trống' }),
         phoneNumber: z
            .string({
               required_error: 'Số điện thoại không thể để trống',
            })
            .min(1, { message: 'Số điện thoại không thể để trống' }),
         // role: z.string({
         //    required_error: 'Vui lòng chọn quyền cho tài khoản',
         // }),
      })
   );

   const props = defineProps<{
      defaultValues?: Employee;
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
      if (props.defaultValues) {
         values = { ...values, employee_id: props.defaultValues.employee_id };
      }
      console.log(values);
      emit('sendValue', values);
   });

   defineExpose({
      onSubmit,
      resetForm,
   });
</script>
