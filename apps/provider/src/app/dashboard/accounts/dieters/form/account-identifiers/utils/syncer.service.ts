import { Injectable, OnDestroy, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { differenceBy, intersectionBy } from 'lodash'
import {
  AccountIdentifier as SelveraAccountIdentifier,
  OrganizationProvider
} from '@coachcare/sdk'
import { AccountIdentifier } from '../models'

@Injectable()
export class AccountIdentifierSyncer implements OnDestroy, OnInit {
  identifiers: AccountIdentifier[] = []

  constructor(
    private accountIdentifier: SelveraAccountIdentifier,
    private context: ContextService,
    private notifier: NotifierService,
    private organization: OrganizationProvider
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  getUserIdentifiers(id?: string): Promise<AccountIdentifier[]> {
    return new Promise<AccountIdentifier[]>(async (resolve, reject) => {
      try {
        if (id) {
          const accesibleOrgsPromises = [
            this.organization.getAccessibleList({
              account: id,
              limit: 'all'
            }),
            this.organization.getAccessibleList({
              account: this.context.user.id,
              limit: 'all',
              permissions: {
                viewAll: true
              }
            })
          ]

          const accesibleOrgsResponse = await Promise.all(accesibleOrgsPromises)
          const clientAccessibleOrgs = accesibleOrgsResponse[0].data.map(
            (org) => org.organization.id
          )
          let providerAccessibleOrgs = accesibleOrgsResponse[1].data.map(
            (org) => org.organization.id
          )

          const providerHierarchy = this.context.organization.hierarchyPath

          providerAccessibleOrgs = differenceBy(
            intersectionBy(providerHierarchy, providerAccessibleOrgs, Number),
            clientAccessibleOrgs,
            Number
          )

          const promises = []
          clientAccessibleOrgs.forEach((org) => {
            promises.push(
              this.accountIdentifier.fetchAll({
                account: id,
                organization: org
              })
            )
          })
          providerAccessibleOrgs.forEach((org) => {
            promises.push(
              this.accountIdentifier.fetchAll({
                account: id,
                organization: org
              })
            )
          })

          const responses = await Promise.all(promises)

          let remoteIdentifiers = []
          responses.forEach(
            (res) => (remoteIdentifiers = [...remoteIdentifiers, ...res.data])
          )

          const resolvedIdentifiers =
            this.identifiers.map(
              (identifier) => new AccountIdentifier(identifier)
            ) || []
          remoteIdentifiers.forEach((remoteIdentifier) => {
            const index = this.identifiers.findIndex(
              (identifier) => identifier.name === remoteIdentifier.name
            )
            if (index > -1) {
              resolvedIdentifiers[index] = new AccountIdentifier({
                ...resolvedIdentifiers[index],
                ...remoteIdentifier
              })
            } else {
              resolvedIdentifiers.push(
                new AccountIdentifier({ ...remoteIdentifier })
              )
            }
          })
          resolve(resolvedIdentifiers)
        } else {
          resolve(
            this.identifiers.map((identifier: AccountIdentifier) => identifier)
          )
        }
      } catch (error) {
        this.notifier.error(error)
        reject(error)
      }
    })
  }

  sync(identifiers: AccountIdentifier[] = [], account: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (identifiers && identifiers.length) {
          const promises = []
          identifiers.forEach((identifier) => {
            if (identifier.dirty) {
              if (identifier.id) {
                promises.push(
                  this.accountIdentifier.delete({
                    id: identifier.id,
                    account: account
                  })
                )
              }

              if (identifier.value) {
                promises.push(
                  this.accountIdentifier.add({
                    account: account,
                    organization:
                      identifier.organization && identifier.organization.id
                        ? identifier.organization.id
                        : this.context.organization.id,
                    name: identifier.name,
                    value: identifier.value
                  })
                )
              }
            }
          })

          await Promise.all(promises)
        }
        resolve()
      } catch (error) {
        this.notifier.error(error)
        reject(error)
      }
    })
  }
}
