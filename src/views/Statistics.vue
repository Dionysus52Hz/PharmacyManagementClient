<template>
    <div>
        <!-- <button @click="addUser" class="mb-4 px-4 py-2 bg-green-500 text-white rounded-md">Add User</button> -->
        <div class="flex items-center space-between">
            <div class="title px-6 flex flex-col gap-y-2">
                <h1 class="font-bold text-[32px] leading-none">Thống kê</h1>
                <h3 class="font-semibold text-sm text-gray-500">Quản lý danh sách thống kê tại đây.</h3>
            </div>
        </div>

        <div>
            <page-header title="Dashboard">
                <div class="flex items-center space-x-2">
                    <DateRangePicker />
                    <Button>Download</Button>
                </div>
            </page-header>
            <Tabs default-value="day" class="space-y-4">
                <TabsList>
                    <TabsTrigger value="day">Ngày</TabsTrigger>
                    <TabsTrigger value="quarter">Quý</TabsTrigger>
                    <TabsTrigger value="monthly">Tháng</TabsTrigger>
                    <TabsTrigger value="yearly">Năm</TabsTrigger>
                </TabsList>
                <TabsContent value="day" class="space-y-4">
                    <StatisticDay :statistics="statistics" />
                </TabsContent>
            </Tabs>
            <!-- <div>
                <page-header title="Dashboard">
                    <div class="flex items-center space-x-2">
                        <DateRangePicker />
                        <Button>Download</Button>
                    </div>
                </page-header>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/daterange-picker';
import StatisticDay from '@/views/StatisticDay.vue';

// Dữ liệu giả cho statistics
const statistics = ref({
    currentDay: [
        { title: 'Đơn mượn', count: 120 },
        { title: 'Sản phẩm bán ra', count: 45 },
        { title: 'Số lượng khách hàng', count: 50 },
        { title: 'Lợi nhuận', count: 50000 },
    ],
    growthRatesDay: [10, -5, 7, 3], // Tỷ lệ tăng trưởng tuần
    growthRatesYear: [15, 10, 12, 8], // Tỷ lệ tăng trưởng năm
    receivedNotes: [
        {
            received_note_id: 'RN01',
            employee_id: 'EP01',
            supplier_id: 'DHT',
            received_date: '2022-01-01',
            medicine_id: 'BUS',
            quantity: 8,
            price: 200000,
        },
        {
            received_note_id: 'RN02',
            employee_id: 'EP02',
            supplier_id: 'MIP',
            received_date: '2022-01-10',
            medicine_id: 'WAR',
            quantity: 17,
            price: 80000,
        },
    ],
    deliveryNotes: [
        {
            delivery_note_id: 'DN01',
            employee_id: 'EP01',
            customer_id: 'KH10',
            delivery_date: '2021-03-15',
            medicine_id: 'FLX',
            quantity: 5,
            price: 120000,
        },
        {
            delivery_note_id: 'DN02',
            employee_id: 'EP02',
            customer_id: 'KH06',
            delivery_date: '2021-03-31',
            medicine_id: 'SIT',
            quantity: 5,
            price: 220000,
        },
    ],
});
// const importReceipts = ref([
//     { id: 'PN001', date: '2024-11-01', supplier: 'Nhà cung cấp A', amount: 100000 },
//     { id: 'PN002', date: '2024-11-02', supplier: 'Nhà cung cấp B', amount: 150000 },
// ]);

// // Dữ liệu giả cho phiếu chi
// const expenditureReceipts = ref([
//     { id: 'PC001', date: '2024-11-03', description: 'Chi cho bảo trì', amount: 50000 },
//     { id: 'PC002', date: '2024-11-04', description: 'Chi trả lương nhân viên', amount: 200000 },
// ]);
</script>

<style scoped></style>
