import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-badge',
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() color: string;
}
