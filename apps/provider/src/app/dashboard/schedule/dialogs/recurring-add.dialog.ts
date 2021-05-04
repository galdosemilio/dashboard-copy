import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import * as moment from 'moment-timezone'
import { Schedule } from '@coachcare/sdk'

import { ConfigService } from '@app/service'
import { _, FormUtils } from '@app/shared'
import { AddRecurrentAvailabilityRequest } from '@coachcare/sdk'

export interface RecurringAddDialogData
  extends AddRecurrentAvailabilityRequest {
  timezone: string
}

@Component({
  selector: 'app-recurring-add-dialog',
  templateUrl: 'recurring-add.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class RecurringAddDialog implements OnInit {
  form: FormGroup
  day = ''
  minStart: moment.Moment
  maxStart: moment.Moment
  minEnd: moment.Moment
  maxEnd: moment.Moment

  constructor(
    private cdr: ChangeDetectorRef,
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<RecurringAddDialog>,
    private schedule: Schedule,
    private config: ConfigService,
    private formUtils: FormUtils,
    @Inject(MAT_DIALOG_DATA) public data: RecurringAddDialogData
  ) {}

  ngOnInit() {
    const date = moment().day(this.data.startDay).startOf('day')

    const initial = moment(date).set(this.config.get('default.startTime'))

    this.day = date.format('dddd')
    this.minStart = moment(date)
    this.minEnd = moment(initial).add(15, 'minutes')
    this.maxEnd = moment(date).add(1, 'day')
    this.maxStart = moment(this.maxEnd).subtract(15, 'minutes')

    this.form = this.builder.group(
      {
        startTime: [initial, Validators.required],
        endTime: [this.minEnd, Validators.required]
      },
      {
        validator: this.validateForm
      }
    )
  }

  onChange() {
    const start = this.form.get('startTime').value
    this.minEnd = moment(start).add(15, 'minutes')
  }

  validateForm(control: AbstractControl) {
    if (!control.get('startTime').touched && !control.get('endTime').touched) {
      return null
    }

    if (control.get('startTime').touched && !control.get('startTime').value) {
      return { timeError: _('NOTIFY.ERROR.START_TIME_EMPTY') }
    }

    if (control.get('endTime').touched && !control.get('endTime').value) {
      return { timeError: _('NOTIFY.ERROR.END_TIME_EMPTY') }
    }

    const startTime = control.get('startTime').value
    const endTime = control.get('endTime').value

    if (startTime && endTime && endTime.isSameOrBefore(startTime)) {
      return { timeError: _('NOTIFY.ERROR.START_MUSTBE_BEFORE') }
    }

    if (control.hasError('apiError')) {
      return { apiError: control.getError('apiError') }
    }

    return null
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value

      // TODO Add all-day checkbox
      const request: AddRecurrentAvailabilityRequest = {
        provider: this.data.provider,
        startDay: data.startTime.day(),
        startTime: data.startTime.format('HH:mm'),
        endDay: data.endTime.day(),
        endTime: data.endTime.format('HH:mm')
      }

      this.schedule
        .addRecurrentAvailability(request)
        .then((res) => {
          this.dialogRef.close({
            id: res.availableId,
            start: data.startTime,
            end: data.endTime
          })
        })
        .catch((err) => {
          this.form.setErrors({ apiError: err })
          this.cdr.detectChanges()
        })
    } else {
      this.formUtils.markAsTouched(this.form)
      this.form.updateValueAndValidity()
    }
  }
}
