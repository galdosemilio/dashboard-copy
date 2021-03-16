import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Directive({
  selector: '[ccrDebounceEvents]'
})
export class DebounceEventsDirective implements OnInit, OnDestroy {
  @Input()
  debounceTime = 500

  @Output()
  ccrSubmit = new EventEmitter()

  @Output()
  ccrClick = new EventEmitter()

  private submits = new Subject()
  private clicks = new Subject()
  private subscription: Subscription

  constructor() {}

  ngOnInit() {
    this.subscription = this.submits
      .pipe(untilDestroyed(this), debounceTime(this.debounceTime))
      .subscribe((e) => this.ccrSubmit.emit(e))

    this.subscription = this.clicks
      .pipe(untilDestroyed(this), debounceTime(this.debounceTime))
      .subscribe((e) => this.ccrClick.emit(e))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  @HostListener('submit', ['$event'])
  submitEvent(event) {
    this.submits.next(event)
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.clicks.next(event)
  }
}
