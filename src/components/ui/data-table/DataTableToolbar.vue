<template>
   <div class="flex flex-1 items-center space-x-2">
      <div class="relative h-full grow">
         <Input
            placeholder="Tìm kiếm nhanh..."
            :model-value="(table.getColumn(props.filteredColumn)?.getFilterValue() as string) ?? ''"
            class="h-full pr-11 w-full"
            @input="
               table
                  .getColumn(props.filteredColumn)
                  ?.setFilterValue($event.target.value)
            "
         >
         </Input>
         <Button
            v-if="isFiltered"
            variant="ghost"
            class="h-full px-2 lg:px-3 absolute end-0 inset-y-0 flex items-center justify-center"
            @click="table.resetColumnFilters()"
         >
            <CircleX class="w-5 h-5" />
         </Button>
      </div>
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
   import type { Table } from '@tanstack/vue-table';
   import { Input } from '@/components/ui/input';
   import { computed } from 'vue';
   import { CircleX } from 'lucide-vue-next';
   import { Button } from '@/components/ui/button';

   interface DataTableToolbarProps {
      table: Table<any>;
      filteredColumn: string;
   }

   const props = defineProps<DataTableToolbarProps>();

   const isFiltered = computed(
      () => props.table.getState().columnFilters.length > 0
   );
</script>
