import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CcrDirectivesModule } from '@coachcare/common/directives';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AccountAutocompleterComponent } from './autocompleters/account/account.component';
import { OrganizationAutocompleterComponent } from './autocompleters/organization/organization.component';

import { ColorFormFieldComponent } from './fields/color/color.component';
import { ConsentFormFieldComponent } from './fields/consent/consent.component';
import { CountryFormFieldComponent } from './fields/country/country.component';
import { EmailFormFieldComponent } from './fields/email/email.component';
import { LangFormFieldComponent } from './fields/lang-selector/lang-selector.component';
import { NumberFormFieldComponent } from './fields/number/number.component';
import { PasswordFormFieldComponent } from './fields/password/password.component';
import { SelectorFormFieldComponent } from './fields/selector/selector.component';
import { StateFormFieldComponent } from './fields/state/state.component';
import { TextFormFieldComponent } from './fields/text/text.component';
import { TimezoneFormFieldComponent } from './fields/timezone/timezone.component';

import { AccountFilterComponent } from './filters/accounts/accounts.component';
import { LabelsFilterComponent } from './filters/labels/labels.component';
import { OrganizationsFilterComponent } from './filters/organizations/organizations.component';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CcrDirectivesModule
  ],
  declarations: [
    // fields
    ColorFormFieldComponent,
    ConsentFormFieldComponent,
    CountryFormFieldComponent,
    EmailFormFieldComponent,
    LangFormFieldComponent,
    NumberFormFieldComponent,
    PasswordFormFieldComponent,
    SelectorFormFieldComponent,
    StateFormFieldComponent,
    TextFormFieldComponent,
    TimezoneFormFieldComponent,
    // autocompleters
    AccountAutocompleterComponent,
    OrganizationAutocompleterComponent,
    // filters
    AccountFilterComponent,
    LabelsFilterComponent,
    OrganizationsFilterComponent
  ],
  exports: [
    // fields
    ColorFormFieldComponent,
    ConsentFormFieldComponent,
    CountryFormFieldComponent,
    EmailFormFieldComponent,
    LangFormFieldComponent,
    NumberFormFieldComponent,
    PasswordFormFieldComponent,
    SelectorFormFieldComponent,
    StateFormFieldComponent,
    TextFormFieldComponent,
    TimezoneFormFieldComponent,
    // autocompleters
    AccountAutocompleterComponent,
    OrganizationAutocompleterComponent,
    // filters
    AccountFilterComponent,
    LabelsFilterComponent,
    OrganizationsFilterComponent
  ]
})
export class CcrFormFieldsModule {}
