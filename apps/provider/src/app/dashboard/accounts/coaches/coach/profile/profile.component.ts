import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ClinicsPickerValue } from '@app/dashboard/accounts/clinics'
import { CoachFormComponent } from '@app/dashboard/accounts/coaches/form'
import { ContextService, NotifierService } from '@app/service'
import {
  _,
  BindForm,
  BINDFORM_TOKEN,
  FormUtils,
  PromptDialog
} from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Access, AccountProvider, Affiliation } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'app-coach-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => CoachProfileComponent)
    }
  ]
})
export class CoachProfileComponent implements BindForm, OnDestroy, OnInit {
  form: FormGroup
  coachId: number
  isLoading = false

  @ViewChild(CoachFormComponent, { static: false })
  coachForm: CoachFormComponent

  constructor(
    private builder: FormBuilder,
    private account: AccountProvider,
    private access: Access,
    private affiliation: Affiliation,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private formUtils: FormUtils
  ) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    this.coachId = +this.context.accountId
    this.createForm()
  }

  createForm() {
    this.form = this.builder.group({})
  }

  async onSubmit() {
    try {
      if (this.form.valid) {
        this.isLoading = true
        const { data, clinics } = CoachFormComponent.preSave(
          this.form.value['coach']
        )
        // save the account
        await this.account.update(data)
        // process the associations
        if (clinics && clinics.length) {
          clinics.forEach(async (c) => {
            if (c === null) {
              return
            }
            if (c.picked !== c.initial.picked) {
              // addition or removal
              if (c.picked) {
                await this.addAssociation(data.id, c)
              } else {
                await this.deleteAssociation(data.id, c)
              }
            } else if (
              c.admin !== c.initial.admin ||
              c.accessall !== c.initial.accessall
            ) {
              // update only
              await this.updateAssociation(data.id, c)
            }
          })
        }

        if (this.coachForm) {
          this.coachForm.markAsSubmitted()
        }
        this.isLoading = false
        this.notifier.success(_('NOTIFY.SUCCESS.COACH_UPDATED'))
        this.context.account = { ...this.context.account, ...data }
      } else {
        this.formUtils.markAsTouched(this.form)
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  async addAssociation(uid: string, c: ClinicsPickerValue) {
    return this.affiliation
      .associate({
        account: uid,
        organization: c.clinicId,
        permissions: {
          viewAll: c.accessall,
          admin: c.admin
        }
      })
      .then(() => {
        return this.updateAssociation(uid, c)
      })
      .catch((err) => this.notifier.error(err))
  }

  async updateAssociation(uid: string, c: ClinicsPickerValue) {
    return this.affiliation
      .update({
        account: uid,
        organization: c.clinicId,
        permissions: {
          viewAll: c.accessall,
          admin: c.admin
        }
      })
      .catch((err) => this.notifier.error(err))
  }

  async deleteAssociation(uid: string, c: ClinicsPickerValue) {
    return this.affiliation
      .disassociate({
        account: uid,
        organization: c.clinicId
      })
      .catch((err) => this.notifier.error(err))
  }

  resetPassword() {
    const account = this.context.account

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.SEND_PASSWORD_RESET'),
          content: _('BOARD.SEND_PASSWORD_RESET_CONTENT'),
          contentParams: {
            email: account.email
          }
        }
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (confirm: boolean) => {
        try {
          if (confirm) {
            this.isLoading = true
            await this.access.resetPassword({
              organization: this.context.organizationId,
              email: account.email || ''
            })
          }
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.isLoading = false
        }
      })
  }
}
