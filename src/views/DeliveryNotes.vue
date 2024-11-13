<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Phiếu xuất</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách phiếu xuất tại đây.
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
                     <span class="">Tổng số phiếu xuất</span>
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
                              v-for="filter in DeliveryNotesFiltersColumn"
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
                        Thêm phiếu xuất
                     </Button>
                  </DialogTrigger>
               </template>
            </DataTable>
         </div>

         <DialogContent
            v-on:interact-outside="(e) => e.preventDefault()"
            v-on:open-auto-focus="(e) => e.preventDefault()"
            class="grid grid-rows-[auto_minmax(0,1fr)_auto] p-0 min-h-[90dvh] max-w-[90dvw]"
         >
            <DialogHeader class="p-6 pb-0">
               <DialogTitle>Thêm phiếu xuất mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="overflow-hidden gap-4 py-4 px-6">
               <DeliveryNoteForm
                  ref="deliveryNoteFormRef"
                  :init-num-of-details-form="2"
                  @send-value="handleDeliveryNoteData"
                  :disabled-input="true"
                  :default-values="defaultValuesForForm"
                  :action="'create'"
               >
               </DeliveryNoteForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-0 gap-y-4">
               <Button
                  @click="addDeliveryNote"
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

   import { ref, onMounted } from 'vue';

   import { columns } from '@/components/delivery-notes/columns';
   import type { DeliveryNote } from '@/components/delivery-notes/schema';
   import DeliveryNoteForm from '@/components/delivery-notes/DeliveryNoteForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import { excelToJson } from '@/utils/data';
   import DeliveryNoteService from '@/services/DeliveryNoteService';
   import { getCurrentLogin } from '@/utils/currentLogin';

   const data = ref<DeliveryNote[]>([]);
   const getAllNotes = async () => {
      try {
         data.value = await DeliveryNoteService.getAllNotes();
      } catch (error) {
         console.log(error);
      }
   };

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const DeliveryNotesFiltersColumn = [
      {
         title: 'Theo mã phiếu',
         value: 'delivery_note_id',
      },
      {
         title: 'Theo mã nhân viên',
         value: 'employee_id',
      },
      {
         title: 'Theo mã khách hàng',
         value: 'customer_id',
      },
   ];

   const currentEmployee = getCurrentLogin();
   const defaultValuesForForm: DeliveryNote = {
      delivery_note_id: '',
      employee_id: currentEmployee.employee_id,
      customer_id: '',
      delivery_date: '',
      details: [],
   };

   const filteredColumn = ref<string>(DeliveryNotesFiltersColumn[0].value);
   const deliveryNoteFormRef = ref<InstanceType<
      typeof DeliveryNoteForm
   > | null>(null);

   const deliveryNoteData = ref<DeliveryNote>({
      delivery_note_id: '',
      employee_id: '',
      customer_id: '',
      delivery_date: '',
      details: [],
   });
   const handleDeliveryNoteData = (data: DeliveryNote) => {
      deliveryNoteData.value = data;
      console.log(localStorage.getItem('deliveryNoteDetails'));
   };

   const addDeliveryNote = async () => {
      if (deliveryNoteFormRef.value) {
         try {
            await deliveryNoteFormRef.value.onSubmit();
         } catch (error: any) {
            console.log(error);
         }
      }
   };

   onMounted(async () => {
      // await getPrices();
      await getAllNotes();
   });
</script>

<style scoped></style>
