import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core'

const MAX_ANGLE = 359.99999 / 100
const DEGREE_IN_RADIANS = Math.PI / 180
const CIRCLE_RADIUS = 50

@Component({
  selector: 'ccr-progress-circle',
  templateUrl: 'progress-circle.component.html'
})
export class ProgressCircleComponent implements OnInit, OnChanges {
  @ViewChild('path', { static: false })
  private path: ElementRef
  @ViewChild('restpath', { static: false })
  private restpath: ElementRef

  @Input() headertext: string
  @Input() value: number
  @Input() maximumvalue: number
  @Input() renderFooter: string
  @Input() measurementUnit: string

  sentences: string[]
  footer: string

  constructor(public renderer: Renderer2) {}

  ngOnInit() {
    this.render()
  }

  ngOnChanges() {
    this.render()
  }

  render() {
    if (!this.value) {
      this.value = 0
    }

    this.sentences = this.headertext.split('\n')
    if (this.renderFooter) {
      // TODO translate
      this.footer = `(${Math.floor(
        (this.value * 100) / this.maximumvalue
      )}% of goal)`
    }
    this.measurementUnit = this.measurementUnit || ''

    if (this.maximumvalue > 0) {
      let renderValue = 100 - (this.value * 100) / this.maximumvalue
      if (renderValue < 0) {
        renderValue = 0
      }
      this.renderArc(renderValue)
    } else {
      this.renderArc(100)
    }
  }

  renderArc(currentValue: number) {
    if (this.path) {
      const svgArc = this.getSvgArc(currentValue, 0, 1)
      const restOfArc = this.getSvgArc(100 - currentValue, currentValue, 1)
      this.renderer.setAttribute(this.path.nativeElement, 'd', svgArc)
      this.renderer.setAttribute(this.restpath.nativeElement, 'd', restOfArc)
    }
  }

  getSvgArc(
    currentValue: number,
    rotation: number,
    strokeWidth: number
  ): string {
    const startPoint = rotation || 0
    const pathRadius = CIRCLE_RADIUS - strokeWidth

    const startAngle = startPoint * MAX_ANGLE
    const endAngle = currentValue * MAX_ANGLE
    const start = this.polarToCartesian(CIRCLE_RADIUS, pathRadius, startAngle)
    const end = this.polarToCartesian(
      CIRCLE_RADIUS,
      pathRadius,
      endAngle + startAngle
    )

    const arcSweep = endAngle < 0 ? 0 : 1
    const largeArcFlag =
      Math.abs(endAngle) >= 0 && Math.abs(endAngle) <= 180 ? 0 : 1

    return `M${start}A${pathRadius},${pathRadius} 0 ${largeArcFlag},${arcSweep} ${end}`
  }

  polarToCartesian(radius: number, pathRadius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS

    return (
      radius +
      pathRadius * Math.cos(angleInRadians) +
      ',' +
      (radius + pathRadius * Math.sin(angleInRadians))
    )
  }

  numberWithCommas(x: number) {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
