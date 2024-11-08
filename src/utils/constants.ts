import {
   Pill,
   Tablets,
   Store,
   Factory,
   UsersRound,
   Contact,
   FileInput,
   FileOutput,
   ChartNoAxesCombined,
   HardDriveDownload,
   HardDriveUpload,
   UserRoundCheck,
   Settings,
} from 'lucide-vue-next';

const MENU_ITEMS = [
   {
      title: 'Chung',
      items: [
         {
            icon: Pill,
            text: 'Thuốc',
            view: 'medicine-view',
         },
         {
            icon: Tablets,
            text: 'Loại thuốc',
            view: 'medicine-categories-view',
         },
         {
            icon: Store,
            text: 'Nhà cung cấp',
            view: 'suppliers-view',
         },
         {
            icon: Factory,
            text: 'Hãng sản xuất',
            view: 'manufacturers-view',
         },
         {
            icon: UsersRound,
            text: 'Khách hàng',
            view: 'customers-view',
         },
         {
            icon: Contact,
            text: 'Nhân viên',
            view: 'employees-view',
         },
         {
            icon: FileInput,
            text: 'Phiếu nhập',
            view: 'received-notes-view',
         },
         {
            icon: FileOutput,
            text: 'Phiếu xuất',
            view: 'delivery-notes-view',
         },
      ],
   },
   {
      title: 'Thống kê',
      items: [
         {
            icon: ChartNoAxesCombined,
            text: 'Thống kê',
            view: 'statistics-view',
         },
         {
            icon: HardDriveDownload,
            text: 'Nhập dữ liệu',
            view: 'import-data-view',
         },
         {
            icon: HardDriveUpload,
            text: 'Xuất dữ liệu',
            view: 'export-data-view',
         },
      ],
   },
   {
      title: 'Khác',
      items: [
         {
            icon: UserRoundCheck,
            text: 'Tài khoản',
            view: 'account-view',
         },
         {
            icon: Settings,
            text: 'Cài đặt',
            view: 'settings-view',
         },
      ],
   },
];

export { MENU_ITEMS };
