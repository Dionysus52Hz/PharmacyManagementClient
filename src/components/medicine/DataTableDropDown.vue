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

            <DropdownMenuItem @click="copyId(props.row.original.medicine_id)">
               <Copy class="w-5 h-5" />
               Sao chép mã thuốc
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'update'">
                  <Pencil class="h-5 w-5" />Sửa thông tin thuốc
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá thuốc
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
            <MedicineForm
               v-if="actionState === 'update'"
               ref="medicineFormRef"
               :default-values="props.row.original"
               @send-value="handleMedicineData"
               :disabled-input="true"
            >
            </MedicineForm>
            <p v-if="actionState === 'delete'">
               Việc xoá thông tin thuốc không thể hoàn tác. Bạn chắc chắn muốn
               xoá thuốc này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
            <Button
               v-if="actionState === 'update'"
               @click="updateMedicine"
               class="w-full"
            >
               Cập nhật
            </Button>

            <DialogClose asChild>
               <Button
                  v-if="actionState === 'delete'"
                  @click="deleteMedicine(props.row.original.medicine_id)"
                  class="w-full"
                  variant="destructive"
               >
                  Xoá
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
   import { MoreHorizontal, Copy, Pencil, Trash } from 'lucide-vue-next';
   import type { Row } from '@tanstack/vue-table';
   import type { Medicine } from './schema';
   import MedicineForm from '@/components/medicine/MedicineForm.vue';
   import { computed, ref } from 'vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import MedicineService from '@/services/MedicineService';
   const { toast } = useToast();

   interface DataTableRowActionProps {
      row: Row<Medicine>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const medicineFormRef = ref<InstanceType<typeof MedicineForm> | null>(null);

   const actionState = ref<'add' | 'update' | 'delete'>('update');
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm thuốc mới';
         case 'update':
            return 'Sửa thông tin thuốc';
         case 'delete':
            return 'Xoá thông tin thuốc';
      }
   });

   const medicineData = ref<Medicine>();
   const handleMedicineData = (data: Medicine) => {
      medicineData.value = data;
   };

   const updateMedicine = async () => {
      if (medicineFormRef.value) {
         try {
            await medicineFormRef.value.onSubmit();

            if (medicineData.value) {
               const medicineId: string = medicineData.value.medicine_id;
               await MedicineService.updateMedicine(
                  medicineId,
                  medicineData.value
               );
               toast({
                  description: 'Cập nhật thông tin thuốc thành công.',
                  class: 'bg-emerald-600 text-white',
               });
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.data.code === 'ER_DUP_ENTRY') {
               toast({
                  variant: 'destructive',
                  description: 'Mã thuốc đã tồn tại!',
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

   const deleteMedicine = async (medicineId: string) => {
      try {
         await MedicineService.deleteMedicine(medicineId);
         toast({
            description: 'Xoá thông tin thuốc thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.data.code === 'ER_DUP_ENTRY') {
            toast({
               variant: 'destructive',
               description: 'Mã thuốc đã tồn tại!',
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
