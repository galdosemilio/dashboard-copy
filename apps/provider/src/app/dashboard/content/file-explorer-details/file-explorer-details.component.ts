import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileExplorerContent, FileExplorerEvents } from '@app/dashboard/content/models';
import { BINDFORM_TOKEN } from '@app/shared';

@Component({
  selector: 'app-content-file-explorer-details',
  templateUrl: './file-explorer-details.component.html',
  styleUrls: ['./file-explorer-details.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FileExplorerDetailsComponent)
    }
  ]
})
export class FileExplorerDetailsComponent {
  @Input()
  content: FileExplorerContent;
  @Input()
  events: FileExplorerEvents;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  deleteContent(): void {
    this.events.deleteContent.emit(this.content);
  }

  moveContent(): void {
    this.events.moveContentPrompt.emit(this.content);
  }

  openContent(): void {
    this.events.openContent.emit(this.content);
  }

  updateContent(): void {
    this.events.updateContent.emit(
      Object.assign({}, this.content, this.getFormContent()) as FileExplorerContent
    );
  }

  shouldShowAlert(): boolean {
    return this.content.type.code === 'folder';
  }

  private createForm(): void {
    this.form = this.formBuilder.group({});
  }

  private getFormContent(): void {
    const details = this.form.value.details,
      returnedValue = Object.assign(
        { ...(details.details ? details.details : details) },
        { ...details }
      );

    returnedValue.name = returnedValue.fullName
      ? returnedValue.fullName
      : returnedValue.name;

    return returnedValue;
  }
}
