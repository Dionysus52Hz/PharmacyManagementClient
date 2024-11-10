<template>
   <div class="grid grid-cols-4 py-6 items-start">
      <div class="flex items-center space-x-2">
         <p class="text-sm">Số dòng trên trang</p>

         <Select
            :model-value="`${table.getState().pagination.pageSize}`"
            @update:model-value="(e) => table.setPageSize(Number(e))"
         >
            <SelectTrigger class="h-full w-[70px]">
               <SelectValue
                  :placeholder="`${table.getState().pagination.pageSize}`"
               ></SelectValue>
            </SelectTrigger>

            <SelectContent side="top">
               <SelectItem
                  v-for="pageSize in [10, 20, 30, 40, 50]"
                  :key="pageSize"
                  :value="`${pageSize}`"
                  >{{ pageSize }}</SelectItem
               >
            </SelectContent>
         </Select>
      </div>

      <Pagination
         v-slot="{ page }"
         :total="table.getRowCount()"
         :sibling-count="1"
         :items-per-page="table.getState().pagination.pageSize"
         show-edges
         :default-page="1"
         class="col-span-2 flex justify-center"
      >
         <PaginationList
            v-slot="{ items }"
            class="flex items-center gap-1"
         >
            <TooltipProvider :delay-duration="delayDurationTooltip">
               <Tooltip>
                  <TooltipTrigger>
                     <PaginationFirst @click="table.setPageIndex(0)" />
                  </TooltipTrigger>
                  <TooltipContent class="bg-primary text-white">
                     <p>Về trang đầu tiên</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>

            <TooltipProvider :delay-duration="delayDurationTooltip">
               <Tooltip>
                  <TooltipTrigger>
                     <PaginationPrev @click="table.previousPage()" />
                  </TooltipTrigger>
                  <TooltipContent class="bg-primary text-white">
                     <p>Về trang trước</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>

            <template v-for="(item, index) in items">
               <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                  @click="table.setPageIndex(item.value - 1)"
               >
                  <Button
                     class="w-10 h-10 p-0"
                     :variant="item.value === page ? 'default' : 'outline'"
                  >
                     {{ item.value }}
                  </Button>
               </PaginationListItem>
               <PaginationEllipsis
                  v-else
                  :key="item.type"
                  :index="index"
               />
            </template>

            <TooltipProvider :delay-duration="delayDurationTooltip">
               <Tooltip>
                  <TooltipTrigger>
                     <PaginationNext @click="table.nextPage()" />
                  </TooltipTrigger>
                  <TooltipContent class="bg-primary text-white">
                     <p>Đến trang kế tiếp</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>

            <TooltipProvider :delay-duration="delayDurationTooltip">
               <Tooltip>
                  <TooltipTrigger>
                     <PaginationLast
                        @click="table.setPageIndex(table.getPageCount() - 1)"
                     />
                  </TooltipTrigger>
                  <TooltipContent class="bg-primary text-white">
                     <p>Đến trang cuối</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </PaginationList>
      </Pagination>

      <div
         class="h-10 flex items-center justify-end gap-x-1 text-sm font-medium"
      >
         Trang
         <span class="font-bold"
            >{{ table.getState().pagination.pageIndex + 1 }}
         </span>
         trên
         <span class="font-bold">{{ table.getPageCount() }}</span>
      </div>
   </div>
</template>

<script setup lang="ts">
   import type { Table } from '@tanstack/vue-table';
   import { Button } from '@/components/ui/button';
   import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';
   import {
      Pagination,
      PaginationEllipsis,
      PaginationFirst,
      PaginationLast,
      PaginationList,
      PaginationListItem,
      PaginationNext,
      PaginationPrev,
   } from '@/components/ui/pagination';
   import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
   } from '@/components/ui/tooltip';

   const delayDurationTooltip = 500;

   interface DataTablePaginationProps {
      table: Table<any>;
   }

   defineProps<DataTablePaginationProps>();
</script>
