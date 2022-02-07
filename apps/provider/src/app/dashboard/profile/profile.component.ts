import { Component, OnInit } from '@angular/core'
import { ContextService } from '@app/service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  public isPatient: boolean

  constructor(private context: ContextService) {}

  public ngOnInit(): void {
    this.isPatient = this.context.isPatient
  }
}
