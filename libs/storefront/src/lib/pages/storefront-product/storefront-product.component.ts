import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { CCRState } from '@coachcare/backend/store'
import { NotifierService } from '@coachcare/common/services'
import { OrgPrefSelectors } from '@coachcare/common/store'
import {
  StorefrontProductDialog,
  StorefrontShoppingPromptDialog
} from '@coachcare/storefront/dialogs'
import {
  StorefrontCategory,
  StorefrontProduct,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { select, Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-storefront-product',
  templateUrl: './storefront-product.component.html',
  styleUrls: ['./storefront-product.component.scss']
})
export class StorefrontProductComponent implements OnInit {
  public search: string = ''
  public search$ = new Subject<string>()
  public categories: StorefrontCategory[] = []
  public products: StorefrontProduct[] = []
  public selectedCategory: StorefrontCategory
  public isLoading: boolean = false
  public primaryColor: string

  constructor(
    private storefront: StorefrontService,
    private notifier: NotifierService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<CCRState.State>
  ) {
    this.store
      .pipe(
        untilDestroyed(this),
        select(OrgPrefSelectors.selectOrgPref),
        filter((pref) => !!pref)
      )
      .subscribe((pref) => {
        const palette = pref.assets.color
        this.primaryColor =
          palette.theme === 'accent' ? palette.accent : palette.primary
      })
  }

  ngOnInit(): void {
    void this.getCategories()

    this.search$.pipe(untilDestroyed(this), debounceTime(400)).subscribe(() => {
      if (this.selectedCategory) {
        void this.getProducts()
      } else {
        void this.getCategories()
      }
    })
  }

  private async getCategories() {
    this.isLoading = true
    this.categories = []

    try {
      this.categories = await this.storefront.getCategories(this.search)
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private async getProducts() {
    this.products = []

    if (!this.selectedCategory) {
      return
    }

    this.isLoading = true

    try {
      this.products = await this.storefront.getProducts(
        this.selectedCategory.id,
        this.search
      )
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public onSelectCategory(category: StorefrontCategory) {
    this.search = ''
    this.selectedCategory = category
    void this.getProducts()
  }

  public async onSelectProduct(product: StorefrontProduct) {
    const productDetails = await this.storefront.getProductSingle(product.id)

    this.dialog
      .open(StorefrontProductDialog, {
        data: productDetails,
        width: '800px'
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe((res) => this.addItemToCart(res.id, res.quantity))
  }

  private async addItemToCart(variantId: string, quantity: number) {
    this.isLoading = true

    try {
      await this.storefront.addItemToCart(variantId, quantity)
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
      this.showShoppingPrompt()
    }
  }

  private showShoppingPrompt() {
    this.dialog
      .open(StorefrontShoppingPromptDialog, {
        width: '60vw',
        maxWidth: '500px'
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe((res: 'cart' | 'category') => {
        if (res === 'cart') {
          return this.router.navigate(['../order/cart'], {
            relativeTo: this.route,
            queryParamsHandling: 'merge'
          })
        }

        if (res === 'category') {
          return this.onClearSelectedCategory()
        }
      })
  }

  public onClearSelectedCategory() {
    this.search = ''
    this.selectedCategory = null
    void this.getCategories()
  }
}
