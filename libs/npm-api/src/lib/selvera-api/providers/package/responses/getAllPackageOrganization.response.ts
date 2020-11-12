/**
 * GET /package/organization
 */

import { PagedResponse } from '../../content/entities'
import { PackageAssociation } from '../entities'

export type GetAllPackageOrganizationResponse = PagedResponse<
  PackageAssociation
>
