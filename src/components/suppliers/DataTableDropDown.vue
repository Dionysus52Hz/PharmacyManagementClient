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

            <DropdownMenuItem @click="copyId(props.row.original.supplier_id)">
               <Copy class="w-5 h-5" />
               Sao chép mã nhà cung cấp
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'update'">
                  <Pencil class="h-5 w-5" />Sửa thông tin nhà cung cấp
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá nhà cung cấp
               </DropdownMenuItem>
            </DialogTrigger>
         </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
         v-on:interact-outside="(e) => e.preventDefault()"
         v-on:open-auto-focus="(e) => e.preventDefault()"
         class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
      >
         <DialogHeader class="p-6 pb-0">
            <DialogTitle>{{ dialogHeaderTitle }}</DialogTitle>

            <DialogDescription> </DialogDescription>
         </DialogHeader>

         <div class="grid gap-4 py-4 px-6 overflow-y-auto">
            <SupplierForm
               v-if="actionState === 'add' || actionState === 'update'"
               ref="supplierFormRef"
               :default-values="props.row.original"
               @send-value="handleSupplierData"
               :disabled-input="true"
            >
            </SupplierForm>
            <p v-if="actionState === 'delete'">
               Việc xoá thông tin nhà cung cấp không thể hoàn tác. Bạn chắc chắn
               muốn xoá nhà cung cấp này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
            <DialogClose as-child>
               <Button
                  v-if="actionState === 'update'"
                  @click="updateSupplier"
                  class="w-full"
               >
                  Cập nhật
               </Button>
               <Button
                  v-if="actionState === 'delete'"
                  @click="deleteSupplier(props.row.original.supplier_id)"
                  class="w-full"
                  variant="destructive"
               >
                  Xoá
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
   import { MoreHorizontal, Copy, Pencil, Trash } from 'lucide-vue-next';
   import type { Row } from '@tanstack/vue-table';
   import type { Supplier } from './schema';
   import SupplierForm from './SupplierForm.vue';
   import { computed, ref } from 'vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import SupplierService from '@/services/SupplierService';
   const { toast } = useToast();

   interface DataTableRowActionProps {
      row: Row<Supplier>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const supplierFormRef = ref<InstanceType<typeof SupplierForm> | null>(null);

   const actionState = ref<'add' | 'update' | 'delete'>('update');
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm nhà cung cấp mới';
         case 'update':
            return 'Sửa thông tin nhà cung cấp';
         case 'delete':
            return 'Xoá nhà cung cấp';
      }
   });

   const supplierData = ref<Supplier>();
   const handleSupplierData = (data: Supplier) => {
      supplierData.value = data;
   };

   const updateSupplier = async () => {
      if (supplierFormRef.value) {
         try {
            await supplierFormRef.value.onSubmit();

            if (supplierData.value) {
               const supplierId: string = supplierData.value.supplier_id;
               console.log(supplierId);
               await SupplierService.updateSupplier(
                  supplierId,
                  supplierData.value
               );
               toast({
                  description: 'Cập nhật thông tin nhà cung cấp thành công.',
                  class: 'bg-emerald-600 text-white',
               });
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.statusText === 'Forbidden') {
               toast({
                  variant: 'destructive',
                  description:
                     'Chỉ nhân viên mới có quyền thay đổi thông tin nhà cung cấp',
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

   const deleteSupplier = async (supplierId: string) => {
      try {
         await SupplierService.deleteSupplier(supplierId);
         toast({
            description: 'Xoá nhà cung cấp thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.statusText === 'Forbidden') {
            toast({
               variant: 'destructive',
               description: 'Chỉ nhân viên mới có quyền xoá nhà cung cấp',
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
