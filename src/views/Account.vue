<template>
    <section class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center m-12">
        <div class="w-full max-w-md p-6 my-10 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">
                Thông tin người dùng
            </h1>
            <form @submit.prevent="updateInfo">
                <div class="mb-4">
                    <label for="editUsername" class="block text-sm font-medium text-gray-900 dark:text-white"
                        >Username</label
                    >
                    <input
                        v-model="userToEdit.username"
                        type="text"
                        id="editUsername"
                        class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
                        required
                        disabled
                    />
                </div>
                <div class="mb-4">
                    <label for="editFullName" class="block text-sm font-medium text-gray-900 dark:text-white"
                        >Tên</label
                    >
                    <input
                        v-model="userToEdit.fullname"
                        type="text"
                        id="editFullName"
                        class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <div class="mb-4">
                    <label for="editAddress" class="block text-sm font-medium text-gray-900 dark:text-white"
                        >Địa chỉ</label
                    >
                    <input
                        v-model="userToEdit.address"
                        type="text"
                        id="editAddress"
                        class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div class="mb-4">
                    <label for="editPhoneNumber" class="block text-sm font-medium text-gray-900 dark:text-white"
                        >Số điện thoại</label
                    >
                    <input
                        v-model="userToEdit.phoneNumber"
                        type="text"
                        id="editPhoneNumber"
                        aria-describedby="helper-text-explanation"
                        class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 block dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        pattern="^0[3579][0-9]{8}$"
                        title="Số điện thoại phải có 10 chữ số, bắt đầu bằng 0 và số thứ hai là 3, 5, 7 hoặc 9."
                    />
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="cursor-pointer hover:opacity-95 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
    data() {
        return {
            userToEdit: {
                username: '',
                fullname: '',
                address: '',
                phoneNumber: '',
            },
        };
    },
    methods: {
        fetchUser() {
            const userToken = JSON.parse(localStorage.getItem('userToken'));
            console.log('userToken.user: ', userToken.user);
            if (userToken && userToken.user) {
                this.userToEdit.username = userToken.user.username || '';
                this.userToEdit.fullname = userToken.user.fullname || '';
                this.userToEdit.address = userToken.user.address || '';
                this.userToEdit.phoneNumber = userToken.user.phoneNumber || '';
            }
        },

        async updateInfo() {
            const updatedUserData = this.userToEdit;
            const user = JSON.parse(localStorage.getItem('userToken'));
            const userToken = user.accessToken;
            try {
                const res = await fetch('http://localhost:3001/api/user/updateInfoMySelf', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify(updatedUserData),
                });
                const data = await res.json();
                console.log('dataUpdateInfo: ', data);
                const toast = useToast();
                if (!data.success) {
                    toast.error(data.message);
                    return;
                }
                const updatedUser = {
                    ...user,
                    user: {
                        ...user.user,
                        ...updatedUserData,
                    },
                };
                console.log('updatedUser: ', updatedUser);
                localStorage.setItem('userToken', JSON.stringify(updatedUser));
                toast.success('Cập nhật thông tin thành công!');
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin:', error);
                const toast = useToast();
                toast.error('Cập nhật thông tin thất bại.');
            }
        },
    },
    mounted() {
        this.fetchUser();
    },
};
</script>
