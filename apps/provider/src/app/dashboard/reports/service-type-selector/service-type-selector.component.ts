import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { MatSelectChange } from '@angular/material/select'
import { STORAGE_CARE_MANAGEMENT_SERVICE_TYPE } from '@app/config'
import { ContextService, NotifierService } from '@app/service'
import { AccountSingle, CareManagementServiceType } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter, Subject } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'app-service-type-selector',
  templateUrl: './service-type-selector.component.html',
  styleUrls: ['./service-type-selector.component.scss']
})
export class ReportsServiceTypeSelectorComponent {
  private account: AccountSingle
  private refresh$ = new Subject<void>()
  public serviceTypes: CareManagementServiceType[] = []
  public isLoading = false
  public selectedServiceType: string

  @Input() public allowAll = false

  @Output() public serviceTypeChange = new EventEmitter<string>()

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private notifier: NotifierService,
    private context: ContextService
  ) {}

  async ngOnInit() {
    this.refresh$
      .pipe(
        untilDestroyed(this),
        filter(() => !!this.account)
      )
      .subscribe(() => this.resolveServiceTypes())

    await this.resolveServiceTypes()
    this.changeDetectorRef.detectChanges()
  }

  public onServiceTypeChange(serviceType: MatSelectChange) {
    if (serviceType.value === 'all') {
      this.serviceTypeChange.emit(null)
      return
    }

    this.saveToStorage(serviceType.value)
    this.serviceTypeChange.emit(serviceType.value)
  }

  private async resolveServiceTypes() {
    this.isLoading = true
    this.serviceTypes = []

    try {
      this.serviceTypes = this.context.user.careManagementServiceTypes
      if (this.allowAll) {
        this.serviceTypes = [
          {
            id: 'all',
            name: 'All',
            tag: 'all'
          },
          ...this.serviceTypes
        ]
      }
      const selectedServiceTypeFromStorage = this.getServiceTypeFromStorage()

      const selectedServiceType = this.serviceTypes.find(
        (serviceType) => serviceType.id === selectedServiceTypeFromStorage
      )

      if (selectedServiceType) {
        this.selectedServiceType = selectedServiceType.id
        this.serviceTypeChange.emit(selectedServiceType.id)
        return
      }

      this.selectedServiceType = this.serviceTypes[0]?.id
      if (this.serviceTypes[0]?.id !== 'all') {
        this.saveToStorage(this.serviceTypes[0]?.id)
        this.serviceTypeChange.emit(this.serviceTypes[0]?.id)
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.changeDetectorRef.detectChanges()
    }
  }

  private removeServiceTypeFromStorage() {
    window.localStorage.removeItem(STORAGE_CARE_MANAGEMENT_SERVICE_TYPE)
  }

  private getServiceTypeFromStorage(): string | null {
    try {
      const serviceType = window.localStorage.getItem(
        STORAGE_CARE_MANAGEMENT_SERVICE_TYPE
      )

      return serviceType
    } catch (error) {
      console.error(error)
    }
  }

  private saveToStorage(serviceType: string) {
    if (serviceType === 'all') {
      return
    }

    window.localStorage.setItem(
      STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
      serviceType
    )
  }
}
