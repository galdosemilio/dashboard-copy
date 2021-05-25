export * from './messages/messages.interfaces'

import { MatMomentDateModule } from '@coachcare/datepicker'

import { AlertIconComponent } from './alert-icon/alert-icon.component'
import { AppSectionComponent } from './app-section/app-section.component'
import { CcrAccessLevelSelectorComponent } from './access-level-selector'
import { CcrAccountAssociationsComponent } from './associations'
import { CcrAttendanceSelectorComponent } from './attendance-selector'
import { CcrCallControlComponent } from './call-control/call-control.component'
import { CcrChildClinicPickerComponent } from './child-clinic-picker'
import { CcrConnectionStatusComponent } from './connection-status/connection-status.component'
import { CountrySelectorComponent } from './country-selector'
// import { CcrDateInputComponent } from '@coachcare/common/components/form/fields/date-input'
import {
  DateNavigator,
  DateNavigatorOutput
} from './date-navigator/date-navigator.component'
import {
  DateRangeNavigator,
  DateRangeNavigatorOutput
} from './date-range/date-range.component'
import { PopupDescriptionComponent } from './description/description.component'
import { HelpLinkComponent } from './help-link/help-link.component'
import { HeightFormFieldComponent } from './dieter-height/dieter-height.component'
import { FormSearchComponent } from './form-search'
import { InlineEditableField } from './inline-editable-field'
import { LangFormFieldComponent } from './lang-selector'
import {
  LocaleFormFieldComponent,
  LocaleSelectDialog,
  LocaleTableComponent
} from './locale-selector'
import { LoginHistoryComponent } from './login-history'
import { CcrMessagesChatInfoComponent } from './messages-chat-info'
import { CcrMessagesComponent } from './messages/messages.component'
import { OrganizationSearchComponent } from './organization-search'
import { PackageEnrollComponent } from './package-enroll'
import { PackageFilterComponent } from './package-filter'
import { PackageSelectorComponent } from './package-selector/package-selector.component'
import { PackageTableComponent } from './package-table/package-table.component'
import { CcrPageSizeSelectorComponent } from './page-size-selector'
import { PhoneInputComponent } from './phone-input'
import { ProgressCircle } from './progress-circle/progress-circle.component'
import { QuickDateRangeComponent } from './quick-date-range'
import { RPMStatusPanelComponent } from './rpm-status-panel'
import { RPMTrackerComponent } from './rpm-tracker'
import { RPMComponent } from './rpm/rpm.component'
import { CcrSelectUserComponent } from './select-user/select-user.component'
import { SequenceSearchComponent } from './sequence-search'
import { CcrTimeframeSelectorComponent } from './timeframe-selector/timeframe-selector.component'
import { UserCardComponent } from './user-card'
import { UserSearchComponent } from './user-search'
import { WalkthroughComponent } from './walkthrough'
import { CcrImageOptionSelectorComponent } from './image-option-selector'
import { CcrTableSortHeaderComponent } from './table-sort-header'
import { CcrSearchSelectorComponent } from './search-selector'
import { CcrTinInputComponent } from './tin-input'
import { RPMStatusInfoComponent } from './rpm-status-info'
import {
  ScheduleListTableComponent,
  DeleteRecurringMeetingDialog,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog,
  ViewAllMeetingsDialog,
  MeetingsDataSource,
  MeetingsDatabase
} from './schedule'

export {
  AlertIconComponent,
  AppSectionComponent,
  CcrAccessLevelSelectorComponent,
  CcrAttendanceSelectorComponent,
  DateNavigator,
  DateNavigatorOutput,
  DateRangeNavigator,
  DateRangeNavigatorOutput,
  CcrAccountAssociationsComponent,
  CcrChildClinicPickerComponent,
  CcrConnectionStatusComponent,
  // CcrDateInputComponent,
  CcrImageOptionSelectorComponent,
  CcrMessagesComponent,
  CcrSearchSelectorComponent,
  CcrSelectUserComponent,
  CcrTableSortHeaderComponent,
  CcrTimeframeSelectorComponent,
  CcrTinInputComponent,
  CcrCallControlComponent,
  CountrySelectorComponent,
  FormSearchComponent,
  HeightFormFieldComponent,
  InlineEditableField,
  LangFormFieldComponent,
  LocaleFormFieldComponent,
  LocaleSelectDialog,
  LocaleTableComponent,
  LoginHistoryComponent,
  OrganizationSearchComponent,
  PackageSelectorComponent,
  PackageEnrollComponent,
  PackageFilterComponent,
  PackageTableComponent,
  PhoneInputComponent,
  PopupDescriptionComponent,
  HelpLinkComponent,
  ProgressCircle,
  QuickDateRangeComponent,
  MatMomentDateModule,
  RPMComponent,
  SequenceSearchComponent,
  UserCardComponent,
  UserSearchComponent,
  WalkthroughComponent,
  ScheduleListTableComponent,
  DeleteRecurringMeetingDialog,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog,
  ViewAllMeetingsDialog,
  MeetingsDataSource,
  MeetingsDatabase
}

export const CmpComponents = [
  AlertIconComponent,
  AppSectionComponent,
  DateNavigator,
  DateRangeNavigator,
  CcrAccessLevelSelectorComponent,
  CcrAccountAssociationsComponent,
  CcrAttendanceSelectorComponent,
  CcrChildClinicPickerComponent,
  CcrConnectionStatusComponent,
  CcrCallControlComponent,
  // CcrDateInputComponent,
  CcrImageOptionSelectorComponent,
  CcrMessagesChatInfoComponent,
  CcrMessagesComponent,
  CcrPageSizeSelectorComponent,
  CcrSearchSelectorComponent,
  CcrSelectUserComponent,
  CcrTableSortHeaderComponent,
  CcrTimeframeSelectorComponent,
  CcrTinInputComponent,
  CountrySelectorComponent,
  FormSearchComponent,
  HeightFormFieldComponent,
  InlineEditableField,
  LangFormFieldComponent,
  LocaleFormFieldComponent,
  LocaleSelectDialog,
  LocaleTableComponent,
  LoginHistoryComponent,
  OrganizationSearchComponent,
  PackageSelectorComponent,
  PackageEnrollComponent,
  PackageFilterComponent,
  PackageTableComponent,
  PhoneInputComponent,
  PopupDescriptionComponent,
  HelpLinkComponent,
  ProgressCircle,
  QuickDateRangeComponent,
  RPMComponent,
  RPMTrackerComponent,
  RPMStatusInfoComponent,
  RPMStatusPanelComponent,
  SequenceSearchComponent,
  UserCardComponent,
  UserSearchComponent,
  WalkthroughComponent,
  ScheduleListTableComponent,
  DeleteRecurringMeetingDialog,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog,
  ViewAllMeetingsDialog
]

export const CmpEntryComponents = [
  LocaleSelectDialog,
  LocaleTableComponent,
  PackageEnrollComponent,
  PackageSelectorComponent,
  RPMComponent,
  DeleteRecurringMeetingDialog,
  SingleAddDialog,
  RecurringAddDialog,
  ViewMeetingDialog,
  ViewAllMeetingsDialog
]
