import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MeasurementAggregation } from '@app/service'
import { _, SelectOptions } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { MeasurementDataSource } from '../../../services'

@UntilDestroy()
@Component({
  selector: 'app-dieter-measurements-aggregation-selector',
  templateUrl: './aggregation-selector.component.html'
})
export class AggregationSelectorComponent implements OnDestroy, OnInit {
  @Input()
  embedded: boolean
  @Input()
  source: MeasurementDataSource | null

  @Output()
  change: Subject<MeasurementAggregation> = new Subject<MeasurementAggregation>()

  form: FormGroup

  aggregations: SelectOptions<MeasurementAggregation> = [
    {
      value: 'mostRecent',
      viewValue: _('MEASUREMENT.AGGREGATIONS.MOST_RECENT')
    },
    { value: 'average', viewValue: _('MEASUREMENT.AGGREGATIONS.AVERAGE') },
    { value: 'oldest', viewValue: _('MEASUREMENT.AGGREGATIONS.OLDEST') }
  ]

  constructor(private fb: FormBuilder) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.createForm()
  }

  private createForm() {
    this.form = this.fb.group({
      aggregation: ['', []]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.change.next(controls.aggregation))

    this.form.controls['aggregation'].patchValue(this.aggregations[0].value)
  }
}
