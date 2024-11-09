<template>
    <div>
        <div class="flex items-center space-between">
            <div class="title px-6 flex flex-col gap-y-2">
                <h1 class="font-bold text-[32px] leading-none">Thống kê</h1>
                <h3 class="font-semibold text-sm text-gray-500">Quản lý danh sách thống kê tại đây.</h3>
            </div>
        </div>

        <div class="mx-6">
            <div class="flex items-center space-x-2">
                <Popover>
                    <PopoverTrigger as-child>
                        <Button variant="outline" class="w-[200px] justify-start text-left font-normal">
                            {{ startDate ? formatDate(startDate) : 'Chọn ngày bắt đầu' }}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="p-2">
                        <Calendar v-model="startDate" placeholder="Chọn ngày bắt đầu" />
                    </PopoverContent>
                </Popover>

                <!-- Popover cho Calendar ngày kết thúc -->
                <Popover>
                    <PopoverTrigger as-child>
                        <Button variant="outline" class="w-[200px] justify-start text-left font-normal">
                            {{ endDate ? formatDate(endDate) : 'Chọn ngày kết thúc' }}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="p-2">
                        <Calendar v-model="endDate" placeholder="Chọn ngày kết thúc" />
                    </PopoverContent>
                </Popover>

                <!-- Button tải dữ liệu -->
                <Button @click="fetchStatisticDay">Submit</Button>
            </div>

            <Tabs default-value="day" class="space-y-4">
                <TabsList>
                    <TabsTrigger value="day">Ngày</TabsTrigger>
                    <TabsTrigger value="quarter">Quý</TabsTrigger>
                    <TabsTrigger value="monthly">Tháng</TabsTrigger>
                    <TabsTrigger value="yearly">Năm</TabsTrigger>
                </TabsList>
                <TabsContent value="day">
                    <StatisticDay v-if="statisticDayData" :statisticDayData="statisticDayData" />
                    <p v-else>Không có dữ liệu để hiển thị.</p>
                </TabsContent>
                <!-- TabsContent sẽ ở đây khi có dữ liệu -->
            </Tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar'; // Import Calendar từ ShadCN
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // Import Popover
import axios from 'axios';
import StatisticDay from '@/views/StatisticDay.vue';

// Khai báo các biến ngày bắt đầu và kết thúc
// const startDate = ref<string | null>(null);
// const endDate = ref<string | null>(null);

const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const statisticDayData = ref<Record<string, any> | null>(null);
const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);

    // Đảm bảo ngày và tháng có 2 chữ số nếu cần
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
    const day = d.getDate().toString().padStart(2, '0');

    // Trả về định dạng yyyy/mm/dd
    return `${year}-${month}-${day}`;
};

// Hàm gọi API để lấy thống kê theo ngày
const fetchStatisticDay = async () => {
    // Kiểm tra nếu không có giá trị startDate hoặc endDate
    if (!startDate.value || !endDate.value) {
        alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
        return;
    }
    const formattedStartDate = formatDate(startDate.value);
    const formattedEndDate = formatDate(endDate.value);
    console.log('formattedStartDate: ', formattedStartDate);
    console.log('formattedEndDate: ', formattedEndDate);
    try {
        const user = JSON.parse(localStorage.getItem('userToken'));
        const userToken = user.accessToken;
        const res = await fetch(
            `http://localhost:3001/api/statistic/day/?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            {
                method: 'GET', // Phương thức GET
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            },
        );
        // Chuyển đổi phản hồi sang JSON
        const data = await res.json();
        console.log('dataStatisticDay: ', data);
        statisticDayData.value = data;
        console.log('statisticDayData.value: ', statisticDayData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        alert('Không thể tải dữ liệu.');
    }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
</style>
