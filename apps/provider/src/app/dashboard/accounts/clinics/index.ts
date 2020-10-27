export * from './clinics.component';
export * from './services';
export * from './table/picker/picker.component';

import { ClinicsComponent } from './clinics.component';
import { CreateClinicDialog } from './dialogs';
import { ClinicsDatabase } from './services';
import { ClinicsPickerComponent } from './table/picker/picker.component';
import { ClinicsTableComponent } from './table/table.component';

export const ClinicsComponents = [
  ClinicsComponent,
  ClinicsPickerComponent,
  ClinicsTableComponent,
  CreateClinicDialog
];

export const ClinicsEntryComponents = [CreateClinicDialog];

export const ClinicsProviders = [ClinicsDatabase];
