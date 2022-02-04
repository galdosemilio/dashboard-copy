import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'

@Component({
  selector: 'app-content-file-explorer-inline-editor',
  templateUrl: './file-explorer-inline-editor.component.html',
  styleUrls: ['./file-explorer-inline-editor.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FileExplorerInlineEditorComponent)
    }
  ]
})
export class FileExplorerInlineEditorComponent implements BindForm, OnInit {
  @HostListener('document:click', ['$event'])
  checkClick($event: any): void {
    if (
      this.type === 'default' &&
      !this.elementRef.nativeElement.contains($event.target)
    ) {
      this.cancel.emit()
    }
  }

  @Input()
  set content(c: any) {
    if (c !== undefined) {
      this._content = c
      this.form.patchValue({ value: c })
    }
  }

  get content(): any {
    return this._content
  }
  @Input()
  type = 'default'
  @Input()
  required = false

  @Output()
  save: EventEmitter<void> = new EventEmitter<void>()
  @Output()
  cancel: EventEmitter<void> = new EventEmitter<void>()

  public form: FormGroup

  private _content: any

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    if (this.required) {
      this.form.controls.value.setValidators([Validators.required])
    }
  }

  keyDown($event: any) {
    switch ($event.key) {
      case 'Escape':
        this.cancel.emit()
        break
      case 'Enter':
        this.save.emit()
        break
    }

    $event.stopPropagation()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      value: ['']
    })
  }
}
