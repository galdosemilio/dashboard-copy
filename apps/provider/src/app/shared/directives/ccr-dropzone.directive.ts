import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

interface CcrDropzoneOptions {
  data?: any;
  isDroppable?: boolean;
  isLongDroppable?: boolean;
}

export interface CcrDropEvent {
  drag: any;
  drop: any;
}

@Directive({
  selector: '[ccrDropzone]'
})
export class CcrDropzoneDirective implements OnDestroy, OnInit {
  @HostBinding('class.ccr-dragover')
  isHovered: boolean;

  @HostBinding('class.ccr-long-dragover')
  isLongHovered: boolean;

  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  onDragOver($event: any): void {
    if (this.options.isDroppable || this.options.isLongDroppable) {
      this.dragFocus = true;
      $event.preventDefault();
      this.dragoverSubject.next();
    }
    $event.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(): void {
    if (this.options.isDroppable || this.options.isLongDroppable) {
      this.dragFocus = false;
      this.isHovered = false;
    }
    this.clearLongDragTimeout();
  }

  @HostListener('drop', ['$event'])
  onDrop($event: any): void {
    if (this.options.isDroppable || this.options.isLongDroppable) {
      const data = JSON.parse($event.dataTransfer.getData('ccr-drag-data'));
      this.isHovered = false;
      if (this.longDrop && this.options.isLongDroppable) {
        this.ccrLongDrop.emit({ drag: data, drop: this.options.data });
      } else if (this.options.isDroppable) {
        this.ccrDrop.emit({ drag: data, drop: this.options.data });
      }
      this.onDragLeave();
    }
    this.clearLongDragTimeout();
  }

  @Input()
  set ccrDropzone(opts: CcrDropzoneOptions) {
    this.options = opts ? opts : this.options;
  }

  @Output()
  ccrDrop: EventEmitter<CcrDropEvent> = new EventEmitter<CcrDropEvent>();
  @Output()
  ccrLongDrop: EventEmitter<CcrDropEvent> = new EventEmitter<CcrDropEvent>();

  private dragoverSubject: Subject<void> = new Subject<void>();
  private dragoverSubjectSubscription: Subscription;
  private dragFocus: boolean;
  private longDropTimeout;
  private longDropTime: number = 700;
  private longDrop: boolean;

  private options: CcrDropzoneOptions = {
    isDroppable: true
  };

  ngOnDestroy(): void {
    if (this.dragoverSubjectSubscription) {
      this.dragoverSubjectSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.dragoverSubjectSubscription = this.dragoverSubject
      .pipe(auditTime(100))
      .subscribe(() => {
        if (this.dragFocus) {
          this.isHovered = true;
          if (this.options.isLongDroppable && !this.longDropTimeout) {
            this.longDropTimeout = setTimeout(() => {
              this.isLongHovered = true;
              this.longDrop = true;
            }, this.longDropTime);
          }
        }
      });
  }

  private clearLongDragTimeout(): void {
    this.longDrop = false;
    this.isLongHovered = false;
    if (this.longDropTimeout) {
      clearTimeout(this.longDropTimeout);
    }
    this.longDropTimeout = undefined;
  }
}
