import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { filter, Subject } from 'rxjs'

import { AccountParams } from '@board/services'
import {
  AccountCareManagementServiceType,
  AccountSingle,
  CareManagementProvider,
  CareManagementServiceType
} from '@coachcare/sdk'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface AccountServiceType {
  type: CareManagementServiceType
  association?: AccountCareManagementServiceType
  isActive: boolean
}

@UntilDestroy()
@Component({
  selector: 'ccr-account-care-management',
  templateUrl: './account-care-management.component.html'
})
export class AccountCareManagementComponent implements OnInit {
  private account: AccountSingle
  private refresh$ = new Subject<void>()
  public serviceTypes: AccountServiceType[] = []
  public isLoading = false

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private careManagement: CareManagementProvider
  ) {}

  ngOnInit() {
    this.refresh$
      .pipe(
        untilDestroyed(this),
        filter(() => !!this.account)
      )
      .subscribe(() => this.resolveServiceTypes())

    this.route.data.subscribe((data: AccountParams) => {
      this.account = data.account
      this.refresh$.next()
    })
    this.changeDetectorRef.detectChanges()
  }

  private async resolveServiceTypes() {
    this.isLoading = true
    this.serviceTypes = []

    try {
      const serviceTypesRes = await this.careManagement.getServiceTypes()

      const res = await this.careManagement.getAccountServiceTypes({
        account: this.account.id,
        status: 'all'
      })

      this.serviceTypes = serviceTypesRes.data.map((type) => {
        const association = res.data.find(
          (entry) => entry.serviceType.id === type.id
        )
        return {
          type,
          association,
          isActive: association?.status !== 'inactive'
        }
      })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.changeDetectorRef.detectChanges()
    }
  }

  public onChange(serviceType: AccountServiceType) {
    const value = !serviceType.isActive
    if (serviceType.association) {
      void this.updateAssociation(serviceType, value)
    } else {
      void this.createAssociation(serviceType, value)
    }
  }

  public async createAssociation(
    serviceType: AccountServiceType,
    value: boolean
  ) {
    try {
      this.isLoading = true
      const res = await this.careManagement.createAccountServiceType({
        account: this.account.id,
        status: value ? 'active' : 'inactive',
        serviceType: serviceType.type.id
      })

      await this.setAssociation(res.id)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.changeDetectorRef.detectChanges()
    }
  }

  public async updateAssociation(
    serviceType: AccountServiceType,
    value: boolean
  ) {
    try {
      this.isLoading = true
      await this.careManagement.updateAccountServiceType({
        id: serviceType.association.id,
        status: value ? 'active' : 'inactive'
      })

      await this.setAssociation(serviceType.association.id)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.changeDetectorRef.detectChanges()
    }
  }

  public async setAssociation(id: string) {
    const association = await this.careManagement.getAccountServiceTypeSingle(
      id
    )

    if (association) {
      return
    }

    const index = this.serviceTypes.findIndex(
      (entry) => entry.type.id === association.serviceType.id
    )

    if (index < 0) {
      return
    }

    this.serviceTypes[index] = {
      type: association.serviceType,
      association,
      isActive: association?.status !== 'inactive'
    }
  }
}
