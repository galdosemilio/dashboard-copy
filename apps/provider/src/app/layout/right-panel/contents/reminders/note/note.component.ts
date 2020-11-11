import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ConfigService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { LayoutNote } from '../notes-container'

@Component({
  selector: 'app-rightpanel-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() note: LayoutNote

  @Output() delete: EventEmitter<any> = new EventEmitter<any>()

  maxChars: number
  maxLenght: number

  constructor(private dialog: MatDialog, private config: ConfigService) {
    this.maxLenght = this.config.get('app.default.noteMaxLenght', 100)
    this.maxChars = this.maxLenght
  }

  toggleCompleteNote(): void {
    this.maxChars = !this.maxChars ? this.maxLenght : 0
  }

  noteHasOverflow(privateNoteText: string): boolean {
    return privateNoteText.length > this.maxLenght
  }

  onDeleteNote(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.NOTES_DELETE_TITLE'),
          content: _('BOARD.NOTES_DELETE_DESCRIPTION')
        }
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.delete.emit(this.note)
        }
      })
  }
}
