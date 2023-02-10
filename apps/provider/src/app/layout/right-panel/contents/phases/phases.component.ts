import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PhasesDataSegment } from '@app/shared'
import { ContextService, EventsService, NotifierService } from '@app/service'
import {
  OrganizationDetailed,
  PackageEnrollment,
  PackageEnrollmentSegment
} from '@coachcare/sdk'
import { intersectionBy, uniqBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss']
})
export class PhasesComponent implements OnDestroy, OnInit {
  public enrollments: PackageEnrollmentSegment[] = []
  public onScroll$: Subject<any> = new Subject<any>()
  public isLoading = false

  private enrollmentsNext: number = 0
  private scrollOffset = 5
  private enrollmentsScroll$: Subject<void> = new Subject<void>()

  constructor(
    private context: ContextService,
    private enrollment: PackageEnrollment,
    private bus: EventsService,
    private notify: NotifierService,
    private router: Router
  ) {
    this.onPhaseAdded = this.onPhaseAdded.bind(this)
    this.onPhaseRemoved = this.onPhaseRemoved.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromBus()
  }

  public ngOnInit(): void {
    merge(this.context.organization$, this.context.account$)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resetListing())

    this.subscribeToBus()
    this.subscribeToScroll()

    this.enrollmentsScroll$
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => this.getEnabledEnrollment())
    merge(this.context.organization$, this.context.account$)
      .pipe((untilDestroyed(this), debounceTime(200)))
      .subscribe(() => this.refresh())
  }

  public goToPhaseManagement(): void {
    void this.router.navigate([
      `/accounts/patients/${this.context.accountId}/settings`,
      { s: 'labels' }
    ])
  }

  private async getEnabledEnrollment() {
    this.isLoading = true
    try {
      const response = await this.enrollment.getLatestEnrollments({
        organization: this.context.organizationId,
        account: this.context.accountId,
        offset: this.enrollmentsNext,
        limit: 5,
        isActive: true
      })

      this.enrollments = uniqBy(
        [...this.enrollments, ...response.data],
        'package.id'
      )
      this.enrollmentsNext = response.pagination.next
    } catch (err) {
      this.notify.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private onPhaseAdded(phase: PhasesDataSegment): void {
    const phaseHierarchyPath = (
      phase.package.organization as OrganizationDetailed
    ).hierarchyPath

    if (
      intersectionBy(
        phaseHierarchyPath,
        this.context.organization.hierarchyPath,
        Number
      ).length < phaseHierarchyPath.length
    ) {
      return
    }

    this.enrollments = [
      {
        ...phase,
        account: { id: '' },
        organization: {
          id: phase.package.organization.id,
          name: phase.package.organization.name ?? ''
        },
        isActive: true,
        enroll: { start: '' }
      },
      ...this.enrollments
    ]
  }

  private onPhaseRemoved(phase: PhasesDataSegment): void {
    const phaseHierarchyPath = (
      phase.package.organization as OrganizationDetailed
    ).hierarchyPath

    if (
      intersectionBy(
        phaseHierarchyPath,
        this.context.organization.hierarchyPath,
        Number
      ).length < phaseHierarchyPath.length
    ) {
      return
    }

    this.enrollments = this.enrollments.filter(
      (enrollment) => enrollment.package.id !== phase.package.id
    )
  }

  private onScroll($event): void {
    const target = $event.target as HTMLElement
    if (
      !this.isLoading &&
      this.enrollmentsNext &&
      target.offsetHeight + target.scrollTop >=
        target.scrollHeight - this.scrollOffset
    ) {
      this.enrollmentsScroll$.next()
    }
  }

  private resetListing(): void {
    this.enrollments = []
    this.enrollmentsNext = 0
  }

  private subscribeToBus(): void {
    this.bus.register('phases.assoc.added', this.onPhaseAdded)
    this.bus.register('phases.assoc.removed', this.onPhaseRemoved)
  }

  private subscribeToScroll(): void {
    this.onScroll$
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(this.onScroll)
  }

  private unsubscribeFromBus(): void {
    this.bus.unregister('phases.assoc.added')
    this.bus.unregister('phases.assoc.removed')
  }

  private refresh() {
    this.enrollments = []
    this.enrollmentsNext = 0
    this.enrollmentsScroll$.next()
  }
}
