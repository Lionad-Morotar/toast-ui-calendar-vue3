<template>
  <div ref="containerRef" class="toastui-vue-calendar" />
</template>

<script setup lang="ts">
import { ref, useAttrs, watchEffect, onMounted, onBeforeUnmount, markRaw } from 'vue';
import Calendar_ from '@toast-ui/calendar';
import { unrefElement } from '@vueuse/core'
import { cloneDeep } from 'lodash';

import defaultTheme from './theme';

// @ts-ignore types/* is not exported
import type { ViewType } from '@toast-ui/calendar/types/types/options.d.ts';

const Calendar = markRaw(Calendar_)

/*************************************************** Binding Props */

const emitEvents = [
  'selectDateTime',
  'beforeCreateEvent',
  'beforeUpdateEvent',
  'beforeDeleteEvent',
  'afterRenderEvent',
  'clickDayName',
  'clickEvent',
] as const

const emits = defineEmits([
  'selectDateTime',
  'beforeCreateEvent',
  'beforeUpdateEvent',
  'beforeDeleteEvent',
  'afterRenderEvent',
  'clickDayName',
  'clickEvent',
]);
const attrs = useAttrs();
const props = withDefaults(
  defineProps<{
    view: string
    useFormPopup?: boolean,
    useDetailPopup?: boolean,
    isReadOnly?: boolean,
    usageStatistics?: boolean,
    gridSelection?: Record<string, any> | boolean,
    week?: Record<string, any>,
    month?: Record<string, any>,
    timezone: Record<string, any>,
    theme?: Record<string, any>,
    template?: Record<string, any>,
    calendars: any[],
    events: any[],
    eventFilter?: (...args: any[]) => any,
  }>(),
  {
    useFormPopup: false,
    useDetailPopup: false,
    isReadOnly: false,
    usageStatistics: false,
    gridSelection: true,
    week: () => ({}),
    month: () => ({}),
    timezone: () => ({
      // @see https://timezonedb.com/time-zones
      zones: [{
        timezoneName: 'Asia/Shanghai',
        displayLabel: 'CN',
        tooltip: 'UTC+08:00',
      }]
    }),
    theme: () => cloneDeep(defaultTheme),
    template: () => ({}),
    eventFilter: () => () => ([]),
  }
)

const instance = ref<any>()

watchEffect(() => {
  if (!instance.value) {
    return
  }
  instance.value.changeView(cloneDeep(props.view));
})

watchEffect(() => {
  if (!instance.value) {
    return
  }
  instance.value.setOptions({
    useFormPopup: cloneDeep(props.useFormPopup),
    useDetailPopup: cloneDeep(props.useDetailPopup),
    isReadOnly: cloneDeep(props.isReadOnly),
    eventFilter: cloneDeep(props.eventFilter),
    week: cloneDeep(props.week),
    month: cloneDeep(props.month),
    gridSelection: cloneDeep(props.gridSelection),
    timezone: cloneDeep(props.timezone),
    template: cloneDeep(props.template),
  });
})

watchEffect(() => {
  if (!instance.value) {
    return
  }
  instance.value.setTheme(cloneDeep(props.theme));
})

watchEffect(() => {
  if (!instance.value) {
    return
  }
  instance.value.setCalendars(cloneDeep(props.calendars));
})

watchEffect(() => {
  if (!instance.value) {
    return
  }
  instance.value.clear();
  instance.value.createEvents(cloneDeep(props.events));
})

/*************************************************** States */

const containerRef = ref<Element | null>(null);

/*************************************************** Life Cycles */

onMounted(() => {
  // @ts-ignore
  instance.value = new Calendar(unrefElement(containerRef), {

    /** States */
    defaultView: cloneDeep(props.view as ViewType),
    useFormPopup: cloneDeep(props.useFormPopup),
    useDetailPopup: cloneDeep(props.useDetailPopup),
    isReadOnly: cloneDeep(props.isReadOnly),
    usageStatistics: cloneDeep(props.usageStatistics),
    week: cloneDeep(props.week),
    month: cloneDeep(props.month),
    gridSelection: cloneDeep(props.gridSelection),
    timezone: cloneDeep(props.timezone),
    theme: cloneDeep(props.theme),
    template: cloneDeep(props.template),
    calendars: cloneDeep(props.calendars),

    /** Filters */
    eventFilter: props.eventFilter,
  });
  console.info('[info] instance.value', instance.value)
  addEvtListeners();
  instance.value.createEvents(cloneDeep(props.events));
})

onBeforeUnmount(() => {
  instance.value.off();
  instance.value.destroy();
})

function addEvtListeners() {
  Object.keys(attrs).forEach((eventName: unknown) => {
    if (emitEvents.find(x => x === eventName)) {
      instance.value.on(eventName, (...args: any[]) => emits(eventName as any, ...args));
    }
  });
}

defineExpose({
  getRootElement() {
    // @ts-ignore
    return unrefElement(containerRef);
  },
  getInstance() {
    return instance.value;
  },
})
</script>

<style lang="less">
@import '@toast-ui/calendar/toastui-calendar.css';
@import 'tui-date-picker/dist/tui-date-picker.min.css';
@import 'tui-time-picker/dist/tui-time-picker.min.css';
</style>

<style lang="less">
.toastui-vue-calendar {
  flex: 1;

  /************************************************************ layouts */

  .toastui-calendar-layout {
    display: grid;
    grid-template: 45px minmax(0, 1fr) / minmax(0, 1fr);
  }

  /************************************************************ panels */

  .toastui-calendar-panel {
    height: 100% !important;

    &.toastui-calendar-day-view-day-names,
    &.toastui-calendar-week-view-day-names,
    &.toastui-calendar-month-view-day-names {
      overflow: auto;
    }

    &.toastui-calendar-time {
      overflow: hidden;
    }
  }

  .toastui-calendar-timegrid {
    height: 100%;
    min-height: 540px;
  }

  /************************************************************ columns */

  .toastui-calendar-column {

    .toastui-calendar-events {
      margin-right: 0 !important;
    }
    .toastui-calendar-grid-selection {
      box-sizing: border-box;
      width: calc(100% - 2px);
    }

  }

}
</style>
