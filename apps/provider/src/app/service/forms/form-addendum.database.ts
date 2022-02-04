import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  AccSingleResponse,
  AccountProvider,
  CreateFormAddendumRequest,
  Entity,
  FormAddendum,
  FormAddendumSingle,
  GetAllFormAddendumRequest,
  GetAllFormAddendumResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class FormAddendumDatabase extends CcrDatabase {
  constructor(
    private account: AccountProvider,
    private formAddendum: FormAddendum
  ) {
    super()
  }

  create(args: CreateFormAddendumRequest): Observable<FormAddendumSingle> {
    return from(
      new Promise<FormAddendumSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.formAddendum.create(args)
          const addendum: FormAddendumSingle =
            await this.formAddendum.getSingle(entity)
          resolve(addendum)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  fetch(
    args: GetAllFormAddendumRequest
  ): Observable<GetAllFormAddendumResponse> {
    return from(this.formAddendum.getAll(args))
  }

  getFormAddendum(args: Entity): Observable<any> {
    return from(
      new Promise<FormAddendumSingle>(async (resolve, reject) => {
        try {
          const addendum: FormAddendumSingle =
            await this.formAddendum.getSingle(args)
          const account: AccSingleResponse = await this.account.getSingle(
            addendum.account.id
          )
          resolve({ ...addendum, account: account })
        } catch (error) {
          reject(error)
        }
      })
    )
  }
}
