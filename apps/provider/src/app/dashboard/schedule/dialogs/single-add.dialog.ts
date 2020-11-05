import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material'
import * as moment from 'moment-timezone'
import { Schedule } from 'selvera-api'

import { _, FormUtils } from '@app/shared'
import { AddSingleAvailabilityRequest } from '@coachcare/npm-api'

@Component({
  selector: 'app-single-add-dialog',
  templateUrl: 'single-add.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class SingleAddDialog implements OnInit {
  form: FormGroup
  now = moment()
  min = moment('08:15', 'HH:mm')

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<SingleAddDialog>,
    private schedule: Schedule,
    private formUtils: FormUtils,
    @Inject(MAT_DIALOG_DATA) public data: AddSingleAvailabilityRequest
  ) {}

  ngOnInit() {
    const initial = this.formUtils.getInitialDate()

    this.form = this.builder.group(
      {
        startTime: [initial, Validators.required],
        endTime: [null, Validators.required]
      },
      {
        validator: this.validateForm
      }
    )
  }

  validateForm(control: AbstractControl) {
    if (control.get('startTime').touched && !control.get('startTime').value) {
      return { timeError: _('NOTIFY.ERROR.START_TIME_EMPTY') }
    }

    if (control.get('endTime').touched && !control.get('endTime').value) {
      return { timeError: _('NOTIFY.ERROR.END_TIME_EMPTY') }
    }

    const startTime = control.get('startTime').value
    const endTime = control.get('endTime').value
    if (
      startTime &&
      endTime &&
      startTime.isValid() &&
      endTime.isValid() &&
      endTime.isSameOrBefore(startTime)
    ) {
      return { timeError: _('NOTIFY.ERROR.START_MUSTBE_BEFORE') }
    }

    return null
  }

  onChange(event) {
    this.min = moment(event.value).add(15, 'minutes')
    if (!this.form.get('endTime').value) {
      this.form.get('endTime').setValue(this.min)
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.data.startTime = this.form.get('startTime').value.toISOString()
      this.data.endTime = this.form.get('endTime').value.toISOString()
      this.schedule
        .addSingleAvailability(this.data)
        .then((data) => {
          this.dialogRef.close(true)
        })
        .catch((err) => {
          this.form.setErrors({ timeError: err })
        })
    } else {
      this.formUtils.markAsTouched(this.form)
      this.form.updateValueAndValidity()
    }
  }
}
