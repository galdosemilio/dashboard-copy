import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslationsObject } from '@coachcare/backend/shared';
import { LayoutService } from '@coachcare/common/services';

@Component({
  selector: 'ccr-layout-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent {
  @Input() isMenuOpened: boolean;
  @Input() isPanelOpened: boolean;
  @Input() isPanelEnabled: boolean;
  @Input() lang: string;
  @Input() translations: TranslationsObject = {};

  constructor(private layout: LayoutService) {}

  menuOpen(e: Event) {
    this.layout.IsMenuOpen = true;
    e.stopPropagation();
  }
}
