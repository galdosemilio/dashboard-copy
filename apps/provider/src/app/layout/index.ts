export * from './layout.component'

import { FooterComponent } from './footer/footer.component'
import { LayoutComponent } from './layout.component'
import { DefaultLayoutComponent, WellcoreLayoutComponent } from './layouts'
import { HelpComponent } from './menubar/help'
import { MenubarComponent } from './menubar/menubar.component'
import { SearchResultItemComponent } from './menubar/search/search-result-item/search-result-item.component'
import { SearchComponent } from './menubar/search/search.component'
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component'
import { SidenavComponent } from './sidenav/sidenav.component'
import { SidenavOrgSelectorComponent } from './org-selector'
import {
  SidenavWellcoreComponent,
  WellcoreRingComponent
} from './sidenav-wellcore'

export const LayoutComponents = [
  DefaultLayoutComponent,
  LayoutComponent,
  FooterComponent,
  HelpComponent,
  MenubarComponent,
  SidenavOrgSelectorComponent,
  SearchComponent,
  SearchResultItemComponent,
  SidenavComponent,
  SidenavItemComponent,
  SidenavWellcoreComponent,
  WellcoreLayoutComponent,
  WellcoreRingComponent
]

export const LayoutEntryComponents = [HelpComponent]
