<template>
    <div class="grid grid-cols-2 gap-x-4 h-fit pt-[52px]">
        <div class="photo w-[420px] rounded-lg flex items-end place-self-end">
            <img src="../assets/images/Login.png" alt="" class="object-cover object-bottom" />
        </div>
        <div class="w-[360px] flex flex-col px-3 gap-y-8">
            <div class="form-title flex flex-col gap-y-2.5">
                <div class="logo bg-gray-200 w-[80px] aspect-square rounded-lg"></div>
                <span class="font-semibold text-2xl">Chào mừng bạn quay trở lại. </span>
                <span>Đăng nhập vào hệ thống</span>
            </div>

            <div class="form">
                <form class="w-full space-y-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="username">
                        <FormItem v-auto-animate>
                            <FormLabel>Tên đăng nhập</FormLabel>

                            <FormControl>
                                <Input type="text" placeholder="Nhập tên đăng nhập" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem v-auto-animate>
                            <FormLabel>Mật khẩu</FormLabel>

                            <FormControl>
                                <Input type="text" placeholder="Nhập mật khẩu" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <div class="forgot-password flex justify-end text-sm">
                        <RouterLink
                            :to="{
                                name: 'reset-password-view',
                            }"
                        >
                            <span class="font-semibold">Quên mật khẩu?</span></RouterLink
                        >
                    </div>

                    <Button type="submit" class="w-full"> Đăng nhập </Button>
                </form>

                <div class="alternative-option flex justify-center gap-x-2 text-sm mt-6">
                    <span>Chưa có tài khoản?</span>
                    <RouterLink
                        :to="{
                            name: 'signup-view',
                        }"
                    >
                        <span class="font-semibold">Đăng ký</span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const router = useRouter();
const formSchema = toTypedSchema(
    z.object({
        username: z
            .string({
                required_error: 'Tên đăng nhập không thể để trống',
            })
            .min(1, { message: 'Tên đăng nhập không thể để trống' }),
        password: z
            .string({ required_error: 'Mật khẩu không thể để trống' })
            .min(1, { message: 'Mật khẩu không thể để trống' }),
    }),
);

const { handleSubmit } = useForm({
    validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
    try {
        const response = await fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        const toast = useToast();

        const data = await response.json();
        console.log('dataLogin: ', data);
        if (!data.success) {
            toast.error(data.message);
            return;
        }
        toast.success('Đăng nhập thành công!');
        localStorage.setItem('userToken', data);
        router.push('/employees');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Đăng nhập thất bại.');
    }
});
</script>

<style scoped></style>
