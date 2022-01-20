import { AssociationsDatabase } from '@app/dashboard'
import { RightPanelEntryComponents } from './contents/index'
import { RightPanelDialogs } from './dialogs/index'
import { RightPanelComponent } from './right-panel.component'
import { RightPanelServices } from './services/index'

export {
  RightPanelComponent,
  RightPanelEntryComponents,
  RightPanelDialogs,
  RightPanelServices
}

export const Components = [
  RightPanelComponent,
  ...RightPanelDialogs,
  ...RightPanelEntryComponents
]

export const Providers = [...RightPanelServices, AssociationsDatabase]
