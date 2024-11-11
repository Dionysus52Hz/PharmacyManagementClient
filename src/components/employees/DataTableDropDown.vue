<template>
   <Dialog>
      <DropdownMenu>
         <DropdownMenuTrigger as-child>
            <Button variant="ghost">
               <span class="sr-only">Open menu</span>
               <MoreHorizontal class="w-5 h-5" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chức năng</DropdownMenuLabel>

            <DropdownMenuItem @click="copyId(props.row.original.employee_id)">
               <Copy class="w-5 h-5" />
               Sao chép mã nhân viên
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'update'">
                  <Pencil class="h-5 w-5" />Sửa thông tin nhân viên
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem
                  v-if="props.row.original.isLocked === 0"
                  @click="actionState = 'lock-employee'"
               >
                  <LockKeyhole class="w-5 h-5" />Khoá tài khoản
               </DropdownMenuItem>

               <DropdownMenuItem
                  v-if="props.row.original.isLocked === 1"
                  @click="actionState = 'lock-employee'"
               >
                  <LockKeyholeOpen class="w-5 h-5" />Mở khoá tài khoản
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá nhân viên
               </DropdownMenuItem>
            </DialogTrigger>
         </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
         v-on:interact-outside="(e) => e.preventDefault()"
         v-on:open-auto-focus="(e) => e.preventDefault()"
         class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
      >
         <DialogHeader class="p-6 pb-0">
            <DialogTitle>{{ dialogHeaderTitle }}</DialogTitle>

            <DialogDescription> </DialogDescription>
         </DialogHeader>

         <div class="grid gap-4 py-4 px-6 overflow-y-auto">
            <EmployeeForm
               v-if="actionState === 'update'"
               ref="employeeFormRef"
               :default-values="props.row.original"
               @send-value="handleEmployeeData"
               :disabled-input="true"
            >
            </EmployeeForm>
            <p v-if="actionState === 'delete'">
               Việc xoá nhân viên không thể hoàn tác. Bạn chắc chắn muốn xoá
               nhân viên này?
            </p>
            <p
               v-if="
                  actionState === 'lock-employee' &&
                  props.row.original.isLocked === 0
               "
            >
               Bạn chắc chắn muốn khoá tài khoản nhân viên này?
            </p>
            <p
               v-if="
                  actionState === 'lock-employee' &&
                  props.row.original.isLocked === 1
               "
            >
               Bạn chắc chắn muốn mở khoá tài khoản nhân viên này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
            <Button
               v-if="actionState === 'update'"
               @click="updateEmployee"
               class="w-full"
            >
               Cập nhật
            </Button>

            <DialogClose asChild>
               <Button
                  v-if="actionState === 'delete'"
                  @click="deleteEmployee(props.row.original.employee_id)"
                  class="w-full"
                  variant="destructive"
               >
                  Xoá
               </Button>

               <Button
                  v-if="actionState === 'lock-employee'"
                  @click="lockEmployee(props.row.original.employee_id)"
                  class="w-full"
                  variant="destructive"
               >
                  {{ props.row.original.isLocked === 0 ? 'Khoá ' : 'Mở khoá' }}
               </Button>
            </DialogClose>
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
   </Dialog>
</template>

<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuTrigger,
   } from '@/components/ui/dropdown-menu';
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
      MoreHorizontal,
      Copy,
      Pencil,
      Trash,
      LockKeyhole,
      LockKeyholeOpen,
   } from 'lucide-vue-next';
   import type { Row } from '@tanstack/vue-table';
   import type { Employee } from './schema';
   import EmployeeForm from './EmployeeForm.vue';
   import { computed, ref } from 'vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import EmployeeService from '@/services/EmployeeService';
   const { toast } = useToast();

   interface DataTableRowActionProps {
      row: Row<Employee>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const employeeFormRef = ref<InstanceType<typeof EmployeeForm> | null>(null);

   const actionState = ref<'add' | 'update' | 'delete' | 'lock-employee'>(
      'update'
   );
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm nhân viên mới';
         case 'update':
            return 'Sửa thông tin nhân viên';
         case 'delete':
            return 'Xoá nhân viên';
         case 'lock-employee':
            return 'Khoá tài khoản nhân viên';
      }
   });

   const employeeData = ref<Employee>();
   const handleEmployeeData = (data: Employee) => {
      employeeData.value = data;
   };

   const updateEmployee = async () => {
      if (employeeFormRef.value) {
         try {
            await employeeFormRef.value.onSubmit();

            if (employeeData.value) {
               const employeeId: string = employeeData.value.employee_id;
               console.log(employeeId);
               await EmployeeService.updateEmployee(
                  employeeId,
                  employeeData.value
               );
               toast({
                  description: 'Cập nhật thông tin nhân viên thành công.',
                  class: 'bg-emerald-600 text-white',
               });
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.statusText === 'Forbidden') {
               toast({
                  variant: 'destructive',
                  description:
                     'Chỉ quản lý mới có quyền thay đổi thông tin của nhân viên',
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

   const deleteEmployee = async (employeeId: string) => {
      try {
         await EmployeeService.deleteEmployee(employeeId);
         toast({
            description: 'Xoá nhân viên thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.statusText === 'Forbidden') {
            toast({
               variant: 'destructive',
               description: 'Chỉ quản lý mới có quyền xoá nhân viên',
            });
         } else {
            toast({
               variant: 'destructive',
               description: 'Xảy ra lỗi không xác định.',
            });
         }
      }
   };

   const lockEmployee = async (employeeId: string) => {
      try {
         await EmployeeService.lockEmployee(employeeId);
         toast({
            description:
               props.row.original.isLocked === 0
                  ? `Đã khoá tài khoản nhân viên có mã ${employeeId}.`
                  : `Đã mở khoá tài khoản nhân viên có mã ${employeeId}.`,
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.statusText === 'Forbidden') {
            toast({
               variant: 'destructive',
               description:
                  'Chỉ quản lý mới có quyền khoá/ mở khoá tài khoản của nhân viên',
            });
         } else {
            toast({
               variant: 'destructive',
               description: 'Xảy ra lỗi không xác định.',
            });
         }
      }
   };
</script>
