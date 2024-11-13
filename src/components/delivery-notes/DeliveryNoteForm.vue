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
                     name="delivery_note_id"
                  >
                     <FormItem v-auto-animate>
                        <FormLabel>Mã phiếu xuất</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="Nhập mã phiếu"
                              v-bind="componentField"
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

                  <FormField
                     v-slot="{ componentField }"
                     name="customer_name"
                  >
                     <FormItem v-auto-animate>
                        <FormLabel>Họ tên khách hàng</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="Nguyễn Văn A"
                              v-bind="componentField"
                              v-bind:model-value="defaultValue?.customer_name"
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
                        <FormLabel>Số điện thoại khách hàng</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="0xxxxxxxxx"
                              v-bind="componentField"
                              v-bind:model-value="defaultValue?.phone"
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
                        <FormLabel>Địa chỉ khách hàng</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="Số nhà, tên đường, quận,..."
                              v-bind="componentField"
                              v-bind:model-value="props.defaultValues?.address"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  </FormField>
               </div>
            </div>
         </div>

         <div
            class="details col-span-3 grow overflow-hidden max-h-full flex flex-col gap-x-4"
         >
            <h1 class="text-sm font-semibold px-1">Chi tiết phiếu xuất</h1>
            <Separator class="mt-2 mb-4" />
            <div class="overflow-y-auto mb-4 p-1">
               <div
                  class="grid gap-y-6"
                  v-if="props.action !== 'update'"
               >
                  <DeliveryNoteDetailsForm
                     v-for="(item, index) in list"
                     @send-value="handleNoteDetailsData"
                     ref="deliveryNoteDetailsFormRef"
                     :default-values="getMedicineDetails(index)"
                     :action="'update'"
                     :disabled-input="props.action === 'create' ? false : true"
                  ></DeliveryNoteDetailsForm>
               </div>
               <div
                  class="grid gap-y-6"
                  v-if="props.action === 'update'"
               >
                  <DeliveryNoteDetailsFormForUpdate
                     v-for="(item, index) in list"
                     @send-value="handleNoteDetailsData"
                     ref="deliveryNoteDetailsFormRef"
                     :default-values="getMedicineDetails(index)"
                     :action="'update'"
                     :disabled-input="props.action === 'create' ? false : true"
                  ></DeliveryNoteDetailsFormForUpdate>
               </div>
            </div>

            <span class="px-1 w-full">
               <Button
                  variant="secondary"
                  class="w-full"
                  @click="addDeliveryNoteDetailsForm"
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

   import type { DeliveryNote } from './schema';
   import type { Supplier } from '@/components/suppliers/schema';
   import ReceivedNoteDetailsForm from '../received-notes-details/ReceivedNoteDetailsForm.vue';
   import { excelToJson } from '@/utils/data';
   import DeliveryNoteDetailsForm from '../delivery-note-details/DeliveryNoteDetailsForm.vue';
   import DeliveryNoteDetailsFormForUpdate from '../delivery-note-details/DeliveryNoteDetailsFormForUpdate.vue';
   import SupplierService from '@/services/SupplierService';
   import DeliveryNoteService from '@/services/DeliveryNoteService';
   import { useToast } from '@/components/ui/toast/use-toast';
   import { getCurrentLogin } from '@/utils/currentLogin';
   import DeliveryNoteDetailsService from '@/services/DeliveryNoteDetailsService';
   import MedicineService from '@/services/MedicineService';
   import CustomerService from '@/services/CustomerService';
   const { toast } = useToast();

   const df = new DateFormatter('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
   });

   const formSchema = toTypedSchema(
      z.object({
         // delivery_note_id: z
         //    .string({
         //       required_error: 'Mã phiếu xuất không thể để trống',
         //    })
         //    .min(1, { message: 'Mã phiếu xuất không thể để trống' }),
         employee_id: z
            .string({
               required_error: 'Mã nhân viên không thể để trống',
            })
            .min(1, { message: 'Mã nhân viên không thể để trống' }),
         customer_name: z
            .string({
               required_error: 'Tên khách hàng không thể để trống',
            })
            .min(1, { message: 'Tên khách hàng không thể để trống' }),
         phone: z
            .string({
               required_error: 'SĐT khách hàng không thể để trống',
            })
            .min(1, { message: 'SĐT khách hàng không thể để trống' }),
         address: z
            .string({
               required_error: 'Địa chỉ khách hàng không thể để trống',
            })
            .min(1, { message: 'Địa chỉ khách hàng không thể để trống' }),
         // received_date: z
         //    .string({
         //       required_error: 'Vui lòng chọn ngày nhập',
         //    })
         //    .refine((v) => v, { message: 'Vui lòng chọn ngày nhập' }),
      })
   );

   interface DefaultValueForForm {
      customer_name: string;
      phone: string;
      address: string;
   }

   const props = defineProps<{
      defaultValues?: DefaultValueForForm;
      initNumOfDetailsForm?: number;
      disabledInput?: boolean;
      action?: string;
   }>();

   const defaultValue = ref(props.defaultValues);
   const { handleSubmit, setFieldValue, values, resetForm } = useForm({
      validationSchema: formSchema,
      initialValues: defaultValue.value || null,
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
   console.log(list.value);
   const addDeliveryNoteDetailsForm = () => {
      list.value.push(1);
   };
   const itemRefs = useTemplateRef('deliveryNoteDetailsFormRef');

   const deliveryNoteDetailsFormRef = ref<InstanceType<
      typeof ReceivedNoteDetailsForm
   > | null>(null);

   const onSubmitDetails = async () => {
      localStorage.removeItem('deliveryNoteDetails');
      if (itemRefs.value) {
         itemRefs.value.forEach((ref) => {
            ref?.onSubmit();
         });
      }
   };

   const saveToLocalStorage = (values) => {
      const existingData = localStorage.getItem('deliveryNoteDetails');

      if (!existingData) {
         localStorage.setItem('deliveryNoteDetails', JSON.stringify([values]));
      } else {
         const dataArray = JSON.parse(existingData);

         dataArray.push(values);

         localStorage.setItem('deliveryNoteDetails', JSON.stringify(dataArray));
      }
   };
   localStorage.removeItem('deliveryNoteDetails');

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
   const deliveryNoteDetailsData = ref<DataFromNoteDetails[]>([]);

   const onSubmit = handleSubmit(async (values) => {
      try {
         await onSubmitDetails();
         const handleValues: DeliveryNote = {
            ...values,
            delivery_note_id: '123',
            delivery_date: toDate(today(getLocalTimeZone())).toLocaleDateString(
               'en-CA'
            ),
         };
         if (props.action === 'create') {
            console.log('create');
            const {
               employee_id,
               delivery_note_id,
               delivery_date,
               ...customerValues
            } = handleValues;

            const newCustomerId = (await CustomerService.create(customerValues))
               .newCustomer[0].customer_id;
            console.log(newCustomerId);
            const handleNoteValue = {
               ...handleValues,
               customer_id: newCustomerId,
            };
            console.log(handleNoteValue);
            const newNoteId = (
               await DeliveryNoteService.create(handleNoteValue)
            ).delivery_note_id;

            const deliveryNoteDetailsData = JSON.parse(
               localStorage.getItem('deliveryNoteDetails')
            );

            if (deliveryNoteDetailsData) {
               deliveryNoteDetailsData.forEach(async (detail) => {
                  const finalDetail = {
                     ...detail,
                     delivery_note_id: newNoteId,
                  };
                  const currentMedicine = await MedicineService.getMedicine(
                     detail.medicine_id
                  );

                  const currentQuantity = currentMedicine.quantity;
                  if (detail.quantity > currentQuantity) {
                     toast({
                        description: 'Số lượng thuốc không đủ',
                        variant: 'destructive',
                     });
                     throw {
                        message: 'Not enough quantity',
                     };
                  } else {
                     await MedicineService.updateMedicine(detail.medicine_id, {
                        ...currentMedicine,
                        quantity: currentQuantity - detail.quantity,
                     });
                  }

                  // if (!currentQuantity || currentQuantity === 0) {
                  //    await MedicineService.updateMedicine(detail.medicine_id, {
                  //       ...currentMedicine,
                  //       quantity: detail.quantity,
                  //    });
                  // } else if (currentQuantity > 0) {
                  //    await MedicineService.updateMedicine(detail.medicine_id, {
                  //       ...currentMedicine,
                  //       quantity: currentQuantity + detail.quantity,
                  //    });
                  // }

                  await DeliveryNoteDetailsService.create(finalDetail);
               });
            } else
               throw {
                  message: 'Missing details',
               };

            emit('sendValue', handleValues);
            toast({
               description: 'Đã thêm phiếu xuất mới.',
               class: 'bg-emerald-600 text-white',
            });
            resetForm();
         } else if (props.action === 'update') {
            console.log('update');
            handleValues.delivery_note_id =
               props.defaultValues?.delivery_note_id;
            const updatedNote = await DeliveryNoteService.getNote(
               handleValues.delivery_note_id
            );
            const updatedCustomerId = updatedNote.customer_id;
            // const updatedCustomer =
            await CustomerService.updateCustomer(updatedCustomerId, {
               customer_id: updatedCustomerId,
               name: handleValues.customer_name,
               address: handleValues.address,
               phone: handleValues.phone,
            });

            console.log(updatedNote);
            console.log(handleValues);
            await DeliveryNoteService.updateNote(
               props.defaultValues?.delivery_note_id,
               handleValues
            );

            const deliveryNoteDetailsData = JSON.parse(
               localStorage.getItem('deliveryNoteDetails')
            );

            console.log(deliveryNoteDetailsData);
            const updatedNoteId = props.defaultValues?.delivery_note_id;
            console.log(props.defaultValues);

            console.log(deliveryNoteDetailsData);
            if (deliveryNoteDetailsData) {
               deliveryNoteDetailsData.forEach(async (detail, index) => {
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
                        currentMedicine.quantity +
                        quantityBeforeUpdate -
                        quantityAfterUpdate,
                  });
                  const finalDetail = {
                     ...detail,
                     delivery_note_id: updatedNoteId,
                     price: currentMedicine.price,
                  };

                  console.log(finalDetail);
                  console.log('create');
                  await DeliveryNoteDetailsService.updateNote(
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
               description: `Cập nhật thông tin phiếu xuất có mã ${updatedNoteId} thành công.`,
               class: 'bg-emerald-600 text-white',
            });
         }
         console.log(handleValues);
      } catch (error: any) {
         if (error.message === 'Missing details') {
            toast({
               description: 'Chi tiết phiếu xuất không thể để trống',
               variant: 'destructive',
            });
         } else if (error.message === 'Not enough quantity') {
            console.log(error);
            toast({
               description: 'Số lượng thuốc không đủ',
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

   watch(
      () => props.defaultValues,
      () => (defaultValue.value = props.defaultValues)
   );

   onMounted(async () => {
      list.value = Array.from(
         { length: props.initNumOfDetailsForm as number },
         (_, index) => index + 1
      );
   });

   defineExpose({
      onSubmit,
      resetForm,
   });
</script>
