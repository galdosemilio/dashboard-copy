import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatStepperModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from '@coachcare/material'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { CcrFormFieldsModule } from '@coachcare/common/components'
import { WellcoreComponents, WellcoreProviders } from './wellcore.barrel'
import { MomentModule } from 'ngx-moment'
@NgModule({
  imports: [
    CcrFormFieldsModule,
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
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MomentModule
  ],
  exports: [],
  declarations: WellcoreComponents,
  entryComponents: [],
  providers: WellcoreProviders
})
export class WellcoreModule {}
