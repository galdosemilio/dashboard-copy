import { DataPointDatabase } from '@coachcare/backend/data'
import { DataPointTypeTranslationsComponent } from './components'
import { EditDataPointTypeDialog } from './dialogs'
import {
  MeasurementsComponent,
  MeasurementsDataPointsComponent
} from './measurements'

export * from './components'
export * from './dialogs'
export * from './measurements'

export const MeasurementsComponents = [
  DataPointTypeTranslationsComponent,
  EditDataPointTypeDialog,
  MeasurementsComponent,
  MeasurementsDataPointsComponent
]

export const MeasurementsProviders = [DataPointDatabase]
