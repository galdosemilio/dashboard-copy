import {
  CellularDeviceHistoryDataSource,
  CellularDeviceHistoryDatabase
} from '@coachcare/backend/data'
import { CellularDeviceHistoryComponent } from './list'

export * from './list'

export const CellularDeviceHistoryComponents = [CellularDeviceHistoryComponent]

export const CellularDeviceHistoryProviders = [
  CellularDeviceHistoryDatabase,
  CellularDeviceHistoryDataSource
]
