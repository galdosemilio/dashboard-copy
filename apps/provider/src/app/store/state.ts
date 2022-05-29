import { CCRConfig } from '@app/config'
import { MeasLabelFeatureState } from './measurement-label'
import { RouterStateType } from './router/index'

export interface AppState {
  config: CCRConfig
  router: RouterStateType
  measurementLabels: MeasLabelFeatureState
}
