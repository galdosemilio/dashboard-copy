/**
 * GET /package/enrollment
 */

import { PagedResponse } from '../../content/entities';
import { PackageEnrollmentSegment } from '../entities';

export type GetAllPackageEnrollmentResponse = PagedResponse<PackageEnrollmentSegment>;
