<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Loại thuốc</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách loại thuốc tại đây.
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
                     <span class="">Tổng số loại</span>
                     <span class="text-gray-500"> {{ data.length }} </span>
                     <Button
                        variant="secondary"
                        @click="getAllCategories()"
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
                        <Plus class="w-5 h-5" />
                        Thêm loại thuốc
                     </Button>
                  </DialogTrigger>
               </template>
            </DataTable>
         </div>

         <DialogContent
            v-on:interact-outside="(e) => e.preventDefault()"
            v-on:open-auto-focus="(e) => e.preventDefault()"
            class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
         >
            <DialogHeader class="p-6 pb-0">
               <DialogTitle>Thêm loại thuốc</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4 px-6 overflow-y-auto">
               <MedicineCategoryForm
                  ref="medicineCategoryFormRef"
                  @send-value="handleCategoryData"
               >
               </MedicineCategoryForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <Button
                  @click="addCategory"
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

   import { columns } from '@/components/medicine-categories/columns';
   import type { MedicineCategory } from '@/components/medicine-categories/schema';
   import MedicineCategoryForm from '@/components/medicine-categories/MedicineCategoryForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import MedicineCategoryService from '@/services/MedicineCategoryService';
   import { useToast } from '@/components/ui/toast/use-toast';
   const { toast } = useToast();

   const data = ref<MedicineCategory[]>([]);

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const getAllCategories = async () => {
      try {
         data.value = (
            await MedicineCategoryService.getAllMedicineCategories()
         ).data;
         console.log(data.value);
      } catch (error) {
         console.log(error);
      }
   };

   const MedicineFiltersColumn = [
      {
         title: 'Theo mã loại',
         value: 'category_id',
      },
      {
         title: 'Theo tên loại',
         value: 'name',
      },
      {
         title: 'Theo mô tả',
         value: 'description',
      },
   ];

   const filteredColumn = ref<string>(MedicineFiltersColumn[0].value);
   const medicineCategoryFormRef = ref<InstanceType<
      typeof MedicineCategoryForm
   > | null>(null);

   const categoryData = ref<MedicineCategory>();
   const handleCategoryData = (data: MedicineCategory) => {
      categoryData.value = data;
   };

   const addCategory = async () => {
      if (medicineCategoryFormRef.value) {
         try {
            await medicineCategoryFormRef.value.onSubmit();
            if (categoryData.value) {
               await MedicineCategoryService.create(categoryData.value);
               toast({
                  description: 'Đã thêm loại thuốc mới.',
                  class: 'bg-emerald-600 text-white',
               });
               medicineCategoryFormRef.value.resetForm();
               categoryData.value = undefined;
               await getAllCategories();
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.data.code === 'ER_DUP_ENTRY') {
               toast({
                  variant: 'destructive',
                  description: 'Mã loại thuốc đã tồn tại!',
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
      await getAllCategories();
   });
</script>

<style scoped></style>
