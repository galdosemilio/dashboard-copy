import { Routes } from '@angular/router'
import { CellularDeviceHistoryComponent } from './list'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CellularDeviceHistoryComponent
  }
]
