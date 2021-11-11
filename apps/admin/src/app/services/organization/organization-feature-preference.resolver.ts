import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import {
  CommunicationPreference,
  CommunicationPreferenceSingle,
  ContentPreference,
  ContentPreferenceSingle,
  Entity,
  GetRPMPreferenceByOrgRequest,
  GetSeqOrgPreferenceByOrg,
  GetSeqOrgPreferenceResponse,
  GetSingleCommunicationPreferenceRequest,
  GetSingleContentPreferenceRequest,
  GetSingleMessagingPreferenceByOrgRequest,
  MessagingPreference,
  MessagingPreferenceSingle,
  OrganizationProvider,
  OrgGetSchedulePreferenceRequest,
  OrgSchedulePreferencesResponse,
  RPM,
  RPMPreferenceSingle,
  Sequence
} from '@coachcare/sdk'
import { OrganizationFeaturePrefs } from './organization.types'

@Injectable()
export class OrganizationFeaturePreferenceResolver
  implements Resolve<OrganizationFeaturePrefs> {
  constructor(
    private communicationPref: CommunicationPreference,
    private contentPref: ContentPreference,
    private messagingPref: MessagingPreference,
    private organization: OrganizationProvider,
    private rpm: RPM,
    private sequence: Sequence
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return new Promise<any>(async (resolve) => {
      try {
        const id = route.paramMap.get('id') as string
        const featurePreferences = await Promise.all([
          this.resolveContentPreference({ organization: id }),
          this.resolveAssociationPreference({ id }),
          this.resolveMessagingPreference({ organization: id }),
          this.resolveCommunicationPreference({ organization: id }),
          this.resolveSequencesPreference({ organization: id }),
          this.resolveRPMPreference({ organization: id }),
          this.resolveFileVaultPreference({ organization: id }),
          this.resolveSchedulePreference({ organization: id })
        ])

        const resolvedPrefs = {
          contentPrefs: featurePreferences[0],
          associationPrefs: featurePreferences[1],
          messagingPrefs: featurePreferences[2],
          communicationPrefs: featurePreferences[3],
          sequencePrefs: featurePreferences[4],
          rpmPrefs: featurePreferences[5],
          fileVaultPrefs: featurePreferences[6],
          schedulePrefs: featurePreferences[7]
        }
        resolve(resolvedPrefs)
      } catch (error) {
        resolve({ contentPrefs: undefined })
      }
    })
  }

  private resolveAssociationPreference(request: Entity): Promise<any> {
    return new Promise<any>(async (resolve) => {
      try {
        const single = await this.organization.getSingle(request.id)
        resolve({
          openAddProvider: single.openAssociation
            ? single.openAssociation.provider
            : false,
          openAddClient: single.openAssociation
            ? single.openAssociation.client
            : false,
          patientAutoUnenroll: single.automaticDisassociation
            ? single.automaticDisassociation.client
            : false,
          removeEnrollmentsOnAssociation:
            single.removeEnrollmentsOnAssociation ?? false
        })
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveContentPreference(
    request: GetSingleContentPreferenceRequest
  ): Promise<ContentPreferenceSingle> {
    return new Promise<ContentPreferenceSingle>(async (resolve) => {
      try {
        resolve(await this.contentPref.getContentPreference(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveCommunicationPreference(
    request: GetSingleCommunicationPreferenceRequest
  ): Promise<CommunicationPreferenceSingle> {
    return new Promise<CommunicationPreferenceSingle>(async (resolve) => {
      try {
        resolve(await this.communicationPref.getPreferenceByOrg(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveFileVaultPreference(
    request: GetSingleContentPreferenceRequest
  ): Promise<ContentPreferenceSingle> {
    return new Promise<ContentPreferenceSingle>(async (resolve) => {
      try {
        resolve(await this.contentPref.getContentVaultPreference(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveMessagingPreference(
    request: GetSingleMessagingPreferenceByOrgRequest
  ): Promise<MessagingPreferenceSingle> {
    return new Promise<MessagingPreferenceSingle>(async (resolve) => {
      try {
        resolve(await this.messagingPref.getPreferenceByOrg(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveRPMPreference(
    request: GetRPMPreferenceByOrgRequest
  ): Promise<RPMPreferenceSingle> {
    return new Promise<RPMPreferenceSingle>(async (resolve) => {
      try {
        resolve(await this.rpm.getRPMPreferenceByOrg(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveSequencesPreference(
    request: GetSeqOrgPreferenceByOrg
  ): Promise<GetSeqOrgPreferenceResponse> {
    return new Promise<GetSeqOrgPreferenceResponse>(async (resolve) => {
      try {
        resolve(await this.sequence.getSeqOrgPreferenceByOrg(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveSchedulePreference(
    request: OrgGetSchedulePreferenceRequest
  ): Promise<OrgSchedulePreferencesResponse> {
    return new Promise<OrgSchedulePreferencesResponse>(async (resolve) => {
      try {
        resolve(await this.organization.getSchedulePreference(request))
      } catch (error) {
        resolve(undefined)
      }
    })
  }
}
