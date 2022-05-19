import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FileVaultComponent } from '.'

const routes: Routes = [
  {
    path: '',
    component: FileVaultComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileVaultRoutingModule {}
