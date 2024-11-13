// export { default as Calendar } from './Calendar.vue';
// export { default as CalendarCell } from './CalendarCell.vue';
// export { default as CalendarCellTrigger } from './CalendarCellTrigger.vue';
// export { default as CalendarGrid } from './CalendarGrid.vue';
// export { default as CalendarGridBody } from './CalendarGridBody.vue';
// export { default as CalendarGridHead } from './CalendarGridHead.vue';
// export { default as CalendarGridRow } from './CalendarGridRow.vue';
// export { default as CalendarHeadCell } from './CalendarHeadCell.vue';
// export { default as CalendarHeader } from './CalendarHeader.vue';
// export { default as CalendarHeading } from './CalendarHeading.vue';
// export { default as CalendarNextButton } from './CalendarNextButton.vue';
// export { default as CalendarPrevButton } from './CalendarPrevButton.vue';

export { default as Calendar } from './Calendar.vue';
import type { CalendarSlotName } from 'v-calendar/dist/types/src/components/Calendar/CalendarSlot.vue.d.ts';
export function isVCalendarSlot(
   slotName: string
): slotName is CalendarSlotName {
   const validSlots: CalendarSlotName[] = [
      'day-content',
      'day-popover',
      'dp-footer',
      'footer',
      'header-title-wrapper',
      'header-title',
      'header-prev-button',
      'header-next-button',
      'nav',
      'nav-prev-button',
      'nav-next-button',
      'page',
      'time-header',
   ];
   return validSlots.includes(slotName as CalendarSlotName);
}
