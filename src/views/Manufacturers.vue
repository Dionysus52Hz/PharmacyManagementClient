<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Hãng sản xuất</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách hãng sản xuất tại đây.
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
                     <span class="">Tổng số hãng</span>
                     <span class="text-gray-500"> {{ data.length }} </span>
                     <Button
                        variant="secondary"
                        @click="getAllManufacturers()"
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
                              v-for="filter in ManufacturerFiltersColumn"
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
                        Thêm hãng mới
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
               <DialogTitle>Thêm hãng sản xuất mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4 px-6 overflow-y-auto">
               <ManufacturerForm
                  ref="manufacturerFormRef"
                  @send-value="handleManufacturerData"
               >
               </ManufacturerForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <Button
                  @click="addManufacturer"
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
   import type { Manufacturer } from '@/components/manufacturers/schema';
   import { ref, onMounted } from 'vue';
   import { columns } from '@/components/manufacturers/columns';
   import { DataTable } from '@/components/ui/data-table';
   import { excelToJson } from '@/utils/data';
   import { Button } from '@/components/ui/button';
   import { Plus, ListRestart } from 'lucide-vue-next';
   import ManufacturerForm from '@/components/manufacturers/ManufacturerForm.vue';
   import ManufacturerService from '@/services/ManufacturerService';
   import { useToast } from '@/components/ui/toast/use-toast';
   const { toast } = useToast();

   const data = ref<Manufacturer[]>([]);

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const getAllManufacturers = async () => {
      try {
         data.value = (await ManufacturerService.getAllManufacturers()).data;
         console.log(data.value);
      } catch (error) {
         console.log(error);
      }
   };

   const ManufacturerFiltersColumn = [
      {
         title: 'Theo mã hãng sản xuất',
         value: 'manufacturer_id',
      },
      {
         title: 'Theo tên hãng sản xuất',
         value: 'name',
      },
      {
         title: 'Theo quốc gia',
         value: 'nation',
      },
   ];

   const filteredColumn = ref<string>(ManufacturerFiltersColumn[0].value);
   const manufacturerFormRef = ref<InstanceType<
      typeof ManufacturerForm
   > | null>(null);

   const manufacturerData = ref<Manufacturer>();
   const handleManufacturerData = (data: Manufacturer) => {
      manufacturerData.value = data;
   };

   const addManufacturer = async () => {
      if (manufacturerFormRef.value) {
         try {
            await manufacturerFormRef.value.onSubmit();
            if (manufacturerData.value) {
               await ManufacturerService.create(manufacturerData.value);
               toast({
                  description: 'Đã thêm nhà cung cấp mới.',
                  class: 'bg-emerald-600 text-white',
               });
               manufacturerFormRef.value.resetForm();
               manufacturerData.value = undefined;
               await getAllManufacturers();
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.data.code === 'ER_DUP_ENTRY') {
               toast({
                  variant: 'destructive',
                  description: 'Mã nhà cung cấp đã tồn tại!',
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
      await getAllManufacturers();
   });
</script>

<style scoped></style>
