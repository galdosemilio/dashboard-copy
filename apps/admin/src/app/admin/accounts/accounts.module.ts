import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// import { UserLogsModule } from '@board/admin/userlogs/index';
import { SharedModule } from '@board/shared/shared.module';
import { CcrFormFieldsModule, CcrUtilityComponentsModule } from '@coachcare/common/components';
import { CcrPipesModule } from '@coachcare/common/pipes';

import { AccountsComponents, AccountsEntryComponents, AccountsProviders } from './accounts.index';
import { routes } from './accounts.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    // UserLogsModule,
    SharedModule,
    CcrFormFieldsModule,
    CcrUtilityComponentsModule,
    CcrPipesModule
  ],
  declarations: AccountsComponents,
  entryComponents: AccountsEntryComponents,
  providers: AccountsProviders
})
export class AccountsModule {}
