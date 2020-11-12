import { AddMeasurementsComponent } from './add-measurements/add-measurements.component'
import { AddConsultationComponent } from './consultation/add-consultation/add-consultation.component'
import { ConsultationComponent } from './consultation/consultation.component'
import { SetAvailabilityComponent } from './consultation/set-unavailability/set-unavailability.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { PhasesComponent } from './phases'
import { SideAlertsComponent } from './reminders/alert/alert.component'
import { NoteComponent } from './reminders/note/note.component'
import { NotesContainerComponent } from './reminders/notes-container'
import { RemindersComponent } from './reminders/reminders.component'

export const RightPanelEntryComponents = [
  AddConsultationComponent,
  AddMeasurementsComponent,
  ConsultationComponent,
  NotificationsComponent,
  NoteComponent,
  NotesContainerComponent,
  PhasesComponent,
  RemindersComponent,
  SetAvailabilityComponent,
  SideAlertsComponent
]

export {
  AddConsultationComponent,
  AddMeasurementsComponent,
  ConsultationComponent,
  NotificationsComponent,
  NoteComponent,
  PhasesComponent,
  RemindersComponent,
  SetAvailabilityComponent,
  SideAlertsComponent
}
