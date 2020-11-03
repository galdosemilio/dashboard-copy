import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { OrgSingleResponse } from '@app/shared/selvera-api'

@Component({
  selector: 'app-clinic-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicFormComponent implements OnInit {
  @Input() clinic: OrgSingleResponse

  public colSpan = 2
  public form: FormGroup
  public readonly = true

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: [],
      shortcode: [],
      contact: this.fb.group({
        email: [],
        firstName: [],
        lastName: [],
        phone: []
      }),
      address: this.fb.group({
        street: [],
        city: [],
        state: [],
        postalCode: [],
        country: []
      })
    })

    this.form.patchValue(this.clinic)
    this.form.controls.contact.patchValue(this.clinic.contact)
    this.form.controls.address.patchValue(
      this.clinic.address ? this.clinic.address : {}
    )
  }
}
