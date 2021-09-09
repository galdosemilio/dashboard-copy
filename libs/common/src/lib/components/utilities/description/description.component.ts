import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { Subject } from 'rxjs'
import {
  ConfirmDialog,
  GridDialog,
  GridDialogData
} from '@coachcare/common/dialogs/core'
import { _, TranslationsObject } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'ccr-popup-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class PopupDescriptionComponent implements OnInit {
  @Input()
  title = ''
  @Input()
  description = ''
  @Input()
  icon = 'help_outline'
  @Input()
  isGrid = false
  @Input()
  gridData: GridDialogData = null
  @Input()
  showIntro = true
  @Input()
  trigger: Subject<void>
  @Input()
  dialogWidth?: string

  translations: TranslationsObject

  constructor(public dialog: MatDialog, private translator: TranslateService) {}

  ngOnInit() {
    this.loadTranslations()
    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.loadTranslations()
    })
    if (this.trigger) {
      this.trigger.pipe(untilDestroyed(this)).subscribe(() => this.openDialog())
    }
  }

  public openDialog(): void {
    if (!this.isGrid) {
      const intro = this.showIntro
        ? `${this.translations['GLOBAL.ABOUT']} `
        : ''
      this.dialog.open(ConfirmDialog, {
        data: {
          title: `${intro}${this.title}`,
          content: this.description
        },
        width: this.dialogWidth
      })
    } else {
      this.dialog.open(GridDialog, {
        data: this.gridData,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
    }
  }

  private loadTranslations() {
    this.translator.get([_('GLOBAL.ABOUT')]).subscribe((translations) => {
      this.translations = translations
    })
  }
}
