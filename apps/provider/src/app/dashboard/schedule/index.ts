export * from './availability/schedule-availability.component';
export * from './calendar/schedule-calendar.component';

import { ScheduleAvailabilityRecurringComponent } from './availability/recurring/recurring.component';
import { ScheduleAvailabilityComponent } from './availability/schedule-availability.component';
import { ScheduleAvailabilitySingleDayComponent } from './availability/single-day/single-day.component';
import { ScheduleCalendarComponent } from './calendar/schedule-calendar.component';
import { DeleteRecurringMeetingDialog } from './dialogs';
import { RecurringAddDialog } from './dialogs/recurring-add.dialog';
import { SingleAddDialog } from './dialogs/single-add.dialog';
import { ViewMeetingDialog } from './dialogs/view-meeting';
import { ScheduleListComponent, ScheduleListTableComponent } from './list';
import { MeetingsDatabase } from './services';

export const ScheduleComponents = [
  DeleteRecurringMeetingDialog,
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent,
  ScheduleListTableComponent,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog
];

export const ScheduleEntryComponents = [
  DeleteRecurringMeetingDialog,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog
];

export const ScheduleProviders = [MeetingsDatabase];

export {
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent,
  ScheduleListComponent,
  ScheduleListTableComponent
};
