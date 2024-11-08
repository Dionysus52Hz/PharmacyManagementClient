import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/suppliers/DataTableDropDown.vue';
import type { Supplier } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<Supplier>[] = [
   {
      accessorKey: 'supplier_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhà cung cấp' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('supplier_id')),
   },
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Tên nhà cung cấp' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'address',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Địa chỉ' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('address')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'representative',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Người đại diện' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('representative')),
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
