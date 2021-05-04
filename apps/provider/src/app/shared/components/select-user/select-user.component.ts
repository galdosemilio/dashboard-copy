import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'

import { ContextService, SelectedAccount } from '@app/service'
import { ScheduleSelectDialog } from '@app/shared/dialogs/schedule-select.dialog'
import { AccountTypeId } from '@coachcare/sdk'

@Component({
  selector: 'ccr-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class CcrSelectUserComponent implements OnInit {
  @Input()
  title = ''
  @Input()
  default = ''
  @Input()
  onlyProviders = false

  text = ''
  user: SelectedAccount

  constructor(private dialog: MatDialog, private context: ContextService) {}

  ngOnInit() {
    this.context.selected$.subscribe((user) => {
      if (
        user &&
        (!this.onlyProviders ||
          user.accountType.id.toString() === AccountTypeId.Provider)
      ) {
        this.user = user
        this.resolveText(user)
      } else {
        this.user = this.context.user
        this.resolveText(this.user)
      }
    })
  }

  openDialog(): void {
    this.dialog
      .open(ScheduleSelectDialog, {
        disableClose: true,
        data: {
          user: this.context.user,
          organization: this.context.organizationId,
          title: this.title,
          button: this.default,
          onlyProviders: this.onlyProviders
        }
      })
      .afterClosed()
      .subscribe((user) => {
        if (user && this.user.id !== user.id) {
          this.context.selected = user
          this.resolveText(user)
        }
      })
  }

  private resolveText(user) {
    this.text =
      this.context.user.id === user.id
        ? this.default
        : `${user.firstName} ${user.lastName}`
  }
}
