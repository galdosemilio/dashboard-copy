import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-connection-status',
  templateUrl: './connection-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcrConnectionStatusComponent {
  @Input()
  userId: string
  @Input()
  organizationId: string

  availability: boolean

  constructor() {}
}
