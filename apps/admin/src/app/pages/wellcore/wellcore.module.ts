import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule, MatIconModule } from '@coachcare/material'
import { WellcoreComponents } from './wellcore.barrel'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [],
  declarations: WellcoreComponents,
  entryComponents: [],
  providers: []
})
export class WellcoreModule {}
