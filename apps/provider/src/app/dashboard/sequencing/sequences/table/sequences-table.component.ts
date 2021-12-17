import { Component, Input } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'
import { ContextService, NotifierService } from '@app/service'
import { _, PromptDialog } from '@app/shared'
import { Sequence as SelveraSequenceService } from '@coachcare/sdk'
import { DuplicateSequenceDialog } from '../../dialogs'
import { Sequence } from '../../models'
import { SequencesDataSource } from '../../services'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-sequencing-sequences-table',
  templateUrl: './sequences-table.component.html',
  styleUrls: ['./sequences-table.component.scss']
})
export class SequencesTableComponent {
  @Input()
  source: SequencesDataSource

  public columns: string[] = [
    'name',
    'createdAt',
    'isActive',
    'organization',
    'actions'
  ]

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private notify: NotifierService,
    private route: ActivatedRoute,
    private router: Router,
    private sequence: SelveraSequenceService
  ) {}

  public onDuplicateSequence(sequence: Sequence): void {
    this.dialog
      .open(DuplicateSequenceDialog, {
        data: { sequence: sequence },
        width: '60vw',
        disableClose: true
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  public onRemoveSequence(sequence: Sequence): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('SEQUENCING.REMOVE_SEQUENCE_TITLE'),
          content: _('SEQUENCING.REMOVE_SEQUENCE_CONTENT'),
          contentParams: { name: sequence.name }
        }
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(async () => {
        await this.sequence.updateSequence({
          id: sequence.id,
          isActive: false,
          organization: this.context.organizationId
        })
        this.source.refresh()
      })
  }

  public onShowSequence(sequence: Sequence): void {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      this.router.navigate(['sequence', sequence.id, { s: 'edit' }], {
        relativeTo: this.route
      })
    } catch (error) {
      this.notify.error(error)
      this.source.isLoading = false
      this.source.change$.next()
    }
  }
}
