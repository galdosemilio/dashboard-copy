import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { fromEvent, of } from 'rxjs'
import { mergeMap, sampleTime } from 'rxjs/operators'
import { MessageThread, SelectMessageThreadEvent } from '../../model'

@UntilDestroy()
@Component({
  selector: 'messages-thread-list',
  templateUrl: './thread-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ccr-recipients-scroll' }
})
export class MessagesThreadListComponent implements AfterContentInit {
  @Input() threads: MessageThread[] = []
  @Input() active = 0

  @Output() onReachedEndOfList: EventEmitter<void> = new EventEmitter<void>()
  @Output() onSelectThread: EventEmitter<SelectMessageThreadEvent> =
    new EventEmitter<SelectMessageThreadEvent>()

  constructor(private elementRef: ElementRef) {}

  public ngAfterContentInit(): void {
    const lastPosition = { scrolled: 0 }
    fromEvent(this.elementRef.nativeElement, 'scroll')
      .pipe(
        untilDestroyed(this),
        sampleTime(300),
        mergeMap(() => of(this.calculatePoints()))
      )
      .subscribe((pos: any) => this.handleScroll(pos, lastPosition))
  }

  public selectThread(thread: MessageThread, index: number): void {
    this.onSelectThread.emit({ thread, index })
  }

  private calculatePoints(): {
    height: number
    scrolled: number
    total: number
  } {
    const el = this.elementRef.nativeElement
    return {
      height: el.offsetHeight,
      scrolled: el.scrollTop,
      total: el.scrollHeight
    }
  }

  private handleScroll(position, lastPosition) {
    if (position.height + position.scrolled >= position.total - 50) {
      this.onReachedEndOfList.emit()
    }
    lastPosition.scrolled = position.scrolled
  }
}
