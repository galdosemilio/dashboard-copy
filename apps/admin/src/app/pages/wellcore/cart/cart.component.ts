import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class WellcoreCartComponent implements OnInit {
  public cartTotal = 0
  public form: FormGroup
  public itemPrice = 0

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({ amount: [1] })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.refreshCartTotal()
    })

    this.refreshCartTotal()
  }

  private refreshCartTotal(): void {
    const amount: number = this.form.value.amount
    this.cartTotal = amount * this.itemPrice
  }
}
