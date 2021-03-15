import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import { AccountRef } from '@coachcare/npm-api'

export interface MessagePatientDialogProps {
  content?: string
  contentParams?: any
  initialMessage?: string
  target: AccountRef
  title: string
  titleParams?: any
}

@Component({
  selector: 'app-message-patient-dialog',
  templateUrl: './message-patient.dialog.html',
  styleUrls: ['./message-patient.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MessagePatientDialog implements OnInit {
  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessagePatientDialogProps,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.loadInitialMessage()
  }

  private createForm(): void {
    this.form = this.fb.group({
      message: ['', Validators.required]
    })
  }

  private loadInitialMessage(): void {
    if (!this.data.initialMessage) {
      return
    }

    this.form.get('message').setValue(this.data.initialMessage)
  }
}
