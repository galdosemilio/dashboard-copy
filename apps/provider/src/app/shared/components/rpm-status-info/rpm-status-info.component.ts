import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core'
import { RPMStateEntry } from '../rpm/models'

@Component({
  selector: 'app-rpm-status-info',
  templateUrl: './rpm-status-info.component.html',
  styleUrls: ['./rpm-status-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RPMStatusInfoComponent implements OnInit {
  @Input() rpmEntry: RPMStateEntry

  public entryIsActive: boolean

  get serviceName(): string {
    return this.rpmEntry.serviceType.name
  }

  public ngOnInit(): void {
    this.entryIsActive = this.rpmEntry.isActive ?? false
  }
}
