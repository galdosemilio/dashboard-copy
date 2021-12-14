import { Component, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@coachcare/material'
import { Sequence } from '@app/dashboard/sequencing/models'
import { SequencesDatabase } from '@app/dashboard/sequencing/services'
import { ContextService, NotifierService } from '@app/service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Sequence as SelveraSequenceService } from '@coachcare/sdk'

type SequenceSearchComponentModes = 'searchbar' | 'select'

@Component({
  selector: 'ccr-sequence-search',
  templateUrl: './sequence-search.component.html'
})
export class SequenceSearchComponent implements OnInit {
  @Input() allowEmptyOption = true
  @Input() organizationId?: string
  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly
    setTimeout(() => {
      if (readonly) {
        this.searchCtrl.disable()
        this.trigger.setDisabledState(true)
      } else {
        this.searchCtrl.enable()
        this.trigger.setDisabledState(false)
      }
    }, 100)
  }

  get readonly(): boolean {
    return this._readonly
  }

  @Input()
  set sequence(sequence: Sequence) {
    if (sequence) {
      this._sequence = sequence
      setTimeout(() => this.searchCtrl.setValue(sequence.name))
    }
  }

  get sequence(): Sequence {
    return this._sequence
  }

  @Output()
  select: Subject<Sequence> = new Subject<Sequence>()
  @Output()
  onSelect: Subject<Sequence> = new Subject<Sequence>()

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  mode: SequenceSearchComponentModes = 'select'
  searchCtrl: FormControl
  selectModeThreshold = 10
  sequences: Sequence[] = []

  private _readonly: boolean
  private _sequence: Sequence

  constructor(
    private context: ContextService,
    private database: SequencesDatabase,
    private notify: NotifierService,
    private sequenceService: SelveraSequenceService
  ) {}

  ngOnInit(): void {
    void this.fetchSequences()
    this.setupAutocomplete()
  }

  async onSeqAutocompleteSelect($event: MatAutocompleteSelectedEvent) {
    try {
      const value = $event.option.value || undefined
      const selectedSequence = this.sequences.find(
        (sequence) => sequence.id === value
      )
      const selectedSequenceInstance = new Sequence(
        await this.sequenceService.getSequence({
          id: selectedSequence.id,
          organization: this.organizationId ?? this.context.organizationId,
          status: 'all',
          full: true
        })
      )
      this.select.next(selectedSequenceInstance)
      this.onSelect.next(selectedSequenceInstance)
    } catch (error) {
      this.notify.error(error)
    }
  }

  async onSequenceSelect(id: string) {
    try {
      const sequence = this.sequences.find((seq) => seq.id === id)
      const selectedSequenceInstance = new Sequence(
        sequence
          ? await this.sequenceService.getSequence({
              id: sequence.id,
              organization: this.organizationId ?? this.context.organizationId,
              status: 'all',
              full: true
            })
          : {}
      )
      this.select.next(selectedSequenceInstance)
      this.onSelect.next(selectedSequenceInstance)
    } catch (error) {
      this.notify.error(error)
    }
  }

  searchBarDisplayWith(value: any): string {
    const selectedSequence: Sequence =
      this.sequences && this.sequences.length
        ? this.sequences.find((sequence) => sequence.id === value)
        : undefined
    return selectedSequence ? selectedSequence.name : value
  }

  private async fetchSequences(query?: string) {
    try {
      const response = await this.database
        .fetch({
          organization: this.organizationId ?? this.context.organizationId,
          query: query,
          status: 'active'
        })
        .toPromise()

      if (response.data && response.data.length) {
        this.sequences = response.data.map((sequence) => new Sequence(sequence))
      }

      if (this.sequences.length >= this.selectModeThreshold) {
        this.mode = 'searchbar'
      }
    } catch (error) {
      this.notify.error(error)
    }
  }

  private setupAutocomplete(): void {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          void this.fetchSequences(query)
        } else {
          this.trigger.closePanel()
        }
      })
  }
}
