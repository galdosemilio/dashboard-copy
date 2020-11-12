import { Component } from '@angular/core'
import { ConfigService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  clinicName: string
  company: string
  currentYear: number

  constructor(config: ConfigService) {
    this.clinicName = config.get(
      'app.layout.footer.clinic',
      'Configure Clinic Name'
    )
    this.company = config.get('app.layout.footer.company', 'CoachCare')
    this.currentYear = new Date().getFullYear()
  }
}
