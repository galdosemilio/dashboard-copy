export class AlertNotification {
  public alertCode: string
  public alertDescription: string
  public createdAt: string
  public detail: string
  public groupId: string
  public icon: string
  public id: string
  public params: any
  public triggeredBy: any

  constructor(args: any) {
    this.alertCode = AlertNotification.calculateAlertTypeCode(args.type.id)
    this.alertDescription = args.type.description || ''
    this.createdAt = args.createdAt || ''
    this.detail = args.detail || ''
    this.groupId = args.groupId || ''
    this.icon = args.icon
    this.id = args.id || ''
    this.params = args.params
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
    }

    return typeCode
  }
}
