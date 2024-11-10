import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/received-notes/DataTableDropDown.vue';
import type { ReceivedNote } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<ReceivedNote>[] = [
   {
      accessorKey: 'received_note_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã phiếu nhập' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('received_note_id')),
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
      accessorKey: 'supplier_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhà cung cấp' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('supplier_id')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'received_date',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Ngày nhập' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('received_date')),
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
