import { Component } from '@angular/core'
import { ContextService } from '@app/service'

@Component({
  selector: 'app-reports-rpm',
  templateUrl: './rpm.component.html'
})
export class RPMReportComponent {
  public showClinicPatientCodeReportLink = false

  constructor(private context: ContextService) {}

  public ngOnInit(): void {
    this.showClinicPatientCodeReportLink = this.context.user.isTopLevel ?? false
  }
}
