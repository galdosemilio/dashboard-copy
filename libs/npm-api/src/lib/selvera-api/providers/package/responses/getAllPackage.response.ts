/**
 * GET /package
 */

import { PagedResponse } from '../../content/entities';
import { PackageSingle } from '../../package/responses/package.single';

export type GetAllPackageResponse = PagedResponse<PackageSingle>;
