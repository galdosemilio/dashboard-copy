import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { clone, map, sortBy } from 'lodash'

import { LOCALES } from '@app/shared/utils'
import { Locale, LocaleSelectEvents } from './locales'

@Component({
  selector: 'app-locale-select-dialog',
  templateUrl: './locale-select.dialog.html',
  host: {
    class: 'ccr-dialog'
  }
})
export class LocaleSelectDialog implements OnInit {
  public columns = ['title', 'check']
  public preferredLocales: Array<Locale> = []
  public events: LocaleSelectEvents = new LocaleSelectEvents()
  public source

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<LocaleSelectDialog>
  ) {
    const clonedLocales = map(LOCALES, clone)
    this.source = sortBy(clonedLocales, 'lang')
  }

  ngOnInit() {
    if (this.data.locales && this.data.locales.length) {
      this.preferredLocales = map(
        LOCALES.filter((v) => this.data.locales.includes(v.code)),
        clone
      )
      this.preferredLocales.forEach((v) => (v.checked = true))
    }
  }

  onLocalesChange(locales: Array<Locale>) {
    this.preferredLocales = locales
  }

  onSave() {
    this.dialogRef.close(this.preferredLocales.map((v) => v.code))
  }
}
