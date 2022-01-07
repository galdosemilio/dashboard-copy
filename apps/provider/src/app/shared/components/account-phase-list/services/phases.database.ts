import { Injectable } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { resolveConfig } from '@app/config/section/utils'
import { ContextService } from '@app/service'
import { PromptDialog, PromptDialogData } from '@app/shared/dialogs'
import { CcrDatabase } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import {
  Entity,
  FetchPackagesResponse,
  GetAllPackageOrganizationRequest,
  PackageEnrollment,
  PackageEnrollmentSegment,
  PackageOrganization,
  Pagination
} from '@coachcare/sdk'
import * as moment from 'moment'
import { from, Observable, throwError } from 'rxjs'

import { PhasesDataSegment } from './phases.datasource'
import { mergeMap } from 'rxjs/operators'

export type PackagesAndEnrollments = FetchPackagesResponse & {
  enrollments: { data: PackageEnrollmentSegment[]; pagination: Pagination }
}

@Injectable()
export class PhasesDatabase extends CcrDatabase {
  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private enrollment: PackageEnrollment,
    private packageOrganization: PackageOrganization
  ) {
    super()
  }

  fetch(
    args: GetAllPackageOrganizationRequest
  ): Observable<PackagesAndEnrollments> {
    return from(
      new Promise<any>(async (resolve, reject) => {
        try {
          const associationResponse = await this.packageOrganization.getAll({
            organization: args.organization,
            isActive: true,
            limit: args.limit,
            offset: args.offset,
            sort: args.sort
          })
          const associations = associationResponse.data

          const enrollmentsPromise = this.enrollment.getAll({
            account: this.context.accountId,
            organization: args.organization,
            offset: 0,
            limit: 'all',
            sort: [{ property: 'enrollStart', dir: 'desc' }]
          })

          const phasePackages = await Promise.all(
            associations.map(async (association) => ({
              ...association.package,
              organization: await this.context.getOrg(
                association.organization.id
              )
            }))
          )

          const enrollments: Partial<PackageEnrollmentSegment>[] = (
            await enrollmentsPromise
          ).data.map((data) =>
            data
              ? { ...data }
              : {
                  id: '',
                  isActive: false,
                  package: phasePackages.find(
                    (pkg) => pkg.id === data.package.id
                  )
                }
          )

          const phaseHistory = { data: enrollments }

          resolve({
            data: [...phasePackages],
            enrollments: phaseHistory,
            pagination: associationResponse.pagination
          })
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  async enroll(item: PhasesDataSegment, old: Entity): Promise<any> {
    const unenrollThenEnroll = resolveConfig(
      'PATIENT_FORM.UNENROLL_THEN_ENROLL',
      this.context.organization
    )

    if (unenrollThenEnroll && old) {
      await this.enrollment.delete({ id: old.id })
    }

    return this.enrollment.create({
      account: this.context.accountId,
      enroll: {
        start: moment().toISOString()
      },
      package: item.package.id
    })
  }

  unenrollPrompt(item: PhasesDataSegment): Promise<void | string> {
    const data: PromptDialogData = {
      title: _('PHASE.CONFIRM_UNENROLL'),
      content: _('PHASE.CONFIRM_UNENROLL_PROMPT'),
      contentParams: { item: `${item.package.title}` },
      no: _('GLOBAL.CANCEL'),
      yes: _('PHASE.UNENROLL')
    }

    return this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .pipe(
        mergeMap((confirm: boolean) => {
          if (confirm) {
            return from(this.unenroll(item))
          }

          return throwError(null)
        })
      )
      .toPromise()
  }

  unenroll(phase: PhasesDataSegment): Promise<void | string> {
    return this.enrollment.update({
      id: phase.id.toString(),
      isActive: false,
      enroll: { start: phase.history.start, end: moment().toISOString() }
    })
  }
}
