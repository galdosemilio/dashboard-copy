import { Component, OnInit } from '@angular/core'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'storefront-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class StorefrontTermsComponent implements OnInit {
  public cart: StorefrontCart
  public terms: string

  constructor(private storefront: StorefrontService) {}

  ngOnInit() {
    this.storefront.store$
      .pipe(
        untilDestroyed(this),
        filter((s) => !!s)
      )
      .subscribe((s) => {
        this.terms = s.terms_and_conditions
      })
  }
}
