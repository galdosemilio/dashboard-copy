import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material';
import { CoachFormComponent } from '@app/dashboard/accounts/coaches/form';
import { DieterFormComponent } from '@app/dashboard/accounts/dieters/form';
import { ContextService, NotifierService } from '@app/service';
import { BindForm, BINDFORM_TOKEN, FormUtils } from '@app/shared';
import { Package } from '@app/shared/components/package-table';
import * as moment from 'moment';
import { Account, Affiliation, Goal, PackageEnrollment } from 'selvera-api';
import { AccountIdentifierSyncer } from '../../dieters/form/account-identifiers/utils';

export interface AccountCreateDialogData {
  accountType?: string;
}

@Component({
  selector: 'app-account-create-dialog',
  templateUrl: 'account-create.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AccountCreateDialog),
    },
  ],
})
export class AccountCreateDialog implements BindForm, OnInit {
  form: FormGroup;
  temp: {};

  private organization: any;

  constructor(
    private accIdentifierSyncer: AccountIdentifierSyncer,
    private builder: FormBuilder,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: AccountCreateDialogData,
    private dialogRef: MatDialogRef<AccountCreateDialog>,
    private account: Account,
    private goal: Goal,
    private affiliation: Affiliation,
    private notifier: NotifierService,
    private formUtils: FormUtils,
    private packageEnrollment: PackageEnrollment
  ) {
    this.data = data ? data : {};
  }

  ngOnInit() {
    this.organization = this.context.organization;
    this.createForm();
  }

  createForm() {
    this.form = this.builder.group({
      accountType: 'dieter',
    });
    this.form.patchValue(this.data);
  }

  onTypeChange(values) {
    this.temp = Object.assign({}, this.temp, values);
  }

  onSubmit() {
    if (this.form.valid) {
      // collect and format the account data
      const type = this.data.accountType
        ? this.data.accountType
        : this.form.value.accountType;

      let data,
        clinics,
        goals = [];

      switch (type) {
        case 'dieter':
          const pref = this.context.user.measurementPreference;
          ({ data, goals } = DieterFormComponent.preSave(
            this.form.value[type],
            pref
          ));
          data.accountType = '3'; // AccountTypeIds.Client
          data.association = { organization: this.context.organizationId };
          break;
        case 'coach':
          ({ data, clinics } = CoachFormComponent.preSave(
            this.form.value[type]
          ));
          const firstClinic = clinics.shift();
          data.accountType = '2'; // AccountTypeIds.Provider
          data.association = {
            organization: firstClinic.clinicId,
            permissions: {
              viewAll: firstClinic.accessall,
              admin: firstClinic.admin,
            },
          };
          break;
      }
      // save the account
      this.account
        .add(data)
        .then(async (response) => {
          data.id = response.id;

          // save associations
          switch (type) {
            case 'dieter':
              await this.enrollAccToPkgs({
                account: data.id,
                packages: Array.isArray(data.packages) ? data.packages : [],
              });
              await this.syncIdentifiers({
                identifiers: data.identifiers,
                account: data.id,
              });
              await this.updateGoals({ account: data.id, goals: goals });
              break;

            case 'coach':
              // coach associations with its permissions
              clinics
                .filter((c) => c.picked)
                .forEach((c) => {
                  this.affiliation
                    .associate({
                      account: data.id,
                      organization: c.clinicId,
                    })
                    .then(() => {
                      this.affiliation.update({
                        account: data.id,
                        organization: c.clinicId,
                        permissions: {
                          viewAll: c.accessall,
                          admin: c.admin,
                        },
                      });
                    })
                    .catch((err) => this.notifier.error(err));
                });
              break;
          }

          // return the result to the caller component
          this.dialogRef.close(data);
        })
        .catch((err) => this.notifier.error(err));
    } else {
      this.formUtils.markAsTouched(this.form);
    }
  }

  private associateAccToOrg(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.affiliation.associate({
          account: args.account,
          organization: args.organization,
        });
        resolve();
      } catch (error) {
        this.notifier.error(error, {
          log: true,
          data: {
            type: 'account-create',
            functionType: 'associateAccToOrg',
            account: args.account,
            organization: args.organization,
            message: 'failed to associate account to organization',
          },
        });
        reject(error);
      }
    });
  }

  private enrollAccToPkgs(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const enrollments: Promise<any>[] = [];
        const packages = args.packages || [];

        packages.forEach((pkg: Package) => {
          enrollments.push(
            this.packageEnrollment
              .create({
                account: args.account,
                package: pkg.id,
                enroll: {
                  start: moment().toISOString(),
                },
              })
              .catch((error) => {
                this.notifier.error(error, {
                  log: true,
                  data: {
                    type: 'account-create',
                    functionType: 'enrollAccToPkgs',
                    account: args.account,
                    package: args.package,
                    message: 'failed to enroll account to package',
                  },
                });
              })
          );
        });

        await Promise.all(enrollments);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private updateGoals(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.goal.update({
          account: args.account,
          goal: args.goals,
        });
        resolve();
      } catch (error) {
        this.notifier.error(error, {
          log: true,
          data: {
            type: 'account-create',
            functionType: 'updateGoals',
            account: args.account,
            goals: args.goals,
            message: 'failed to update account goals',
          },
        });
        reject(error);
      }
    });
  }

  private syncIdentifiers(args: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.accIdentifierSyncer.sync(args.identifiers, args.account);
        resolve();
      } catch (error) {
        this.notifier.error(error, {
          log: true,
          data: {
            type: 'account-create',
            functionType: 'syncIdentifiers',
            account: args.account,
            identifiers: args.identifiers,
            message: 'failed to sync account to identifiers',
          },
        });
        reject(error);
      }
    });
  }
}
