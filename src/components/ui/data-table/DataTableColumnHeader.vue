<template>
   <div
      v-if="column.getCanSort()"
      :class="cn('flex items-center space-x-2', $attrs.class ?? '')"
   >
      <DropdownMenu>
         <DropdownMenuTrigger as-child>
            <Button
               variant="ghost"
               size="sm"
               class="h-8 data-[state=open]:bg-accent font-bold"
            >
               <span>{{ title }}</span>
               <ArrowDown
                  v-if="column.getIsSorted() === 'desc'"
                  class="w-5 h-5 ml-2"
               />
               <ArrowUp
                  v-else-if="column.getIsSorted() === 'asc'"
                  class="w-5 h-5 ml-2"
               />
               <ArrowDownUp
                  v-else
                  class="w-5 h-5 ml-2"
               />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="start">
            <DropdownMenuItem @click="column.toggleSorting(false)">
               <ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
               Tăng dần
            </DropdownMenuItem>
            <DropdownMenuItem @click="column.toggleSorting(true)">
               <ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
               Giảm dần
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   </div>

   <div
      v-else
      :class="$attrs.class"
   >
      {{ title }}
   </div>
</template>

<script setup lang="ts">
   import type { Column } from '@tanstack/vue-table';
   import { ArrowDown, ArrowUp, ArrowDownUp } from 'lucide-vue-next';

   import { cn } from '@/lib/utils';
   import { Button } from '@/components/ui/button';
   import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
   } from '@/components/ui/dropdown-menu';

   interface DataTableColumnHeaderProps {
      column: Column<any>;
      title: string;
   }

   defineProps<DataTableColumnHeaderProps>();
</script>

<script lang="ts">
   export default {
      inheritAttrs: false,
   };
</script>
