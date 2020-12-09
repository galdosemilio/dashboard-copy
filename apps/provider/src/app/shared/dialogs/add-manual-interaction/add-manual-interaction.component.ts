import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import {
  BILLABLE_SERVICES,
  BillableService,
  INTERACTION_TYPES
} from '@app/dashboard/reports/communications/models'
import { ContextService, NotifierService } from '@app/service'
import {
  CreateManualInteractionRequest,
  InteractionType
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { unionBy } from 'lodash'
import * as moment from 'moment'
import { Interaction } from '@coachcare/npm-api'

@Component({
  selector: 'add-manual-interaction-dialog',
  templateUrl: './add-manual-interaction.component.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./add-manual-interaction.component.scss']
})
export class AddManualInteractionDialog implements OnInit {
  public billableServices: BillableService[] = []
  public durations: { value: string; displayValue: string }[] = [
    { value: 'minutes', displayValue: _('GLOBAL.MINUTES') },
    { value: 'hours', displayValue: _('UNIT.HOURS') }
  ]
  public form: FormGroup
  public interactionTypes: InteractionType[] = []
  public isLoading = false
  public now: moment.Moment = moment()

  constructor(
    private context: ContextService,
    private dialogRef: MatDialogRef<AddManualInteractionDialog>,
    private fb: FormBuilder,
    private interaction: Interaction,
    private notifier: NotifierService
  ) {
    this.validateStartDate = this.validateStartDate.bind(this)
  }

  public ngOnInit(): void {
    this.createForm()
    this.fetchInteractionTypes()
    this.resolveBillableServices()
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true
      const formValue = this.form.value

      const startTime = moment(formValue.startDate)
        .set('hour', formValue.startTime.hour())
        .set('minutes', formValue.startTime.minutes())
      const endTime = startTime
        .clone()
        .add(formValue.durationMagnitude, formValue.durationUnit)

      const payload: CreateManualInteractionRequest = {
        billableService:
          formValue.billableService > -1
            ? formValue.billableService
            : undefined,
        organization: this.context.organizationId,
        participants: [this.context.user.id, this.context.accountId],
        type: formValue.interactionType,
        range: {
          start: startTime.toISOString(),
          end: endTime.toISOString()
        },
        note: 'some note'
      } as any

      await this.interaction.createManual(payload)
      this.notifier.success(_('NOTIFY.SUCCESS.MANUAL_INTERACTION_CREATED'))
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group(
      {
        interactionType: ['', Validators.required],
        billableService: ['-1', Validators.required],
        durationMagnitude: [15, Validators.required],
        durationUnit: ['minutes', Validators.required],
        startDate: [moment(), Validators.required],
        startTime: [moment().subtract(20, 'minutes'), Validators.required]
      },
      { validators: [this.validateStartDate] }
    )
  }

  private async fetchInteractionTypes(): Promise<void> {
    try {
      this.isLoading = true
      const interactionTypeResponse = await this.interaction.getAllInteractionTypes(
        {
          status: 'active',
          limit: 'all'
        }
      )

      this.interactionTypes = interactionTypeResponse.data.map(
        (interactionType) => {
          const interactionTypeItem = Object.values(INTERACTION_TYPES).find(
            (typeItem) => typeItem.id === interactionType.id
          )
          return {
            ...interactionType,
            displayName: interactionTypeItem
              ? interactionTypeItem.displayName
              : interactionType.name
          }
        }
      )

      if (!this.interactionTypes.length) {
        return
      }

      this.form.get('interactionType').setValue(this.interactionTypes[0].id)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async resolveBillableServices(): Promise<void> {
    try {
      const billableServices = (
        await this.interaction.getBillableServices({
          limit: 'all',
          status: 'active'
        })
      ).data.map((billServ) => ({ ...billServ, displayName: billServ.name }))

      this.billableServices = unionBy(
        Object.values(BILLABLE_SERVICES),
        billableServices,
        'id'
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private validateStartDate(form: FormGroup): any {
    if (!this.form) {
      return
    }

    const value = form.value.startDate

    return form.value.billableService === BILLABLE_SERVICES.rpm.id &&
      this.now.isAfter(value, 'month')
      ? { rpmBillingConflict: true }
      : null
  }
}
