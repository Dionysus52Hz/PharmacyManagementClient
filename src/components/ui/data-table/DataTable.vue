<template>
   <div class="flex py-4 gap-x-20">
      <slot name="table-statistics"></slot>
      <DataTableToolbar
         :table="table"
         :filtered-column="filteredColumn"
      >
         <slot name="filters-selection"></slot>
         <slot name="action-buttons"></slot>
      </DataTableToolbar>
   </div>

   <div class="border rounded-md">
      <Table>
         <TableHeader>
            <TableRow
               v-for="headerGroup in table.getHeaderGroups()"
               :key="headerGroup.id"
               class="bg-gray-100"
            >
               <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  class="pr-8"
               >
                  <FlexRender
                     v-if="!header.isPlaceholder"
                     :render="header.column.columnDef.header"
                     :props="header.getContext()"
                  ></FlexRender>
               </TableHead>
            </TableRow>
         </TableHeader>

         <TableBody>
            <template v-if="table.getRowModel().rows?.length">
               <TableRow
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  :data-state="row.getIsSelected() ? 'selected' : undefined"
               >
                  <TableCell
                     v-for="cell in row.getVisibleCells()"
                     :key="cell.id"
                     class="pl-7 py-3 font-medium"
                  >
                     <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                     ></FlexRender>
                  </TableCell>
               </TableRow>
            </template>

            <template v-else>
               <TableRow>
                  <TableCell
                     :colspan="columns.length"
                     class="h-24 text-center"
                  >
                     Không có kết quả nào.
                  </TableCell>
               </TableRow>
            </template>
         </TableBody>
      </Table>
   </div>

   <DataTablePagination :table="table"></DataTablePagination>
</template>

<script setup lang="ts" generic="TData, TValue">
   import type {
      ColumnDef,
      SortingState,
      ColumnFiltersState,
   } from '@tanstack/vue-table';

   import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
   } from '@/components/ui/table';
   import {
      FlexRender,
      getCoreRowModel,
      getPaginationRowModel,
      getSortedRowModel,
      getFilteredRowModel,
      useVueTable,
   } from '@tanstack/vue-table';
   import { valueUpdater } from '@/lib/utils';
   import { ref } from 'vue';
   import {
      DataTablePagination,
      DataTableToolbar,
   } from '@/components/ui/data-table';

   const emit = defineEmits(['reset-data']);

   const props = defineProps<{
      columns: ColumnDef<TData, TValue>[];
      data: TData[];
      filteredColumn: string;
   }>();

   const sorting = ref<SortingState>([]);
   const columnFilters = ref<ColumnFiltersState>([]);

   const table = useVueTable({
      get data() {
         return props.data;
      },
      get columns() {
         return props.columns;
      },
      state: {
         get sorting() {
            return sorting.value;
         },
         get columnFilters() {
            return columnFilters.value;
         },
      },
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: (updaterOrValue) =>
         valueUpdater(updaterOrValue, sorting),
      onColumnFiltersChange: (updaterOrValue) =>
         valueUpdater(updaterOrValue, columnFilters),
   });
</script>
