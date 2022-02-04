import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MessagesComponent } from './'

const routes: Routes = [
  {
    path: 'messages',
    component: MessagesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {}
