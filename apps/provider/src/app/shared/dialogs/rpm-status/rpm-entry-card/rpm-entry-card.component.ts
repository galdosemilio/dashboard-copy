import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  RPMStateEntry,
  RPMStateEntryPendingStatus
} from '@app/shared/components/rpm/models'
import { AccountRef, OrganizationAccess } from '@coachcare/sdk'

@Component({
  selector: 'app-dialog-rpm-entry-card',
  templateUrl: './rpm-entry-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RPMEntryCardComponent {
  @Input() accessibleOrganizations: OrganizationAccess[]
  @Input() canDisableRPM: boolean
  @Input() client: AccountRef
  @Input() entryIsActive: boolean
  @Input() entryPending: RPMStateEntryPendingStatus
  @Input() inaccessibleOrganizations: OrganizationAccess[]
  @Input() rpmEntry: RPMStateEntry

  get serviceName(): string {
    return this.rpmEntry.rpmState.serviceType.name
  }
}
