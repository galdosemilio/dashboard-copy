import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NotifierService } from '@coachcare/common/services'
import { CellularDeviceDatabase } from '../../../services'
import { CellularDeviceType } from '@coachcare/sdk'
import { resolveConfig } from '@app/config/section'
import { ContextService } from '@app/service'

@Component({
  selector: 'app-cellular-device-form',
  templateUrl: './cellular-device-form.component.html'
})
export class CellularDeviceFormComponent implements OnInit {
  @Output() onDeviceAdded = new EventEmitter()
  public form: FormGroup
  public devices: CellularDeviceType[]

  constructor(
    private database: CellularDeviceDatabase,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  async ngOnInit() {
    this.createForm()
    const res = await this.getAllTypes()

    const filterRegex: RegExp = resolveConfig(
      'PATIENT_DASHBOARD.INCLUDE_CELLULAR_DEVICE_NAMES_REGEX',
      this.context.organization
    )

    this.devices = filterRegex
      ? res.data.filter((entry) => entry.name.match(filterRegex))
      : res.data

    if (this.devices.length > 0) {
      this.form.get('type').setValue(this.devices[0].id)
    }
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) return

    try {
      const req = {
        account: this.context.account.id,
        data: this.form.value
      }

      await this.database.add(req)

      this.onDeviceAdded.emit()
      this.form.reset({ type: this.devices[0].id })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async getAllTypes() {
    try {
      return await this.database.getTypes()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm() {
    this.form = new FormGroup({
      identifier: new FormControl(null, Validators.required),
      type: new FormControl(null)
    })
  }
}
