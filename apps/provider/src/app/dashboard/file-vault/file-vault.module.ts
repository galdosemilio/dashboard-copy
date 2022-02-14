import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { FileVaultComponents } from '.'
import { FileVaultRoutes } from './file-vault-routing.module'
import { DietersModule } from '../accounts/dieters/dieters.module'

@NgModule({
  declarations: FileVaultComponents,
  imports: [
    CommonModule,
    DietersModule,
    RouterModule.forChild(FileVaultRoutes),
    SharedModule
  ]
})
export class FileVaultModule {}
