import { Routes } from '@angular/router';
import { BoardLayout } from '@coachcare/layout';

import { NotFoundPageComponent } from '@board/shared/shared.barrel';

export const routes: Routes = [
  {
    path: '',
    component: BoardLayout,
    children: [
      // TODO child routes here
    ]
  },
  {
    // wildcard processing
    path: '**',
    component: BoardLayout,
    children: [
      {
        path: '',
        component: NotFoundPageComponent
      }
    ]
  }
];
