<template>
    <div class="mx-6">
        <div class="flex items-center space-between">
            <div class="title flex flex-col gap-y-2">
                <h1 class="font-bold text-[32px] leading-none">Thống kê</h1>
                <h3 class="font-semibold text-sm text-gray-500">Quản lý danh sách thống kê tại đây.</h3>
            </div>
        </div>

        <div>
            <Tabs default-value="day" v-model="selectedTab" class="space-y-4 my-4">
                <TabsList>
                    <TabsTrigger value="day">Ngày</TabsTrigger>
                    <TabsTrigger value="quarterly">Quý</TabsTrigger>
                    <TabsTrigger value="monthly">Tháng</TabsTrigger>
                    <TabsTrigger value="yearly">Năm</TabsTrigger>
                </TabsList>

                <TabsContent value="day" class="mx-0">
                    <div class="flex items-center space-x-2 mt-4">
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button variant="outline" class="w-full justify-start text-left font-normal">
                                    {{ startDate ? formatDate(startDate) : 'Chọn ngày bắt đầu' }}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-full p-2">
                                <Calendar v-model="startDate" placeholder="Chọn ngày bắt đầu" />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger as-child>
                                <Button variant="outline" class="w-full mx-6 justify-start text-left font-normal">
                                    {{ endDate ? formatDate(endDate) : 'Chọn ngày kết thúc' }}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-full p-2 mx-6">
                                <Calendar v-model="endDate" placeholder="Chọn ngày kết thúc" />
                            </PopoverContent>
                        </Popover>

                        <Button @click="fetchStatisticDay">Thống kê</Button>
                    </div>
                    <StatisticDay v-if="statisticDayData" :statisticDayData="statisticDayData" />
                    <p v-else class="mt-4">Không có dữ liệu để hiển thị.</p>
                </TabsContent>

                <TabsContent value="monthly">
                    <div class="flex items-center space-x-2 mt-4">
                        <Select v-model="selectedMonth" class="w-[200px]">
                            <SelectTrigger>
                                <div
                                    class="w-full p-0 text-left flex justify-between items-center cursor-pointer"
                                    :class="selectedMonth ? 'text-black' : 'text-gray-500'"
                                >
                                    {{ selectedMonth ? `Tháng ${selectedMonth}` : 'Chọn tháng' }}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="month in months" :key="month.value" :value="String(month.value)">
                                    {{ month.label }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="selectedYear" class="w-[200px]">
                            <SelectTrigger>
                                <div
                                    class="w-full p-0 text-left flex justify-between items-center cursor-pointer"
                                    :class="selectedYear ? 'text-black' : 'text-gray-500'"
                                >
                                    {{ selectedYear ? `Năm ${selectedYear}` : 'Chọn năm' }}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="year in years" :key="year" :value="String(year)">
                                    {{ year }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button @click="fetchStatisticMonth">Thống kê</Button>
                    </div>
                    <StatisticMonthly v-if="statisticMonthlyData" :statisticMonthlyData="statisticMonthlyData" />
                    <p v-else class="mt-4">Không có dữ liệu để hiển thị.</p>
                </TabsContent>

                <TabsContent value="quarterly">
                    <div class="flex items-center space-x-2 mt-4">
                        <Select v-model="selectedQuarter" class="w-[200px]">
                            <SelectTrigger>
                                <div
                                    class="w-full p-0 text-left flex justify-between items-center cursor-pointer"
                                    :class="selectedQuarter ? 'text-black' : 'text-gray-500'"
                                >
                                    {{ selectedQuarter ? `Quý ${selectedQuarter}` : 'Chọn quý' }}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="quarter in quarters" :key="quarter" :value="String(quarter)">
                                    {{ `Quý ${quarter}` }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="selectedYear" class="w-[200px]">
                            <SelectTrigger>
                                <div
                                    class="w-full p-0 text-left flex justify-between items-center cursor-pointer"
                                    :class="selectedYear ? 'text-black' : 'text-gray-500'"
                                >
                                    {{ selectedYear ? `Năm ${selectedYear}` : 'Chọn năm' }}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="year in years" :key="year" :value="String(year)">
                                    {{ year }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button @click="fetchStatisticQuarter">Thống kê</Button>
                    </div>
                    <StatisticQuarterly
                        v-if="statisticQuarterlyData"
                        :statisticQuarterlyData="statisticQuarterlyData"
                    />
                    <p v-else class="mt-4">Không có dữ liệu để hiển thị.</p>
                </TabsContent>

                <TabsContent value="yearly">
                    <div class="flex items-center space-x-2 mt-4">
                        <!-- Chọn Năm -->
                        <Select v-model="selectedYear" class="w-[200px]">
                            <SelectTrigger>
                                <div
                                    class="w-full p-0 text-left flex justify-between items-center cursor-pointer"
                                    :class="selectedYear ? 'text-black' : 'text-gray-500'"
                                >
                                    {{ selectedYear ? `Năm ${selectedYear}` : 'Chọn năm' }}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="year in years" :key="year" :value="String(year)">
                                    {{ year }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <!-- Nút Thống Kê -->
                        <Button @click="fetchStatisticYear">Thống kê</Button>
                    </div>

                    <!-- Hiển thị kết quả thống kê -->
                    <StatisticYearly v-if="statisticYearlyData" :statisticYearlyData="statisticYearlyData" />
                    <p v-else class="mt-4">Không có dữ liệu để hiển thị.</p>
                </TabsContent>
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
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import StatisticDay from '@/views/StatisticDay.vue';
import StatisticMonthly from '@/views/StatisticMonthly.vue';
import StatisticQuarterly from '@/views/StatisticQuarterly.vue';
import StatisticYearly from '@/views/StatisticYearly.vue';

// Dùng để theo dõi tab được chọn (day, month, etc.)
const startDate = ref(null);
const endDate = ref(null);

const statisticDayData = ref(null);
const statisticMonthlyData = ref(null);
const statisticQuarterlyData = ref(null);
const statisticYearlyData = ref(null);

const months = [
    { label: 'Tháng 1', value: 1 },
    { label: 'Tháng 2', value: 2 },
    { label: 'Tháng 3', value: 3 },
    { label: 'Tháng 4', value: 4 },
    { label: 'Tháng 5', value: 5 },
    { label: 'Tháng 6', value: 6 },
    { label: 'Tháng 7', value: 7 },
    { label: 'Tháng 8', value: 8 },
    { label: 'Tháng 9', value: 9 },
    { label: 'Tháng 10', value: 10 },
    { label: 'Tháng 11', value: 11 },
    { label: 'Tháng 12', value: 12 },
];
const quarters = [1, 2, 3, 4];
const years = Array.from({ length: 25 }, (_, i) => 2000 + i); // Tạo dãy năm từ 2020 đến 2029

const selectedTab = ref('day');
const selectedMonth = ref('');
const selectedYear = ref('');
const selectedQuarter = ref(null);

console.log('selectedMonth: ', selectedMonth);
console.log('selectedYear: ', selectedYear);

const fetchStatisticMonth = async () => {
    const toast = useToast();
    try {
        const user = JSON.parse(localStorage.getItem('userToken'));
        const userToken = user.accessToken;
        const res = await fetch(
            `http://localhost:3001/api/statistic/month/?month=${selectedMonth.value}&year=${selectedYear.value}`,
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
        console.log('dataStatisticMonth: ', data);
        if (!data.success) {
            toast.error(data.message);
            return;
        }
        statisticMonthlyData.value = data;
        console.log('statisticMonthlyData.value: ', statisticMonthlyData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Không thể tải dữ liệu.');
    }
};

const fetchStatisticQuarter = async () => {
    const quarterYear = `${selectedQuarter.value}-${selectedYear.value}`;
    console.log('quarterYear: ', quarterYear);
    const toast = useToast();
    try {
        const user = JSON.parse(localStorage.getItem('userToken'));
        const userToken = user.accessToken;
        const res = await fetch(
            `http://localhost:3001/api/statistic/quarter/?quarter=${selectedQuarter.value}&year=${selectedYear.value}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            },
        );
        const data = await res.json();
        console.log('dataStatisticQuarter: ', data);
        if (!data.success) {
            toast.error(data.message);
            return;
        }
        statisticQuarterlyData.value = data;
        console.log('statisticQuarterlyData.value: ', statisticQuarterlyData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Không thể tải dữ liệu.');
    }
};

const fetchStatisticYear = async () => {
    const year = `${selectedYear.value}`;
    console.log('year: ', year);
    const toast = useToast();
    try {
        const user = JSON.parse(localStorage.getItem('userToken'));
        const userToken = user.accessToken;
        const res = await fetch(`http://localhost:3001/api/statistic/year/?year=${selectedYear.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
        });
        const data = await res.json();
        console.log('dataStatisticYear: ', data);
        if (!data.success) {
            toast.error(data.message);
            return;
        }
        statisticYearlyData.value = data;
        console.log('statisticYearlyData.value: ', statisticYearlyData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Không thể tải dữ liệu.');
    }
};

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

const fetchStatisticDay = async () => {
    if (!startDate.value || !endDate.value) {
        alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
        return;
    }
    const formattedStartDate = formatDate(startDate.value);
    const formattedEndDate = formatDate(endDate.value);
    const toast = useToast();
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
        if (!data.success) {
            toast.error(data.message);
            return;
        }
        statisticDayData.value = data;
        console.log('statisticDayData.value: ', statisticDayData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Không thể tải dữ liệu.');
    }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
</style>
