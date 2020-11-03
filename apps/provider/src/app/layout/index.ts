export * from './layout.component';

import { LayoutBaseComponent } from './base/base.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { HelpComponent } from './menubar/help';
import { MenubarComponent } from './menubar/menubar.component';
import { SearchResultItemComponent } from './menubar/search/search-result-item/search-result-item.component';
import { SearchComponent } from './menubar/search/search.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';

export const LayoutComponents = [
  LayoutBaseComponent,
  LayoutComponent,
  FooterComponent,
  HelpComponent,
  MenubarComponent,
  SearchComponent,
  SearchResultItemComponent,
  SidenavComponent,
  SidenavItemComponent
];

export const LayoutEntryComponents = [HelpComponent];
