import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ReportsListComponent } from './list/list.component'
import { routes } from './reports.routing'

@NgModule({
  declarations: [ReportsListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ReportsModule {}
