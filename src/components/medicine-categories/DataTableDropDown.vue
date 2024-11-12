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
               :disabled-input="true"
               @send-value="handleCategoryData"
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
               @click="updateCategory"
               class="w-full"
            >
               Cập nhật
            </Button>

            <DialogClose as-child>
               <Button
                  v-if="actionState === 'delete'"
                  @click="deleteCategory(props.row.original.category_id)"
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
   import type { MedicineCategory } from './schema';
   import MedicineCategoryForm from './MedicineCategoryForm.vue';
   import { computed, ref } from 'vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import MedicineCategoryService from '@/services/MedicineCategoryService';
   const { toast } = useToast();

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

   const categoryData = ref<MedicineCategory>();
   const handleCategoryData = (data: MedicineCategory) => {
      categoryData.value = data;
   };

   const updateCategory = async () => {
      if (medicineCategoryFormRef.value) {
         try {
            await medicineCategoryFormRef.value.onSubmit();

            if (categoryData.value) {
               const categoryId: string = categoryData.value.category_id;
               console.log(categoryId);
               await MedicineCategoryService.updateMedicineCategory(
                  categoryId,
                  categoryData.value
               );
               toast({
                  description: 'Cập nhật thông tin loại thuốc thành công.',
                  class: 'bg-emerald-600 text-white',
               });
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.statusText === 'Forbidden') {
               toast({
                  variant: 'destructive',
                  description:
                     'Chỉ nhân viên mới có quyền thay đổi thông tin loại thuốc',
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

   const deleteCategory = async (categoryId: string) => {
      try {
         await MedicineCategoryService.deleteMedicineCategory(categoryId);
         toast({
            description: 'Xoá loại thuốc thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.statusText === 'Forbidden') {
            toast({
               variant: 'destructive',
               description: 'Chỉ nhân viên mới có quyền xoá loại thuốc',
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
