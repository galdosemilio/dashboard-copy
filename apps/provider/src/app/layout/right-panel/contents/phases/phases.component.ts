import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PhasesDataSegment } from '@app/shared'
import { ContextService, EventsService } from '@app/service'
import { OrganizationDetailed, PackageEnrollmentSegment } from '@coachcare/sdk'
import { chain, intersectionBy, sortBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import {
  PhaseEnrollmentDatabase,
  PhaseEnrollmentDataSource
} from '../../services'
import * as moment from 'moment'

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss']
})
export class PhasesComponent implements OnDestroy, OnInit {
  public enrollments: PackageEnrollmentSegment[] = []
  public source: PhaseEnrollmentDataSource

  constructor(
    private context: ContextService,
    private database: PhaseEnrollmentDatabase,
    private bus: EventsService,
    private router: Router
  ) {
    this.onPhaseAdded = this.onPhaseAdded.bind(this)
    this.onPhaseRemoved = this.onPhaseRemoved.bind(this)
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
  }

  public goToPhaseManagement(): void {
    void this.router.navigate([
      `/accounts/patients/${this.context.accountId}/settings`,
      { s: 'labels' }
    ])
  }

  private createSource(): void {
    this.source = new PhaseEnrollmentDataSource(this.database)
    this.source.addDefault({ limit: 'all' })

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

    this.source.connect().subscribe((values) => {
      this.enrollments = chain(values)
        .groupBy('package.id')
        .map(
          (entries) =>
            sortBy(entries, (entry) =>
              moment(entry.enroll.start).unix()
            ).reverse()[0]
        )
        .filter((entry) => entry.isActive)
        .value()
    })
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

  private resetListing(): void {
    this.enrollments = []
  }

  private subscribeToBus(): void {
    this.bus.register('phases.assoc.added', this.onPhaseAdded)
    this.bus.register('phases.assoc.removed', this.onPhaseRemoved)
  }

  private unsubscribeFromBus(): void {
    this.bus.unregister('phases.assoc.added')
    this.bus.unregister('phases.assoc.removed')
  }
}
