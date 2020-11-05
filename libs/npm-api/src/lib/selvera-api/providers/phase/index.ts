import * as moment from 'moment-timezone'
import { Method } from 'axios'
import { ApiService } from '../../services/api.service'
import {
  CreateEnrollmentsRequest,
  CreatePackageRequest,
  FetchEnrollmentsRequest,
  FetchPackagesRequest,
  UpdatePackageRequest
} from './requests'
import {
  Enrollment,
  EnrollmentUnfiltered,
  FetchEnrollmentsResponse,
  FetchEnrollmentsUnfiltered,
  FetchPackageResponse,
  FetchPackagesResponse,
  FetchPackagesUnfiltered,
  FetchPhaseResponse,
  InsertResponse
} from './responses'

/**
 * Phase and Package Management
 */
class Phase {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add new package.
   * Restricted to Admins.
   * @param createPackageRequest must implement CreatePackageRequest
   * @returns Promise<InsertResponse>
   */
  public createPackage(
    createPackageRequest: CreatePackageRequest
  ): Promise<InsertResponse> {
    const data: CreatePackageRequest = {
      descriptionPublic: '',
      currency: 'USD',
      ...createPackageRequest
    }
    return this.apiService.request({
      endpoint: '/package',
      method: 'POST',
      data
    })
  }

  /**
   * Fetch a package.
   * Restricted to admins and providers.
   * @param id Package ID
   * @returns Promise<FetchPackageResponse>
   */
  public fetchPackage(id: string): Promise<FetchPackageResponse> {
    return this.apiService
      .request({
        endpoint: `/package/${id}`,
        method: 'GET'
      })
      .then((res) => ({
        id: res.id,
        shortcode: res.shortcode,
        title: res.title,
        description: res.description_public,
        organization: {
          id: res.organization,
          name: res.organization_name
        },
        createdAt: res.created_at,
        isActive: res.is_active
      }))
  }

  /**
   * Update package.
   * Restricted to Admins.
   * @param updatePackageRequest must implement UpdatePackageRequest
   * @returns Promise<void>
   */
  public updatePackage(
    updatePackageRequest: UpdatePackageRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/${updatePackageRequest.id}`,
      method: 'PUT',
      data: updatePackageRequest
    })
  }

  /**
   * Get listing of all packages and products, returns a maximum of 10 matching entries.
   * @param fetchPackagesRequest must implement FetchPackagesRequest
   * @returns Promise<FetchPackagesResponse>
   */
  public fetchPackages(
    fetchPackagesRequest: FetchPackagesRequest
  ): Promise<FetchPackagesResponse> {
    return this.apiService
      .request({
        endpoint: '/package',
        method: 'GET',
        data: fetchPackagesRequest
      })
      .then((res) => {
        return {
          data: res.entries.map((item: FetchPackagesUnfiltered) => ({
            id: item.id,
            title: item.title,
            shortcode: item.shortcode,
            organization: {
              id: item.organization,
              name: item.organization_name
            },
            createdAt: item.created_at,
            isActive: item.is_active
          })),
          pagination: res.pagination
        }
      })
  }

  /**
   * Add new enrollment entry.
   * Providers can only add clients to packages for which they are members of the same organization.
   * Clients can only enroll in packages for organizations they are members of.
   * @param createEnrollmentRequest must implement CreateEnrollmentsRequest
   * @returns Promise<InsertResponse>
   */
  public createEnrollment(
    createEnrollmentRequest: CreateEnrollmentsRequest
  ): Promise<InsertResponse> {
    return this.apiService
      .request({
        endpoint: '/package/enrollment',
        method: 'POST',
        data: createEnrollmentRequest
      })
      .then((res) => ({
        id: res.id
      }))
  }

  /**
   * Fetch all enrollments, returned in alphabetical order by last name, in results of 10.
   * This endpoint is restricted to admins, providers and clients.
   * @param {FetchEnrollmentsRequest} fetchEnrollmentsRequest
   * @return {Promise<FetchEnrollmentsResponse>}
   */
  public fetchEnrollments(
    fetchEnrollmentsRequest: FetchEnrollmentsRequest
  ): Promise<FetchEnrollmentsResponse> {
    const request = {
      active: true,
      paginate: true,
      ...fetchEnrollmentsRequest
    }
    return this.apiService
      .request({
        endpoint: '/package/enrollment',
        method: 'GET',
        data: request
      })
      .then(
        (res: FetchEnrollmentsUnfiltered): FetchEnrollmentsResponse => ({
          data: res.entries.map((item: any) => ({
            id: item.id,
            title: item.title,
            shortcode: item.shortcode,
            package: item.package,
            organization: item.organization,
            account: {
              id: item.account,
              firstName: item.first_name,
              lastName: item.last_name,
              email: item.email
            },
            startDate: item.enroll_start,
            endDate: item.enroll_end,
            duration:
              item.enroll_end !== null
                ? moment.duration(
                    moment(item.enroll_end).diff(item.enroll_start)
                  )
                : moment.duration(moment().diff(item.enroll_start)),
            isActive: item.is_active
          })),
          pagination: res.pagination
        })
      )
  }

  /**
   * Fetch enrollments history for a given account.
   * @param {string | number} account Account ID
   * @param {string} dir Optional sort direction: asc | desc
   * @param {string} sort Optional sort property: enroll_start | enroll_end
   * @return {Promise<FetchEnrollmentsResponse>}
   */
  public fetchHistory(
    account: string | number,
    params: Partial<FetchEnrollmentsRequest> = {}
  ): Promise<FetchEnrollmentsResponse> {
    params = {
      ...params,
      account,
      sortProperty:
        params && params.sortProperty ? params.sortProperty : 'enroll_start',
      sortDirection:
        params && params.sortDirection ? params.sortDirection : 'desc',
      paginate: params && params.paginate ? true : false
    }
    return this.apiService
      .request({
        endpoint: '/package/enrollment',
        method: 'GET',
        data: params
      })
      .then(
        (res: FetchEnrollmentsUnfiltered): FetchEnrollmentsResponse => ({
          data: res.entries.map((item: any) => ({
            id: item.id,
            title: item.title,
            shortcode: item.shortcode,
            package: item.package,
            organization: item.organization,
            startDate: item.enroll_start,
            endDate: item.enroll_end,
            duration:
              item.enroll_end !== null
                ? moment.duration(
                    moment(item.enroll_end).diff(item.enroll_start)
                  )
                : moment.duration(moment().diff(item.enroll_start)),
            isActive: item.is_active
          })),
          pagination: res.pagination ? res.pagination : {}
        })
      )
  }

  /**
   * Fetch phase for a given account.
   * @param {string} account Account ID
   * @param {string} organization Organization ID
   * @returns Promise<FetchPhaseResponse>
   */
  public fetch(
    account: string,
    organization: string
  ): Promise<FetchPhaseResponse> {
    const request = {
      endpoint: '/package/enrollment',
      method: 'GET' as Method
    }
    const current: FetchEnrollmentsRequest = {
      account,
      organization,
      sortProperty: 'enroll_start',
      sortDirection: 'desc',
      active: true,
      limit: 1
    }
    const initial: FetchEnrollmentsRequest = {
      account,
      organization,
      sortProperty: 'enroll_start',
      sortDirection: 'asc',
      limit: 1
    }

    return Promise.all([
      this.apiService.request({ ...request, data: current }),
      this.apiService.request({ ...request, data: initial })
    ]).then(
      ([curr, init]: Array<FetchEnrollmentsUnfiltered>): FetchPhaseResponse => {
        const phase: FetchPhaseResponse = {}

        if (curr.entries.length) {
          phase.current = curr.entries.map(
            (res: EnrollmentUnfiltered): Enrollment => {
              return {
                id: res.id,
                title: res.title,
                shortcode: res.shortcode,
                package: res.package,
                organization: res.organization,
                startDate: res.enroll_start,
                endDate: res.enroll_end
              }
            }
          )[0]
        }

        if (init.entries.length) {
          phase.initial = init.entries.map(
            (res: EnrollmentUnfiltered): Enrollment => {
              return {
                id: res.id,
                title: res.title,
                shortcode: res.shortcode,
                package: res.package,
                organization: res.organization,
                startDate: res.enroll_start,
                endDate: res.enroll_end
              }
            }
          )[0]
        }

        return phase
      }
    )
  }

  /**
   * Update phase for user.
   * @param {string | number} account Account ID
   * @param {string | number} enrollment Enrollment ID
   * @param {string} shortcode Optional package shortcode
   * @return {Promise<InsertResponse | string>} result or error message
   */
  public update(
    account: string | number,
    enrollment: string | number | null,
    shortcode = ''
  ): Promise<InsertResponse | string> {
    if (!enrollment) {
      if (shortcode) {
        return this.enroll(account, shortcode)
      } else {
        return Promise.reject('No enrollment nor shortcode passed.')
      }
    } else {
      // currently enrolled
      if (!shortcode) {
        //  moving to a phase zero
        return this.unenroll(enrollment).then(() => ({ id: '' }))
      } else {
        // moving to a non-zero phase
        return this.unenroll(enrollment).then(() => {
          return this.enroll(account, shortcode)
        })
      }
    }
  }

  /**
   * Update enrollment start date.
   * @param {string | number} enrollment Enrrolment ID
   * @param {string | number} account Account ID
   * @param {string} start Start date to save
   * @return {Promise<boolean>}
   */
  public updateStart(
    enrollment: string | number,
    account: string | number,
    start: string
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: '/package/enrollment',
      method: 'PUT',
      data: {
        id: enrollment,
        account,
        start
      }
    })
  }

  /**
   * Enroll a dieter from a specific enrollment.
   * @param {string | number} account
   * @param {string} shortcode
   * @return {Promise<InsertResponse>}
   */
  public enroll(
    account: string | number,
    shortcode: string
  ): Promise<InsertResponse> {
    const request: CreateEnrollmentsRequest = {
      account,
      shortcode
    }
    return this.createEnrollment(request)
  }

  /**
   * Unenroll a dieter from a specific enrollment.
   * Admins and providers have access to this endpoint
   * Providers can only access clients they have permission to, and packages they are part of the same organization of
   * @param {number | string} enrollment Enrollment ID
   * @return {Promise<void>} void or error message
   */
  public unenroll(enrollment: number | string): Promise<void | string> {
    if (!enrollment) {
      return Promise.reject('Empty enrollment ID passed')
    }
    return this.apiService.request({
      endpoint: `/package/enrollment/${enrollment}`,
      method: 'DELETE'
    })
  }
}

export { Phase }
