<template>
   <Dialog>
      <DropdownMenu>
         <DropdownMenuTrigger as-child>
            <Button variant="ghost">
               <span class="sr-only">Open menu</span>
               <MoreHorizontal class="w-5 h-5" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chức năng</DropdownMenuLabel>

            <DropdownMenuItem
               @click="
                  copyId(props.row.original.delivery_note_id),
                     console.log(props.row.original)
               "
            >
               <Copy class="w-5 h-5" />
               Sao chép mã phiếu
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem
                  @click="
                     (actionState = 'show-details'),
                        showDeliveryNoteDetails(
                           props.row.original.delivery_note_id
                        )
                  "
               >
                  <Pencil class="h-5 w-5" />Xem chi tiết
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá phiếu xuất
               </DropdownMenuItem>
            </DialogTrigger>
         </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
         v-on:open-auto-focus="(e) => e.preventDefault()"
         class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
         :class="{
            'max-w-[90dvw] min-h-[90dvh]':
               actionState === 'show-details' || actionState === 'update',
            'h-auto max-w-[90dvw]': actionState == 'show-details',
         }"
      >
         <DialogHeader class="p-6 pb-0">
            <DialogTitle>{{ dialogHeaderTitle }}</DialogTitle>

            <DialogDescription> </DialogDescription>
         </DialogHeader>

         <div
            class="grid gap-4 py-4 px-6 overflow-y-auto"
            :class="{
               'grid-rows-[auto_auto_1fr]': actionState == 'show-details',
            }"
         >
            <p v-if="actionState === 'delete'">
               Việc xoá thông tin phiếu xuất không thể hoàn tác. Bạn chắc chắn
               muốn xoá phiếu xuất này?
            </p>
            <DataTable
               v-if="actionState === 'show-details'"
               :data="data"
               :columns="columns"
               :filtered-column="filteredColumn"
            >
               <template v-slot:table-statistics>
                  <div class="flex items-center gap-x-1 font-bold text-2xl">
                     <span class="">Tổng số thuốc</span>
                     <span class="text-gray-500"> {{ data.length }} </span>
                  </div>
               </template>
               <template v-slot:action-buttons>
                  <Button
                     @click="
                        [getDeliveryNoteDetailsData(), (actionState = 'update')]
                     "
                  >
                     <Pencil class="w-5 h-5 mr-2" />
                     Sửa phiếu
                  </Button>
               </template>
            </DataTable>

            <div
               class="overflow-hidden"
               v-if="actionState === 'update'"
               v-auto-animate
            >
               <DeliveryNoteForm
                  ref="deliveryNoteFormRef"
                  :init-num-of-details-form="initNumOfDetailsForm"
                  :default-values="deliveryNoteDetailsData"
                  :action="'update'"
                  :disabled-input="true"
               >
               </DeliveryNoteForm>
            </div>
         </div>

         <DialogFooter
            class="flex p-6 pt-2 gap-y-4"
            :class="{
               '!flex-col':
                  actionState === 'delete' || actionState === 'update',
               '!justify-center':
                  actionState === 'show-details' || actionState === 'update',
            }"
         >
            <Button
               v-if="actionState === 'update'"
               class="w-full"
               @click="updateDeliveryNotes"
            >
               Cập nhật
            </Button>

            <Button
               v-if="actionState === 'update'"
               @click="actionState = 'show-details'"
               class="w-full"
               variant="outline"
            >
               Quay lại
            </Button>

            <DialogClose as-child>
               <Button
                  v-if="actionState === 'delete'"
                  @click="
                     deleteDeliveryNote(props.row.original.delivery_note_id)
                  "
                  class="w-full"
                  variant="destructive"
               >
                  Xoá
               </Button>
               <Button
                  v-if="actionState === 'delete'"
                  class="w-full"
                  variant="outline"
                  >Quay lại</Button
               >
               <Button
                  v-if="actionState === 'show-details'"
                  class="px-8"
               >
                  Đóng
               </Button>
            </DialogClose>
         </DialogFooter>
      </DialogContent>
   </Dialog>
</template>

<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuTrigger,
   } from '@/components/ui/dropdown-menu';
   import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogFooter,
      DialogTitle,
      DialogTrigger,
      DialogClose,
   } from '@/components/ui/dialog';

   import { MoreHorizontal, Copy, Pencil, Trash } from 'lucide-vue-next';
   import type { Row } from '@tanstack/vue-table';
   import type { DeliveryNote } from './schema';
   import type { DeliveryNoteDetails } from '../delivery-note-details/schema';
   import DeliveryNoteForm from './DeliveryNoteForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import { columns } from '@/components/delivery-note-details/columns';
   import { onMounted, computed, ref } from 'vue';
   import { excelToJson } from '@/utils/data';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';
   import DeliveryNoteDetailsService from '@/services/DeliveryNoteDetailsService';
   import MedicineService from '@/services/MedicineService';
   import DeliveryNoteService from '@/services/DeliveryNoteService';
   import { useToast } from '@/components/ui/toast/use-toast';
   import Medicine from '@/views/Medicine.vue';
   import CustomerService from '@/services/CustomerService';
   const { toast } = useToast();

   const data = ref<DeliveryNoteDetails[]>([]);

   async function getData(): Promise<DeliveryNoteDetails[]> {
      return await excelToJson(excelURL, 'DeliveryNoteDetails');
   }
   const deliveryNoteFormRef = ref<InstanceType<
      typeof DeliveryNoteForm
   > | null>(null);

   const filteredColumn = ref<string>('medicine_id');

   interface DataTableRowActionProps {
      row: Row<DeliveryNote>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const deliveryNoteDetailsData = ref<DeliveryNote>();

   const initNumOfDetailsForm = ref<number>(0);
   const getDeliveryNoteDetailsData = async () => {
      deliveryNoteDetailsData.value = {
         ...props.row.original,
      };
      const customerValues = await CustomerService.getCustomer(
         deliveryNoteDetailsData.value.customer_id
      );
      deliveryNoteDetailsData.value.details = (
         await DeliveryNoteDetailsService.getNote(
            props.row.original.delivery_note_id
         )
      ).details;

      deliveryNoteDetailsData.value = {
         ...deliveryNoteDetailsData.value,
         customer_name: customerValues.name,
         address: customerValues.address,
         phone: customerValues.phone,
      };
      console.log(deliveryNoteDetailsData.value);
      initNumOfDetailsForm.value = deliveryNoteDetailsData.value.details.length;
      console.log(initNumOfDetailsForm.value);
      console.log(deliveryNoteDetailsData.value);
   };

   const showDeliveryNoteDetails = async (id: string) => {
      data.value = (await DeliveryNoteDetailsService.getNote(id)).details;
   };

   const actionState = ref<'add' | 'show-details' | 'update' | 'delete'>(
      'show-details'
   );
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm phiếu xuất mới';
         case 'show-details':
            return 'Chi tiết phiếu xuất';
         case 'update':
            return 'Sửa thông tin phiếu xuất';
         case 'delete':
            return 'Xoá phiếu xuất';
      }
   });

   const updateDeliveryNotes = async () => {
      if (deliveryNoteFormRef.value) {
         await deliveryNoteFormRef.value.onSubmit();
      }
   };

   const deleteDeliveryNote = async (deliveryNoteId: string) => {
      try {
         const noteDetails = (
            await DeliveryNoteDetailsService.getNote(deliveryNoteId)
         ).details;
         if (noteDetails) {
            noteDetails.forEach(async (detail) => {
               const medicineDeleted = await MedicineService.getMedicine(
                  detail.medicine_id
               );
               const medicineQuantity = medicineDeleted.quantity;

               await MedicineService.updateMedicine(
                  medicineDeleted.medicine_id,
                  {
                     ...medicineDeleted,
                     quantity: medicineQuantity + detail.quantity,
                  }
               );
               await DeliveryNoteDetailsService.deleteNote(
                  deliveryNoteId,
                  detail.medicine_id
               );
            });
         }

         await DeliveryNoteService.deleteNote(deliveryNoteId);
         // console.log(noteDetails);
         toast({
            description: 'Xoá phiếu xuất thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error) {
         console.log(error);
         toast({
            description: 'Xảy ra lỗi không xác định',
            variant: 'destructive',
         });
      }
   };
</script>
