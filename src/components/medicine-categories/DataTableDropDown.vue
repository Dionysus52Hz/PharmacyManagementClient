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

            <DropdownMenuItem @click="copyId(props.row.original.category_id)">
               <Copy class="w-5 h-5" />
               Sao chép mã loại
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'update'">
                  <Pencil class="h-5 w-5" />Sửa thông tin loại thuốc
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá loại thuốc
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
            <MedicineCategoryForm
               v-if="actionState === 'add' || actionState === 'update'"
               ref="medicineCategoryFormRef"
               :default-values="props.row.original"
            >
            </MedicineCategoryForm>
            <p v-if="actionState === 'delete'">
               Việc xoá loại thuốc không thể hoàn tác. Bạn chắc chắn muốn xoá
               loại thuốc này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
            <Button
               v-if="actionState === 'update'"
               @click="updateMedicineCategory"
               class="w-full"
            >
               Cập nhật
            </Button>

            <Button
               v-if="actionState === 'delete'"
               @click="deleteMedicineCategory(props.row.original.category_id)"
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
   import type { MedicineCategory } from './schema';
   import MedicineCategoryForm from './MedicineCategoryForm.vue';
   import { computed, ref } from 'vue';

   interface DataTableRowActionProps {
      row: Row<MedicineCategory>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const medicineCategoryFormRef = ref<InstanceType<
      typeof MedicineCategoryForm
   > | null>(null);

   const actionState = ref<'add' | 'update' | 'delete'>('update');
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm loại thuốc mới';
         case 'update':
            return 'Sửa thông tin loại thuốc';
         case 'delete':
            return 'Xoá loại thuốc';
      }
   });

   const updateMedicineCategory = () => {
      if (medicineCategoryFormRef.value) {
         medicineCategoryFormRef.value.onSubmit();
      }
   };
   const deleteMedicineCategory = (medicineCategoryId: string) => {
      console.log(medicineCategoryId);
   };
</script>
