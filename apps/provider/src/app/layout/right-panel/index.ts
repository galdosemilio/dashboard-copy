import { RightPanelEntryComponents } from './contents/index';
import { RightPanelDialogs } from './dialogs/index';
import { RightPanelComponent } from './right-panel.component';
import { RightPanelServices } from './services/index';

export {
  RightPanelComponent,
  RightPanelEntryComponents,
  RightPanelDialogs,
  RightPanelServices
};

export const Components = [
  RightPanelComponent,
  ...RightPanelDialogs,
  ...RightPanelEntryComponents
];

export const EntryComponents = [...RightPanelEntryComponents, ...RightPanelDialogs];

export const Providers = [...RightPanelServices];
