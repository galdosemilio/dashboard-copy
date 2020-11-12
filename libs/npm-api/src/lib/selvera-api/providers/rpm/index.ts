import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import {
  RPMDeactivationReason,
  RPMPreferenceSingle,
  RPMState
} from './entities'
import {
  CreateRPMPreferenceRequest,
  CreateRPMStateRequest,
  GetAuditListRequest,
  GetListRequest,
  GetPatientRPMReportRequest,
  GetRPMDeactivationReasonsRequest,
  GetRPMPreferenceByOrgRequest,
  UpdateRPMPreferenceRequest
} from './requests'
import { GetPatientRPMReportResponse } from './responses'

/**
 * Remote Patient Monitoring provider service
 */
export class RPM {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create RPM state entry
   * @param request must implement CreateRPMStateRequest
   * @returns Entity
   */
  public create(request: CreateRPMStateRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/state',
      method: 'POST',
      version: '2.0'
    })
  }

  /**
   * Create RPM Organization preference
   * @param request must implement CreateRPMPreferenceRequest
   * @returns Promise<Entity>
   */
  public createRPMPreference(
    request: CreateRPMPreferenceRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/preference/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Removes an Organization's RPM preference
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteRPMPreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/rpm/preference/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Get RPM state entry audit listing
   * @param request must implement GetAuditListRequest
   * @returns PagedResponse<RPMState>
   */
  public getAuditList(
    request: GetAuditListRequest
  ): Promise<PagedResponse<RPMState>> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/state/audit',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves RPM state deactivation reason listing
   * @param request must implement GetRPMDeactivationReasonsRequest
   * @returns Promise<PagedResponse<RPMDeactivationReason>>
   */
  public getDeactivationReasons(
    request: GetRPMDeactivationReasonsRequest
  ): Promise<PagedResponse<RPMDeactivationReason>> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/state/deactivation-reason',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get RPM state entry listing
   * @param request must implement GetListRequest
   * @returns PagedResponse<RPMState>
   */
  public getList(request: GetListRequest): Promise<PagedResponse<RPMState>> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/state',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves individual summary for an RPM client (as JSON)
   * @param request must implement GetPatientRPMReportRequest
   * @returns Promise<GetPatientRPMReportResponse>
   */
  public getPatientRPMReport(
    request: GetPatientRPMReportRequest
  ): Promise<GetPatientRPMReportResponse> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/individual-summary',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves individual summary for an RPM client (as Excel)
   * @param request must implement GetPatientRPMReportRequest
   * @returns Promise<void>
   */
  public getPatientRPMReportAsExcel(
    request: GetPatientRPMReportRequest
  ): Promise<Blob> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/individual-summary',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      method: 'GET',
      responseType: 'blob',
      version: '1.0'
    })
  }

  /**
   * Retrieves individual summary for an RPM client (as PDF)
   * @param request must implement GetPatientRPMReportRequest
   * @returns Promise<void>
   */
  public getPatientRPMReportAsPDF(
    request: GetPatientRPMReportRequest
  ): Promise<Blob> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/individual-summary',
      headers: {
        Accept: 'application/pdf'
      },
      method: 'GET',
      responseType: 'blob',
      version: '1.0'
    })
  }

  /**
   * Get Organization RPM preference by ID
   * @param request must implement Entity
   * @returns Promise<RPMPreferenceSingle>
   */
  public getRPMPreference(request: Entity): Promise<RPMPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: `/rpm/preference/organization/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get Organization RPM preference by Organization ID
   * @param request must implement GetRPMPreferenceByOrgRequest
   * @returns Promise<RPMPreferenceSingle>
   */
  public getRPMPreferenceByOrg(
    request: GetRPMPreferenceByOrgRequest
  ): Promise<RPMPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: '/rpm/preference/organization',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Update Organization RPM preference
   * @param request must implement UpdateRPMPreferenceRequest
   * @returns Promise<void>
   */
  public updateRPMPreference(
    request: UpdateRPMPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/rpm/preference/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }
}
