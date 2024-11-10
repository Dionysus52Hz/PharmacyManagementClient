import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import type { ReceivedNoteDetails } from './schema';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<ReceivedNoteDetails>[] = [
   {
      accessorKey: 'received_note_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã phiếu nhập' });
      },
      cell: ({ row }) =>
         h('div', { class: '' }, row.getValue('received_note_id')),
   },
   {
      accessorKey: 'medicine_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã thuốc' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('medicine_id')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'medicine_name',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Tên thuốc' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('medicine_name')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'quantity',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Số lượng' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('quantity')),
   },
   {
      accessorKey: 'price',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Đơn giá' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('price')),
   },
   // {
   //    id: 'actions',
   //    enableHiding: false,
   //    cell: ({ row }) => {
   //       return h('div', { class: 'relative' }, h(DataTableDropDown, { row }));
   //    },
   // },
];
