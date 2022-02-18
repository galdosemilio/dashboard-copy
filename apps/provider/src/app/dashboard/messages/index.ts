export * from './components'
export * from './messages.component'
export * from './services'

import {
  MessagesChatInfoComponent,
  MessagesRecipientsComponent,
  MessagesChatMessagesComponent,
  MessagesThreadListComponent
} from './components'
import { MessagesComponent } from './messages.component'
import { ThreadsDatabase } from './services/threads.database'

export const MessagesComponents = [
  MessagesComponent,
  MessagesRecipientsComponent,
  MessagesChatInfoComponent,
  MessagesChatMessagesComponent,
  MessagesThreadListComponent
]

export const MessagesProviders = [ThreadsDatabase]
