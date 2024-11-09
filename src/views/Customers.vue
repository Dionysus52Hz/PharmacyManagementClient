<template>
   <Dialog>
      <div class="medicine-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Khách hàng</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách khách hàng tại đây.
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
                     <span class="">Tổng số khách hàng</span>
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
                              v-for="filter in CustomersFiltersColumn"
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
                        Thêm khách hàng
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
               <DialogTitle>Thêm khách hàng mới</DialogTitle>

               <DialogDescription> </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4 px-6 overflow-y-auto">
               <CustomerForm ref="customerFormRef"> </CustomerForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <Button
                  @click="addCustomer"
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

   import { columns } from '@/components/customers/columns';
   import type { Customer } from '@/components/customers/schema';
   import CustomerForm from '@/components/customers/CustomerForm.vue';
   import { DataTable } from '@/components/ui/data-table';
   import { excelToJson } from '@/utils/data';

   const data = ref<Customer[]>([]);

   async function getData(): Promise<Customer[]> {
      return await excelToJson(excelURL, 'Customers');
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

   const CustomersFiltersColumn = [
      {
         title: 'Theo mã khách hàng',
         value: 'customer_id',
      },
      {
         title: 'Theo tên khách hàng',
         value: 'name',
      },
      {
         title: 'Theo số điện thoại',
         value: 'phone',
      },
      {
         title: 'Theo địa chỉ',
         value: 'address',
      },
   ];

   const filteredColumn = ref<string>(CustomersFiltersColumn[0].value);
   const customerFormRef = ref<InstanceType<typeof CustomerForm> | null>(null);

   const addCustomer = () => {
      if (customerFormRef.value) {
         customerFormRef.value.onSubmit();
      }
   };
</script>

<style scoped></style>
