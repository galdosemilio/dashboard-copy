import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
  public selectedServiceType: string = this.getServiceTypeFromStorage()

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
    this.saveToStorage(serviceType.value)
    this.serviceTypeChange.emit(serviceType.value)
  }

  private async resolveServiceTypes() {
    this.isLoading = true
    this.serviceTypes = []

    try {
      this.serviceTypes = this.context.user.careManagementServiceTypes
      const selectedServiceTypeFromStorage = this.getServiceTypeFromStorage()

      if (selectedServiceTypeFromStorage) {
        this.selectedServiceType = selectedServiceTypeFromStorage
        this.serviceTypeChange.emit(selectedServiceTypeFromStorage)
        return
      }

      this.selectedServiceType = this.serviceTypes[0]?.id
      this.saveToStorage(this.serviceTypes[0]?.id)
      this.serviceTypeChange.emit(this.serviceTypes[0]?.id)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.changeDetectorRef.detectChanges()
    }
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
    window.localStorage.setItem(
      STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
      serviceType
    )
  }
}
