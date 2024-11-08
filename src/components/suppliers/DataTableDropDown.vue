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
            >
            </SupplierForm>
            <p v-if="actionState === 'delete'">
               Việc xoá thông tin nhà cung cấp không thể hoàn tác. Bạn chắc chắn
               muốn xoá nhà cung cấp này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
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
   import { MoreHorizontal, Copy, Pencil, Trash } from 'lucide-vue-next';
   import type { Row } from '@tanstack/vue-table';
   import type { Supplier } from './schema';
   import SupplierForm from './SupplierForm.vue';
   import { computed, ref } from 'vue';

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
            return 'Xoá thông tin nhà cung cấp';
      }
   });

   const updateSupplier = () => {
      if (supplierFormRef.value) {
         supplierFormRef.value.onSubmit();
      }
   };
   const deleteSupplier = (supplierId: string) => {
      console.log(supplierId);
   };
</script>
