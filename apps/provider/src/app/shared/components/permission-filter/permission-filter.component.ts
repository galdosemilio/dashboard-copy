import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AllOrgPermissions } from '@coachcare/sdk'

@Component({
  selector: 'ccr-permission-filter',
  templateUrl: './permission-filter.component.html',
  styleUrls: ['./permission-filter.component.scss']
})
export class CcrPermissionFilterComponent implements OnInit {
  @Output()
  onChange: EventEmitter<AllOrgPermissions> = new EventEmitter<AllOrgPermissions>()

  public form: FormGroup

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public onApplyFilter(): void {
    this.onChange.emit(this.form.value)
  }

  private createForm(): void {
    this.form = this.fb.group({
      admin: [false],
      viewAll: [false],
      clientPhi: [false]
    })
  }
}
