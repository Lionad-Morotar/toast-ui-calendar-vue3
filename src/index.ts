import TuiCalendar_ from './tui-calendar.vue'
import Calendar from '@toast-ui/calendar';
import type { App } from 'vue'

const install = (app: App) => {
  app.component('TuiCalendar', TuiCalendar_)
}
export const TuiCalendar = TuiCalendar_
TuiCalendar.install = install

export default TuiCalendar
export { Calendar }