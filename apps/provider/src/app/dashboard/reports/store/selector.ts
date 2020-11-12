import { createFeatureSelector } from '@ngrx/store'
import { ReportsState } from './state'

export const name = 'reports'

export const reportsSelector = createFeatureSelector<ReportsState>(name)
