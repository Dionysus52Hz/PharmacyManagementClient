<template>
   <div
      class="form"
      v-if="!isDelete"
   >
      <form
         class="w-full grid grid-cols-[1fr_1fr_1fr_40px] gap-x-4"
         @submit="onSubmit"
      >
         <div class="grid grid-cols-1">
            <FormField
               v-slot="{ componentField }"
               name="medicine_id"
            >
               <FormItem class="col-span-1">
                  <FormLabel>Thuốc</FormLabel>
                  <Select v-bind="componentField">
                     <FormControl>
                        <SelectTrigger>
                           <SelectValue placeholder="Chọn thuốc" />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent class="max-h-[240px]">
                        <SelectGroup>
                           <SelectItem
                              v-for="medicine in medicineSelection"
                              :value="medicine.medicine_id"
                           >
                              {{ medicine.medicine_id + ' - ' + medicine.name }}
                           </SelectItem>
                        </SelectGroup>
                     </SelectContent>
                  </Select>
                  <FormMessage />
               </FormItem>
            </FormField>
         </div>

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
            name="price"
            v-slot="{ value }"
         >
            <FormItem v-auto-animate>
               <FormLabel>Đơn giá</FormLabel>

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

         <TooltipProvider :delay-duration="400">
            <Tooltip>
               <TooltipTrigger
                  as-child
                  class="mt-8"
               >
                  <Button
                     variant="outline"
                     size="icon"
                     class=""
                     @click="deleteForm"
                  >
                     <Trash class="w-5 h-5" />
                  </Button>
               </TooltipTrigger>
               <TooltipContent class="bg-primary text-white outline-none">
                  <p>Xoá dòng này</p>
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>
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
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
   } from '@/components/ui/tooltip';
   import {
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
   } from '@/components/ui/number-field';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';

   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import * as z from 'zod';
   import { computed, onMounted, ref } from 'vue';
   import { Trash } from 'lucide-vue-next';

   import type { ReceivedNoteDetails } from './schema';
   import type { Medicine } from '@/components/medicine/schema';
   import { excelToJson } from '@/utils/data';

   const medicineSelection = ref<Medicine[]>([]);

   async function getMedicineData(): Promise<Medicine[]> {
      return await excelToJson(excelURL, 'Medicine');
   }

   const excelURL = 'src/Database.xlsx';
   onMounted(async () => {
      medicineSelection.value = await getMedicineData();
   });

   const formSchema = toTypedSchema(
      z.object({
         medicine_id: z.string({
            required_error: 'Vui lòng chọn thuốc',
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
      defaultValues?: {
         medicine_id: string;
         quantity: number;
         price: number;
      };
   }>();

   const emit = defineEmits({
      sendValue: (payload) => {
         if (payload) return true;
         else return false;
      },
   });

   const { handleSubmit, setFieldValue } = useForm({
      validationSchema: formSchema,
      initialValues: props.defaultValues || null,
   });

   const onSubmit = handleSubmit((values) => {
      emit('sendValue', values);
   });

   const isDelete = ref(false);
   const deleteForm = () => {
      isDelete.value = true;
   };

   defineExpose({
      onSubmit,
      deleteForm,
   });
</script>
