import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SessionSelectors, SessionState } from '@coachcare/backend/store/session';
import { ConfigService, LayoutService } from '@coachcare/common/services';
import { AppPalette, MenuItem } from '@coachcare/common/shared';
import { Store } from '@ngrx/store';
import { findIndex } from 'lodash';
import { Messaging } from 'selvera-api';

@Component({
  selector: 'ccr-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  @Input() isOpened = false;

  _this: MenuComponent = this;
  menuItems: MenuItem[] = [];
  palette: AppPalette;
  route: string;
  size: string;

  constructor(
    private router: Router,
    private messaging: Messaging,
    private config: ConfigService,
    // private bus: EventsService,
    private layout: LayoutService,
    private session: Store<SessionState.State>
  ) {
    this.palette = this.config.get('palette');

    this.session.select(SessionSelectors.selectAccount).subscribe(account => {
      const menu = this.config.get('menu');
      this.menuItems = menu[account] || [];
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.route = event.url.split('/')[1];
        this.updateNavigation();
      }
    });

    this.layout.size.subscribe(size => (this.size = size));
  }

  ngOnInit() {
    // register event to refresh unread
    // this.bus.register('system.timer', this.updateUnread.bind(this));
  }

  updateNavigation() {
    this.menuItems = this.menuItems.map(item => {
      if (this.route === item.route && !item.expanded) {
        item.expanded = true;
        // only changes the reference when the status changes
        return { ...item };
      }
      return item;
    });
  }

  updateUnread() {
    Promise.all([this.messaging.getUnread()]).then(([threads]) => {
      // update the unread threads
      const m = findIndex(this.menuItems, { navRoute: 'messages' });
      if (this.menuItems[m].unread !== threads.unreadThreadsCount) {
        this.menuItems[m].unread = threads.unreadThreadsCount;
        this.menuItems[m] = { ...this.menuItems[m] };
      }
    });
  }
}
