import { Injectable } from '@angular/core'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementDataPointTypeProvider,
  MeasurementLabelEntry,
  MeasurementLabelProvider,
  MeasurementPreferenceProvider
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { BehaviorSubject, Observable } from 'rxjs'
import { concatMap, first, shareReplay } from 'rxjs/operators'
import { ContextService } from '../context.service'
import { NotifierService } from '../notifier.service'

export interface ExtendedMeasurementLabelEntry extends MeasurementLabelEntry {
  routeLink: string
}

@Injectable()
export class MeasurementLabelService {
  // fetching all available measurement labels caches them
  // this service holds the information about the measurement labels and data point types
  public dataPointTypes: MeasurementDataPointTypeAssociation[] = []
  public measurementLabels: ExtendedMeasurementLabelEntry[] = []
  public loaded$: Observable<unknown>

  private dataPointTypes$: Observable<MeasurementDataPointTypeAssociation[]>
  private inheritsPreference = false
  private measurementLabels$: Observable<ExtendedMeasurementLabelEntry[]>
  private measurementPref?: MeasurementPreferenceEntry
  private refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(null)

  constructor(
    private context: ContextService,
    private dataPointType: MeasurementDataPointTypeProvider,
    private measurementLabel: MeasurementLabelProvider,
    private measurementPreference: MeasurementPreferenceProvider,
    private notifier: NotifierService
  ) {
    this.context.organization$.subscribe(() => this.markCacheAsStale())

    this.requestDataPointTypes = this.requestDataPointTypes.bind(this)
    this.requestMeasurementLabels = this.requestMeasurementLabels.bind(this)

    this.measurementLabels$ = this.refresh$.pipe(
      concatMap(() => this.requestMeasurementLabels()),
      shareReplay(1)
    )

    this.dataPointTypes$ = this.measurementLabels$.pipe(
      concatMap(() => this.requestDataPointTypes()),
      shareReplay(1)
    )

    this.loaded$ = this.dataPointTypes$
  }

  public async init(): Promise<void> {
    await this.fetchMeasurementPreference()
    this.refresh$.next()
  }

  public async fetchDataPointTypes(): Promise<
    MeasurementDataPointTypeAssociation[]
  > {
    try {
      return await this.dataPointTypes$.pipe(first()).toPromise()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public async fetchMeasurementLabels(): Promise<
    ExtendedMeasurementLabelEntry[]
  > {
    try {
      return await this.measurementLabels$.pipe(first()).toPromise()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public markCacheAsStale(): void {
    this.inheritsPreference = false
    this.measurementLabels = []
    this.dataPointTypes = []
    this.refresh$.next()
  }

  public async resolveLabelDataPointTypes(
    label: MeasurementLabelEntry
  ): Promise<MeasurementDataPointTypeAssociation[]> {
    try {
      if (!this.dataPointTypes.length) {
        await this.fetchDataPointTypes()
      }

      return this.dataPointTypes.filter((type) => type.label.id === label.id)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async fetchMeasurementPreference(): Promise<void> {
    try {
      const single = await this.measurementPreference.getSingleMatching({
        organization: this.context.organization.id,
        status: 'active'
      })

      this.measurementPref = single

      this.inheritsPreference =
        single.organization.id !== this.context.organization.id
    } catch (error) {
      this.inheritsPreference = false
      this.measurementPref = undefined
    }
  }

  private async refreshMeasurementPref(): Promise<void> {
    try {
      if (
        this.measurementPref &&
        this.measurementPref.organization.id === this.context.organization.id
      ) {
        return
      }

      await this.fetchMeasurementPreference()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async requestDataPointTypes(): Promise<
    MeasurementDataPointTypeAssociation[]
  > {
    await this.refreshMeasurementPref()

    const response = await this.dataPointType.getAssociations({
      limit: 'all',
      status: 'active'
    })

    this.dataPointTypes = this.inheritsPreference
      ? response.data.filter(
          (assoc) =>
            assoc.organization.id === this.measurementPref.organization.id
        )
      : response.data.filter(
          (assoc) => assoc.organization.id === this.context.organization.id
        )

    return this.dataPointTypes.slice()
  }

  private async requestMeasurementLabels(): Promise<
    ExtendedMeasurementLabelEntry[]
  > {
    await this.refreshMeasurementPref()

    const response = await this.measurementLabel.getAll({
      localeMode: 'matching',
      organization: this.context.organizationId,
      limit: 'all',
      status: 'active'
    })

    const data = this.inheritsPreference
      ? response.data.filter(
          (entry) =>
            entry.organization.id === this.measurementPref.organization.id
        )
      : response.data.filter(
          (entry) => entry.organization.id === this.context.organization.id
        )

    this.measurementLabels = data.map((label) => ({
      ...label,
      routeLink: encodeURIComponent(
        label.name.replace(/\s/gi, '-').toLowerCase()
      )
    }))

    return this.measurementLabels
  }
}
