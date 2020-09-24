import { DefaultClinicPackageComponent } from './';
import { ClinicPackagesSharedComponents } from './components/components.barrel';

export const ClinicPackagesComponents = [
  ClinicPackagesSharedComponents,
  DefaultClinicPackageComponent
];

export const ClinicPackagesEntryComponents = [DefaultClinicPackageComponent];
