<template>
    <div class="mx-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card class="px-6 my-6" v-for="(item, key) in statistics.currentDay" :key="key">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">{{ item.title }}</CardTitle>
                </CardHeader>
                <CardContent class="flex justify-between items-center">
                    <div class="text-2xl font-bold">{{ item.count }}</div>
                    <p
                        class="text-sm flex items-center"
                        :class="statistics.growthRatesDay[key] >= 0 ? 'text-green-500' : 'text-red-500'"
                    >
                        {{ statistics.growthRatesDay[key] ? (statistics.growthRatesDay[key] >= 0 ? '+' : '-') : '' }}
                        {{ Math.abs(statistics.growthRatesDay[key]).toFixed(2) }}%
                        <span class="ms-1">
                            <template v-if="statistics.growthRatesDay[key] >= 0">
                                <svg
                                    class="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13V1m0 0L1 5m4-4 4 4"
                                    />
                                </svg>
                            </template>
                            <template v-else>
                                <svg
                                    class="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 1v12m0 0L9 9M5 13 1 9"
                                    />
                                </svg>
                            </template>
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Mã Phiếu nhập</th>
                        <th scope="col" class="px-6 py-3">Mã Nhân viên</th>
                        <th scope="col" class="px-6 py-3">Mã Nhà Cung Cấp</th>
                        <th scope="col" class="px-6 py-3">Mã Thuốc</th>
                        <th scope="col" class="px-6 py-3">Ngày nhập</th>
                        <th scope="col" class="px-6 py-3">Số Lượng</th>
                        <th scope="col" class="px-6 py-3">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="note in statistics.receivedNotes" :key="note.received_note_id">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ note.received_note_id }}
                        </th>
                        <td class="px-6 py-4">{{ note.employee_id }}</td>
                        <td class="px-6 py-4">{{ note.supplier_id }}</td>
                        <td class="px-6 py-4">{{ note.medicine_id }}</td>
                        <td class="px-6 py-4">{{ note.received_date }}</td>
                        <td class="px-6 py-4">{{ note.quantity }}</td>
                        <td class="px-6 py-4">{{ note.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Cao Nhất: </span>
                    <p class="text-xl">{{ statistics.maxPrice | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Thấp Nhất: </span>
                    <p class="text-xl">{{ statistics.minPrice | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Trung Bình: </span>
                    <p class="text-xl">{{ statistics.avgPrice | currency }}</p>
                </div>
            </div>
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Mã Phiếu Chi</th>
                        <th scope="col" class="px-6 py-3">Mã Nhân viên</th>
                        <th scope="col" class="px-6 py-3">Mã Khách hàng</th>
                        <th scope="col" class="px-6 py-3">Mã Thuốc</th>
                        <th scope="col" class="px-6 py-3">Ngày xuất</th>
                        <th scope="col" class="px-6 py-3">Số Lượng</th>
                        <th scope="col" class="px-6 py-3">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="note in statistics.deliveryNotes" :key="note.delivery_note_id">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ note.delivery_note_id }}
                        </th>
                        <td class="px-6 py-4">{{ note.employee_id }}</td>
                        <td class="px-6 py-4">{{ note.customer_id }}</td>
                        <td class="px-6 py-4">{{ note.medicine_id }}</td>
                        <td class="px-6 py-4">{{ note.delivery_date }}</td>
                        <td class="px-6 py-4">{{ note.quantity }}</td>
                        <td class="px-6 py-4">{{ note.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Cao Nhất: </span>
                    <p class="text-xl">{{ statistics.maxPrice | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Thấp Nhất: </span>
                    <p class="text-xl">{{ statistics.minPrice | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Giá Trung Bình: </span>
                    <p class="text-xl">{{ statistics.avgPrice | currency }}</p>
                </div>
            </div>
        </div>
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Tổng thu: </span>
                    <p class="text-xl">{{ statistics.totalPriceInput | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Tổng chi: </span>
                    <p class="text-xl">{{ statistics.totalPriceOutput | currency }}</p>
                </div>
                <div class="flex items-center space-x-2 text-start">
                    <span class="text-lg font-semibold">Lợi nhuận: </span>
                    <p class="text-xl">{{ statistics.totalProfit | currency }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Nhận props statistics từ parent component
const props = defineProps({
    statistics: {
        type: Object,
        required: true,
    },
});
onMounted(() => {
    console.log('statistics.currentDay: ', props.statistics.currentDay);
});
</script>

<style scoped>
/* table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
} */
</style>
