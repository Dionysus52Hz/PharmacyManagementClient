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
                  copyId(props.row.original.received_note_id),
                     console.log(props.row.original)
               "
            >
               <Copy class="w-5 h-5" />
               Sao chép mã phiếu nhập
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem
                  @click="
                     (actionState = 'show-details'),
                        showReceivedNoteDetails(
                           props.row.original.received_note_id
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
                        [(actionState = 'update'), getReceivedNoteDetailsData()]
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
               <ReceivedNoteForm
                  ref="receivedNoteFormRef"
                  :init-num-of-details-form="initNumOfDetailsForm"
                  :default-values="receivedNoteDetailsData"
                  :action="'update'"
                  :disabled-input="true"
               >
               </ReceivedNoteForm>
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
               @click="updateReceivedNotes"
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
                     deleteReceivedNote(props.row.original.received_note_id)
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
   import type { ReceivedNote } from './schema';
   import type { ReceivedNoteDetails } from '../received-notes-details/schema';
   import ReceivedNoteForm from './ReceivedNoteForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import { columns } from '@/components/received-notes-details/columns';
   import { onMounted, computed, ref } from 'vue';
   import { excelToJson } from '@/utils/data';
   import { vAutoAnimate } from '@formkit/auto-animate/vue';
   import ReceivedNoteDetailsService from '@/services/ReceivedNoteDetailsService';
   import MedicineService from '@/services/MedicineService';
   import ReceivedNoteService from '@/services/ReceivedNoteService';
   import { useToast } from '@/components/ui/toast/use-toast';
   import Medicine from '@/views/Medicine.vue';
   const { toast } = useToast();

   const data = ref<ReceivedNoteDetails[]>([]);

   const receivedNoteFormRef = ref<InstanceType<
      typeof ReceivedNoteForm
   > | null>(null);

   const filteredColumn = ref<string>('medicine_id');

   interface DataTableRowActionProps {
      row: Row<ReceivedNote>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const receivedNoteDetailsData = ref<ReceivedNote>();
   const initNumOfDetailsForm = ref<number>(0);
   const getReceivedNoteDetailsData = async () => {
      receivedNoteDetailsData.value = {
         ...props.row.original,
      };
      receivedNoteDetailsData.value.details = (
         await ReceivedNoteDetailsService.getNote(
            props.row.original.received_note_id
         )
      ).details;
      console.log(receivedNoteDetailsData.value);
      initNumOfDetailsForm.value = receivedNoteDetailsData.value.details.length;
   };

   const showReceivedNoteDetails = async (id: string) => {
      data.value = (await ReceivedNoteDetailsService.getNote(id)).details;
      console.log(data.value);
      data.value.map(
         async (item) =>
            (item.medicine_name = await MedicineService.getMedicine(
               item.medicine_id
            ))
      );
   };

   const actionState = ref<'add' | 'show-details' | 'update' | 'delete'>(
      'show-details'
   );
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm phiếu nhập mới';
         case 'show-details':
            return 'Chi tiết phiếu nhập';
         case 'update':
            return 'Sửa thông tin phiếu nhập';
         case 'delete':
            return 'Xoá phiếu nhập';
      }
   });

   const updateReceivedNotes = async () => {
      if (receivedNoteFormRef.value) {
         await receivedNoteFormRef.value.onSubmit();
      }
   };

   const deleteReceivedNote = async (receivedNoteId: string) => {
      try {
         const noteDetails = (
            await ReceivedNoteDetailsService.getNote(receivedNoteId)
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
                     quantity: medicineQuantity - detail.quantity,
                  }
               );
               await ReceivedNoteDetailsService.deleteNote(
                  receivedNoteId,
                  detail.medicine_id
               );
            });
         }

         await ReceivedNoteService.deleteNote(receivedNoteId);
         // console.log(noteDetails);
         toast({
            description: 'Xoá phiếu nhập thành công.',
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
