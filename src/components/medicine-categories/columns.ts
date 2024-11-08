import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/medicine-categories/DataTableDropDown.vue';
import type { MedicineCategory } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<MedicineCategory>[] = [
   {
      accessorKey: 'category_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã loại' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('category_id')),
   },
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Tên loại' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'description',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mô tả' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('description')),
      sortingFn: sortingFn,
   },
   {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
         return h('div', { class: 'relative' }, h(DataTableDropDown, { row }));
      },
   },
];
