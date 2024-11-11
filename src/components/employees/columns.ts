import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import DataTableDropDown from '@/components/employees/DataTableDropDown.vue';
import type { Employee } from './schema';
import { Button } from '@/components/ui/button';

const vietnameseCollator = new Intl.Collator('vi', { sensitivity: 'base' });
const sortingFn = (rowA: any, rowB: any, columnId: string) => {
   const valueA: string = rowA.getValue(columnId);
   const valueB: string = rowB.getValue(columnId);
   return vietnameseCollator.compare(valueA, valueB);
};

export const columns: ColumnDef<Employee>[] = [
   {
      accessorKey: 'employee_id',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Mã nhân viên' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('employee_id')),
   },
   {
      accessorKey: 'username',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Tên đăng nhập' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('username')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'fullname',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Họ và tên' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('fullname')),
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
      accessorKey: 'phoneNumber',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Số điện thoại' });
      },
      cell: ({ row }) => h('div', { class: '' }, row.getValue('phoneNumber')),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'role',
      header: ({ column }) => {
         return h(DataTableColumnHeader, { column, title: 'Vị trí' });
      },
      cell: ({ row }) =>
         h(
            'div',
            { class: '' },
            row.getValue('role') === 'staff' ? 'Nhân viên' : 'Quản lý'
         ),
      sortingFn: sortingFn,
   },
   {
      accessorKey: 'isLocked',
      header: ({ column }) => {
         return h(DataTableColumnHeader, {
            column,
            title: 'Trạng thái tài khoản',
         });
      },
      cell: ({ row }) =>
         h(
            'div',
            { class: '' },
            row.getValue('isLocked') === 0
               ? h(
                    Button,
                    { class: 'bg-emerald-600 text-white' },
                    'Đang hoạt động'
                 )
               : h(Button, { variant: 'destructive' }, 'Đã khoá')
         ),
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
