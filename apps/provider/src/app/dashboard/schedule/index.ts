export * from './availability/schedule-availability.component'
export * from './calendar/schedule-calendar.component'

import { ScheduleAvailabilityRecurringComponent } from './availability/recurring/recurring.component'
import { ScheduleAvailabilityComponent } from './availability/schedule-availability.component'
import { ScheduleAvailabilitySingleDayComponent } from './availability/single-day/single-day.component'
import { ScheduleCalendarComponent } from './calendar/schedule-calendar.component'
import { ScheduleListComponent } from './list'

export const ScheduleComponents = [
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent
]

export const ScheduleEntryComponents = []

export const ScheduleProviders = []

export {
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent
}
