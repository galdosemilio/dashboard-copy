import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import { Authentication, SyncedDeviceDate } from '@coachcare/sdk'
import * as moment from 'moment'

@Component({
  selector: 'ccr-integrations-device-sync',
  styleUrls: ['./device-sync.component.scss'],
  templateUrl: './device-sync.component.html'
})
export class DeviceSyncComponent implements OnInit {
  @Input() accountId: string

  public services: SyncedDeviceDate[] = []
  public forms: FormGroup[]
  public isLoading = false

  constructor(
    private authentication: Authentication,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    void this.fetchDevices()
  }

  public async onSubmit(formIndex: number): Promise<void> {
    try {
      this.isLoading = true

      const formValue = this.forms[formIndex].value

      if (formValue.service === 'healthkit') {
        await this.authentication.syncHealthKit({
          account: this.accountId
        } as any)
      } else {
        await this.authentication.forceDeviceSync({
          account: this.accountId,
          service: formValue.service,
          range: {
            start: moment(formValue.startDate).format('YYYY-MM-DD'),
            end: moment(formValue.endDate).format('YYYY-MM-DD')
          }
        })
      }
      this.notifier.success(_('NOTIFY.SUCCESS.SERVICE_SYNC_SUCCESS'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.cdr.detectChanges()
    }
  }

  private createForms(): void {
    this.forms = this.services.map((service) =>
      this.fb.group({
        service: [service.service, Validators.required],
        startDate: [moment().subtract(1, 'week'), Validators.required],
        endDate: [moment().endOf('day'), Validators.required]
      })
    )
  }

  private async fetchDevices(): Promise<void> {
    try {
      if (!this.accountId) {
        this.services = []
        this.createForms()
        return
      }

      const response = await this.authentication.lastActivity(this.accountId)
      this.services = response.data

      this.createForms()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.cdr.detectChanges()
    }
  }
}
