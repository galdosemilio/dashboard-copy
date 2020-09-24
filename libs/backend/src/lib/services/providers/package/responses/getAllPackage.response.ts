/**
 * GET /package
 */

import { PagedResponse } from '../../../shared';
import { PackageSingle } from '../../package/responses/package.single';

export type GetAllPackageResponse = PagedResponse<PackageSingle>;
