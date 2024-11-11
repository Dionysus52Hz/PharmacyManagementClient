<template>
   <Dialog>
      <div class="employee-view">
         <div class="title px-6 flex flex-col gap-y-2">
            <h1 class="font-bold text-[32px] leading-none">Nhân viên</h1>
            <h3 class="font-semibold text-sm text-gray-500">
               Quản lý danh sách nhân viên tại đây.
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
                     <span class="">Tổng số nhân viên</span>
                     <span class="text-gray-500"> {{ data.length }} </span>
                     <Button
                        variant="secondary"
                        @click="getAllEmployee()"
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
                              v-for="filter in EmployeeFiltersColumn"
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
                        Thêm nhân viên
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
               <EmployeeForm
                  ref="employeeFormRef"
                  @send-value="handleEmployeeData"
               >
               </EmployeeForm>
            </div>

            <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
               <Button
                  @click="addEmployee"
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
   import type { Employee } from '@/components/employees/schema';
   import { ref, onMounted } from 'vue';
   import { columns } from '@/components/employees/columns';
   import { DataTable } from '@/components/ui/data-table';
   import { Button } from '@/components/ui/button';
   import { Plus, ListRestart } from 'lucide-vue-next';
   import EmployeeForm from '@/components/employees/EmployeeForm.vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import EmployeeService from '@/services/EmployeeService';
   const { toast } = useToast();

   const data = ref<Employee[]>([]);

   const getAllEmployee = async () => {
      try {
         data.value = (await EmployeeService.getAllEmployees()).users;
         console.log(data.value);
      } catch (error) {
         console.log(error);
      }
   };

   const EmployeeFiltersColumn = [
      {
         title: 'Theo mã nhân viên',
         value: 'employee_id',
      },
      {
         title: 'Theo tên đăng nhập',
         value: 'username',
      },
      {
         title: 'Theo họ và tên',
         value: 'fullname',
      },
      {
         title: 'Theo địa chỉ',
         value: 'address',
      },
      {
         title: 'Theo số điện thoại',
         value: 'phoneNumber',
      },
   ];

   const filteredColumn = ref<string>(EmployeeFiltersColumn[0].value);
   const employeeFormRef = ref<InstanceType<typeof EmployeeForm> | null>(null);

   const EmployeeData = ref<Employee>();
   const handleEmployeeData = (data: Employee) => {
      EmployeeData.value = data;
   };

   const addEmployee = async () => {
      if (employeeFormRef.value) {
         try {
            await employeeFormRef.value.onSubmit();
            if (EmployeeData.value) {
               await EmployeeService.create(EmployeeData.value);
               toast({
                  description: 'Đã thêm nhân viên mới.',
                  class: 'bg-emerald-600 text-white',
               });
               employeeFormRef.value.resetForm();
               EmployeeData.value = undefined;
               await getAllEmployee();
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.statusText === 'Forbidden') {
               toast({
                  variant: 'destructive',
                  description: 'Chỉ quản lý mới có quyền thêm nhân viên mới',
               });
            } else {
               toast({
                  variant: 'destructive',
                  description: 'Xảy ra lỗi không xác định',
               });
            }
         }
      }
   };

   onMounted(async () => {
      await getAllEmployee();
   });
</script>

<style scoped></style>
