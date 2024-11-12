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

            <DropdownMenuItem
               @click="copyId(props.row.original.manufacturer_id)"
            >
               <Copy class="w-5 h-5" />
               Sao chép mã hãng
            </DropdownMenuItem>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'update'">
                  <Pencil class="h-5 w-5" />Sửa thông tin hãng
               </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
               <DropdownMenuItem @click="actionState = 'delete'">
                  <Trash class="w-5 h-5" />Xoá hãng
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
            <ManufacturerForm
               v-if="actionState === 'add' || actionState === 'update'"
               ref="manufacturerFormRef"
               :default-values="props.row.original"
               :disabled-input="true"
               @send-value="handleManufacturerData"
            >
            </ManufacturerForm>
            <p v-if="actionState === 'delete'">
               Việc xoá thông tin hãng sản xuất không thể hoàn tác. Bạn chắc
               chắn muốn xoá hãng sản xuất này?
            </p>
         </div>

         <DialogFooter class="flex !flex-col p-6 pt-2 gap-y-4">
            <Button
               v-if="actionState === 'update'"
               @click="updateManufacturer"
               class="w-full"
            >
               Cập nhật
            </Button>

            <DialogClose as-child>
               <Button
                  v-if="actionState === 'delete'"
                  @click="
                     deleteManufacturer(props.row.original.manufacturer_id)
                  "
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
   import type { Manufacturer } from './schema';
   import ManufacturerForm from '@/components/manufacturers/ManufacturerForm.vue';
   import { computed, ref } from 'vue';
   import { useToast } from '@/components/ui/toast/use-toast';
   import ManufacturerService from '@/services/ManufacturerService';
   const { toast } = useToast();

   interface DataTableRowActionProps {
      row: Row<Manufacturer>;
   }

   const props = defineProps<DataTableRowActionProps>();

   const copyId = (id: string) => {
      navigator.clipboard.writeText(id);
      console.log(id);
   };

   const manufacturerFormRef = ref<InstanceType<
      typeof ManufacturerForm
   > | null>(null);

   const actionState = ref<'add' | 'update' | 'delete'>('update');
   const dialogHeaderTitle = computed(() => {
      switch (actionState.value) {
         case 'add':
            return 'Thêm hãng sản xuất mới';
         case 'update':
            return 'Sửa thông tin hãng sản xuất';
         case 'delete':
            return 'Xoá thông tin hãng sản xuất';
      }
   });

   const manufacturerData = ref<Manufacturer>();
   const handleManufacturerData = (data: Manufacturer) => {
      manufacturerData.value = data;
   };

   const updateManufacturer = async () => {
      if (manufacturerFormRef.value) {
         try {
            await manufacturerFormRef.value.onSubmit();

            if (manufacturerData.value) {
               const manufacturerId: string =
                  manufacturerData.value.manufacturer_id;
               console.log(manufacturerId);
               await ManufacturerService.updateManufacturer(
                  manufacturerId,
                  manufacturerData.value
               );
               toast({
                  description: 'Cập nhật thông tin hãng sản xuất thành công.',
                  class: 'bg-emerald-600 text-white',
               });
            }
         } catch (error: any) {
            console.log(error);
            if (error.response.statusText === 'Forbidden') {
               toast({
                  variant: 'destructive',
                  description:
                     'Chỉ nhân viên mới có quyền thay đổi thông tin hãng sản xuất',
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

   const deleteManufacturer = async (manufacturerId: string) => {
      try {
         await ManufacturerService.deleteManufacturer(manufacturerId);
         toast({
            description: 'Xoá hãng sản xuất thành công.',
            class: 'bg-emerald-600 text-white',
         });
      } catch (error: any) {
         console.log(error);
         if (error.response.statusText === 'Forbidden') {
            toast({
               variant: 'destructive',
               description: 'Chỉ nhân viên mới có quyền xoá hãng sản xuất',
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
