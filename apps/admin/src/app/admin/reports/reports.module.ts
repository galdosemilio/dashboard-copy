import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { routes } from './reports.routing'
import { ReportsComponents } from './reports.index'
import { SharedModule } from '@board/shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [...ReportsComponents],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ]
})
export class ReportsModule {}
