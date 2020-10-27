export * from './components';
export * from './messages.component';
export * from './services';

import { MessagesRecipientsComponent } from './components';
import { MessagesComponent } from './messages.component';
import { ThreadsDatabase } from './services/threads.database';

export const MessagesComponents = [MessagesComponent, MessagesRecipientsComponent];

export const MessagesEntryComponents = [];

export const MessagesProviders = [ThreadsDatabase];
