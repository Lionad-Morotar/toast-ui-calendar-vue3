import { TZDate } from '@toast-ui/calendar'

import { addHours, addDate } from './utils'

const today = new TZDate()
const tommorow = addDate(today, 1)

export const events = [
  {
    id: '1',
    calendarId: 'home',
    title: 'Home',
    category: 'time',
    start: today,
    end: addHours(today, 2),
    isReadonly: true,
  },
  {
    id: '2',
    calendarId: 'work',
    title: 'Work',
    category: 'time',
    start: tommorow,
    end: addHours(tommorow, 6),
    isReadonly: true,
  },
]
