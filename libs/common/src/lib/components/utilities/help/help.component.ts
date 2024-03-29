import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { _, TranslationsObject } from '@coachcare/common/shared'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'

@UntilDestroy()
@Component({
  selector: 'ccr-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit, OnDestroy {
  @Input() title = ''
  @Input() description = ''

  translations: TranslationsObject

  constructor(public dialog: MatDialog, private translator: TranslateService) {}

  ngOnInit() {
    this.loadTranslations()
    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.loadTranslations()
    })
  }

  ngOnDestroy() {}

  public openDialog(): void {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: `${this.translations['GLOBAL.ABOUT']} ${this.title}`,
        content: this.description
      }
    })
  }

  private loadTranslations() {
    this.translator.get([_('GLOBAL.ABOUT')]).subscribe((translations) => {
      this.translations = translations
    })
  }
}
