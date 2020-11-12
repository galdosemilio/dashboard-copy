import { Routes } from '@angular/router'
import { SequenceComponent } from './sequence'
import { SequencesComponent } from './sequences'
import { SequenceResolver } from './services'

export const SequencingRoutes: Routes = [
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
