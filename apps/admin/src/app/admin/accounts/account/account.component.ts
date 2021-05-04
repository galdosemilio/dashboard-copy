import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AccountSingle } from '@coachcare/sdk'

@Component({
  selector: 'ccr-accounts-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  accountType: string
  id: string
  item: AccountSingle

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: any) => {
      this.accountType = data.accountType
      this.id = data.account.id
      this.item = data.account
    })
  }
}
