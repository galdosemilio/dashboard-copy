import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  CreatePackageRequest,
  Entity,
  GetAllPackageRequest,
  GetAllPackageResponse,
  GetListOrganizationRequest,
  GetListOrganizationResponse,
  OrganizationProvider,
  Package,
  UpdatePackageRequest
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'

@Injectable()
export class LabelsDatabase extends AppDatabase {
  constructor(
    private pkg: Package,
    private organization: OrganizationProvider
  ) {
    super()
  }

  fetch(args: GetAllPackageRequest): Observable<GetAllPackageResponse> {
    // observable of the API response
    return from(this.pkg.getAll(args))
  }

  update(args: UpdatePackageRequest): Promise<void> {
    return this.pkg.update(args)
  }

  list(
    request: GetListOrganizationRequest
  ): Promise<GetListOrganizationResponse> {
    return this.organization.getList(request as any) as any //MERGETODO: CHECK THIS TYPE!!!
  }

  create(request: CreatePackageRequest): Promise<Entity> {
    return this.pkg.create(request)
  }
}
