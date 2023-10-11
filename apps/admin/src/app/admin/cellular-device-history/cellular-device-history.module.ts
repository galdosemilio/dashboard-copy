import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@board/shared/shared.module'
import { CoachcareSdkModule } from '@coachcare/common'
import { CcrUtilityComponentsModule } from '@coachcare/common/components'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { TranslateModule } from '@ngx-translate/core'
import { routes } from './cellular-device-history'
import {
  CellularDeviceHistoryComponents,
  CellularDeviceHistoryProviders
} from './cellular-device-history.barrel'

@NgModule({
  imports: [
    CcrDirectivesModule,
    CcrUtilityComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    CoachcareSdkModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: CellularDeviceHistoryComponents,
  providers: CellularDeviceHistoryProviders
})
export class CellularDeviceHistoryModule {}
