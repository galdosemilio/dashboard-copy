import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from '@coachcare/material'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { CcrUtilityComponentsModule } from '@coachcare/common/components'
import { CcrIconsComponentsModule } from '@coachcare/common/components/icons'
import { CcrPipesModule } from '@coachcare/common/pipes'

import { BaseComponent } from './base/base.component'
import { FooterComponent } from './footer/footer.component'
import { MenuComponent } from './menu/menu.component'
import { MenuItemComponent } from './menu/menuitem/menuitem.component'
import { SearchComponent } from './search/search.component'
import { TopbarComponent } from './topbar/topbar.component'

import { BoardLayout } from './board-layout.component'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    TranslateModule.forChild(),
    CcrPipesModule,
    CcrIconsComponentsModule,
    CcrUtilityComponentsModule
  ],
  declarations: [
    BaseComponent,
    FooterComponent,
    MenuComponent,
    MenuItemComponent,
    SearchComponent,
    TopbarComponent,
    BoardLayout
  ],
  exports: [BoardLayout]
})
export class BoardLayoutModule {}
