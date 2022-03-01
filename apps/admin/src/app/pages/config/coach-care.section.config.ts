import { _ } from '@coachcare/backend/shared'
import { SectionConfigDetails } from './section.config'

export const CoachCareTestSectionConfig: SectionConfigDetails = {
  REGISTER: {
    CLINIC_PLANS: [
      {
        id: 'virtual_health',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.V_HEALTH_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.V_HEALTH'),
        billing: [],
        targetParentOrg: '7412',
        type: 'virtualHealth'
      },
      {
        id: 'remote_monitoring',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.R_MONITORING_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.R_MONITORING'),
        billing: [],
        targetParentOrg: '7412',
        type: 'remoteMonitoring'
      },
      {
        id: 'health_system',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM'),
        billing: [],
        targetParentOrg: '7412',
        type: 'healthSystem'
      }
    ],
    NEWSLETTER_CHECKBOX: true,
    REDIRECT_ON_CLINIC_REGISTRATION: true
  }
}

export const CoachCareProdSectionConfig: SectionConfigDetails = {
  REGISTER: {
    CLINIC_PLANS: [
      {
        id: 'virtual_health',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.V_HEALTH_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.V_HEALTH'),
        billing: [],
        targetParentOrg: '3637',
        type: 'virtualHealth'
      },
      {
        id: 'remote_monitoring',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.R_MONITORING_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.R_MONITORING'),
        billing: [],
        targetParentOrg: '3637',
        type: 'remoteMonitoring'
      },
      {
        id: 'health_system',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM'),
        billing: [],
        targetParentOrg: '3637',
        type: 'healthSystem'
      }
    ],
    NEWSLETTER_CHECKBOX: true,
    REDIRECT_ON_CLINIC_REGISTRATION: true
  }
}
