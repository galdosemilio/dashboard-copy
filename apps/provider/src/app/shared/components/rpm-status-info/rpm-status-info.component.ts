import { Component, Input, OnInit } from '@angular/core'
import { RPMStateEntry } from '../rpm/models'

@Component({
  selector: 'app-rpm-status-info',
  templateUrl: './rpm-status-info.component.html',
  styleUrls: ['./rpm-status-info.component.scss']
})
export class RPMStatusInfoComponent implements OnInit {
  @Input() rpmEntry: RPMStateEntry

  public entryIsActive: boolean

  public ngOnInit(): void {
    this.entryIsActive = this.rpmEntry.isActive ?? false
  }
}
