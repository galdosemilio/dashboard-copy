import {
  AccountCoreData,
  AlertNotification as SDKAlertNotification,
  AlertNotificationPayload
} from '@coachcare/sdk'

export class AlertNotification {
  public alertCode: string
  public alertDescription: string
  public createdAt: string
  public detail: string
  public groupId: string
  public icon: string
  public id: string
  public params: Record<string, unknown>
  public payload: AlertNotificationPayload
  public triggeredBy: Partial<AccountCoreData>

  constructor(args: Partial<SDKAlertNotification> & Record<string, unknown>) {
    this.alertCode = AlertNotification.calculateAlertTypeCode(args.type.id)
    this.alertDescription = args.type.description || ''
    this.createdAt = args.createdAt || ''
    this.detail = (args.detail as string) || ''
    this.groupId = args.groupId || ''
    this.icon = args.icon as string
    this.id = args.id || ''
    this.params = args.params as Record<string, unknown>
    this.payload = args.payload
    this.triggeredBy = args.triggeredBy
  }

  public static calculateAlertTypeCode(id: string): string {
    let typeCode: string

    switch (id) {
      case '1':
        typeCode = 'weight-regained'
        break
      case '2':
        typeCode = 'meal-logging'
        break
      case '3':
        typeCode = 'tracker-syncing'
        break
      case '4':
        typeCode = 'weight-logging'
        break
      case '5':
        typeCode = 'weight-threshold'
        break
      case '6':
        typeCode = 'data-point-threshold'
        break
      case '7':
        typeCode = 'missing-data-point'
        break
    }

    return typeCode
  }
}
