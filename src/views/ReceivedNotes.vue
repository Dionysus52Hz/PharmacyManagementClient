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
   import { Plus } from 'lucide-vue-next';

   import { ref, onMounted } from 'vue';

   import { columns } from '@/components/received-notes/columns';
   import type { ReceivedNote } from '@/components/received-notes/schema';
   import ReceivedNoteForm from '@/components/received-notes/ReceivedNoteForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import { excelToJson } from '@/utils/data';

   const data = ref<ReceivedNote[]>([]);

   async function getData(): Promise<ReceivedNote[]> {
      return await excelToJson(excelURL, 'ReceivedNotes');
   }

   const excelURL = 'src/Database.xlsx';
   onMounted(async () => {
      data.value = await getData();
      console.log(data.value);
   });

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

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

   const filteredColumn = ref<string>(ReceivedNotesFiltersColumn[0].value);
   const receivedNoteFormRef = ref<InstanceType<
      typeof ReceivedNoteForm
   > | null>(null);

   const addReceivedNote = () => {
      if (receivedNoteFormRef.value) {
         receivedNoteFormRef.value.onSubmit();
      }
   };
</script>

<style scoped></style>
