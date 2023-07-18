import { Injectable, OnDestroy } from '@angular/core'
import { NavigationStart, Router, RouterEvent } from '@angular/router'
import { STORAGE_TIME_TRACKER_STASH } from '@app/config'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject, debounceTime, merge } from 'rxjs'
import { AccountProvider } from '@coachcare/sdk'
import { ContextService, SelectedOrganization } from '../context.service'
import { NotifierService } from '../notifier.service'
import { TIME_TRACKER_ROUTES, TimeTrackerRoute } from './consts'
import { RouteUtils } from '@app/shared/helpers'
import { uniq } from 'lodash'
import { _ } from '@coachcare/backend/shared'

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService implements OnDestroy {
  public currentRoute$: BehaviorSubject<TimeTrackerRoute> =
    new BehaviorSubject<TimeTrackerRoute>(undefined)

  set currentRoute(route: TimeTrackerRoute) {
    this.currentRoute$.next(route)
  }

  get currentRoute(): TimeTrackerRoute {
    return this.currentRoute$.getValue()
  }

  activeCareManagementServiceTag: string

  private currentOrganization: SelectedOrganization
  private trackingTimeStart: Date
  private automatedTimeTracking: boolean = true

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router
  ) {
    this.routeEventHandler = this.routeEventHandler.bind(this)
    this.forceCommit = this.forceCommit.bind(this)
    this.currentOrganization = this.context.organization
    this.context.automatedTimeTracking$.subscribe((value) => {
      this.automatedTimeTracking = value
    })
    this.router.events
      .pipe(untilDestroyed(this))
      .subscribe(this.routeEventHandler)
    void this.commitStashedTime()

    this.context.activeCareManagementService$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((serviceType) => {
        this.activeCareManagementServiceTag = serviceType?.tag
      })

    merge(this.context.organization$, this.context.activeCareManagementService$)
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        try {
          await this.forceCommit()
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.currentOrganization = this.context.organization
        }
      })
  }

  public ngOnDestroy(): void {}

  public async forceCommit(
    resetTrackingTimeStart: boolean = true
  ): Promise<void> {
    try {
      if (!this.currentRoute || !this.trackingTimeStart) {
        return
      }
      const currentRouteCache = this.currentRoute

      await this.commitTime(this.currentRoute)

      if (resetTrackingTimeStart) {
        this.resetTrackingTimeStart()
      } else {
        this.trackingTimeStart = undefined
      }

      this.currentRoute = currentRouteCache
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public async manualCommit(startTime: Date, endTime: Date): Promise<void> {
    if (!this.currentRoute || !startTime || !endTime) {
      return
    }

    try {
      const tags = this.getTags(this.currentRoute)
      await this.account.addActivityEvent({
        account: this.currentRoute.useAccount
          ? this.context.accountId
          : undefined,
        interaction: {
          time: {
            end: endTime.toISOString(),
            start: startTime.toISOString()
          }
        },
        organization: this.currentOrganization.id,
        source: 'dashboard',
        tags
      })
      this.notifier.success(_('NOTIFY.SUCCESS.MANUAL_TIME_ADDED'))
    } catch (error) {
      this.notifier.error(_('NOTIFY.ERROR.MANUAL_TIME_ADD_FAILED'))
    }
  }

  public getCurrentRounte(): TimeTrackerRoute {
    return this.currentRoute
  }

  public resetTrackingTimeStart(): void {
    this.trackingTimeStart = new Date()
  }

  private getTags(route: TimeTrackerRoute) {
    const params = this.calculateParams(route)

    const tags = [...route.tags, ...params]

    if (
      route.useAccount &&
      this.context.activeCareManagementService &&
      this.automatedTimeTracking
    ) {
      tags.push(this.context.activeCareManagementService.tag)
    }

    if (!this.automatedTimeTracking) {
      tags.push('manual-entry')
    }

    return uniq(tags)
  }

  public stashTime(): void {
    if (!this.currentRoute || !this.trackingTimeStart) {
      return
    }

    const route = this.currentRoute
    const tags = this.getTags(route)

    const payload = {
      account: route.useAccount ? this.context.accountId : undefined,
      interaction: {
        time: {
          end: new Date().toISOString(),
          start: this.trackingTimeStart.toISOString()
        }
      },
      organization: this.currentOrganization.id,
      source: 'dashboard',
      tags
    }

    window.localStorage.setItem(
      STORAGE_TIME_TRACKER_STASH,
      JSON.stringify(payload)
    )
  }

  private async commitTime(route: TimeTrackerRoute): Promise<void> {
    try {
      const tags = this.getTags(route)
      await this.account.addActivityEvent({
        account: route.useAccount ? this.context.accountId : undefined,
        interaction: {
          time: {
            end: new Date().toISOString(),
            start: this.trackingTimeStart.toISOString()
          }
        },
        organization: this.currentOrganization.id,
        source: 'dashboard',
        tags
      })

      this.trackingTimeStart = undefined
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async commitStashedTime(): Promise<void> {
    try {
      const stash = window.localStorage.getItem(STORAGE_TIME_TRACKER_STASH)
        ? JSON.parse(window.localStorage.getItem(STORAGE_TIME_TRACKER_STASH))
        : null

      if (!stash) {
        return
      }

      await this.account.addActivityEvent(stash)

      window.localStorage.removeItem(STORAGE_TIME_TRACKER_STASH)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private calculateParams(route: TimeTrackerRoute): string[] {
    let params = []
    if (route.useParamMap) {
      const rawParams = this.router.url.split(';')

      rawParams.shift()

      params = rawParams.length ? rawParams.map((raw) => raw.split('=')[1]) : []

      params = route.ignoredParams
        ? params.filter(
            (param) => !route.ignoredParams.find((ignored) => ignored === param)
          )
        : params

      if (route.defaultParams) {
        route.defaultParams.forEach((defaultParam, index) => {
          params[index] = params[index] || defaultParam
        })
      }
    }

    return params
  }

  private resolveTimeTrackerRoute($event: RouterEvent): TimeTrackerRoute {
    const timeTrackerRoutes = Object.values(TIME_TRACKER_ROUTES)
    const urlSegments = $event.url.split('/').filter((segment) => !!segment)

    return RouteUtils.findRouteEntry(timeTrackerRoutes, urlSegments)
  }

  private async routeEventHandler($event: RouterEvent): Promise<void> {
    try {
      if (!($event instanceof NavigationStart)) {
        return
      }

      const timeTrackerRoute = this.resolveTimeTrackerRoute($event)

      if (!timeTrackerRoute) {
        if (this.currentRoute) {
          await this.commitTime(this.currentRoute)
          this.currentRoute = undefined
        }
        return
      }

      if (!this.trackingTimeStart) {
        this.trackingTimeStart = new Date()
      }

      if (
        this.currentRoute &&
        (this.currentRoute.id !== timeTrackerRoute.id ||
          this.currentRoute.useParamMap)
      ) {
        await this.commitTime(this.currentRoute)
        this.trackingTimeStart = new Date()
      }

      this.currentRoute = timeTrackerRoute
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
