<template>
   <div class="form h-full relative overflow-hidden">
      <form
         class="absolute w-full h-full overflow-hidden grid grid-cols-5 gap-x-6"
         @submit="onSubmit"
      >
         <div
            class="general col-span-2 grow overflow-hidden max-h-full flex flex-col gap-x-4"
         >
            <h1 class="text-sm font-semibold px-1">Thông tin chung</h1>
            <Separator class="mt-2 mb-4 px-1" />

            <div class="overflow-y-auto p-1">
               <div class="grid gap-y-6">
                  <!-- <FormField
                     v-slot="{ componentField }"
                     name="received_note_id"
                  >
                     <FormItem v-auto-animate>
                        <FormLabel>Mã phiếu nhập</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="Nhập mã phiếu nhập"
                              v-bind="componentField"
                              :disabled="props.disabledInput"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField> -->

                  <FormField
                     v-slot="{ componentField }"
                     name="employee_id"
                  >
                     <FormItem v-auto-animate>
                        <FormLabel>Mã nhân viên</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="Nhập mã nhân viên"
                              v-bind="componentField"
                              :disabled="props.disabledInput"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>
                  <div class="grid grid-cols-1">
                     <FormField
                        v-slot="{ componentField }"
                        name="supplier_id"
                     >
                        <FormItem>
                           <FormLabel>Nhà cung cấp</FormLabel>
                           <Select v-bind="componentField">
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue
                                       placeholder="Chọn nhà cung cấp"
                                    />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent class="max-h-[240px]">
                                 <SelectGroup>
                                    <SelectItem
                                       v-for="supplier in suppliersSelection"
                                       :value="supplier.supplier_id"
                                    >
                                       {{
                                          supplier.supplier_id +
                                          ' - ' +
                                          supplier.name
                                       }}
                                    </SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     </FormField>
                  </div>
               </div>
            </div>
         </div>

         <div
            class="details col-span-3 grow overflow-hidden max-h-full flex flex-col gap-x-4"
         >
            <h1 class="text-sm font-semibold px-1">Chi tiết phiếu nhập</h1>
            <Separator class="mt-2 mb-4" />
            <div class="overflow-y-auto mb-4 p-1">
               <div class="grid gap-y-6">
                  <ReceivedNoteDetailsForm
                     v-for="(item, index) in list"
                     @send-value="handleNoteDetailsData"
                     ref="receivedNoteDetailsFormRef"
                     :default-values="getMedicineDetails(index)"
                     :action="'update'"
                     :disabled-input="props.action === 'create' ? false : true"
                  ></ReceivedNoteDetailsForm>
               </div>
            </div>

            <span class="px-1 w-full">
               <Button
                  variant="secondary"
                  class="w-full"
                  @click="addReceivedNoteDetailsForm"
                  :disabled="props.action !== 'create'"
               >
                  <Plus class="w-5 h-5 mr-2" />
                  Thêm dòng mới
               </Button>
            </span>
         </div>

         <!-- <FormField name="received_date">
            <FormItem class="flex flex-col">
               <FormLabel>Ngày nhập</FormLabel>
               <Popover>
                  <PopoverTrigger as-child>
                     <FormControl>
                        <Button
                           variant="outline"
                           :class="
                              cn(
                                 ' w-auto ps-3 text-start font-normal',
                                 !receivedDateValue && 'text-muted-foreground'
                              )
                           "
                        >
                           <span>{{
                              receivedDateValue
                                 ? df.format(toDate(receivedDateValue))
                                 : 'Chọn ngày nhập'
                           }}</span>
                           <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                        <input hidden />
                     </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                     <Calendar
                        v-model:placeholder="receivedDatePlaceholder"
                        v-model="receivedDateValue"
                        calendar-label="Date of birth"
                        initial-focus
                        :min-value="new CalendarDate(1900, 1, 1)"
                        :max-value="today(getLocalTimeZone())"
                        @update:model-value="
                           (v) => {
                              if (v) {
                                 setFieldValue('received_date', v.toString());
                              } else {
                                 setFieldValue('received_date', undefined);
                              }
                           }
                        "
                     />
                  </PopoverContent>
               </Popover>
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
   import { Separator } from '@/components/ui/separator';
   import { Calendar } from '@/components/ui/calendar';
   import { Button } from '@/components/ui/button';
   import { Plus } from 'lucide-vue-next';
   import {
      Popover,
      PopoverContent,
      PopoverTrigger,
   } from '@/components/ui/popover';
   import { cn } from '@/lib/utils';
   import {
      CalendarDate,
      DateFormatter,
      getLocalTimeZone,
      parseDate,
      today,
   } from '@internationalized/date';
   import { Calendar as CalendarIcon } from 'lucide-vue-next';
   import { toDate } from 'radix-vue/date';
   import { Input } from '@/components/ui/input';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';

   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import * as z from 'zod';
   import {
      computed,
      onBeforeMount,
      onMounted,
      ref,
      useTemplateRef,
      watch,
   } from 'vue';

   import type { ReceivedNote } from './schema';
   import type { Supplier } from '@/components/suppliers/schema';
   import ReceivedNoteDetailsForm from '../received-notes-details/ReceivedNoteDetailsForm.vue';
   import { excelToJson } from '@/utils/data';
   import type { ReceivedNoteDetails } from '../received-notes-details/schema';
   import SupplierService from '@/services/SupplierService';
   import ReceivedNoteService from '@/services/ReceivedNoteService';
   import { useToast } from '@/components/ui/toast/use-toast';
   import { getCurrentLogin } from '@/utils/currentLogin';
   import ReceivedNoteDetailsService from '@/services/ReceivedNoteDetailsService';
   import MedicineService from '@/services/MedicineService';
   const { toast } = useToast();

   const df = new DateFormatter('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
   });

   const suppliersSelection = ref<Supplier[]>([]);

   async function getSuppliersData(): Promise<Supplier[]> {
      return (await SupplierService.getAllSuppliers()).data;
   }

   const formSchema = toTypedSchema(
      z.object({
         // received_note_id: z
         //    .string({
         //       required_error: 'Mã phiếu nhập không thể để trống',
         //    })
         //    .min(1, { message: 'Mã phiếu nhập không thể để trống' }),
         employee_id: z
            .string({
               required_error: 'Mã nhân viên không thể để trống',
            })
            .min(1, { message: 'Mã nhân viên không thể để trống' }),
         supplier_id: z
            .string({
               required_error: 'Mã nhà cung cấp không thể để trống',
            })
            .min(1, { message: 'Mã nhà cung cấp không thể để trống' }),
         // received_date: z
         //    .string({
         //       required_error: 'Vui lòng chọn ngày nhập',
         //    })
         //    .refine((v) => v, { message: 'Vui lòng chọn ngày nhập' }),
      })
   );

   const props = defineProps<{
      defaultValues?: ReceivedNote;
      initNumOfDetailsForm?: number;
      disabledInput?: boolean;
      action?: string;
   }>();

   const { handleSubmit, setFieldValue, values, resetForm } = useForm({
      validationSchema: formSchema,
      initialValues: props.defaultValues || null,
   });

   const emit = defineEmits({
      sendValue: (payload) => {
         if (payload) return true;
         else return false;
      },
   });

   // const receivedDatePlaceholder = ref();
   // const receivedDateValue = computed({
   //    get: () =>
   //       values.received_date ? parseDate(values.received_date) : undefined,
   //    set: (val) => val,
   // });

   const list = ref<number[]>([]);
   const addReceivedNoteDetailsForm = () => {
      list.value.push(1);
   };
   const itemRefs = useTemplateRef('receivedNoteDetailsFormRef');

   const receivedNoteDetailsFormRef = ref<InstanceType<
      typeof ReceivedNoteDetailsForm
   > | null>(null);

   const onSubmitDetails = async () => {
      localStorage.removeItem('receivedNoteDetails');
      if (itemRefs.value) {
         itemRefs.value.forEach((ref) => {
            ref?.onSubmit();
         });
      }
   };

   const saveToLocalStorage = (values) => {
      const existingData = localStorage.getItem('receivedNoteDetails');

      if (!existingData) {
         localStorage.setItem('receivedNoteDetails', JSON.stringify([values]));
      } else {
         const dataArray = JSON.parse(existingData);

         dataArray.push(values);

         localStorage.setItem('receivedNoteDetails', JSON.stringify(dataArray));
      }
   };
   localStorage.removeItem('receivedNoteDetails');

   const handleNoteDetailsData = async (values) => {
      saveToLocalStorage(values);

      try {
         if (props.action === 'create') {
            console.log('create details');
         } else if (props.action === 'update') {
            console.log('update details');
         }
      } catch (error) {
         toast({
            description: 'Xảy ra lỗi không xác định.',
            variant: 'destructive',
         });
      }
   };

   interface DataFromNoteDetails {
      medicine_id: string;
      quantity: number;
      price: number;
   }

   const getMedicineDetails = (index: number) => {
      if (props.defaultValues?.details[index]) {
         console.log(props.defaultValues?.details[index]);
         console.log(list.value.length);
         return props.defaultValues?.details[index];
      } else return undefined;
   };

   const onSubmit = handleSubmit(async (values) => {
      try {
         await onSubmitDetails();
         const handleValues: ReceivedNote = {
            ...values,
            received_note_id: '123',
            received_date: toDate(today(getLocalTimeZone())).toLocaleDateString(
               'en-CA'
            ),
         };
         if (props.action === 'create') {
            console.log('create');
            const newNoteId = (await ReceivedNoteService.create(handleValues))
               .received_note_id;

            const receivedNoteDetailsData = JSON.parse(
               localStorage.getItem('receivedNoteDetails')
            );

            if (receivedNoteDetailsData) {
               receivedNoteDetailsData.forEach(async (detail) => {
                  const finalDetail = {
                     ...detail,
                     received_note_id: newNoteId,
                  };
                  const currentMedicine = await MedicineService.getMedicine(
                     detail.medicine_id
                  );

                  const currentQuantity = currentMedicine.quantity;

                  if (!currentQuantity || currentQuantity === 0) {
                     await MedicineService.updateMedicine(detail.medicine_id, {
                        ...currentMedicine,
                        quantity: detail.quantity,
                     });
                  } else if (currentQuantity > 0) {
                     await MedicineService.updateMedicine(detail.medicine_id, {
                        ...currentMedicine,
                        quantity: currentQuantity + detail.quantity,
                     });
                  }

                  await ReceivedNoteDetailsService.create(finalDetail);
               });
            } else
               throw {
                  message: 'Missing details',
               };

            emit('sendValue', handleValues);
            toast({
               description: 'Đã thêm phiếu nhập mới.',
               class: 'bg-emerald-600 text-white',
            });
            resetForm();
         } else if (props.action === 'update') {
            console.log('update');
            handleValues.received_note_id =
               props.defaultValues?.received_note_id;
            await ReceivedNoteService.updateNote(
               props.defaultValues?.received_note_id,
               handleValues
            );

            const receivedNoteDetailsData = JSON.parse(
               localStorage.getItem('receivedNoteDetails')
            );

            console.log(receivedNoteDetailsData);
            const updatedNoteId = props.defaultValues?.received_note_id;
            console.log(props.defaultValues);

            console.log(receivedNoteDetailsData);
            if (receivedNoteDetailsData) {
               receivedNoteDetailsData.forEach(async (detail, index) => {
                  const currentMedicine = await MedicineService.getMedicine(
                     detail.medicine_id
                  );
                  const quantityBeforeUpdate =
                     props.defaultValues.details[index].quantity;
                  const quantityAfterUpdate = detail.quantity;
                  console.log(
                     currentMedicine.quantity,
                     quantityBeforeUpdate,
                     quantityAfterUpdate
                  );

                  await MedicineService.updateMedicine(detail.medicine_id, {
                     ...currentMedicine,
                     quantity:
                        currentMedicine.quantity -
                        quantityBeforeUpdate +
                        quantityAfterUpdate,
                  });
                  const finalDetail = {
                     ...detail,
                     received_note_id: updatedNoteId,
                  };

                  console.log(detail);
                  console.log('create');
                  await ReceivedNoteDetailsService.updateNote(
                     updatedNoteId,
                     detail.medicine_id,
                     finalDetail
                  );
               });
            } else
               throw {
                  message: 'Missing details',
               };

            emit('sendValue', handleValues);
            toast({
               description: `Cập nhật thông tin phiếu nhập có mã ${updatedNoteId} thành công.`,
               class: 'bg-emerald-600 text-white',
            });
         }
      } catch (error: any) {
         console.log(error);
         if (error.message === 'Missing details') {
            toast({
               description: 'Chi tiết phiếu nhập không thể để trống',
               variant: 'destructive',
            });
         }
      }
   });

   watch(
      () => props.initNumOfDetailsForm,
      () => {
         list.value = Array.from(
            { length: props.initNumOfDetailsForm as number },
            (_, index) => index + 1
         );
      }
   );

   onMounted(async () => {
      list.value = Array.from(
         { length: props.initNumOfDetailsForm as number },
         (_, index) => index + 1
      );
      suppliersSelection.value = await getSuppliersData();
   });

   defineExpose({
      onSubmit,
      resetForm,
   });
</script>
