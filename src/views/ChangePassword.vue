<template>
    <section class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center m-16">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">Đổi mật khẩu</h1>
            <form class="mt-6 space-y-6" @submit.prevent="changePassword">
                <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-900 dark:text-white">
                        Mật khẩu hiện tại
                    </label>
                    <div class="relative">
                        <input
                            v-model="currentPassword"
                            :type="isCurrentPasswordVisible ? 'text' : 'password'"
                            name="currentPassword"
                            id="currentPassword"
                            class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <button
                            type="button"
                            @click="togglePasswordVisibility('current')"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <i v-if="isCurrentPasswordVisible" class="fas fa-eye text-gray-600 dark:text-white"></i>
                            <i v-else class="fas fa-eye-slash text-gray-600 dark:text-white"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-900 dark:text-white">
                        Mật khẩu mới
                    </label>
                    <div class="relative">
                        <input
                            v-model="newPassword"
                            :type="isNewPasswordVisible ? 'text' : 'password'"
                            name="newPassword"
                            id="newPassword"
                            class="w-full p-2.5 mt-1 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <button
                            type="button"
                            @click="togglePasswordVisibility('new')"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <i v-if="isNewPasswordVisible" class="fas fa-eye text-gray-600 dark:text-white"></i>
                            <i v-else class="fas fa-eye-slash text-gray-600 dark:text-white"></i>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    class="w-full py-2.5 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    </section>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
    data() {
        return {
            currentPassword: '',
            newPassword: '',
            isCurrentPasswordVisible: false,
            isNewPasswordVisible: false,
        };
    },
    methods: {
        togglePasswordVisibility(type) {
            if (type === 'current') {
                // Using 'this' to correctly refer to the component's data
                this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
            } else if (type === 'new') {
                this.isNewPasswordVisible = !this.isNewPasswordVisible;
            }
        },
        async changePassword() {
            const userPassword = {
                currentPassword: this.currentPassword,
                newPassword: this.newPassword,
            };
            try {
                const user = JSON.parse(localStorage.getItem('userToken'));
                const userToken = user.accessToken;
                const res = await fetch('http://localhost:3001/api/user/changePassword', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify(userPassword),
                });
                const data = await res.json();
                console.log('dataPassword: ', data);

                const toast = useToast();
                if (!data.success) {
                    toast.error(data.message);
                    return;
                }
                toast.success('Đổi mật khẩu thành công!');
            } catch (error) {
                console.log('error: ', error);
                toast.error(error.message);
            }
        },
    },
};
</script>
