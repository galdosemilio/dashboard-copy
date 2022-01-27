import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import {
  AuthService,
  ContextService,
  CurrentAccount,
  NotifierService
} from '@app/service'
import { User } from '@coachcare/sdk'
import { LanguagesDialog, RouteUtils } from '@app/shared'
import { NavigationStart, Router, RouterEvent } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { WELLCORE_ROUTE_TITLE } from '.'
import { CCRConfig } from '@app/config'
import { Store } from '@ngrx/store'
import { ToggleMenu } from '@app/layout/store'

@UntilDestroy()
@Component({
  selector: 'wellcore-topbar',
  templateUrl: './topbar.component.html'
})
export class WellcoreTopBarComponent implements OnInit {
  public account: CurrentAccount
  public title: string

  constructor(
    private auth: AuthService,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private router: Router,
    private store: Store<CCRConfig>,
    private user: User
  ) {
    this.routeEventHandler = this.routeEventHandler.bind(this)
  }

  public ngOnInit(): void {
    this.account = this.context.user

    this.router.events
      .pipe(untilDestroyed(this))
      .subscribe(this.routeEventHandler)
  }

  public async logout(): Promise<void> {
    const loginSite = resolveConfig(
      'GLOBAL.LOGIN_SITE_URL',
      this.context.organization
    )

    try {
      await this.user.logout()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.auth.redirect(loginSite)
    }
  }

  public showLanguagesDialog(): void {
    this.dialog.open(LanguagesDialog, {
      panelClass: 'ccr-lang-dialog'
    })
  }

  public toggleMenu(e: Event): void {
    this.store.dispatch(new ToggleMenu())
    e.stopPropagation()
  }

  private async routeEventHandler($event: RouterEvent): Promise<void> {
    try {
      if (!($event instanceof NavigationStart)) {
        return
      }

      this.title = this.resolveRouteTitle($event)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private resolveRouteTitle($event: NavigationStart): string {
    const routeTitles = Object.values(WELLCORE_ROUTE_TITLE)
    const urlSegments = $event.url.split('/').filter((segment) => !!segment)

    const foundRoute = RouteUtils.findRouteEntry(routeTitles, urlSegments)

    return foundRoute?.title ?? ''
  }
}
