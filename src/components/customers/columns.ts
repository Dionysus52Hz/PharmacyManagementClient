import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/customers/DataTableDropDown.vue';
import type { Customer } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<Customer>[] = [
   {
      accessorKey: 'customer_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã khách hàng' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('customer_id')),
   },
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Họ và tên' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'phone',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Số điện thoại' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('phone')),
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
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
         return h('div', { class: 'relative' }, h(DataTableDropDown, { row }));
      },
   },
];
