import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatSelectChange
} from '@coachcare/material'
import { AssociationsDatabase } from '@app/dashboard/accounts/dieters/dieter/settings/services/associations'
import { ContextService, NotifierService } from '@app/service'
import {
  OrganizationAccess,
  OrganizationEntity,
  OrganizationPermission
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators'

type OrganizationSearchComponentModes = 'searchbar' | 'select'

@Component({
  selector: 'ccr-organization-search',
  templateUrl: './organization-search.component.html',
  styleUrls: ['./organization-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationSearchComponent implements OnInit {
  @Input()
  account: string
  @Input() initialOrg: any
  @Input() label: string = _('BOARD.SELECT_ORGANIZATION')
  @Input() setOrgId: string
  @Input()
  permissions: Partial<OrganizationPermission>
  @Input()
  allowSearchbarReset = false
  @Input()
  ancestor: string
  @Input()
  prefixIcon?: string
  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly
    setTimeout(() => {
      if (readonly) {
        this.searchCtrl.disable()
        this.trigger.setDisabledState(true)
      } else {
        this.searchCtrl.enable()
        this.trigger.setDisabledState(false)
      }
    }, 100)
  }

  get readonly(): boolean {
    return this._readonly
  }
  @Input() strict = false
  @Input() showEmptyOption = true
  @Input() suffixIcon?: string

  @Output()
  onSelect: Subject<OrganizationEntity> = new Subject<OrganizationEntity>()
  @Output()
  filteredOrgs: Subject<OrganizationEntity[]> = new Subject<
    OrganizationEntity[]
  >()
  @Output()
  select: Subject<OrganizationEntity> = new Subject<OrganizationEntity>()

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  mode: OrganizationSearchComponentModes = 'select'
  searchCtrl: FormControl
  orgSelected: boolean
  selectModeThreshold = 10
  organizations: OrganizationAccess[] = []

  private _readonly: boolean

  constructor(
    private context: ContextService,
    private database: AssociationsDatabase,
    private notify: NotifierService
  ) {}

  ngOnInit(): void {
    void this.fetchOrganizations()
    this.setupAutocomplete()

    if (this.initialOrg) {
      this.searchCtrl.setValue(this.initialOrg.name, { emitEvent: false })
      this.setOrgId = this.initialOrg.id

      if (this.allowSearchbarReset) {
        this.searchCtrl.disable()
      }

      this.orgSelected = true
      this.select.next(this.initialOrg)
      this.onSelect.next(this.initialOrg)
    }
  }

  onOrgAutocompleteSelect($event: MatAutocompleteSelectedEvent) {
    const value = $event.option.value || undefined
    const selectedAssoc = this.organizations.find(
      (assoc) => assoc.organization.id === value
    )
    this.orgSelected = true
    this.select.next(selectedAssoc ? selectedAssoc.organization : undefined)
    this.onSelect.next(selectedAssoc ? selectedAssoc.organization : undefined)

    if (this.allowSearchbarReset) {
      this.searchCtrl.disable()
    }
  }

  onOrgSelect($event: MatSelectChange): void {
    const association = this.organizations.find(
      (assoc) => assoc.organization.id === $event.value
    )
    this.orgSelected = true
    this.select.next(association ? association.organization : undefined)
    this.onSelect.next(association ? association.organization : undefined)

    if (this.allowSearchbarReset) {
      this.searchCtrl.disable()
    }
  }

  resetSearchBar() {
    this.orgSelected = false
    this.searchCtrl.enable()
    this.searchCtrl.reset()
    this.select.next()
    this.onSelect.next()
  }

  searchBarDisplayWith(value: any): string {
    const selectedAssoc: OrganizationAccess =
      this.organizations && this.organizations.length
        ? this.organizations.find((assoc) => assoc.organization.id === value)
        : undefined
    return selectedAssoc ? selectedAssoc.organization.name : value
  }

  private async fetchOrganizations(query?: string) {
    try {
      const response = await this.database.fetch({
        account: this.account || this.context.user.id,
        permissions: this.permissions || undefined,
        ancestor: this.ancestor || undefined,
        query: query,
        strict: this.strict,
        status: 'active'
      })

      if (response.data && response.data.length) {
        this.organizations = response.data
      }

      this.filteredOrgs.next(this.organizations.map((org) => org.organization))

      if (this.organizations.length >= this.selectModeThreshold) {
        this.mode = 'searchbar'
      }

      if (!query && this.organizations.length === 1) {
        const orgId = this.organizations[0].organization.id
        this.onOrgSelect({
          value: orgId,
          source: null
        })
        this.setOrgId = orgId
        this.readonly = true
      }
    } catch (error) {
      this.notify.error(error)
    }
  }

  private setupAutocomplete(): void {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(
        skip(this.initialOrg ? 1 : 0),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        if (query) {
          void this.fetchOrganizations(query)
        } else {
          this.trigger.closePanel()
        }
      })
  }
}
