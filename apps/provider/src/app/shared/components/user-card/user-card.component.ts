import { Component, Input, OnInit, Output } from '@angular/core';
import { ContextService, CurrentAccount } from '@app/service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ccr-user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {
  @Input()
  user: any;
  @Input()
  showRemoveButton: boolean = true;

  @Output()
  remove: Subject<string> = new Subject<string>();

  currentAccount: CurrentAccount;

  constructor(private context: ContextService) {}

  ngOnInit(): void {
    this.currentAccount = this.context.user;
  }

  onRemove(id: string): void {
    this.remove.next(id);
  }
}
