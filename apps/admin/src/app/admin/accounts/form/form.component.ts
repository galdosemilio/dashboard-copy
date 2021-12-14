import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AccountDialogs, AccountParams, AccountRoutes } from '@board/services'
import { AccountsDatabase } from '@coachcare/backend/data'
import { AccountTypeIds, GetUserMFAResponse, MFA } from '@coachcare/sdk'
import { _, FormUtils } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import * as moment from 'moment'

@Component({
  selector: 'ccr-account-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AccountFormComponent implements OnInit {
  form: FormGroup
  accountType: AccountTypeIds
  id: string | undefined
  item: any
  mfaInstance: GetUserMFAResponse
  readonly = true
  colSpan = 2

  constructor(
    public routes: AccountRoutes,
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private database: AccountsDatabase,
    private dialogs: AccountDialogs,
    private mfa: MFA,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: AccountParams) => {
      this.accountType = (data.accountType as any) as AccountTypeIds // MERGETODO: CHECK THIS TYPE!!!
      if (data.account) {
        this.item = data.account
      }
      this.id = data.account ? data.account.id : undefined

      // setup the FormGroup
      this.createForm()
      // fill the form
      if (this.item) {
        if (this.item.clientData) {
          this.item.clientData.birthday = moment(
            this.item.clientData && this.item.clientData.birthday
          )
            .subtract(moment().utcOffset(), 'minutes')
            .toISOString()
        }

        if (this.item.phone && typeof this.item.phone !== 'object') {
          this.item.phone = {
            phone: this.item.phone,
            countryCode: this.item.countryCode
          }
        }

        this.form.patchValue(this.item)
      }

      this.readonly = data.readonly ? true : false

      if (this.id) {
        void this.resolveMFAInstance()
      }
    })
  }

  createForm() {
    this.form = this.builder.group({
      id: this.id,
      accountType: this.accountType,
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      phoneType: null,
      measurementPreference: 'us',
      timezone: null,
      clientData: this.builder.group(this.createClientControls()),
      isActive: null
    })
  }

  createClientControls(): any {
    return this.accountType === AccountTypeIds.Client
      ? {
          birthday: null,
          height: null,
          gender: null
        }
      : {}
  }

  async onDeleteMFAInstance() {
    try {
      const response = await this.dialogs.deactivateMFA(this.mfaInstance)
      if (response) {
        void this.resolveMFAInstance()
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value

      if (this.accountType === AccountTypeIds.Client) {
        formValue.client = this.form.value.clientData
        const birthday = moment(formValue.client.birthday)
        formValue.client.birthday = birthday.format('YYYY-MM-DD')
        delete formValue.clientData
      }

      formValue.countryCode = formValue.phone.countryCode
      formValue.phone = formValue.phone.phone

      this.database
        .create(FormUtils.pruneEmpty(formValue))
        .then((res) => {
          this.notifier.success(_('NOTIFY.SUCCESS.ACC_CREATED'))
          void this.router.navigate(['../', res.id], { relativeTo: this.route })
        })
        .catch((err) => this.notifier.error(err))
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const formValue = this.form.value
      formValue.accountType = this.accountType

      if (this.accountType === AccountTypeIds.Client) {
        formValue.client = this.form.value.clientData
        const birthday = moment(this.form.value.client.birthday)
        formValue.client.birthday = birthday.format('YYYY-MM-DD')
        delete formValue.clientData
      }

      formValue.countryCode = formValue.phone.countryCode
      formValue.phone = formValue.phone.phone

      this.database
        .update(FormUtils.pruneEmpty(formValue))
        .then((res) => {
          this.notifier.success(_('NOTIFY.SUCCESS.ACC_UPDATED'))
          void this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { updated: new Date().getTime() }
          })
        })
        .catch((err) => this.notifier.error(err))
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  onCancel() {
    if (!this.id) {
      // create
      void this.router.navigate([this.routes.list(this.accountType as any)]) // MERGETODO: CHECK THIS TYPE!!!
    } else {
      // update
      void this.router.navigate(['../'], { relativeTo: this.route })
    }
  }

  onActivate() {
    this.dialogs
      .activatePrompt(this.item)
      .then(() => {
        this.item.isActive = true
        this.form.patchValue({ isActive: true })
        this.notifier.success(_('NOTIFY.SUCCESS.ACC_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate() {
    this.dialogs
      .deactivatePrompt(this.item)
      .then(() => {
        this.item.isActive = false
        this.form.patchValue({ isActive: false })
        this.notifier.success(_('NOTIFY.SUCCESS.ACC_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  private async resolveMFAInstance() {
    try {
      this.mfaInstance = await this.mfa.getUserMFA({ account: this.id } as any)
    } catch (error) {
      delete this.mfaInstance
    } finally {
      this.cdr.detectChanges()
    }
  }
}
