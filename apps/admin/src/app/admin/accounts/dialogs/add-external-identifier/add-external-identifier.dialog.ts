import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import {
  AccountSingle,
  GetListOrganizationRequest,
  OrganizationProvider
} from '@coachcare/sdk'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { find } from 'lodash'
import { AutocompleterOption, FormUtils } from '@coachcare/common/shared'
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs'

interface AddExternalIdentifierDialogData {
  account: AccountSingle
}

@Component({
  selector: 'ccr-add-external-identifier-dialog',
  templateUrl: './add-external-identifier.dialog.html',
  styleUrls: ['./add-external-identifier.dialog.scss'],
  host: {
    class: 'ccr-dialog ccr-plain'
  }
})
export class AddExternalIdentifierDialogComponent implements OnInit {
  public form: FormGroup
  private account: AccountSingle
  public organizations: Array<AutocompleterOption> = []

  public hasSelected = false

  autocomplete: FormControl

  @ViewChild(MatAutocompleteTrigger, { static: true })
  trigger: MatAutocompleteTrigger

  constructor(
    public dialogRef: MatDialogRef<AddExternalIdentifierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddExternalIdentifierDialogData,
    private builder: FormBuilder,
    private organization: OrganizationProvider
  ) {
    this.account = this.data.account
    this.fetchOrganizations = this.fetchOrganizations.bind(this)
  }

  ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.autocomplete = new FormControl()

    this.form = this.builder.group({
      account: [this.data.account.id],
      name: [null, Validators.required],
      value: [null, Validators.required],
      organization: [null, Validators.required]
    })

    this.autocomplete.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap(this.fetchOrganizations)
      )
      .subscribe((organizations) => {
        this.organizations = organizations

        if (this.organizations.length) {
          this.trigger.openPanel()
        } else {
          this.trigger.closePanel()
        }
      })

    this.autocomplete.valueChanges.subscribe((val) => {
      this.form.patchValue({
        organization: val?.value || null
      })

      this.hasSelected = !!val?.value

      if (val && val.value && !find(this.organizations, { value: val.value })) {
        this.organizations.push(val)
      }
    })
  }

  public displayFn(value: AutocompleterOption | string): string {
    return (
      (typeof value === 'string'
        ? this.organizations.find((o) => o.value === value)?.viewValue ?? ''
        : value?.viewValue) ?? ''
    )
  }

  private async fetchOrganizations(
    query?: string
  ): Promise<AutocompleterOption[]> {
    if (!query) {
      return []
    }

    const res = await this.organization.getAccessibleList({
      user: this.account.id,
      query,
      status: 'active',
      strict: false,
      limit: 5
    } as GetListOrganizationRequest)

    return res.data.map((c) => ({
      value: c.organization.id,
      viewValue: `${c.organization.name}`
    }))
  }

  public onBlurOrg(): void {
    const organization = this.autocomplete.value

    if (!organization?.value) {
      this.autocomplete.setValue('')
    }
  }

  public removeOrg(): void {
    this.autocomplete.setValue('')
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value)

      return
    }

    if (!this.form.controls.organization.valid) {
      this.autocomplete.setErrors({ required: true })
    }

    FormUtils.markAsTouched(this.form)
  }
}
