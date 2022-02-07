import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import {
  AccountProvider,
  AccSingleResponse,
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  DataPointTypes,
  MeasurementDataPointProvider
} from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { take } from 'rxjs/operators'

type AccountPersonaInfoComponentMode = 'edit' | 'readonly'

@Component({
  selector: 'app-account-personal-info',
  templateUrl: './account-personal-info.component.html'
})
export class AccountPersonalInfoComponent implements OnInit {
  @Input() accountId: string
  @Input() initialMode: AccountPersonaInfoComponentMode = 'edit'

  public account: AccSingleResponse
  public form: FormGroup
  public isLoading = false
  public mode: AccountPersonaInfoComponentMode
  public readonly = false

  private initialFormValue: { [key: string]: unknown }

  constructor(
    private accountProvider: AccountProvider,
    private context: ContextService,
    private dataPointGroup: MeasurementDataPointProvider,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.setMode(this.initialMode)
      this.createForm()
      await this.fetchAccountData()
      await this.fetchWeightData()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.isLoading) {
        return
      }
      this.isLoading = true

      const values = this.form.value

      await this.accountProvider.update({
        id: this.account.id,
        firstName: values.firstName,
        lastName: values.lastName,
        profile: {
          ...this.account.profile,
          birthday: values.birthdate,
          height: values.height
        }
      })

      this.notifier.success(_('NOTIFY.SUCCESS.PROFILE_UPDATED'))

      this.loadInitialFormValue()
      this.setMode('readonly')
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  public setMode(mode: AccountPersonaInfoComponentMode): void {
    this.mode = mode
    this.readonly = mode === 'readonly'

    if (mode === 'edit') {
      this.loadInitialFormValue()
    } else if (this.form) {
      this.form.patchValue({ ...this.initialFormValue })
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['']
    })

    this.form.valueChanges
      .pipe(take(1))
      .subscribe(() => this.loadInitialFormValue())
  }

  private async fetchAccountData(): Promise<void> {
    try {
      const accountResponse = await this.accountProvider.getSingle(
        this.accountId
      )

      this.account = accountResponse

      this.form.patchValue({
        ...this.account,
        birthdate: moment(this.account.profile.birthday).format('YYYY-MM-DD'),
        height: this.account.profile.height
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async fetchWeightData(): Promise<void> {
    try {
      const {
        data: [weightDataPointGroup]
      } = await this.dataPointGroup.getGroups({
        account: this.accountId,
        limit: 1,
        recordedAt: {
          start: this.account.profile.startedAt,
          end: moment().endOf('day').toISOString()
        },
        sort: [{ property: 'recordedAt', dir: 'desc' }],
        type: [DataPointTypes.WEIGHT]
      })

      if (!weightDataPointGroup) {
        return
      }

      const [dataPointEntry] = weightDataPointGroup.dataPoints

      const weightUnit = convertUnitToPreferenceFormat(
        dataPointEntry.type,
        this.context.user.measurementPreference,
        this.translate.currentLang
      )

      this.form.patchValue({
        weight: `${convertToReadableFormat(
          dataPointEntry.value,
          dataPointEntry.type,
          this.context.user.measurementPreference
        ).toFixed(1)} ${weightUnit}`
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private loadInitialFormValue(): void {
    this.initialFormValue = { ...this.form.value }
  }
}
