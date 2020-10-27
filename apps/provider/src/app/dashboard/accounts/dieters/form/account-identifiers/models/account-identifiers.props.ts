import { AccountIdentifier } from './account-identifier';

export class AccountIdentifiersProps {
  account?: string;
  identifiers?: AccountIdentifier[];

  constructor(args: AccountIdentifiersProps) {
    this.account = args.account || '';
    this.identifiers = args.identifiers || [];
  }
}
