import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Access, AccountProvider, Goal } from '@coachcare/sdk'

import { MatDialog } from '@coachcare/material'
import { DieterFormComponent } from '@app/dashboard/accounts/dieters/form'
import { AccountIdentifierSyncer } from '@app/dashboard/accounts/dieters/form/account-identifiers/utils'
import { ContextService, EventsService, NotifierService } from '@app/service'
import {
  _,
  BindForm,
  BINDFORM_TOKEN,
  FormUtils,
  PromptDialog
} from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-dieter-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => DieterProfileComponent)
    }
  ]
})
export class DieterProfileComponent implements BindForm, OnDestroy, OnInit {
  form: FormGroup
  dieterId: number
  isLoading = false
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360019702272-Editing-a-Patient-Profile'

  constructor(
    private access: Access,
    private accIdentifierSyncer: AccountIdentifierSyncer,
    private account: AccountProvider,
    private builder: FormBuilder,
    private bus: EventsService,
    private context: ContextService,
    private dialog: MatDialog,
    private formUtils: FormUtils,
    private goal: Goal,
    private notifier: NotifierService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.dieterId = +this.context.accountId
    this.createForm()

    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  createForm() {
    this.form = this.builder.group({})
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true
      const pref = this.context.user.measurementPreference
      const { data, goals } = DieterFormComponent.preSave(
        this.form.value['dieter'],
        pref
      )

      // save the account
      this.account
        .update(data)
        .then(async () => {
          await this.accIdentifierSyncer.sync(data.identifiers, data.id)
          // save goals
          this.goal
            .update({
              account: data.id,
              goal: goals
            })
            .catch((err) => this.notifier.error(err))

          this.isLoading = false
          this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_UPDATED'))
        })
        .catch((err) => this.notifier.error(err))
    } else {
      this.formUtils.markAsTouched(this.form)
    }
  }

  resetPassword() {
    const dieter = this.form.value.dieter || {}

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.SEND_PASSWORD_RESET'),
          content: _('BOARD.SEND_PASSWORD_RESET_CONTENT'),
          contentParams: {
            email: dieter.email
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
              email: dieter.email || ''
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
