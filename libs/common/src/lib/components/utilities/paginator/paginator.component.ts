import { Component } from '@angular/core';
import { MatPaginator } from '@coachcare/common/material';

@Component({
  selector: 'ccr-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent extends MatPaginator {}
