import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { MatDialog, MatSort, Sort } from '@coachcare/material'
import { Router } from '@angular/router'
import { ClinicsDataSource } from '@app/dashboard/accounts/clinics/services'
import { ContextService, NotifierService } from '@app/service'
import { _, PromptDialog, PromptDialogData } from '@app/shared'
import { Affiliation, OrganizationAccess } from '@coachcare/sdk'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-clinics-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class ClinicsTableComponent implements OnInit {
  @Input()
  columns = [
    'id',
    'name',
    'address',
    'city',
    'state',
    'zip',
    'contact',
    'actions'
  ]
  @Input()
  source: ClinicsDataSource | null

  @Output()
  onSorted = new EventEmitter<Sort>()

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private affiliation: Affiliation,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cdr.detectChanges()
  }

  onRemove(clinic) {
    const data: PromptDialogData = {
      title: _('BOARD.CLINIC_REMOVE'),
      content: _('BOARD.CLINIC_REMOVE_PROMPT'),
      contentParams: { clinic: `${clinic.organization.name}` }
    }
    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        this.affiliation
          .disassociate({
            account: this.context.user.id,
            organization: clinic.organization.id
          })
          .then(() => {
            this.notifier.success(
              _('NOTIFY.SUCCESS.CLINIC_ASSOCIATION_REMOVED')
            )
            this.source.refresh()
          })
          .catch((err) => this.notifier.error(err))
      })
  }

  onSort(sort: Sort) {
    this.onSorted.emit(sort)
  }

  public showClinic(row: OrganizationAccess, newTab?: boolean): void {
    if (newTab) {
      window.open(
        `${window.location.href.split('?')[0]}/${row.organization.id}`,
        '_blank'
      )
    } else {
      this.router.navigate(['/accounts/clinics', row.organization.id])
    }
  }
}
