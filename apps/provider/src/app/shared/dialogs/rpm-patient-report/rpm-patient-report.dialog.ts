import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import {
  AccountProvider,
  AccSingleResponse,
  CareManagementProvider,
  CareManagementState
} from '@coachcare/sdk'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SelectOption } from '@app/shared/utils'
import { STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE } from '@app/config'

interface RPMSession {
  end?: string
  start: string
}

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-patient-report',
  templateUrl: './rpm-patient-report.dialog.html',
  styleUrls: ['./rpm-patient-report.dialog.scss'],
  host: {
    class: 'ccr-dialog'
  }
})
export class RPMPatientReportDialog implements OnDestroy, OnInit {
  public account: AccSingleResponse
  public form: FormGroup
  public maxDate: moment.Moment = moment()
  public minEndDate: moment.Moment
  public serviceTypes: SelectOption<string>[] = []
  public rpmSessions: {
    organization: any
    data: RPMSession[]
  }[] = []
  public status: 'downloading' | 'loading' | 'ready' = 'loading'

  constructor(
    private accountService: AccountProvider,
    private context: ContextService,
    private dialogRef: MatDialogRef<RPMPatientReportDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private careManagement: CareManagementProvider,
    private careManagementState: CareManagementState
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    void this.resolveData()
  }

  public async onDownloadReport(): Promise<void> {
    try {
      if (this.form.invalid) {
        return
      }

      this.status = 'downloading'
      const formValue = this.form.value
      const dateRange = {
        end: moment(formValue.endDate)
          .tz(this.account.timezone || this.context.user.timezone, true)
          .endOf('day')
          .toISOString(),
        start: moment(formValue.startDate)
          .tz(this.account.timezone || this.context.user.timezone, true)
          .startOf('day')
          .toISOString()
      }

      const format = formValue.format
      const request = {
        account: this.account.id,
        organization: this.context.organization.id,
        start: dateRange.start,
        end: dateRange.end,
        serviceType: formValue.serviceType || undefined
      }

      let data
      let fileFormat

      switch (format) {
        case 'pdf':
          data = await this.careManagement.getIndividualSummaryAsPDF(request)
          fileFormat = 'pdf'
          break

        case 'excel':
          data = await this.careManagement.getIndividualSummaryAsExcel(request)
          fileFormat = 'xlsx'
          break
      }

      if (!data || data.size <= 2) {
        return
      }

      const blob = new Blob([data])
      const link = document.createElement('a')
      const serviceName =
        this.serviceTypes.find((item) => item.value === formValue.serviceType)
          ?.viewValue || 'RPM'
      const rawFileName = `${this.account.firstName}_${this.account.lastName}_${serviceName}_Report`
      link.href = window.URL.createObjectURL(blob)
      link.download = `${rawFileName.replace(/\W/gi, '')}.${fileFormat}`
      link.click()
      this.dialogRef.close()
    } catch (error) {
      console.error(error)
      this.notifier.error(error)
    } finally {
      this.status = 'ready'
    }
  }

  private createForm(): void {
    const lastMonth = moment().subtract(1, 'month')

    this.form = this.fb.group({
      endDate: [lastMonth.clone().endOf('month'), Validators.required],
      format: ['pdf'],
      serviceType: [''],
      startDate: [lastMonth.clone().startOf('month'), Validators.required]
    })

    this.form.controls.startDate.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((startDate) => {
        this.minEndDate = moment(startDate)
      })
  }

  private async resolveData(): Promise<void> {
    try {
      this.account = await this.accountService.getSingle(this.context.accountId)
      await this.resolveServiceTypes()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.status = 'ready'
    }
  }

  private async resolveServiceTypes(): Promise<void> {
    const activeCareManagementStates = (
      await this.careManagementState.getList({
        account: this.context.accountId,
        organization: this.context.organization.id,
        status: 'active'
      })
    ).data

    this.serviceTypes = this.context.accessibleCareManagementServiceTypes
      .filter((accessibleServiceType) => {
        return activeCareManagementStates.some(
          (activeSession) =>
            activeSession.serviceType.id === accessibleServiceType.id
        )
      })
      .map((e) => {
        return {
          value: e.id,
          viewValue: e.name
        }
      })

    const storageServiceType = localStorage.getItem(
      STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE
    )

    const loadedServiceType = this.serviceTypes.find(
      (e) => e.value === storageServiceType
    )
      ? storageServiceType
      : this.serviceTypes[0]?.value

    this.form.patchValue({
      serviceType: loadedServiceType
    })
  }
}
