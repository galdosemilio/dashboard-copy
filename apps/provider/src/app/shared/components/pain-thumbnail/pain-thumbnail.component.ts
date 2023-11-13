import { Component, Input } from '@angular/core'
import { Coordinate, PainAreaTypes } from '@coachcare/sdk'

enum PainModelView {
  FRONT = 'front',
  BACK = 'back'
}

const painBackPoints: PainAreaTypes[] = [
  PainAreaTypes.SHOULDER_RIGHT_BACK,
  PainAreaTypes.NECK_CENTER_BACK,
  PainAreaTypes.HEAD_MID_CENTER_BACK,
  PainAreaTypes.NECK_RIGHT_BACK,
  PainAreaTypes.HEAD_TOP_RIGHT_BACK,
  PainAreaTypes.HEAD_MID_RIGHT_BACK,
  PainAreaTypes.HEAD_TOP_CENTER_BACK,
  PainAreaTypes.HEAD_TOP_LEFT_BACK,
  PainAreaTypes.NECK_LEFT_BACK,
  PainAreaTypes.SHOULDER_LEFT_BACK,
  PainAreaTypes.FOREARM_LEFT_BACK,
  PainAreaTypes.UPPER_ARM_LEFT_BACK,
  PainAreaTypes.BUTTOCK_LEFT,
  PainAreaTypes.HAMSTRING_LEFT,
  PainAreaTypes.CALF_LEFT,
  PainAreaTypes.ANKLE_LEFT_BACK,
  PainAreaTypes.FOOT_LEFT_BACK,
  PainAreaTypes.FOOT_RIGHT_BACK,
  PainAreaTypes.ANKLE_RIGHT_BACK,
  PainAreaTypes.CALF_RIGHT,
  PainAreaTypes.KNEE_RIGHT_BACK,
  PainAreaTypes.HAMSTRING_RIGHT,
  PainAreaTypes.BUTTOCK_RIGHT,
  PainAreaTypes.HAND_LEFT_BACK,
  PainAreaTypes.HAND_RIGHT_BACK,
  PainAreaTypes.FOREARM_RIGHT_BACK,
  PainAreaTypes.ELBOW_RIGHT_BACK,
  PainAreaTypes.UPPER_ARM_RIGHT_BACK,
  PainAreaTypes.UPPER_BACK,
  PainAreaTypes.MID_BACK,
  PainAreaTypes.LOWER_BACK
]

@Component({
  selector: 'ccr-pain-thumbnail',
  templateUrl: './pain-thumbnail.component.html',
  styleUrls: ['./pain-thumbnail.component.scss']
})
export class PainThumbnailComponent {
  @Input()
  set areaType(value: PainAreaTypes) {
    this._areaType = value

    if (!this._view) {
      this._view = painBackPoints.includes(value)
        ? PainModelView.BACK
        : PainModelView.FRONT
    }
  }

  get areaType() {
    return this._areaType
  }

  @Input()
  set view(value: PainModelView) {
    this._view = value
  }

  get view() {
    return this._view
  }

  @Input()
  size = 30

  @Input()
  coordinates: Coordinate

  get x() {
    return this.coordinates?.x || 0
  }

  get y() {
    return this.coordinates?.y || 0
  }

  public painAreaTypes = PainAreaTypes
  private _view: PainModelView
  private _areaType: PainAreaTypes
}
