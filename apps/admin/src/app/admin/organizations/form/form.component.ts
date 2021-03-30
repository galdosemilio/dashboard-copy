import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { OrganizationsDatabase } from '@coachcare/backend/data'
import {
  NamedEntity,
  OrganizationProvider,
  OrganizationSingle
} from '@coachcare/npm-api'
import { FormUtils } from '@coachcare/backend/shared'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import {
  OrganizationDialogs,
  OrganizationParams,
  OrganizationRoutes
} from '@board/services'
import * as moment from 'moment'

@Component({
  selector: 'ccr-organizations-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganizationsFormComponent implements OnInit {
  billingForm: FormGroup
  entities: NamedEntity[] = []
  form: FormGroup
  id: string | undefined
  item: OrganizationSingle
  plans: NamedEntity[] = []
  readonly = true
  colSpan = 2

  constructor(
    private builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private database: OrganizationsDatabase,
    private notifier: NotifierService,
    private dialogs: OrganizationDialogs,
    private organization: OrganizationProvider,
    public routes: OrganizationRoutes
  ) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: OrganizationParams) => {
      this.id = data.org ? data.org.id : undefined
      if (data.org) {
        this.item = data.org
      }

      // setup the FormGroup
      this.createForms()
      if (this.item) {
        // fill the form
        this.form.patchValue(this.item)
      }

      this.readonly = data.editable ? false : true

      if (this.readonly) {
        this.billingForm.controls['entity'].disable()
        this.billingForm.controls['plan'].disable()
        this.billingForm.controls['isPaying'].disable()
        this.billingForm.controls['isBillable'].disable()
      } else {
        this.billingForm.controls['entity'].enable()
        this.billingForm.controls['plan'].enable()
        this.billingForm.controls['isPaying'].enable()
        this.billingForm.controls['isBillable'].enable()
      }
    })
  }

  async createForms(): Promise<void> {
    try {
      // TODO type the object
      this.form = this.builder.group({
        id: this.id,
        name: [null, Validators.required],
        shortcode: null,
        contact: this.builder.group({
          firstName: [null, Validators.required],
          lastName: [null, Validators.required],
          email: [null, Validators.required],
          phone: null
        }),
        address: this.builder.group({
          street: null,
          city: null,
          state: null,
          postalCode: null,
          country: null
        }),
        welcomeEmailAddress: 'no_reply@coachcare.com',
        passwordResetEmailAddress: 'no_reply@coachcare.com',
        openAssociationAddProvider: false,
        openAssociationAddClient: false,
        parentOrganizationId: null,
        isActive: true
      })

      this.billingForm = this.builder.group({
        entity: [],
        isBillable: [],
        recordExists: [false],
        plan: [],
        isPaying: [false, Validators.required],
        payingStartDate: [],
        basePricing: [],
        rpmPatientPricing: [],
        nonRpmPatientPricing: [],
        churnDate: [],
        renewalDate: [],
        numberOfLocations: [0, Validators.min(0)]
      })

      await Promise.all([this.resolveBillingPlans(), this.resolveEntities()])

      this.resolveBillingStatus()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid || this.billingForm.invalid) {
        FormUtils.markAsTouched(this.form)
        return
      }

      const res = await this.database.create(this.form.value)

      const billingFormValue = this.billingForm.value
      const billingUpdatePayload = FormUtils.pruneEmpty({
        ...billingFormValue,
        basePricing:
          billingFormValue.basePricing && billingFormValue.basePricing > -1
            ? billingFormValue.basePricing
            : null,
        rpmPatientPricing:
          billingFormValue.rpmPatientPricing &&
          billingFormValue.basePricing > -1
            ? billingFormValue.rpmPatientPricing
            : null,
        churnDate: billingFormValue.churnDate
          ? billingFormValue.churnDate.format('YYYY-MM-DD')
          : null,
        payingStartDate: billingFormValue.payingStartDate
          ? billingFormValue.payingStartDate.format('YYYY-MM-DD')
          : null,
        renewalDate: billingFormValue.renewalDate
          ? billingFormValue.renewalDate.format('YYYY-MM-DD')
          : null,
        organization: res.id,
        entity: billingFormValue.entity
          ? {
              isBillable: billingFormValue.isBillable || false,
              type: billingFormValue.entity
            }
          : undefined,
        numberOfLocations: billingFormValue.numberOfLocations || null
      })
      await this.organization.createBillingRecord(billingUpdatePayload)

      this.notifier.success(_('NOTIFY.SUCCESS.ORG_CREATED'))
      this.router.navigate([this.routes.single(res.id)])
    } catch (error) {
      this.notifier.error(error)
    }
  }

  async onUpdate(): Promise<void> {
    if (this.form.invalid || this.billingForm.invalid) {
      FormUtils.markAsTouched(this.form)
      return
    }

    const billingFormValue = this.billingForm.value
    const billingUpdatePayload = FormUtils.pruneEmpty(
      {
        ...billingFormValue,
        basePricing:
          billingFormValue.basePricing && billingFormValue.basePricing > -1
            ? billingFormValue.basePricing
            : null,
        rpmPatientPricing:
          billingFormValue.rpmPatientPricing &&
          billingFormValue.basePricing > -1
            ? billingFormValue.rpmPatientPricing
            : null,
        churnDate: billingFormValue.churnDate
          ? billingFormValue.churnDate.format('YYYY-MM-DD')
          : null,
        payingStartDate: billingFormValue.payingStartDate
          ? billingFormValue.payingStartDate.format('YYYY-MM-DD')
          : null,
        renewalDate: billingFormValue.renewalDate
          ? billingFormValue.renewalDate.format('YYYY-MM-DD')
          : null,
        organization: this.id,
        entity: billingFormValue.entity
          ? {
              isBillable: billingFormValue.isBillable || false,
              type: billingFormValue.entity
            }
          : undefined,
        numberOfLocations: billingFormValue.numberOfLocations || null
      },
      billingFormValue.recordExists
        ? ['basePricing', 'rpmPatientPricing', 'entity', 'numberOfLocations']
        : []
    )

    if (billingFormValue.recordExists) {
      await this.organization.updateBillingRecord(billingUpdatePayload)
    } else {
      await this.organization.createBillingRecord(billingUpdatePayload)
    }

    const formValue = this.form.value
    formValue.id = this.id
    await this.database.update(FormUtils.pruneEmpty(formValue))

    this.notifier.success(_('NOTIFY.SUCCESS.ORG_UPDATED'))
    this.router.navigate([this.routes.single(this.id as string)], {
      queryParams: { updated: new Date().getTime() }
    })
  }

  onCancel() {
    if (!this.id) {
      // create
      this.router.navigate([this.routes.list()])
    } else {
      // update
      this.router.navigate([this.routes.single(this.id as string)])
    }
  }

  onActivate() {
    this.dialogs
      .activatePrompt(this.item)
      .then(() => {
        this.item.isActive = true
        this.form.patchValue({ isActive: true })
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate() {
    this.dialogs
      .deactivatePrompt(this.item)
      .then(() => {
        this.item.isActive = false
        this.form.patchValue({ isActive: false })
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  private async resolveEntities(): Promise<void> {
    try {
      const response = await this.organization.getEntityTypes({
        limit: 'all'
      })

      this.entities = response.data
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveBillingPlans(): Promise<void> {
    try {
      const response = await this.organization.getBillingPlans()
      this.plans = response.data
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveBillingStatus(): Promise<void> {
    try {
      if (!this.id) {
        return
      }

      const response = await this.organization.getBillingRecord({
        organization: this.id
      })

      this.billingForm.patchValue({
        recordExists: true,
        plan: response.plan ? response.plan.id : null,
        isPaying: response.isPaying,
        payingStartDate: response.payingStartDate
          ? moment(response.payingStartDate)
          : null,
        basePricing: response.basePricing ? +response.basePricing : null,
        rpmPatientPricing: response.rpmPatientPricing
          ? +response.rpmPatientPricing
          : null,
        nonRpmPatientPricing: response.nonRpmPatientPricing
          ? +response.nonRpmPatientPricing
          : null,
        churnDate: response.churnDate ? moment(response.churnDate) : null,
        renewalDate: response.renewalDate ? moment(response.renewalDate) : null,
        entity: response.entity ? response.entity.type.id : null,
        isBillable: response.entity ? response.entity.isBillable : null,
        numberOfLocations: response.numberOfLocations
          ? response.numberOfLocations
          : 0
      })
    } catch (error) {
      console.error(error)
    }
  }
}
