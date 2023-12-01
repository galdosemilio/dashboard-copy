import { Component, OnInit } from '@angular/core'
import { StorefrontService } from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'storefront-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class StorefrontFooterComponent implements OnInit {
  currentYear = new Date().getFullYear()
  storeName: string
  terms: string
  refundPolicy: string

  constructor(private storefront: StorefrontService) {}

  ngOnInit() {
    this.storefront.store$
      .pipe(
        untilDestroyed(this),
        filter((s) => !!s)
      )
      .subscribe((s) => {
        this.terms = s.terms_and_conditions
        this.refundPolicy = s.return_policy
        this.storeName = s.name
      })
  }
}
