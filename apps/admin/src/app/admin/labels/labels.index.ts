export * from './form/index';
export * from './list/index';
export * from './shared/index';

import { LabelDialogs, LabelResolver, LabelRoutes } from '@board/services';
import { LabelsDatabase } from '@coachcare/backend/data';
import { LabelFormComponent } from './form/index';
import { LabelsListComponent } from './list/index';
import { LabelsTableComponent } from './shared/index';

export const LabelsComponents = [LabelFormComponent, LabelsListComponent, LabelsTableComponent];

export const LabelsEntryComponents = [];

export const LabelsProviders = [LabelResolver, LabelsDatabase, LabelDialogs, LabelRoutes];
