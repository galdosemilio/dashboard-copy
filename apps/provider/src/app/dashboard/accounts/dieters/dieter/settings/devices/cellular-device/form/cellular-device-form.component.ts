import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ContextService, NotifierService } from '@coachcare/common/services'
import { CellularDeviceDatabase } from '../../../services'
import { CellularDeviceType } from '@coachcare/sdk'

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

    this.devices = res.data
    this.form.get('type').setValue(this.devices[0].id)
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
