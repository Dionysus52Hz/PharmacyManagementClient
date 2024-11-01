<template>
   <form
      class="w-full space-y-4"
      @submit="onSubmit"
   >
      <FormField
         v-slot="{ componentField, value }"
         name="pin"
      >
         <FormItem>
            <FormLabel>Mã xác nhận</FormLabel>
            <FormControl>
               <PinInput
                  id="pin-input"
                  :model-value="value"
                  placeholder="○"
                  class="flex gap-2 items-center mt-1"
                  otp
                  type="number"
                  :name="componentField.name"
                  @complete="handleComplete"
                  @update:model-value="
                     (arrStr) => {
                        setFieldValue('pin', arrStr.filter(Boolean));
                     }
                  "
               >
                  <PinInputGroup class="w-full">
                     <PinInputInput
                        v-for="(id, index) in 5"
                        :key="id"
                        :index="index"
                        class="w-1/5 h-auto aspect-square text-base"
                     />
                  </PinInputGroup>
               </PinInput>
            </FormControl>

            <FormMessage />
         </FormItem>
      </FormField>

      <div class="alternative-option flex justify-center items-center text-sm">
         <span>Không nhận được mã?</span>

         <Button
            v-if="counterToResendCode > 0"
            variant="link"
            class="font-semibold"
            disabled
            >Gửi lại mã sau {{ counterToResendCode }}s</Button
         >
         <Button
            v-if="counterToResendCode == 0"
            variant="link"
            class="font-semibold"
            @click="console.log(123)"
            >Gửi lại mã</Button
         >
      </div>

      <Button class="w-full">Xác nhận</Button>
   </form>
</template>
<script setup lang="ts">
   import { Button } from '@/components/ui/button';
   import {
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
   } from '@/components/ui/form';
   import {
      PinInput,
      PinInputGroup,
      PinInputInput,
   } from '@/components/ui/pin-input';
   import { toTypedSchema } from '@vee-validate/zod';
   import { useForm } from 'vee-validate';
   import { onMounted, onUnmounted, ref } from 'vue';
   import * as z from 'zod';

   const formSchema = toTypedSchema(
      z.object({
         pin: z
            .array(z.coerce.string(), {
               required_error: 'Chưa nhập mã xác nhận',
            })
            .length(5, { message: 'Giá trị không hợp lệ' }),
      })
   );

   const { handleSubmit, setFieldValue } = useForm({
      validationSchema: formSchema,
   });

   const onSubmit = handleSubmit(({ pin }) => {
      console.log(pin.join(''));
   });

   const handleComplete = (e: string[]) => console.log(e.join(''));

   const counterToResendCode = ref(60);
   let interval: NodeJS.Timeout | null = null;

   const startCountdown = () => {
      interval = setInterval(() => {
         if (counterToResendCode.value > 0) {
            counterToResendCode.value--;
         } else {
            clearInterval(interval as NodeJS.Timeout);
         }
      }, 1000);
   };
   onMounted(() => {
      startCountdown();
   });
   onUnmounted(() => {
      if (interval) {
         clearInterval(interval);
      }
   });
</script>
