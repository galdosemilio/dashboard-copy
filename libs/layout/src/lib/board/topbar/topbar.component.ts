import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatDialog } from '@coachcare/common/material'
import { TranslationsObject } from '@coachcare/backend/shared'
import { _ } from '@coachcare/backend/shared'
import { LanguagesDialog } from '@coachcare/common/dialogs/core'
import {
  AuthService,
  ConfigService,
  LayoutService
} from '@coachcare/common/services'
import { AppPalette } from '@coachcare/common/shared'
import { User } from '@coachcare/npm-api'

@Component({
  selector: 'ccr-topbar',
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  @Input() translations: TranslationsObject = {}
  @Input() selectedLanguage: string
  @Input() panelEnabled: boolean

  palette: AppPalette

  constructor(
    private user: User,
    private auth: AuthService,
    private config: ConfigService,
    private layout: LayoutService,
    protected dialog: MatDialog
  ) {
    this.palette = this.config.get('palette')
  }

  selectLanguage() {
    this.dialog.open(LanguagesDialog, {
      data: {
        title: _('GLOBAL.SELECT_LANGUAGE')
      },
      panelClass: 'ccr-lang-dialog'
    })
  }

  logout(): void {
    this.user.logout().then(() => {
      this.auth.logout()
    })
  }

  toggleMenu(e: Event): void {
    this.layout.toggleMenu()
    e.stopPropagation()
  }

  togglePanel(e: Event): void {
    this.layout.togglePanel()
    e.stopPropagation()
  }
}
