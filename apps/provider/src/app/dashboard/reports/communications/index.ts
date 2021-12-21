import { CallRecordingButtonComponent, CallsComponent } from './calls'
import { CommunicationsReportComponent } from './communications.component'
import { CallHistoryDatabase } from './services'

export * from './communications.component'

export const CommunicationsComponents = [
  CallsComponent,
  CallRecordingButtonComponent,
  CommunicationsReportComponent
]
export const CommunicationsProviders = [CallHistoryDatabase]
