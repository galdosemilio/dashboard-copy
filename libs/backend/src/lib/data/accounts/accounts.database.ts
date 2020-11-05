import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  AccountProvider,
  AccountSingle,
  CheckAccountRequest,
  CreateAccountRequest,
  GetAllAccountRequest,
  GetAllAccountResponse,
  GetListAccountRequest,
  GetListAccountResponse,
  UpdateAccountRequest
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'

@Injectable()
export class AccountsDatabase extends AppDatabase {
  constructor(private account: AccountProvider) {
    super()
  }

  getAll(args: GetAllAccountRequest): Observable<GetAllAccountResponse> {
    return from(this.account.getAll(args))
  }

  getList(args: GetListAccountRequest): Observable<GetListAccountResponse> {
    return from(this.account.getList(args))
  }

  check(request: CheckAccountRequest): Promise<void> {
    return this.account.check(request)
  }

  getSingle(id: string): Promise<AccountSingle> {
    return this.account.getSingle(id)
  }

  create(request: CreateAccountRequest) {
    return this.account.create(request)
  }

  update(request: UpdateAccountRequest) {
    return this.account.update(request as any) // MERGETODO: CHECK THIS TYPE OUT!!!
  }

  delete(id: string): Promise<void> {
    return this.account.setActive({ id, isActive: false })
  }

  // TODO move this to an override service of common
  // activatePrompt(item: AccountSingle): Promise<any> {
  activatePrompt(item: AccountSingle): any {
    // return new Promise((resolve, reject) => {
    //   const data: PromptDialogData = {
    //     title: _('PROMPT.ACCS.CONFIRM_ACTIVATE'),
    //     content: _('PROMPT.ACCS.CONFIRM_ACTIVATE_PROMPT'),
    //     contentParams: { item: `${item.firstName} ${item.lastName}` }
    //   };
    //   this.dialog
    //     .open(PromptDialog, { data: data })
    //     .afterClosed()
    //     .subscribe(confirm => {
    //       if (confirm) {
    //         this.account
    //           .activate(item.id)
    //           .then(resolve)
    //           .catch(reject);
    //       } else {
    //         reject();
    //       }
    //     });
    // });
  }

  // TODO move this to an override service of common
  // deactivatePrompt(item: AccountSingle): Promise<any> {
  deactivatePrompt(item: AccountSingle): any {
    // return new Promise((resolve, reject) => {
    //   const data: PromptDialogData = {
    //     title: _('PROMPT.ACCS.CONFIRM_DEACTIVATE'),
    //     content: _('PROMPT.ACCS.CONFIRM_DEACTIVATE_PROMPT'),
    //     contentParams: { item: `${item.firstName} ${item.lastName}` }
    //   };
    //   this.dialog
    //     .open(PromptDialog, { data: data })
    //     .afterClosed()
    //     .subscribe(confirm => {
    //       if (confirm) {
    //         this.delete(item.id)
    //           .then(resolve)
    //           .catch(reject);
    //       } else {
    //         reject();
    //       }
    //     });
    // });
  }
}
