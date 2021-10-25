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
import { SidenavWellcoreComponent } from './sidenav-wellcore/sidenav-wellcore.component'

export const LayoutComponents = [
  DefaultLayoutComponent,
  LayoutComponent,
  FooterComponent,
  HelpComponent,
  MenubarComponent,
  SearchComponent,
  SearchResultItemComponent,
  SidenavComponent,
  SidenavItemComponent,
  WellcoreLayoutComponent,
  SidenavWellcoreComponent
]

export const LayoutEntryComponents = [HelpComponent]
