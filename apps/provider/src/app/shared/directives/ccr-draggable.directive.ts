import {
  AfterViewInit,
  Directive,
  HostBinding,
  HostListener,
  Input,
  ViewContainerRef
} from '@angular/core'

interface CcrDraggableOptions {
  data?: any
  isDraggable?: boolean
}

@Directive({
  selector: '[ccrDraggable]'
})
export class CcrDraggableDirective implements AfterViewInit {
  @HostBinding('class.ccr-dragged')
  isBeingDragged: boolean

  @HostBinding('draggable')
  get draggable() {
    return this.allowDrag && this.options.isDraggable
  }

  @HostListener('dragend', [])
  onDragEnd() {
    this.isBeingDragged = false
    if (this.handle) {
      this.allowDrag = false
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragStart($event: any) {
    if (this.allowDrag) {
      const { data = {} } = this.options
      $event.dataTransfer.setData('ccr-drag-data', JSON.stringify(data))
      this.isBeingDragged = true
    }
  }

  @Input()
  set ccrDraggable(opts: CcrDraggableOptions) {
    this.options = opts ? opts : this.options
  }

  private allowDrag = true
  private handle: HTMLElement
  private options: CcrDraggableOptions = {
    isDraggable: true
  }

  constructor(private viewContainer: ViewContainerRef) {}

  ngAfterViewInit(): void {
    this.handle = this.viewContainer.element.nativeElement.getElementsByClassName(
      'handle'
    )[0]
    if (this.handle) {
      this.handle.onmousedown = () => {
        this.allowDrag = true
      }
      this.allowDrag = false
    }
  }
}
