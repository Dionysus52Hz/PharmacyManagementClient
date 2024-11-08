import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/medicine/DataTableDropDown.vue';
import type { Medicine } from './schema';

export const columns: ColumnDef<Medicine>[] = [
   {
      accessorKey: 'medicine_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã thuốc' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('medicine_id')),
   },
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Tên thuốc' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
   },
   {
      accessorKey: 'manufacturer_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhà sản xuất' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('manufacturer_id')),
   },
   {
      accessorKey: 'supplier_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhà cung cấp' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('supplier_id')),
   },
   {
      accessorKey: 'effects',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Công dụng' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('effects')),
   },
   {
      accessorKey: 'category_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã loại' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('category_id')),
   },

   {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
         return h('div', { class: 'relative' }, h(DataTableDropDown, { row }));
      },
   },
];
