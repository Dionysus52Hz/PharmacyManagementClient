<template>
   <div class="employee-view">
      <div class="title px-6 flex flex-col gap-y-2">
         <h1 class="font-bold text-[32px] leading-none">Xuất dữ liệu</h1>
         <h3 class="font-semibold text-sm text-gray-500">
            Lưu dữ liệu về thiết bị của bạn tại đây.
         </h3>
      </div>
      <div class="px-6 py-8">
         <Card class="w-[500px]">
            <CardHeader>
               <CardTitle>Định dạng tập tin</CardTitle>
            </CardHeader>
            <CardContent>
               <form
                  class="w-full px-6 py-4 pb-0 space-y-6"
                  @submit="onSubmit"
               >
                  <FormField
                     v-slot="{ componentField }"
                     name="dataType"
                  >
                     <FormItem
                        class=""
                        v-auto-animate
                     >
                        <FormLabel>Chọn dữ liệu</FormLabel>

                        <Select v-bind="componentField">
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue
                                    placeholder="Chọn dữ liệu cần xuất"
                                 />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem
                                    :value="type.value"
                                    v-for="type in dataTypesSelection"
                                 >
                                    {{ type.title }}</SelectItem
                                 >
                              </SelectGroup>
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <FormField
                     v-slot="{ componentField }"
                     name="fileFormat"
                  >
                     <FormItem
                        class=""
                        v-auto-animate
                     >
                        <FormLabel>Chọn định dạng</FormLabel>

                        <Select
                           v-bind="componentField"
                           @update:model-value="
                              (e) => {
                                 console.log(e);
                                 fileFormat = e;
                                 console.log(fileFormat);
                              }
                           "
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue
                                    placeholder="Chọn định dạng tập tin"
                                 />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem value="xlsx">
                                    Tập tin Excel</SelectItem
                                 >
                                 <SelectItem value="csv">
                                    Tập tin CSV
                                 </SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <FormField
                     v-slot="{ componentField }"
                     name="fileName"
                  >
                     <FormItem v-auto-animate>
                        <FormLabel>Tên tập tin</FormLabel>
                        <FormControl>
                           <div class="relative w-full items-center">
                              <Input
                                 id="search"
                                 type="text"
                                 placeholder="Nhập tên tập tin..."
                                 class="pl-10"
                                 v-bind="componentField"
                              />
                              <span
                                 class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                              >
                                 <FileSpreadsheet
                                    class="size-6 text-muted-foreground"
                                 />
                              </span>
                              <span
                                 class="absolute end-0 inset-y-0 flex items-center justify-center px-4"
                              >
                                 .{{ fileFormat }}
                              </span>
                           </div>
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  </FormField>

                  <div class="flex justify-end">
                     <Button
                        type="submit"
                        class="!mt-0"
                        >Xuất dữ liệu</Button
                     >
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   </div>
</template>

<script setup lang="ts">
   import exportFromJSON from 'export-from-json';
   import MedicineService from '@/services/MedicineService';
   import { toTypedSchema } from '@vee-validate/zod';
   import * as z from 'zod';
   import { useForm } from 'vee-validate';
   import { FileSpreadsheet } from 'lucide-vue-next';
   import { Button } from '@/components/ui/button';
   import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
   } from '@/components/ui/card';
   import {
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
   } from '@/components/ui/form';
   import {
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectTrigger,
      SelectValue,
   } from '@/components/ui/select';
   import { Input } from '@/components/ui/input';
   import { computed, ref } from 'vue';
   import { vAutoAnimate } from '@formkit/auto-animate';
   import { useToast } from '@/components/ui/toast/use-toast';
   import MedicineCategoryService from '@/services/MedicineCategoryService';
   import SupplierService from '@/services/SupplierService';
   import ManufacturerService from '@/services/ManufacturerService';
   import CustomerService from '@/services/CustomerService';
   import EmployeeService from '@/services/EmployeeService';
   import ReceivedNoteService from '@/services/ReceivedNoteService';
   import ReceivedNoteDetailsService from '@/services/ReceivedNoteDetailsService';
   import DeliveryNoteService from '@/services/DeliveryNoteService';
   import DeliveryNoteDetailsService from '@/services/DeliveryNoteDetailsService';
   const { toast } = useToast();

   const dataTypesSelection = [
      {
         value: 'medicine',
         title: 'Thuốc',
      },
      {
         value: 'medicine-categories',
         title: 'Phân loại thuốc',
      },
      {
         value: 'suppliers',
         title: 'Nhà cung cấp',
      },
      {
         value: 'manufacturers',
         title: 'Hãng sản xuất',
      },
      {
         value: 'customers',
         title: 'Khách hàng',
      },
      {
         value: 'employees',
         title: 'Nhân viên',
      },
      {
         value: 'received-notes',
         title: 'Phiếu nhập',
      },
      {
         value: 'received-note-details',
         title: 'Chi tiết phiếu nhập',
      },
      {
         value: 'delivery-notes',
         title: 'Phiếu xuất',
      },
      {
         value: 'delivery-note-details',
         title: 'Chi tiết phiếu xuất',
      },
   ];

   const formExportSchema = toTypedSchema(
      z.object({
         dataType: z.string({
            required_error: 'Vui lòng chọn loại dữ liệu',
         }),
         fileName: z
            .string({
               required_error: 'Vui lòng nhập tên tập tin',
            })
            .min(1, { message: 'Vui lòng nhập tên tập tin' }),
         fileFormat: z.string({
            required_error: 'Vui lòng chọn định dạng tập tin',
         }),
      })
   );

   const fileFormat = ref<string>('xlsx');
   const { handleSubmit, resetForm } = useForm({
      validationSchema: formExportSchema,
   });

   import { export_json_to_excel } from '@/utils/Export2Excel';
   import { onMounted } from 'vue';
   const formatJSON = (filterData: any, JSONData: any) => {
      return JSONData.map((v: any) =>
         filterData.map((f: any) => {
            return v[f];
         })
      );
   };

   const createKeyMap = (oldKeys: string[], newKeys: string[]) => {
      const keyMap: any = {};

      if (oldKeys.length !== newKeys.length) {
         throw new Error('Hai mảng phải có cùng độ dài.');
      }
      for (let i = 0; i < oldKeys.length; i++) {
         keyMap[oldKeys[i]] = newKeys[i];
      }
      return keyMap;
   };

   const transformKeys = (rawData: any[], keyMap: any) => {
      return rawData.map((obj) => {
         return Object.keys(obj).reduce((acc: any, key: string) => {
            if (keyMap[key]) {
               acc[keyMap[key]] = obj[key];
            }
            return acc;
         }, {});
      });
   };

   const joinArrays = (arrayA: any[], arrayB: any[], keyToMatch: string) => {
      return arrayA.flatMap((itemA) => {
         const matchingB = arrayB.filter(
            (itemB) => itemB[keyToMatch] === itemA[keyToMatch]
         );

         return matchingB.map((itemB) => ({
            ...itemA,
            ...itemB,
         }));
      });
   };

   const populateArrays = (
      arrayA: any[],
      arrayB: any[],
      keyToMatch: string
   ) => {
      return arrayA
         .map((itemA) => {
            const matchingB = arrayB.find(
               (itemB) => itemB[keyToMatch] === itemA[keyToMatch]
            );

            return {
               ...itemA,
               ...(matchingB || {}),
            };
         })
         .filter((item) => item[keyToMatch]);
   };

   const removeKeyFromArray = (array: any[], keyToRemove: string) => {
      return array.map((item) => {
         const { [keyToRemove]: _, ...rest } = item;
         return rest;
      });
   };

   const formatDate = (array: any[], keyDate: string) => {
      array.map((item: any) => {
         const date = new Date(item[keyDate]);
         const formattedDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
         });
         item[keyDate] = formattedDate;
      });
   };

   const formatCurrency = (array: any[], keyCurrency: string) => {
      array.map((item: any) => {
         const formattedPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
         }).format(item[keyCurrency]);
         item[keyCurrency] = formattedPrice;
      });
   };

   const export2CSV = (fileName: string) => {
      field.value = Object.keys(rawData.value[0]);
      const keyMap = createKeyMap(field.value, header.value);
      let data: any[] = rawData.value;
      data = transformKeys(data, keyMap);
      exportFromJSON({ data, fileName, exportType: 'csv' });
   };

   const header = ref<string[]>([]);
   const field = ref<string[]>([]);
   const rawData = ref<any[]>([]);
   const handleData = ref([]);
   const export2Excel = (fileName: string) => {
      handleData.value = formatJSON(field.value, rawData.value);
      console.log('handleData:', handleData.value);
      export_json_to_excel({
         header: header.value,
         data: handleData.value,
         sheetName: fileName,
         filename: fileName,
         autoWidth: true,
         bookType: 'xlsx',
      });
   };
   const exportData = async (
      fileName: string,
      fileFormat: 'xlsx' | 'csv',
      dataType:
         | 'medicine'
         | 'medicine-categories'
         | 'suppliers'
         | 'manufacturers'
         | 'customers'
         | 'employees'
         | 'received-notes'
         | 'received-note-details'
         | 'delivery-notes'
         | 'delivery-note-details'
   ) => {
      switch (fileFormat) {
         case 'xlsx':
            switch (dataType) {
               case 'medicine':
                  // console.log(fileName, 'xlsx', 'medicine');
                  header.value = [
                     'Mã thuốc',
                     'Tên thuốc',
                     'Mã nhà sản xuất',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại',
                     'Số lượng',
                     'Giá',
                  ];
                  rawData.value = await MedicineService.getAllMedicine();
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  break;
               case 'medicine-categories':
                  header.value = ['Mã loại', 'Tên loại', 'Mô tả'];
                  rawData.value = (
                     await MedicineCategoryService.getAllMedicineCategories()
                  ).data;
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'medicine-categories');
                  break;
               case 'suppliers':
                  header.value = [
                     'Mã nhà cung cấp',
                     'Tên nhà cung cấp',
                     'Địa chỉ',
                     'Người đại diện',
                  ];
                  rawData.value = (
                     await SupplierService.getAllSuppliers()
                  ).data;
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'suppliers');
                  break;
               case 'manufacturers':
                  header.value = [
                     'Mã hãng sản xuất',
                     'Tên hãng sản xuất',
                     'Quốc gia',
                  ];
                  rawData.value = (
                     await ManufacturerService.getAllManufacturers()
                  ).data;
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'manufacturers');
                  break;
               case 'customers':
                  header.value = [
                     'Mã khách hàng',
                     'Họ và tên',
                     'Số điện thoại',
                     'Địa chỉ',
                  ];
                  rawData.value = (
                     await CustomerService.getAllCustomers()
                  ).data;
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'customers');

                  break;
               case 'employees':
                  header.value = [
                     'Mã nhân viên',
                     'Tên đăng nhập',
                     'Họ và tên',
                     'Địa chỉ',
                     'Số điện thoại',
                     'Vị trí',
                     'Trạng thái tài khoản',
                  ];
                  rawData.value = (
                     await EmployeeService.getAllEmployees()
                  ).users;
                  rawData.value.map((item: any) => {
                     if (item.role === 'staff') {
                        item.role = 'Nhân viên';
                     }
                     if (item.role === 'admin') {
                        item.role = 'Quản lý';
                     }
                     if (item.isLocked === 0) {
                        item.isLocked = 'Đang hoạt động';
                     }
                     if (item.isLocked === 1) {
                        item.isLocked = 'Đã khoá';
                     }
                  });
                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'employees');

                  break;
               case 'received-notes':
                  header.value = [
                     'Mã phiếu nhập',
                     'Mã nhân viên',
                     'Mã nhà cung cấp',
                     'Ngày nhập',
                     'Tổng giá trị',
                  ];
                  rawData.value = await ReceivedNoteService.getAllNotes();
                  rawData.value.map((item: any) => {
                     const date = new Date(item.received_date);
                     const formattedDate = date.toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                     });
                     item.received_date = formattedDate;
                     const formattedPrice = new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                     }).format(item.total_price);
                     item.total_price = formattedPrice;
                  });

                  console.log('rawData:', rawData.value);
                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'received-notes');

                  break;
               case 'received-note-details':
                  header.value = [
                     'Mã phiếu nhập',
                     'Mã nhân viên',
                     'Mã nhà cung cấp',
                     'Ngày nhập',
                     'Tổng giá trị',
                     'Mã thuốc',
                     'Số lượng',
                     'Đơn giá',
                     'Tên thuốc',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại thuốc',
                  ];
                  const receivedNote = await ReceivedNoteService.getAllNotes();
                  const receivedNoteDetails =
                     await ReceivedNoteDetailsService.getAllNoteDetails();
                  rawData.value = joinArrays(
                     receivedNote,
                     receivedNoteDetails,
                     'received_note_id'
                  );
                  const medicineData = await MedicineService.getAllMedicine();
                  rawData.value = populateArrays(
                     rawData.value,
                     medicineData,
                     'medicine_id'
                  );
                  formatDate(rawData.value, 'received_date');
                  formatCurrency(rawData.value, 'price');
                  formatCurrency(rawData.value, 'total_price');
                  removeKeyFromArray(rawData.value, 'total_price');
                  field.value = Object.keys(rawData.value[0]);
                  export2Excel(fileName);
                  break;
               case 'delivery-notes':
                  header.value = [
                     'Mã phiếu xuất',
                     'Mã nhân viên',
                     'Mã khách hàng',
                     'Ngày xuất',
                     'Tổng giá trị',
                     'Tên khách hàng',
                     'Số điện thoại khách hàng',
                     'Địa chỉ khách hàng',
                  ];
                  rawData.value = await DeliveryNoteService.getAllNotes();
                  const customers = (await CustomerService.getAllCustomers())
                     .data;
                  rawData.value = populateArrays(
                     rawData.value,
                     customers,
                     'customer_id'
                  );
                  formatDate(rawData.value, 'delivery_date');
                  formatCurrency(rawData.value, 'total_price');

                  console.log('rawData:', rawData.value);

                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2Excel(fileName);
                  console.log(fileName, 'xlsx', 'delivery-notes');
                  break;
               case 'delivery-note-details':
                  header.value = [
                     'Mã phiếu xuất',
                     'Mã nhân viên',
                     'Mã khách hàng',
                     'Ngày xuất',
                     'Tổng giá trị',
                     'Mã thuốc',
                     'Số lượng',
                     'Đơn giá',
                     'Tên thuốc',
                     'Mã hãng sản xuất',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại thuốc',
                  ];
                  const deliveryNotes = await DeliveryNoteService.getAllNotes();
                  const deliveryNoteDetails =
                     await DeliveryNoteDetailsService.getAllNoteDetails();
                  rawData.value = joinArrays(
                     deliveryNotes,
                     deliveryNoteDetails,
                     'delivery_note_id'
                  );

                  const medicines = await MedicineService.getAllMedicine();
                  rawData.value = populateArrays(
                     rawData.value,
                     medicines,
                     'medicine_id'
                  );
                  formatDate(rawData.value, 'delivery_date');
                  formatCurrency(rawData.value, 'price');
                  formatCurrency(rawData.value, 'total_price');
                  removeKeyFromArray(rawData.value, 'total_price');
                  field.value = Object.keys(rawData.value[0]);
                  export2Excel(fileName);
            }
            break;
         case 'csv':
            switch (dataType) {
               case 'medicine':
                  header.value = [
                     'Mã thuốc',
                     'Tên thuốc',
                     'Mã nhà sản xuất',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại',
                     'Số lượng',
                     'Giá',
                  ];

                  rawData.value = await MedicineService.getAllMedicine();
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'medicine');
                  break;
               case 'medicine-categories':
                  header.value = ['Mã loại', 'Tên loại', 'Mô tả'];
                  rawData.value = (
                     await MedicineCategoryService.getAllMedicineCategories()
                  ).data;
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'medicine-categories');
                  break;
               case 'suppliers':
                  header.value = [
                     'Mã nhà cung cấp',
                     'Tên nhà cung cấp',
                     'Địa chỉ',
                     'Người đại diện',
                  ];
                  rawData.value = (
                     await SupplierService.getAllSuppliers()
                  ).data;
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'suppliers');
                  break;
               case 'manufacturers':
                  header.value = [
                     'Mã hãng sản xuất',
                     'Tên hãng sản xuất',
                     'Quốc gia',
                  ];
                  rawData.value = (
                     await ManufacturerService.getAllManufacturers()
                  ).data;
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'manufacturers');
                  break;
               case 'customers':
                  header.value = [
                     'Mã khách hàng',
                     'Họ và tên',
                     'Số điện thoại',
                     'Địa chỉ',
                  ];
                  rawData.value = (
                     await CustomerService.getAllCustomers()
                  ).data;
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'customers');
                  break;
               case 'employees':
                  header.value = [
                     'Mã nhân viên',
                     'Tên đăng nhập',
                     'Họ và tên',
                     'Địa chỉ',
                     'Số điện thoại',
                     'Vị trí',
                     'Trạng thái tài khoản',
                  ];
                  rawData.value = (
                     await EmployeeService.getAllEmployees()
                  ).users;
                  rawData.value.map((item: any) => {
                     if (item.role === 'staff') {
                        item.role = 'Nhân viên';
                     }
                     if (item.role === 'admin') {
                        item.role = 'Quản lý';
                     }
                     if (item.isLocked === 0) {
                        item.isLocked = 'Đang hoạt động';
                     }
                     if (item.isLocked === 1) {
                        item.isLocked = 'Đã khoá';
                     }
                  });
                  export2CSV(fileName);
                  console.log(fileName, 'csv', 'employees');
                  break;
               case 'received-notes':
                  header.value = [
                     'Mã phiếu nhập',
                     'Mã nhân viên',
                     'Mã nhà cung cấp',
                     'Ngày nhập',
                     'Tổng giá trị',
                  ];
                  rawData.value = await ReceivedNoteService.getAllNotes();
                  rawData.value.map((item: any) => {
                     const date = new Date(item.received_date);
                     const formattedDate = date.toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                     });
                     item.received_date = formattedDate;
                     const formattedPrice = new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                     }).format(item.total_price);
                     item.total_price = formattedPrice;
                  });
                  field.value = Object.keys(rawData.value[0]);
                  export2CSV(fileName);
                  break;
               case 'received-note-details':
                  header.value = [
                     'Mã phiếu nhập',
                     'Mã nhân viên',
                     'Mã nhà cung cấp',
                     'Ngày nhập',
                     'Tổng giá trị',
                     'Mã thuốc',
                     'Số lượng',
                     'Đơn giá',
                     'Tên thuốc',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại thuốc',
                  ];
                  const receivedNote = await ReceivedNoteService.getAllNotes();
                  const receivedNoteDetails =
                     await ReceivedNoteDetailsService.getAllNoteDetails();
                  rawData.value = joinArrays(
                     receivedNote,
                     receivedNoteDetails,
                     'received_note_id'
                  );
                  const medicineData = await MedicineService.getAllMedicine();
                  rawData.value = populateArrays(
                     rawData.value,
                     medicineData,
                     'medicine_id'
                  );
                  formatDate(rawData.value, 'received_date');
                  formatCurrency(rawData.value, 'price');
                  formatCurrency(rawData.value, 'total_price');
                  removeKeyFromArray(rawData.value, 'total_price');
                  field.value = Object.keys(rawData.value[0]);
                  export2CSV(fileName);
                  break;
               case 'delivery-notes':
                  header.value = [
                     'Mã phiếu xuất',
                     'Mã nhân viên',
                     'Mã khách hàng',
                     'Ngày xuất',
                     'Tổng giá trị',
                     'Tên khách hàng',
                     'Số điện thoại khách hàng',
                     'Địa chỉ khách hàng',
                  ];
                  rawData.value = await DeliveryNoteService.getAllNotes();
                  const customers = (await CustomerService.getAllCustomers())
                     .data;
                  rawData.value = populateArrays(
                     rawData.value,
                     customers,
                     'customer_id'
                  );
                  formatDate(rawData.value, 'delivery_date');
                  formatCurrency(rawData.value, 'total_price');

                  console.log('rawData:', rawData.value);

                  field.value = Object.keys(rawData.value[0]);
                  console.log('field: ', field.value);
                  export2CSV(fileName);
                  break;
               case 'delivery-note-details':
                  header.value = [
                     'Mã phiếu xuất',
                     'Mã nhân viên',
                     'Mã khách hàng',
                     'Ngày xuất',
                     'Tổng giá trị',
                     'Mã thuốc',
                     'Số lượng',
                     'Đơn giá',
                     'Tên thuốc',
                     'Mã hãng sản xuất',
                     'Mã nhà cung cấp',
                     'Công dụng',
                     'Mã loại thuốc',
                  ];
                  const deliveryNotes = await DeliveryNoteService.getAllNotes();
                  const deliveryNoteDetails =
                     await DeliveryNoteDetailsService.getAllNoteDetails();
                  rawData.value = joinArrays(
                     deliveryNotes,
                     deliveryNoteDetails,
                     'delivery_note_id'
                  );

                  const medicines = await MedicineService.getAllMedicine();
                  rawData.value = populateArrays(
                     rawData.value,
                     medicines,
                     'medicine_id'
                  );
                  formatDate(rawData.value, 'delivery_date');
                  formatCurrency(rawData.value, 'price');
                  formatCurrency(rawData.value, 'total_price');
                  removeKeyFromArray(rawData.value, 'total_price');
                  field.value = Object.keys(rawData.value[0]);
                  export2CSV(fileName);
            }
      }
   };

   const onSubmit = handleSubmit(async (values) => {
      try {
         await exportData(values.fileName, values.fileFormat, values.dataType);
         resetForm();
      } catch (error) {
         console.log(error);
         toast({
            variant: 'destructive',
            description: 'Xảy ra lỗi, không thể xuất dữ liệu',
         });
      }
   });

   onMounted(async () => {
      // await getMedicine();
   });
</script>

<style scoped></style>
