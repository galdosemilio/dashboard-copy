import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import { untilDestroyed } from 'ngx-take-until-destroy'

import { ContextService } from '@app/service'
import { ConfirmDialog } from '@app/shared'
import { _, TranslationsObject } from '@app/shared/utils'

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.scss']
})
export class AlertInfoComponent implements OnInit, OnDestroy {
  indirectOrganization = false
  text: TranslationsObject

  constructor(
    public dialog: MatDialog,
    private translator: TranslateService,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.context.organization$.subscribe((org) => {
      this.indirectOrganization = !org.isDirect
    })

    this.loadTranslations()
    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.loadTranslations()
    })
  }

  ngOnDestroy() {}

  public openDialog(): void {
    this.dialog.open(ConfirmDialog, {
      data: {
        title:
          this.text['GLOBAL.ABOUT'] +
          ' ' +
          this.text['ALERTS.ALERT_NOTIFICATIONS'],
        content:
          this.text['ALERTS.ASSOCIATION_WARNING_EXPLANATION'] +
          this.renderTable()
      }
    })
  }

  private renderTable() {
    // FIXME may list all the accesible organizations here?
    return (
      `
      <br><br>
        <table width="100%">
          <thead>
            <tr class="row-odd">
              <th>${this.text['BOARD.CLINIC']}</th>
              <th>${this.text['GLOBAL.ASSOCIATED']}</th>
              <th>${this.text['GLOBAL.ALERTS_GENERATED']}?</th>
            </tr>
          </thead>
          <tbody>
    ` +
      this.context.organizations
        .map((e, i) => {
          return `
            <tr class="${i % 2 ? 'row-odd' : 'row-even'}">
                <td>${e.name}</td>
                <td align="center">${
                  e.isDirect
                    ? this.text['GLOBAL.DIRECTLY']
                    : this.text['GLOBAL.CASCADING']
                }</td>
                <td align="center">${
                  e.isDirect
                    ? '<strong>' + this.text['GLOBAL.YES'] + '</strong>'
                    : this.text['GLOBAL.NO']
                }</td>
            </tr>
        `
        })
        .join('') +
      `
      </tbody>
      </table>
    `
    )
  }

  private loadTranslations() {
    this.translator
      .get([
        _('BOARD.CLINIC'),
        _('GLOBAL.ALERTS_GENERATED'),
        _('GLOBAL.ASSOCIATED'),
        _('GLOBAL.DIRECTLY'),
        _('GLOBAL.CASCADING'),
        _('GLOBAL.ABOUT'),
        _('GLOBAL.NO'),
        _('GLOBAL.YES'),
        _('ALERTS.ALERT_NOTIFICATIONS'),
        _('ALERTS.ASSOCIATION_WARNING_EXPLANATION')
      ])
      .subscribe((translations) => {
        this.text = translations
      })
  }
}
