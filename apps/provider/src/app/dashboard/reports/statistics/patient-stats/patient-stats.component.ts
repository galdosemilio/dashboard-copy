import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core'

import { _ } from '@app/shared'

@Component({
  selector: 'app-patient-stats',
  templateUrl: './patient-stats.component.html'
})
export class PatientStatsComponent implements AfterViewInit {
  demographicType
  demographics = [
    { value: 'age', viewValue: _('REPORTS.AGE') },
    { value: 'gender', viewValue: _('REPORTS.GENDER') }
  ]

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.selectType(this.demographics[0].value)
    this.cdr.detectChanges()
  }

  selectType(demographicType) {
    this.demographicType = demographicType
  }
}
