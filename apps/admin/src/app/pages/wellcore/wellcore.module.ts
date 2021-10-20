import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatStepperModule,
  MatSelectModule
} from '@coachcare/material'
import { MatDatepickerModule } from '@angular/material/datepicker'

import { WellcoreComponents } from './wellcore.barrel'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule
  ],
  exports: [],
  declarations: WellcoreComponents,
  entryComponents: [],
  providers: []
})
export class WellcoreModule {}
