<template>
  <div class="play-container">
    <button @click="toggle">toggle</button>
    <button @click="next">next</button>
    <button @click="prev">prev</button>
    <tui-calendar class="my-calendar" ref="calendarRef" :view="currentView" @beforeCreateEvent="createEvent"
      @beforeUpdateEvent="updateEvent" :use-form-popup="true" :use-detail-popup="true" :week="options.week"
      :timezone="options.timezone" :calendars="calendars" :events="myEvents" />
  </div>
</template>

<script setup lang="ts">
/** for local dev */
import TuiCalendar, { Calendar } from '../../src';
import moment from 'moment'
/** for local artifacts test */
// import TuiCalendar from '../../dist/lib/index.esm.js';
// import '../../dist/style.css';

/** for npm pkg test */
// import TuiCalendar  from 'toast-ui-calendar-vue3';
import 'toast-ui-calendar-vue3/styles.css'

import { events } from './mock-data.js';
import { computed, ref, onMounted } from 'vue';

const calendarRef = ref<Calendar | undefined>()
const myEvents = ref()
const zones = [
  {
    timezoneName: "Asia/Kolkata",
    displayLabel: "Delhi",
    tooltip: "India Standard Time (UTC+05:30)"
  },
  {
    timezoneName: 'Asia/Seoul',
    displayLabel: 'Seoul',
    tooltip: 'Seoul Time',
  },
]
const defaultTimezoneName = computed(() => zones[0].timezoneName)
const calendars = computed(() => ([
  {
    id: 'home',
    name: 'Home',
    backgroundColor: '#69ff7061',
    borderColor: '#69ff7061',
    dragBackgroundColor: '#69ff7061',
  },
  {
    id: 'work',
    name: 'Work',
    backgroundColor: '#2d9fff61',
    borderColor: '#2d9fff61',
    dragBackgroundColor: '#2d9fff61',
  },
]))

onMounted(() => {
  myEvents.value = events
})

const next = () => {
  calendarRef.value.getInstance().next()
}
const prev = () => {
  calendarRef.value.getInstance().prev()
}
const viewOptions = ["day", "week", "month"];
const currentView = ref("month");

const toggle = () => {
  const currentIndex = viewOptions.findIndex((v) => v === currentView.value);
  const nextIndex = (currentIndex + 1) % viewOptions.length; // Corrected circular logic
  currentView.value = viewOptions[nextIndex];
};

function toDefaultTimeZone(event){
  return {
    ...event,
    start: event.start.local(defaultTimezoneName.value),
    end: event.end.local(defaultTimezoneName.value)
  }
}

function updateEvent({ event, changes }) {
  const updateIndex = myEvents.value.findIndex((innerEvent) => innerEvent.title === event.title)
  const updatedEvent={
    ...event,
    ...changes
  } 
  myEvents.value[updateIndex] = toDefaultTimeZone(updatedEvent)
}

function createEvent(event) {
  myEvents.value.push(toDefaultTimeZone(event))
}

/**
 * Calendar 配置项
 * @see https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md
 */
const options = computed(() => ({
  timezone: {
    zones,
  },
  week: {
    showNowIndicator: true,
    showTimezoneCollapseButton: false,
    timezonesCollapsed: false,
    hourStart: 0,
    hourEnd: 24,
    eventView: ['time'],
    taskView: false,
    collapseDuplicateEvents: true,
  },
}))

</script>

<style scoped>
.intro {
  max-width: clamp(60em, 62vw);
}

.play-container {
  display: flex;
  flex-direction: column;
  padding: 8px;
}
</style>

<style>
.my-calendar {
  border: solid 1px #eee;
  border-radius: 4px;

  .toastui-calendar-day-names {
    border: none !important;
  }
}
</style>
