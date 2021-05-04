import { Component, Input } from '@angular/core'
import { OrgSingleResponse } from '@coachcare/sdk'

@Component({
  selector: 'app-clinic-info',
  templateUrl: './clinic-info.component.html'
})
export class ClinicInfoComponent {
  @Input() clinic: OrgSingleResponse
}
