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
                     <Button
                        variant="secondary"
                        @click="getAllMedicine()"
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
                        <Plus class="w-5 h-5 mr-2" />
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
               <MedicineForm
                  ref="medicineFormRef"
                  @send-value="handleMedicineData"
               >
               </MedicineForm>
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

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';
   import type { Medicine } from '@/components/medicine/schema';
   import { ref, onMounted } from 'vue';
   import { columns } from '@/components/medicine/columns';
   import { DataTable } from '@/components/ui/data-table';
   import { Button } from '@/components/ui/button';
   import { Plus, ListRestart } from 'lucide-vue-next';
   import MedicineForm from '@/components/medicine/MedicineForm.vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import MedicineService from '@/services/MedicineService';
   const { toast } = useToast();
   console.log(columns);

   const data = ref<Medicine[]>([]);

   const getAllMedicine = async () => {
      try {
         data.value = await MedicineService.getAllMedicine();
      } catch (error) {
         console.log(error);
      }
   };

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

   const medicineData = ref<Medicine>();
   const handleMedicineData = (data: Medicine) => {
      medicineData.value = data;
   };

   const addMedicine = async () => {
      if (medicineFormRef.value) {
         try {
            await medicineFormRef.value.onSubmit();
            if (medicineData.value) {
               await MedicineService.create(medicineData.value);
               toast({
                  description: 'Đã thêm thuốc mới.',
                  class: 'bg-emerald-600 text-white',
               });
               medicineFormRef.value.resetForm();
               medicineData.value = undefined;
               await getAllMedicine();
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.data.code === 'ER_DUP_ENTRY') {
               toast({
                  variant: 'destructive',
                  description: 'Mã thuốc đã tồn tại!',
               });
            } else {
               toast({
                  variant: 'destructive',
                  description: 'Xảy ra lỗi không xác định.',
               });
            }
         }
      }
   };

   onMounted(async () => {
      await getAllMedicine();
   });
</script>

<style scoped></style>
