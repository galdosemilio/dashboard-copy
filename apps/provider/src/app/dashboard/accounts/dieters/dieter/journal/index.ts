import { DieterJournalComponent } from './journal.component'

import { ExerciseComponent, ExerciseTableComponent } from './exercise/'
import { FoodExpandableTable } from './food/expandable-table/expandable-table.component'
import { FoodComponent } from './food/food.component'
import { HydrationComponent } from './hydration/hydration.component'
import { HydrationTableComponent } from './hydration/table/table.component'
import { FoodKeysComponent } from './keys/keys.component'
import { LevlChartComponent, LevlComponent, LevlTableComponent } from './levl'
import {
  MetricsChartComponent,
  MetricsComponent,
  MetricsTableComponent
} from './metrics'
import { PainComponent, PainTableComponent } from './pain'
import { SupplementsComponent } from './supplement/supplements.component'
import { SupplementsTableComponent } from './supplement/table/table.component'

export const JournalComponents = [
  DieterJournalComponent,
  ExerciseComponent,
  ExerciseTableComponent,
  FoodComponent,
  FoodExpandableTable,
  FoodKeysComponent,
  HydrationComponent,
  HydrationTableComponent,
  LevlComponent,
  LevlTableComponent,
  LevlChartComponent,
  MetricsComponent,
  PainComponent,
  PainTableComponent,
  SupplementsComponent,
  SupplementsTableComponent,
  MetricsChartComponent,
  MetricsTableComponent
]

export const JournalEntryComponents = []
