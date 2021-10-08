import { Injectable } from '@angular/core'
import { ContextService } from '@app/service'
import { AccountIdentifier } from '@coachcare/sdk'
import { environment } from 'apps/provider/src/environments/environment'
import { BehaviorSubject } from 'rxjs'

const prescriberyIdentifierName = 'Prescribery ID'

@Injectable()
export class AvailabilityManagementService {
  public isDisabledAvailabilityManagement$ = new BehaviorSubject<boolean>(false)

  constructor(
    private accountIdentifier: AccountIdentifier,
    private context: ContextService
  ) {}

  public init(): void {
    this.context.organization$.subscribe((org) => {
      this.checkDisabledAvailabilityManagement(org.id)
    })
  }

  private setDisabledAvailabilityManagement(isDisabled: boolean): void {
    this.isDisabledAvailabilityManagement$.next(isDisabled)
  }

  private async checkDisabledAvailabilityManagement(
    orgId: string
  ): Promise<void> {
    const wellCoreOrg = this.context.organizations.find(
      (org) => org.id === environment.wellCoreOrgId
    )

    if (!wellCoreOrg) {
      return this.setDisabledAvailabilityManagement(false)
    }

    try {
      const res = await this.accountIdentifier.fetchAll({
        account: this.context.user.id,
        organization: orgId
      })

      const hasPrescriberyIdentifier = res.data.some(
        (i) => i.name === prescriberyIdentifierName
      )

      this.setDisabledAvailabilityManagement(hasPrescriberyIdentifier)
    } catch (err) {
      this.setDisabledAvailabilityManagement(false)
    }
  }
}
