import { Injectable } from '@angular/core'
import { ContextService } from '@app/service'
import { ExtendedMeasurementLabelEntry } from '@app/shared/model'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementDataPointTypeProvider,
  MeasurementLabelProvider,
  MeasurementPreferenceProvider
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'
import { forkJoin, from } from 'rxjs'
import { debounceTime, map, mergeMap, switchMap } from 'rxjs/operators'
import { AppState } from '../state'
import { MeasurementLabelActions } from './measurement-label.actions'
import { measurementLabelSelector } from './measurement-label.selector'
import { MeasLabelFeatureState } from './measurement-label.state'

@UntilDestroy()
@Injectable()
export class MeasurementLabelsEffects implements OnInitEffects {
  private state: MeasLabelFeatureState

  constructor(
    private actions$: Actions,
    private context: ContextService,
    private dataPointType: MeasurementDataPointTypeProvider,
    private measurementLabel: MeasurementLabelProvider,
    private preferenceProvider: MeasurementPreferenceProvider,
    private store: Store<AppState>
  ) {
    this.store
      .select(measurementLabelSelector)
      .subscribe((state) => (this.state = state))
  }

  public ngrxOnInitEffects(): Action {
    this.context.organization$
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe(() =>
        this.store.dispatch(MeasurementLabelActions.RefreshFeature())
      )

    return MeasurementLabelActions.Init()
  }

  public init$ = createEffect(() =>
    this.actions$.pipe(
      debounceTime(300),
      ofType(MeasurementLabelActions.Init),
      map(() => MeasurementLabelActions.RefreshFeature())
    )
  )

  public refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeasurementLabelActions.RefreshFeature),
      switchMap(() => from(this.fetchMeasurementPreference())),
      mergeMap((preference) => [
        MeasurementLabelActions.SetMeasurementPref({
          preference,
          inherited: this.context.organizationId !== preference.organization.id
        }),
        MeasurementLabelActions.RefreshLabelsAndTypes()
      ])
    )
  )

  public refreshLabelsAndTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeasurementLabelActions.RefreshLabelsAndTypes),
      switchMap(() =>
        forkJoin([
          from(this.fetchMeasurementLabels()),
          from(this.fetchDataPointTypes())
        ])
      ),
      map(([labels, types]) =>
        MeasurementLabelActions.SetLabelsAndTypes({ labels, types })
      )
    )
  )

  private async fetchDataPointTypes(): Promise<
    MeasurementDataPointTypeAssociation[]
  > {
    const response = await this.dataPointType.getAssociations({
      limit: 'all',
      status: 'active'
    })

    return this.state.preferenceIsInherited
      ? response.data.filter(
          (assoc) =>
            assoc.organization.id === this.state.preference.organization.id
        )
      : response.data.filter(
          (assoc) => assoc.organization.id === this.context.organization.id
        )
  }

  private async fetchMeasurementLabels(): Promise<
    ExtendedMeasurementLabelEntry[]
  > {
    const response = await this.measurementLabel.getAll({
      localeMode: 'matching',
      organization: this.context.organizationId,
      limit: 'all',
      status: 'active'
    })

    const data = this.state.preferenceIsInherited
      ? response.data.filter(
          (entry) =>
            entry.organization.id === this.state.preference.organization.id
        )
      : response.data.filter(
          (entry) => entry.organization.id === this.context.organization.id
        )

    return data.map((label) => ({
      ...label,
      routeLink: encodeURIComponent(
        label.name.replace(/\s/gi, '-').toLowerCase()
      )
    }))
  }

  private async fetchMeasurementPreference(): Promise<MeasurementPreferenceEntry> {
    return await this.preferenceProvider.getSingleMatching({
      organization: this.context.organizationId,
      status: 'active'
    })
  }
}
