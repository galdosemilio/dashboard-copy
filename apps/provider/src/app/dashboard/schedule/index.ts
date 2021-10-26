export * from './availability/schedule-availability.component'
export * from './calendar/schedule-calendar.component'

import { ScheduleAvailabilityRecurringComponent } from './availability/recurring/recurring.component'
import { ScheduleAvailabilityComponent } from './availability/schedule-availability.component'
import { ScheduleAvailabilitySingleDayComponent } from './availability/single-day/single-day.component'
import { ScheduleCalendarComponent } from './calendar/schedule-calendar.component'
import {
  BaseScheduleListComponent,
  DefaultScheduleListComponent,
  WellcoreMeetingContainer,
  WellcoreScheduleListComponent
} from './list'
import { AvailabilityManagementService } from './service'

export const ScheduleComponents = [
  BaseScheduleListComponent,
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  DefaultScheduleListComponent,
  WellcoreMeetingContainer,
  WellcoreScheduleListComponent
]

export const ScheduleEntryComponents = []

export const ScheduleProviders = [AvailabilityManagementService]

export {
  BaseScheduleListComponent,
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  DefaultScheduleListComponent,
  WellcoreScheduleListComponent
}
