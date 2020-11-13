import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  CreateOrganizationRequest,
  GetAllOrganizationRequest,
  GetAllOrganizationResponse,
  GetListOrganizationRequest,
  GetListOrganizationResponse,
  UpdateOrganizationRequest
} from '@coachcare/npm-api'
import { OrganizationProvider } from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'

import { OrganizationsCriteria } from './organization.types'

@Injectable()
export class OrganizationsDatabase extends AppDatabase {
  constructor(private organization: OrganizationProvider) {
    super()
  }

  fetch(request, forAdmin): Observable<GetAllOrganizationResponse>
  // fetch(request, forAdmin): Observable<GetListOrganizationResponse>
  fetch(request: OrganizationsCriteria, forAdmin: boolean) {
    return forAdmin ? from(this.admin(request)) : from(this.list(request))
  }

  admin(request: GetAllOrganizationRequest) {
    return this.organization.getAll(request)
  }

  list(request: GetListOrganizationRequest) {
    return this.organization.getAccessibleList(request)
  }

  single(id: string) {
    return this.organization.getSingle(id)
  }

  create(request: CreateOrganizationRequest) {
    return this.organization.create(request)
  }

  update(request: UpdateOrganizationRequest) {
    return this.organization.update(request)
  }

  delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.organization.delete(id).then(resolve).catch(reject)
    })
  }
}
