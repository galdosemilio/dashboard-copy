import { Component, Input } from '@angular/core'
import { ConnectionStatus } from '@coachcare/npm-api'

@Component({
  selector: 'app-call-connection-indicator',
  templateUrl: './connection-indicator.component.html',
  styleUrls: ['./connection-indicator.component.scss']
})
export class ConnectionIndicatorComponent {
  @Input() connectionStatus: ConnectionStatus
}
