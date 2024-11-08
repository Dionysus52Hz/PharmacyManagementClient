import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/manufacturers/DataTableDropDown.vue';
import type { Manufacturer } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });

export const columns: ColumnDef<Manufacturer>[] = [
   {
      accessorKey: 'manufacturer_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã hãng sản xuất' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('manufacturer_id')),
   },
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, {
            column,
            title: 'Tên hãng sản xuất',
         });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
   },
   {
      accessorKey: 'nation',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Quốc gia' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('nation')),
      sortingFn: (rowA, rowB, columnId) => {
         const valueA: string = rowA.getValue(columnId);
         const valueB: string = rowB.getValue(columnId);
         return vietnameseCollator.compare(valueA, valueB);
      },
   },
   {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
         return h('div', { class: 'relative' }, h(DataTableDropDown, { row }));
      },
   },
];
