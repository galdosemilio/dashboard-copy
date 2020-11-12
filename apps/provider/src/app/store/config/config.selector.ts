import { CCRConfig } from '@app/config'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const configSelector = createFeatureSelector<CCRConfig>('config')

export const paletteSelector = createSelector(
  configSelector,
  (state: CCRConfig) => state.palette
)
