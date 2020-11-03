import { AccessDeniedDialogComponent } from '@app/layout/call/access-denied-dialog/access-denied-dialog.component';
import { AccessRequiredDialogComponent } from '@app/layout/call/access-required-dialog/access-required-dialog.component';
import { BrowserSupportDialogComponent } from '@app/layout/call/browser-support-dialog/browser-support-dialog.component';
import { CallSettingsComponent } from '@app/layout/call/call-settings/call-settings.component';
import { CallControlsComponent } from '@app/layout/call/call-window/call-controls/call-controls.component';
import { CallWindowComponent } from '@app/layout/call/call-window/call-window.component';
import { CallHeaderControlsComponent } from '@app/layout/call/call-window/header-controls/header-controls.component';
import { CallHeaderTextComponent } from '@app/layout/call/call-window/header-text/header-text.component';
import { RoomComponent } from '@app/layout/call/call-window/room/room.component';
import { CallVideoRequestComponent } from '@app/layout/call/call-window/video-request/video-request.component';
import { CallLayoutService } from '@app/layout/call/services/call-layout.service';
import { TwilioBandwidthService } from '@app/layout/call/services/twilio-bandwidth.service';
import { TwilioService } from '@app/layout/call/services/twilio.service';
import { ConnectionIndicatorComponent } from './call-window/connection-indicator';

export { CallWindowComponent };

export const Components = [
  AccessDeniedDialogComponent,
  AccessRequiredDialogComponent,
  BrowserSupportDialogComponent,
  CallSettingsComponent,
  CallWindowComponent,
  CallVideoRequestComponent,
  CallControlsComponent,
  CallHeaderControlsComponent,
  CallHeaderTextComponent,
  ConnectionIndicatorComponent,
  RoomComponent
];

export const Providers = [CallLayoutService, TwilioBandwidthService, TwilioService];
