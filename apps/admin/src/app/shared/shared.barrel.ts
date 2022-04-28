import { MFACodeInputComponent } from './mfa-code-input'
import { NotFoundPageComponent } from './not-found/not-found.component'
import { PhoneInputComponent } from './phone-input'
import { QRCodeDisplayDialog } from './dialogs'
import { UnsupportedBrowserPageComponent } from './unsupported-browser/unsupported-browser.component'
import { CcrSanitizePipe } from '@coachcare/common/pipes'

export {
  MFACodeInputComponent,
  NotFoundPageComponent,
  PhoneInputComponent,
  QRCodeDisplayDialog,
  UnsupportedBrowserPageComponent
}

export const SharedComponents = [
  MFACodeInputComponent,
  NotFoundPageComponent,
  PhoneInputComponent,
  QRCodeDisplayDialog,
  UnsupportedBrowserPageComponent,
  CcrSanitizePipe
]
