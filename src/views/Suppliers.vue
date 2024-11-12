<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Nhà cung cấp</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách nhà cung cấp tại đây.
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
                     <span class="">Tổng số nhà cung cấp</span>
                     <span class="text-gray-500"> {{ data.length }} </span>
                     <Button
                        variant="secondary"
                        @click="getAllSuppliers()"
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
                              v-for="filter in SuppliersFiltersColumn"
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
                        Thêm nhà cung cấp
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
               <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4 px-6 overflow-y-auto">
               <SupplierForm
                  ref="supplierFormRef"
                  @send-value="handleSupplierData"
               >
               </SupplierForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <DialogClose as-child>
                  <Button
                     @click="addSupplier"
                     class="w-full"
                  >
                     Xác nhận
                  </Button>
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

   import { columns } from '@/components/suppliers/columns';
   import type { Supplier } from '@/components/suppliers/schema';
   import SupplierForm from '@/components/suppliers/SupplierForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import SupplierService from '@/services/SupplierService';
   import { useToast } from '@/components/ui/toast/use-toast';
   const { toast } = useToast();

   const data = ref<Supplier[]>([]);

   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';

   const getAllSuppliers = async () => {
      try {
         data.value = (await SupplierService.getAllSuppliers()).data;
         console.log(data.value);
      } catch (error) {
         console.log(error);
      }
   };

   const SuppliersFiltersColumn = [
      {
         title: 'Theo mã nhà cung cấp',
         value: 'supplier_id',
      },
      {
         title: 'Theo tên nhà cung cấp',
         value: 'name',
      },
      {
         title: 'Theo địa chỉ',
         value: 'address',
      },
      {
         title: 'Theo người đại diện',
         value: 'representative',
      },
   ];

   const filteredColumn = ref<string>(SuppliersFiltersColumn[0].value);
   const supplierFormRef = ref<InstanceType<typeof SupplierForm> | null>(null);

   const supplierData = ref<Supplier>();
   const handleSupplierData = (data: Supplier) => {
      supplierData.value = data;
   };

   const addSupplier = async () => {
      if (supplierFormRef.value) {
         try {
            await supplierFormRef.value.onSubmit();
            if (supplierData.value) {
               await SupplierService.create(supplierData.value);
               toast({
                  description: 'Đã thêm nhà cung cấp mới.',
                  class: 'bg-emerald-600 text-white',
               });
               supplierFormRef.value.resetForm();
               supplierData.value = undefined;
               await getAllSuppliers();
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
      await getAllSuppliers();
   });
</script>

<style scoped></style>
