import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { resolveConfig } from '@board/pages/config/section.config'
import { SelectorOption } from '@coachcare/backend/shared'
import { ContextService } from '@coachcare/common/services'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { debounceTime } from 'rxjs/operators'
import { PackagePriceItem, PackagePricePlanItem } from '../../model'

export interface PlanSelectorSelectionEvent {
  plan?: PackagePriceItem
  billing?: PackagePricePlanItem
}

@Component({
  selector: 'ccr-clinic-plan-selector',
  templateUrl: './clinic-plan-selector.component.html',
  styleUrls: ['./clinic-plan-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicPlanSelectorComponent implements OnDestroy, OnInit {
  @Output()
  select: EventEmitter<PlanSelectorSelectionEvent> = new EventEmitter<
    PlanSelectorSelectionEvent
  >()

  public clinicPlans: PackagePriceItem[] = []
  public form: FormGroup
  public planBillingPeriods: SelectorOption[] = []

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    this.calculateClinicPlanOptions()

    this.route.queryParamMap
      .pipe(untilDestroyed(this))
      .subscribe((map: ParamMap) => {
        const plan = map.get('plan') || ''

        // @ts-ignore - doesn't like the way i'm comparing the map.get('billingTerm)
        // I don't like it either -- Zcyon
        const billingTermSelection: 'monthly' | 'annually' = [
          'monthly',
          'annually'
        ].find((e) => e === map.get('billingTerm'))
          ? map.get('billingTerm')
          : 'annually'

        this.attemptSelectPlan(plan)
        this.attemptSelectBillingPeriod(billingTermSelection)
      })
  }

  private attemptSelectPlan(planType: string): void {
    const foundPlan = this.clinicPlans.find((plan) => plan.type === planType)

    if (!foundPlan) {
      return
    }

    this.form.controls.plan.setValue(foundPlan.id)
  }

  private attemptSelectBillingPeriod(
    billingPeriodName: 'monthly' | 'annually'
  ): void {
    const foundPlan = this.clinicPlans.find(
      (plan) => plan.id === this.form.value.plan
    )

    if (!foundPlan) {
      return
    }

    const foundBilling = foundPlan.billing.find(
      (billing) => billing.billingPeriod === billingPeriodName
    )

    if (!foundBilling) {
      return
    }

    this.form.controls.billingPeriod.setValue(foundBilling.id)
  }

  private calculateClinicPlanOptions(): void {
    this.clinicPlans =
      resolveConfig(
        'REGISTER.CLINIC_PLANS',
        this.context.organizationId,
        true
      ) || []

    if (!this.clinicPlans.length) {
      return
    }

    this.form.patchValue({ plan: this.clinicPlans[0].id })
  }

  private createForm(): void {
    this.form = this.fb.group({
      plan: ['', Validators.required],
      billingPeriod: ['', Validators.required]
    })

    this.form.controls.plan.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((planId) => {
        const foundPlan = this.clinicPlans.find(
          (clinicPlan) => clinicPlan.id === planId
        )

        if (!foundPlan) {
          return
        }

        this.planBillingPeriods = foundPlan.billing.map((plan) => ({
          value: plan.id,
          viewValue: plan.name
        }))

        if (!this.planBillingPeriods.length) {
          return
        }

        this.form.controls.billingPeriod.setValue(
          this.planBillingPeriods[0].value
        )
      })

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(150))
      .subscribe((controls) => {
        const foundPlan = this.clinicPlans.find(
          (clinicPlan) => clinicPlan.id === controls.plan
        )
        let foundBillingPeriod

        if (foundPlan) {
          foundBillingPeriod = foundPlan.billing.find(
            (billing) => billing.id === controls.billingPeriod
          )
        }

        this.select.emit({
          plan: foundPlan,
          billing: foundBillingPeriod
        })
      })
  }
}
