import { Injectable } from '@angular/core';
import { CcrRol } from '@coachcare/backend/shared';
import { ContextService } from '@coachcare/common/services';

@Injectable()
export class LabelRoutes {
  /**
   * Constants
   */
  static ADMIN = 'labels';

  // FIXME fetch current site from ngrx
  site = 'admin';

  /**
   * Label route handler
   */
  constructor(private context: ContextService) {}

  list(force?: CcrRol) {
    const site = force || this.context.site || 'admin';

    switch (site) {
      case 'admin':
        return `/${site}/${LabelRoutes.ADMIN}`;
      default:
        console.error('List route not implemented', site);
        return ``;
    }
  }

  single(id: string) {
    const site = this.context.site || 'admin';

    switch (site) {
      case 'admin':
        return `/${site}/${LabelRoutes.ADMIN}/${id}`;
      default:
        console.error('Single route not implemented', site);
        return ``;
    }
  }

  edit(id: string) {
    return `/${this.site}/${LabelRoutes.ADMIN}/${id}/data/edit`;
  }
}
