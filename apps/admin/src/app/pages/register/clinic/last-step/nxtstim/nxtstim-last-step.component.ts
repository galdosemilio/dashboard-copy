import { Component } from '@angular/core'

@Component({
  selector: 'ccr-page-register-clinic-nxtstim-last-step',
  templateUrl: './nxtstim-last-step.component.html'
})
export class NXTSTIMLastStepComponent {
  public refresh(): void {
    window.location.reload()
  }
}
