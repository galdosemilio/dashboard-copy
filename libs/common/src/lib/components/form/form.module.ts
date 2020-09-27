import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CcrDirectivesModule } from '@coachcare/common/directives';
import { CcrMaterialModule } from '@coachcare/common/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { UserSearchComponent } from './autocompleters';

import { AccountAutocompleterComponent } from './autocompleters/account/account.component';
import { OrganizationAutocompleterComponent } from './autocompleters/organization/organization.component';
import { TranslatedTextFormFieldComponent } from './fields';

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
    CcrDirectivesModule,
    CcrMaterialModule,
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
    TranslatedTextFormFieldComponent,
    // autocompleters
    AccountAutocompleterComponent,
    OrganizationAutocompleterComponent,
    // filters
    AccountFilterComponent,
    LabelsFilterComponent,
    OrganizationsFilterComponent,
    UserSearchComponent,
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
    TranslatedTextFormFieldComponent,
    // autocompleters
    AccountAutocompleterComponent,
    OrganizationAutocompleterComponent,
    // filters
    AccountFilterComponent,
    LabelsFilterComponent,
    OrganizationsFilterComponent,
    UserSearchComponent,
  ],
})
export class CcrFormFieldsModule {}
