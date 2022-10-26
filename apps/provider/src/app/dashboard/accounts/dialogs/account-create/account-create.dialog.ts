import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { CoachFormComponent } from '@app/dashboard/accounts/coaches/form'
import { DieterFormComponent } from '@app/dashboard/accounts/dieters/form'
import {
  AccountIdentifierSyncer,
  ContextService,
  NotifierService
} from '@app/service'
import { FormUtils } from '@app/shared/utils'
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives'
import { Package } from '@app/shared/components/package-table'
import * as moment from 'moment'
import {
  AccountProvider,
  AddressProvider,
  Affiliation,
  GoalV2,
  PackageEnrollment
} from '@coachcare/sdk'
import { Subject } from 'rxjs'

export interface AccountCreateDialogData {
  accountType?: string
}

@Component({
  selector: 'app-account-create-dialog',
  templateUrl: 'account-create.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AccountCreateDialog)
    }
  ]
})
export class AccountCreateDialog implements BindForm, OnInit {
  public form: FormGroup
  public markAsTouched$: Subject<void> = new Subject<void>()
  public temp: {}
  public zendeskLink = ''

  constructor(
    private accIdentifierSyncer: AccountIdentifierSyncer,
    private builder: FormBuilder,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: AccountCreateDialogData,
    private dialogRef: MatDialogRef<AccountCreateDialog>,
    private account: AccountProvider,
    private goalV2: GoalV2,
    private affiliation: Affiliation,
    private notifier: NotifierService,
    private formUtils: FormUtils,
    private packageEnrollment: PackageEnrollment,
    private addressProvider: AddressProvider
  ) {}

  public ngOnInit(): void {
    this.data = this.data ?? {}

    this.zendeskLink =
      this.data.accountType === 'coach'
        ? 'https://coachcare.zendesk.com/hc/en-us/articles/360019620832-Setting-the-Coach-Permissions'
        : ''

    this.createForm()
  }

  public onTypeChange(values): void {
    this.temp = Object.assign({}, this.temp, values)
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        this.formUtils.markAsTouched(this.form)
        this.markAsTouched$.next()
        return
      }

      // collect and format the account data
      const type = this.data.accountType
        ? this.data.accountType
        : this.form.value.accountType

      let data,
        clinics,
        goals = []

      switch (type) {
        case 'dieter':
          const pref = this.context.user.measurementPreference
          ;({ data, goals } = DieterFormComponent.preSave(
            this.form.value[type],
            pref
          ))
          data.accountType = '3' // AccountTypeIds.Client
          data.association = { organization: this.context.organizationId }
          break
        case 'coach':
          ;({ data, clinics } = CoachFormComponent.preSave(
            this.form.value[type]
          ))
          const firstClinic = clinics.shift()
          data.accountType = '2' // AccountTypeIds.Provider
          data.association = {
            organization: firstClinic.clinicId,
            permissions: {
              viewAll: firstClinic.accessall,
              admin: firstClinic.admin,
              allowClientPhi: firstClinic.allowClientPhi
            }
          }
          break
      }

      // save the account
      const response = await this.account.add(data)
      let selectedClinics = []
      data.id = response.id

      // save associations
      switch (type) {
        case 'dieter':
          await this.enrollAccToPkgs({
            account: data.id,
            packages: Array.isArray(data.packages) ? data.packages : []
          })

          await this.syncIdentifiers({
            identifiers: data.identifiers,
            account: data.id
          })
          await this.createGoals({ account: data.id, goals: goals })
          break
        case 'coach':
          // coach associations with its permissions
          selectedClinics = clinics.filter((c) => c.picked)

          for (const clinic of selectedClinics) {
            await this.affiliation.associate({
              account: data.id,
              organization: clinic.clinicId
            })

            await this.affiliation.update({
              account: data.id,
              organization: clinic.clinicId,
              permissions: {
                viewAll: clinic.accessall,
                admin: clinic.admin,
                allowClientPhi: clinic.allowClientPhi || undefined
              }
            })
          }

          break
      }

      if (data.addresses?.length) {
        for (const address of data.addresses) {
          await this.addressProvider.createAddress({
            account: data.id,
            address1: address.address1,
            address2: address.address2 || undefined,
            city: address.city,
            country: address.country,
            labels: address.labels,
            postalCode: address.postalCode,
            stateProvince: address.stateProvince
          })
        }
      }

      // return the result to the caller component
      this.dialogRef.close(data)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.builder.group({
      accountType: 'dieter'
    })
    this.form.patchValue(this.data)
  }

  private enrollAccToPkgs(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const enrollments: Promise<any>[] = []
        const packages = args.packages || []

        packages.forEach((pkg: Package) => {
          enrollments.push(
            this.packageEnrollment
              .create({
                account: args.account,
                package: pkg.id,
                enroll: {
                  start: moment().toISOString()
                }
              })
              .catch((error) => {
                this.notifier.error(error, {
                  log: true,
                  data: {
                    type: 'account-create',
                    functionType: 'enrollAccToPkgs',
                    account: args.account,
                    package: args.package,
                    message: 'failed to enroll account to package'
                  }
                })
              })
          )
        })

        await Promise.all(enrollments)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  private createGoals(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.goalV2.create({
          account: args.account,
          goals: args.goals
        })
        resolve()
      } catch (error) {
        this.notifier.error(error, {
          log: true,
          data: {
            type: 'account-create',
            functionType: 'createGoals',
            account: args.account,
            goals: args.goals,
            message: 'failed to update account goals'
          }
        })
        reject(error)
      }
    })
  }

  private syncIdentifiers(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.accIdentifierSyncer.sync(args.identifiers, args.account)
        resolve()
      } catch (error) {
        this.notifier.error(error, {
          log: true,
          data: {
            type: 'account-create',
            functionType: 'syncIdentifiers',
            account: args.account,
            identifiers: args.identifiers,
            message: 'failed to sync account to identifiers'
          }
        })
        reject(error)
      }
    })
  }
}
