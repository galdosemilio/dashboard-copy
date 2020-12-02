import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LabelsDataSegment } from '@app/dashboard'
import {
  ContextService,
  EVENT_PHASE_ASSOC_ADDED,
  EVENT_PHASE_ASSOC_REMOVED,
  EventsService
} from '@app/service'
import {
  OrganizationDetailed,
  PackageEnrollmentSegment
} from '@coachcare/npm-api'
import { intersectionBy, uniqBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import {
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
} from '../../services'

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss']
})
export class PhasesComponent implements OnDestroy, OnInit {
  public enrollments: PackageEnrollmentSegment[] = []
  public onScroll$: Subject<any> = new Subject<any>()
  public source: PhaseEnrollmentDataSource

  private enrollmentsNext: number
  private enrollmentsScroll$: Subject<void> = new Subject<void>()

  constructor(
    private context: ContextService,
    private database: PhaseEnrollmentDatabase,
    private bus: EventsService,
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

    this.createSource()
    this.subscribeToBus()
    this.subscribeToScroll()
  }

  public goToPhaseManagement(): void {
    this.router.navigate([
      `/accounts/patients/${this.context.accountId}/settings`,
      { s: 'labels' }
    ])
  }

  private createSource(): void {
    this.source = new PhaseEnrollmentDataSource(this.database)
    this.source.addDefault({ isActive: true, limit: 5 })

    this.source.addRequired(
      this.context.organization$.pipe(debounceTime(200)),
      () => ({
        organization: this.context.organizationId
      })
    )
    this.source.addRequired(
      this.context.account$.pipe(debounceTime(200)),
      () => ({
        account: this.context.accountId
      })
    )

    this.source.addOptional(
      this.enrollmentsScroll$.pipe(debounceTime(200)),
      () => ({
        offset: this.enrollmentsNext
      })
    )

    this.source.connect().subscribe((values) => {
      this.enrollments = uniqBy([...this.enrollments, ...values], 'package.id')
      this.enrollmentsNext = this.source.next
    })
  }

  private onPhaseAdded(phase: LabelsDataSegment): void {
    const phaseHierarchyPath = (phase.package
      .organization as OrganizationDetailed).hierarchyPath

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
        organization: { id: phase.package.organization.id },
        isActive: true,
        enroll: { start: '' }
      },
      ...this.enrollments
    ]
  }

  private onPhaseRemoved(phase: LabelsDataSegment): void {
    const phaseHierarchyPath = (phase.package
      .organization as OrganizationDetailed).hierarchyPath

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
      !this.source.isLoading &&
      this.enrollmentsNext &&
      target.offsetHeight + target.scrollTop >= target.scrollHeight
    ) {
      this.enrollmentsScroll$.next()
    }
  }

  private resetListing(): void {
    this.enrollments = []
    this.enrollmentsNext = 0
  }

  private subscribeToBus(): void {
    this.bus.register(EVENT_PHASE_ASSOC_ADDED, this.onPhaseAdded)
    this.bus.register(EVENT_PHASE_ASSOC_REMOVED, this.onPhaseRemoved)
  }

  private subscribeToScroll(): void {
    this.onScroll$
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(this.onScroll)
  }

  private unsubscribeFromBus(): void {
    this.bus.unregister(EVENT_PHASE_ASSOC_ADDED)
    this.bus.unregister(EVENT_PHASE_ASSOC_REMOVED)
  }
}
