import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { OrganizationPreference } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnDestroy, OnInit {
  @Input() orgId: string
  @Input() prefs: any

  public colSpan = 4
  public form: FormGroup
  public iconUrl: string | undefined
  public logoUrl: string | undefined
  public splashUrl: string | undefined
  public faviconUrl: string | undefined

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()

    this.iconUrl = this.prefs.iconUrl
    this.logoUrl = this.prefs.logoUrl
    this.splashUrl = this.prefs.splashUrl
    this.faviconUrl = this.prefs.faviconUrl
  }

  public updateLogo(name: string, data: any): void {
    this[name] = data.logoUrl
    this.form.patchValue(data)
  }

  private createForm(): void {
    this.form = this.fb.group({
      logoBaseUrl: ['', Validators.required],
      logoFilename: [''],
      iconFilename: [''],
      splashFilename: [''],
      faviconFilename: ['']
    })

    this.form.patchValue(this.prefs)

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onSubmit())
  }

  private async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        return
      }

      const formValue = this.form.value
      await this.organizationPreference.update({
        id: this.orgId,
        logoBaseUrl: formValue.logoBaseUrl,
        logoFilename: formValue.logoFilename,
        iconFilename: formValue.iconFilename,
        splashFilename: formValue.splashFilename,
        faviconFilename: formValue.faviconFilename
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'))
      this.form.patchValue({ logoBaseUrl: '' })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
