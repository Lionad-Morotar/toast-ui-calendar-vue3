import TuiCalendar_ from './tui-calendar.vue'

import type { App } from 'vue'

const install = (app: App) => {
  app.component('TuiCalendar', TuiCalendar_)
}
export const TuiCalendar = TuiCalendar_
TuiCalendar.install = install

export default TuiCalendar
