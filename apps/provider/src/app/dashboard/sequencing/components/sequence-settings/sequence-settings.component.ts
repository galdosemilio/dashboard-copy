import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { NamedEntity, Sequence as SequenceProvider } from '@coachcare/npm-api'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { Sequence } from '../../models'

@UntilDestroy()
@Component({
  selector: 'sequencing-sequence-settings',
  templateUrl: './sequence-settings.component.html',
  styleUrls: ['./sequence-settings.component.scss']
})
export class SequenceSettingsComponent implements OnInit {
  @Input() sequence: Sequence

  public forceBrandingPopupDescription = {
    title: _('SEQUENCING.FORCE_EMAIL_BRANDING'),
    description: _('SEQUENCING.FORCE_EMAIL_BRANDING_DESCRIPTION')
  }
  public colSpan = 1
  public currentClinic: NamedEntity
  public form: FormGroup
  public readonly = false

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private seqProvider: SequenceProvider
  ) {}

  public ngOnInit(): void {
    this.currentClinic = this.sequence.organization
    this.createForm()

    if (!this.sequence.enrollment) {
      return
    }

    this.form.get('forceEmailBranding').setValue(true, { emitEvent: false })
  }

  private createForm(): void {
    this.form = this.fb.group({ forceEmailBranding: [false] })

    this.form
      .get('forceEmailBranding')
      .valueChanges.pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((force: boolean) => {
        void this.updateSequenceSettings(force)
      })
  }

  private async updateSequenceSettings(force: boolean): Promise<void> {
    try {
      const updatedEnrollment = force
        ? { organization: { id: this.sequence.organization.id } }
        : null

      await this.seqProvider.updateSequence({
        id: this.sequence.id,
        organization: this.sequence.organization.id,
        enrollment: updatedEnrollment
      })

      this.sequence.enrollment = updatedEnrollment

      this.notifier.success(_('NOTIFY.SUCCESS.SEQUENCE_SETTINGS_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
