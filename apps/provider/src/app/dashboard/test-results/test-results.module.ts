import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'

import { TestResultsComponents } from './'
import { TestResultsRoutingModule } from './test-results.routing.module'
import { AccountsModule } from '../accounts/accounts.module'

@NgModule({
  declarations: TestResultsComponents,
  imports: [AccountsModule, TestResultsRoutingModule, SharedModule]
})
export class TestResultsModule {}
