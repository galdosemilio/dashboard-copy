import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SequenceComponent } from './sequence'
import { SequencesComponent } from './sequences'
import { SequenceResolver } from './services'

const routes: Routes = [
  {
    path: '',
    component: SequencesComponent
  },
  { path: 'new', component: SequenceComponent },
  {
    path: 'sequence/:id',
    resolve: {
      sequence: SequenceResolver
    },
    component: SequenceComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SequencingRoutingModule {}
