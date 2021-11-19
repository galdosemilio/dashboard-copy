import { Injectable } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { resolveConfig } from '@app/config/section/utils'
import { ContextService } from '@app/service'
import { PromptDialog, PromptDialogData } from '@app/shared/dialogs'
import { CcrDatabase } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import {
  FetchEnrollmentsResponse,
  FetchPackagesResponse,
  GetAllPackageOrganizationRequest,
  PackageEnrollment,
  PackageOrganization
} from '@coachcare/sdk'
import { merge } from 'lodash'
import * as moment from 'moment'
import { from, Observable } from 'rxjs'

import { PhasesDataSegment } from './phases.datasource'

export type PackagesAndEnrollments = FetchPackagesResponse & {
  enrollments: FetchEnrollmentsResponse
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
            offset: args.offset
          })
          const associations = associationResponse.data

          const enrollmentsPromise = this.enrollment.getAll({
            account: this.context.accountId,
            organization: args.organization,
            isActive: true,
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

          const enrollments = (await enrollmentsPromise).data.map((data) =>
            data
              ? { ...data, package: data.package.id }
              : {
                  id: '',
                  isActive: false,
                  package: phasePackages.find(
                    (pkg) => pkg.id === data.package.id
                  )
                }
          )

          const phaseHistory = { data: enrollments }

          resolve(
            merge(
              {},
              {
                data: [...phasePackages],
                enrollments: phaseHistory,
                pagination: associationResponse.pagination
              }
            )
          )
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  async enroll(item: PhasesDataSegment, old: PhasesDataSegment): Promise<any> {
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
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PHASE.CONFIRM_UNENROLL'),
        content: _('PHASE.CONFIRM_UNENROLL_PROMPT'),
        contentParams: { item: `${item.package.title}` },
        no: _('GLOBAL.CANCEL'),
        yes: _('PHASE.UNENROLL')
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.unenroll(item.enrolled).then(resolve).catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  unenroll(id: string | number): Promise<void | string> {
    return this.enrollment.update({ id: id.toString(), isActive: false })
  }
}
