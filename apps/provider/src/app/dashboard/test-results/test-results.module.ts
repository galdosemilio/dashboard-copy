import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { TestResultsComponents } from './'
import { TestResultsRoutes } from './test-results-routing.module'

@NgModule({
  declarations: TestResultsComponents,
  imports: [
    CommonModule,
    RouterModule.forChild(TestResultsRoutes),
    SharedModule
  ]
})
export class TestResultsModule {}
