import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { AccountsRoutingModule } from './accounts.routing'
import { ClinicsModule } from './clinics/clinics.module'
import { CoachesModule } from './coaches/coaches.module'
import { DialogsComponents } from './dialogs'
import { DietersModule } from './dieters/dieters.module'

@NgModule({
  declarations: DialogsComponents,
  imports: [
    AccountsRoutingModule,
    DietersModule,
    CoachesModule,
    ClinicsModule,
    SharedModule
  ],
  exports: [...DialogsComponents, DietersModule, CoachesModule, ClinicsModule]
})
export class AccountsModule {}
