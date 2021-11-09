export * from './availability/schedule-availability.component'
export * from './calendar/schedule-calendar.component'

import { ScheduleAvailabilityRecurringComponent } from './availability/recurring/recurring.component'
import { ScheduleAvailabilityComponent } from './availability/schedule-availability.component'
import { ScheduleAvailabilitySingleDayComponent } from './availability/single-day/single-day.component'
import { ScheduleCalendarComponent } from './calendar/schedule-calendar.component'
import { ScheduleMeetingContainer, ScheduleMosaicComponent } from './mosaic'
import { ScheduleListComponent } from './list'
import { AvailabilityManagementService } from './service'

export const ScheduleComponents = [
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent,
  ScheduleMeetingContainer,
  ScheduleMosaicComponent
]

export const ScheduleEntryComponents = []

export const ScheduleProviders = [AvailabilityManagementService]

export {
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent,
  ScheduleMeetingContainer,
  ScheduleMosaicComponent
}
