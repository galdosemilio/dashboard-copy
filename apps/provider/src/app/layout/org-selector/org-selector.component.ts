import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { CCRConfig } from '@app/config'
import { ContextService, SelectedOrganization } from '@app/service'
import { OrganizationProvider } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { fromEvent, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { SidenavOrg } from '../sidenav/sidenav.component'
import { FetchSubaccount } from '../store/call'

@Component({
  selector: 'app-sidenav-org-selector',
  templateUrl: './org-selector.component.html',
  styleUrls: ['./org-selector.component.scss']
})
export class SidenavOrgSelectorComponent
  implements AfterViewInit, OnDestroy, OnInit {
  public hasMoreThanOneClinic = false
  public isSearchingClinics = false
  public logoSrc = './assets/logo.png'
  public menuClosed$ = new Subject<Event>()
  public organization: SelectedOrganization
  public organizations: Array<SidenavOrg> = []
  public searchCtrl: FormControl
  public searchQuery: string = undefined

  private menuContainer: HTMLElement
  private searchNext = 0

  constructor(
    private context: ContextService,
    private orgservice: OrganizationProvider,
    private store: Store<CCRConfig>
  ) {}

  public ngOnInit(): void {
    this.hasMoreThanOneClinic = this.context.organizations.length > 1
    this.initSearch()
    this.createEventListeners()
  }

  public ngAfterViewInit(): void {
    this.menuContainer = document.querySelector('.org-selector')
  }

  public ngOnDestroy(): void {
    this.menuClosed$.complete()
  }

  public menuOpened(): void {
    this.menuContainer = document.querySelector('.org-selector')
    fromEvent(this.menuContainer, 'scroll')
      .pipe(takeUntil(this.menuClosed$))
      .subscribe(($event: Event) => {
        const target = $event.target as HTMLElement
        if (
          !this.isSearchingClinics &&
          this.searchNext &&
          target.offsetHeight + target.scrollTop >= target.scrollHeight * 0.75
        ) {
          void this.searchClinics(this.searchQuery)
        }
      })
  }

  public selectOrg(org: SidenavOrg): void {
    if (org.id !== this.organization.id) {
      this.context.organizationId = org.id
      this.store.dispatch(new FetchSubaccount(org.id))
    }
  }

  private createEventListeners(): void {
    this.context.organization$.subscribe((org) => {
      this.organization = org

      // TODO consider logo-mark for md screens
      this.logoSrc =
        org && org.assets && org.assets.logoUrl
          ? org.assets.logoUrl
          : './assets/logo.png'
    })
  }

  private initSearch(): void {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.menuContainer.scrollTop = 0
        this.searchQuery = query.trim() || undefined
        this.searchNext = 0
        void this.searchClinics(this.searchQuery)
      })

    void this.searchClinics(this.searchQuery)
  }

  private async searchClinics(query: string) {
    this.isSearchingClinics = true
    const orgs = await this.orgservice.getAccessibleList({
      query,
      status: 'active',
      offset: this.searchNext,
      limit: 24
    })
    const sidenavOrgs = orgs.data.map((org) => ({
      id: org.organization.id,
      name: org.organization.name
    }))
    this.organizations =
      this.searchNext === 0
        ? sidenavOrgs
        : this.organizations.concat(sidenavOrgs)
    this.searchNext = orgs.pagination.next || 0
    this.isSearchingClinics = false
  }
}
