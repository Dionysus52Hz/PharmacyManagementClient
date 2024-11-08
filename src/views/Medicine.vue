<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Thuốc</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách thuốc tại đây.
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
                     <span class="">Tổng số thuốc</span>
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
                              v-for="filter in MedicineFiltersColumn"
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
                        Thêm thuốc
                     </Button>
                  </DialogTrigger>
               </template>
            </DataTable>
         </div>

         <DialogContent
            v-on:interact-outside="(e) => e.preventDefault()"
            v-on:open-auto-focus="(e) => e.preventDefault()"
            class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
         >
            <DialogHeader class="p-6 pb-0">
               <DialogTitle>Thêm thuốc mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4 px-6 overflow-y-auto">
               <MedicineForm ref="medicineFormRef"> </MedicineForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <Button
                  @click="addMedicine"
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
   import type { Medicine } from '@/components/medicine/schema';
   import { ref, onMounted } from 'vue';
   import { columns } from '@/components/medicine/columns';
   import { DataTable } from '@/components/ui/data-table';
   import { excelToJson } from '@/components/medicine/data';
   import { Button } from '@/components/ui/button';
   import { Plus } from 'lucide-vue-next';
   import MedicineForm from '@/components/medicine/MedicineForm.vue';

   const data = ref<Medicine[]>([]);

   async function getData(): Promise<Medicine[]> {
      return await excelToJson(excelURL, 'Medicine');
   }

   const excelURL = 'src/Database.xlsx';
   onMounted(async () => {
      data.value = await getData();
   });

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const MedicineFiltersColumn = [
      {
         title: 'Theo mã thuốc',
         value: 'medicine_id',
      },
      {
         title: 'Theo tên thuốc',
         value: 'name',
      },
      {
         title: 'Theo mã nhà sản xuất',
         value: 'manufacturer_id',
      },
      {
         title: 'Theo mã nhà cung cấp',
         value: 'supplier_id',
      },
      {
         title: 'Theo công dụng',
         value: 'effects',
      },
      {
         title: 'Theo mã loại',
         value: 'category_id',
      },
   ];

   const filteredColumn = ref<string>(MedicineFiltersColumn[0].value);
   const medicineFormRef = ref<InstanceType<typeof MedicineForm> | null>(null);

   const addMedicine = () => {
      if (medicineFormRef.value) {
         medicineFormRef.value.onSubmit();
      }
   };
</script>

<style scoped></style>
