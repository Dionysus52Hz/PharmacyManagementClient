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
                  <Trash class="w-5 h-5" />Xoá phiếu nhập
               </DropdownMenuItem>
            </DialogTrigger>
         </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
         v-on:open-auto-focus="(e) => e.preventDefault()"
         class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
         :class="{
            'max-w-[90dvw] min-h-[90dvh]': actionState === 'update',
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
               Việc xoá thông tin phiếu nhập không thể hoàn tác. Bạn chắc chắn
               muốn xoá phiếu nhập này?
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
                        [(actionState = 'update'), getDeliveryNoteDetailsData()]
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
            <Button
               v-if="actionState === 'delete'"
               @click="deleteDeliveryNote(props.row.original.delivery_note_id)"
               class="w-full"
               variant="destructive"
            >
               Xoá
            </Button>
            <DialogClose as-child>
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

   const data = ref<DeliveryNoteDetails[]>([]);

   async function getData(): Promise<DeliveryNoteDetails[]> {
      return await excelToJson(excelURL, 'DeliveryNoteDetails');
   }

   const excelURL = 'src/Database.xlsx';
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
      deliveryNoteDetailsData.value.details = (await getData()).filter(
         (note) => note.delivery_note_id === props.row.original.delivery_note_id
      );
      initNumOfDetailsForm.value = deliveryNoteDetailsData.value.details.length;
      console.log(initNumOfDetailsForm.value);
      console.log(deliveryNoteDetailsData.value);
   };

   const showDeliveryNoteDetails = async (id: string) => {
      data.value = (await getData()).filter(
         (note) => note.delivery_note_id === id
      );
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

   onMounted(async () => {
      data.value = await getData();
   });

   const updateDeliveryNotes = async () => {
      if (deliveryNoteFormRef.value) {
         await deliveryNoteFormRef.value.onSubmit();
      }
   };

   const deleteDeliveryNote = (deliveryNoteId: string) => {
      console.log(deliveryNoteId);
   };
</script>
