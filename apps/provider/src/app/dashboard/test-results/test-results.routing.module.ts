import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TestResultsComponent } from '.'

const routes: Routes = [
  {
    path: 'test-results',
    component: TestResultsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestResultsRoutingModule {}
