import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatPaginator } from '@coachcare/material'
import { Sequence } from '@app/dashboard/sequencing/models'
import { ContextService } from '@app/service'
import { AddRecipientDialog } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { Sequence as SelveraSequenceService } from '@coachcare/npm-api'
import {
  SequenceEnrollmentDatabase,
  SequenceEnrollmentDataSource
} from '../services'

@UntilDestroy()
@Component({
  selector: 'app-dieter-sequences',
  templateUrl: './sequences.component.html'
})
export class DieterSequencesComponent implements OnDestroy, OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator

  refresh$: Subject<void> = new Subject<void>()
  sequence$: Subject<Sequence> = new Subject<Sequence>()
  sequence: Sequence
  sequenceIsValid: boolean
  source: SequenceEnrollmentDataSource

  constructor(
    private context: ContextService,
    private database: SequenceEnrollmentDatabase,
    private dialog: MatDialog,
    private seq: SelveraSequenceService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.source = new SequenceEnrollmentDataSource(
      this.database,
      this.paginator
    )
    this.source.addDefault({
      organization: this.context.organizationId,
      account: this.context.accountId
    })

    this.source.addOptional(this.sequence$, () => ({
      sequence: this.sequence ? this.sequence.id || undefined : undefined
    }))

    this.source.addOptional(this.refresh$, () => ({}))
  }

  async onSelectSequence(sequence: Sequence) {
    this.sequence = sequence
    this.sequence$.next(sequence)
    this.sequenceIsValid = false
    try {
      const response = new Sequence(
        await this.seq.getSequence({
          full: true,
          id: this.sequence.id,
          organization: this.context.organizationId,
          status: 'all'
        })
      )
      this.sequence = response
      this.sequenceIsValid =
        this.sequence.isActive &&
        this.sequence.states.length > 0 &&
        this.sequence.transitions.length > 0
    } catch (error) {}
  }

  onAddEnrollment(): void {
    this.dialog
      .open(AddRecipientDialog, {
        data: {
          account: this.context.account,
          sequence: this.sequence || undefined
        },
        disableClose: true,
        panelClass: 'ccr-full-dialog',
        width: '80vw'
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.refresh$.next())
  }
}
