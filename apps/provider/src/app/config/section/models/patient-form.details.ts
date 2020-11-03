import { SectionConfigObject } from '@app/config/section/section.config';

export interface PatientFormConfigDetails {
  SHOW_ACC_IDN_INPUT_CREATE?: boolean;
  ACCOUNT_IDENTIFIERS_INPUT?: SectionConfigObject;
  GRID_PACKAGE_IDS?: string[];
  PACKAGE_ENROLL?: SectionConfigObject;
  PACKAGE_ENROLL_GRID?: SectionConfigObject;
  UNENROLL_THEN_ENROLL?: boolean;
}
