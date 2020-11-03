import { _ } from '@coachcare/backend/shared';
import { SectionConfigDetails } from './section.config';

export const CoachCareTestSectionConfig: SectionConfigDetails = {
  REGISTER: {
    CLINIC_PLANS: [
      {
        id: 'track',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.TRACK_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.TRACK'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'track_monthly',
            name: _('GLOBAL.MONTHLY'),
            price: 150
          },
          {
            billingPeriod: 'annually',
            id: 'track_annually',
            name: _('GLOBAL.ANNUAL'),
            price: 100
          }
        ],
        targetParentOrg: '30',
        type: 'track'
      },
      {
        id: 'virtual_health',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.V_HEALTH_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.V_HEALTH'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'virtual_health_monthly',
            name: _('GLOBAL.MONTHLY'),
            price: 425
          },
          {
            billingPeriod: 'annually',
            id: 'virtual_health_annually',
            name: _('GLOBAL.ANNUAL'),
            price: 350
          }
        ],
        targetParentOrg: '7412',
        type: 'virtualHealth'
      },
      {
        id: 'remote_monitoring',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.R_MONITORING_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.R_MONITORING'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'remote_monitoring_monthly',
            name: _('GLOBAL.MONTHLY')
          },
          {
            billingPeriod: 'annually',
            id: 'remote_monitoring_annually',
            name: _('GLOBAL.ANNUAL')
          }
        ],
        targetParentOrg: '7412',
        type: 'remoteMonitoring'
      },
      {
        id: 'health_system',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'health_system_monthly',
            name: _('GLOBAL.MONTHLY')
          },
          {
            billingPeriod: 'annually',
            id: 'health_system_annually',
            name: _('GLOBAL.ANNUAL')
          }
        ],
        targetParentOrg: '7412',
        type: 'healthSystem'
      }
    ],
    NEWSLETTER_CHECKBOX: true
  }
};

export const CoachCareProdSectionConfig: SectionConfigDetails = {
  REGISTER: {
    CLINIC_PLANS: [
      {
        id: 'track',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.TRACK_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.TRACK'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'track_monthly',
            name: _('GLOBAL.MONTHLY'),
            price: 150
          },
          {
            billingPeriod: 'annually',
            id: 'track_annually',
            name: _('GLOBAL.ANNUAL'),
            price: 100
          }
        ],
        targetParentOrg: '4066',
        type: 'track'
      },
      {
        id: 'virtual_health',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.V_HEALTH_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.V_HEALTH'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'virtual_health_monthly',
            name: _('GLOBAL.MONTHLY'),
            price: 425
          },
          {
            billingPeriod: 'annually',
            id: 'virtual_health_annually',
            name: _('GLOBAL.ANNUAL'),
            price: 350
          }
        ],
        targetParentOrg: '3637',
        type: 'virtualHealth'
      },
      {
        id: 'remote_monitoring',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.R_MONITORING_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.R_MONITORING'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'remote_monitoring_monthly',
            name: _('GLOBAL.MONTHLY')
          },
          {
            billingPeriod: 'annually',
            id: 'remote_monitoring_annually',
            name: _('GLOBAL.ANNUAL')
          }
        ],
        targetParentOrg: '3637',
        type: 'remoteMonitoring'
      },
      {
        id: 'health_system',
        lastStepMessage: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM_LAST_STEP'),
        name: _('CLINIC_PLANS.COACH_CARE.H_SYSTEM'),
        billing: [
          {
            billingPeriod: 'monthly',
            id: 'health_system_monthly',
            name: _('GLOBAL.MONTHLY')
          },
          {
            billingPeriod: 'annually',
            id: 'health_system_annually',
            name: _('GLOBAL.ANNUAL')
          }
        ],
        targetParentOrg: '3637',
        type: 'healthSystem'
      }
    ],
    NEWSLETTER_CHECKBOX: true
  }
};
