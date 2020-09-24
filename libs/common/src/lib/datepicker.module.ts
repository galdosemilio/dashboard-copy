import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@coachcare/layout';
import {
  MatDatepickerIntl,
  MatDatepickerModule,
  MatMomentDateModule
} from '@coachcare/datepicker';
import { DatepickerIntl } from './services/i18n/datepicker/datepicker-intl';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule
  ],
  providers: [{ provide: MatDatepickerIntl, useClass: DatepickerIntl }]
})
export class AppDatepickerModule {}
