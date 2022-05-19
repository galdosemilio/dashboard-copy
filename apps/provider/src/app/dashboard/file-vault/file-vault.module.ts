import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@app/shared/shared.module'

import { FileVaultComponents } from '.'
import { FileVaultRoutingModule } from './file-vault-routing.module'
import { DietersModule } from '../accounts/dieters/dieters.module'

@NgModule({
  declarations: FileVaultComponents,
  imports: [FileVaultRoutingModule, CommonModule, DietersModule, SharedModule]
})
export class FileVaultModule {}
