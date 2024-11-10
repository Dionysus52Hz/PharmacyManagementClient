import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/delivery-notes/DataTableDropDown.vue';
import type { DeliveryNote } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<DeliveryNote>[] = [
   {
      accessorKey: 'delivery_note_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã phiếu xuất' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('delivery_note_id')),
   },
   {
      accessorKey: 'employee_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhân viên' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('employee_id')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'customer_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã khách hàng' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('customer_id')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'delivery_date',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Ngày nhập' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('delivery_date')),
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
