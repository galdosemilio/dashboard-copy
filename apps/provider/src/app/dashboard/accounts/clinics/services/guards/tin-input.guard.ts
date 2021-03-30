import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate } from '@angular/router'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { MatDialog } from '@coachcare/material'
import { ClinicComponent } from '../../clinic'

@Injectable()
export class TinInputGuard implements CanDeactivate<ClinicComponent> {
  constructor(private dialog: MatDialog) {}

  public async canDeactivate(
    component: ClinicComponent,
    currentRoute: ActivatedRouteSnapshot
  ): Promise<boolean> {
    if (
      currentRoute.paramMap.get('s') !== 'billable-services' ||
      component.isTinValid()
    ) {
      return true
    }

    return await this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.WARNING'),
          content: _('BOARD.TIN_INVALID_NAV_WARNING')
        }
      })
      .afterClosed()
      .toPromise()
  }
}
