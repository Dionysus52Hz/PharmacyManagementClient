<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Phiếu nhập</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách phiếu nhập tại đây.
            </h3>
         </div>

         <div class="data-table px-6 py-4">
            <DataTable
               :columns="columns"
               :data="data"
               :filtered-column="filteredColumn"
            >
               <template v-slot:table-statistics>
                  <div class="flex items-center gap-x-1 font-bold text-2xl">
                     <span class="">Tổng số phiếu nhập</span>
                     <span class="text-gray-500"> {{ data.length }} </span>

                     <Button
                        variant="secondary"
                        @click="getAllNotes()"
                     >
                        <ListRestart class="w-5 h-5 mr-2" />
                        Làm mới
                     </Button>
                  </div>
               </template>
               <template v-slot:filters-selection>
                  <Select v-model="filteredColumn">
                     <SelectTrigger class="max-w-[250px]">
                        <SelectValue placeholder="Chọn tiêu chí tìm kiếm" />
                     </SelectTrigger>

                     <SelectContent class="max-h-[240px]">
                        <SelectGroup>
                           <SelectItem
                              v-for="filter in ReceivedNotesFiltersColumn"
                              :value="filter.value"
                           >
                              {{ filter.title }}
                           </SelectItem>
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </template>

               <template v-slot:action-buttons>
                  <DialogTrigger asChild>
                     <Button>
                        <Plus class="w-5 h-5" />
                        Thêm phiếu nhập
                     </Button>
                  </DialogTrigger>
               </template>
            </DataTable>
         </div>

         <DialogContent
            v-on:interact-outside="(e) => e.preventDefault()"
            v-on:open-auto-focus="(e) => e.preventDefault()"
            class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 min-h-[90dvh] max-w-[90dvw]"
         >
            <DialogHeader class="p-6 pb-0">
               <DialogTitle>Thêm phiếu nhập mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="overflow-hidden gap-4 py-4 px-6">
               <ReceivedNoteForm
                  ref="receivedNoteFormRef"
                  :init-num-of-details-form="2"
                  @send-value="handleReceivedNoteData"
                  :disabled-input="true"
                  :default-values="defaultValuesForForm"
                  :action="'create'"
               >
               </ReceivedNoteForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-0 gap-y-4">
               <Button
                  @click="addReceivedNote"
                  class="w-full"
               >
                  Xác nhận
               </Button>

               <DialogClose as-child>
                  <Button
                     variant="outline"
                     class="w-full"
                  >
                     Quay lại
                  </Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </div>
   </Dialog>
</template>

<script setup lang="ts">
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
   import { Button } from '@/components/ui/button';
   import { Plus, ListRestart } from 'lucide-vue-next';

   import { ref, onMounted, onBeforeMount } from 'vue';

   import { columns } from '@/components/received-notes/columns';
   import type { ReceivedNote } from '@/components/received-notes/schema';
   import ReceivedNoteForm from '@/components/received-notes/ReceivedNoteForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import ReceivedNoteService from '@/services/ReceivedNoteService';
   import ReceivedNoteDetailsService from '@/services/ReceivedNoteDetailsService';
   import { useToast } from '@/components/ui/toast/use-toast';
   import { getCurrentLogin } from '@/utils/currentLogin';
   const { toast } = useToast();

   const data = ref<ReceivedNote[]>([]);

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const getAllNotes = async () => {
      try {
         data.value = await ReceivedNoteService.getAllNotes();

         // let prices = [];
         // data.value.forEach(async (item, index) => {
         //    const details = (
         //       await ReceivedNoteDetailsService.getNote(item.received_note_id)
         //    ).details;
         //    let sum = 0;
         //    await details.forEach((detail) => {
         //       sum += detail.quantity * detail.price;
         //    });
         //    prices[index] = sum;
         // });
      } catch (error) {
         console.log(error);
      }
   };

   const ReceivedNotesFiltersColumn = [
      {
         title: 'Theo mã phiếu',
         value: 'received_note_id',
      },
      {
         title: 'Theo mã nhân viên',
         value: 'employee_id',
      },
      {
         title: 'Theo mã nhà cung cấp',
         value: 'supplier_id',
      },
   ];

   const currentEmployee = getCurrentLogin();
   const defaultValuesForForm: ReceivedNote = {
      received_note_id: '',
      employee_id: currentEmployee.employee_id,
      supplier_id: '',
      received_date: '',
      details: [],
   };

   const filteredColumn = ref<string>(ReceivedNotesFiltersColumn[0].value);
   const receivedNoteFormRef = ref<InstanceType<
      typeof ReceivedNoteForm
   > | null>(null);

   const receivedNoteData = ref<ReceivedNote>({
      received_note_id: '',
      employee_id: '',
      supplier_id: '',
      received_date: '',
      details: [],
   });
   const handleReceivedNoteData = (data: ReceivedNote) => {
      receivedNoteData.value = data;
      console.log(localStorage.getItem('receivedNoteDetails'));
   };

   const addReceivedNote = async () => {
      if (receivedNoteFormRef.value) {
         try {
            await receivedNoteFormRef.value.onSubmit();
         } catch (error: any) {
            console.log(error);
         }
      }
   };

   onMounted(async () => {
      // await getPrices();
      await getAllNotes();
   });

   onBeforeMount(async () => {
      await getAllNotes();
   });
</script>

<style scoped></style>
