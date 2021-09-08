import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { TestResultsComponents } from './'
import { TestResultsRoutes } from './test-results-routing.module'
import { DietersModule } from '../accounts/dieters/dieters.module'

@NgModule({
  declarations: TestResultsComponents,
  imports: [
    CommonModule,
    DietersModule,
    RouterModule.forChild(TestResultsRoutes),
    SharedModule
  ]
})
export class TestResultsModule {}
