import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormUtils } from '@coachcare/common/shared'

@Component({
  selector: 'ccr-wellcore-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class WellcoreAccountComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup

  @Output() nextStep = new EventEmitter()

  constructor() {}

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]

  ngOnInit() {}

  ngOnDestroy() {}

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.nextStep.emit()
    } else {
      FormUtils.markAsTouched(this.formGroup)
    }
  }
}
