import { Component, forwardRef, Input, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  CONTENT_TYPE_MAP,
  FILE_TYPE_MAP,
  FileTypeMapItem
} from '@app/dashboard/content/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { chain } from 'lodash'

interface SupportedFileType extends FileTypeMapItem {
  extension: string
}

@Component({
  selector: 'app-content-file-form',
  templateUrl: './file.form.component.html',
  styleUrls: ['./file.form.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FileFormComponent)
    }
  ]
})
export class FileFormComponent implements BindForm {
  @Input() mode: 'digital-library' | 'vault' = 'digital-library'

  public form: FormGroup
  public details: any = {
    type: CONTENT_TYPE_MAP.file,
    name: ''
  }
  public extension: string
  public fileTypes = FILE_TYPE_MAP
  public supportedFileTypes: SupportedFileType[] = Object.keys(
    FILE_TYPE_MAP
  ).map((extension: string) => ({
    ...FILE_TYPE_MAP[extension],
    extension: extension
  }))
  public groupedFileTypes = chain(this.supportedFileTypes)
    .groupBy('name')
    .sortBy((group) => this.supportedFileTypes.indexOf(group[0]))
    .mapValues((v) => chain(v).map('extension').value())
    .value()

  @ViewChild('file', { static: false })
  file

  constructor(private formBuilder: FormBuilder) {
    this.createForm()
  }

  updateFile(): void {
    const file: File = this.file.nativeElement.files.length
      ? this.file.nativeElement.files[0]
      : undefined

    if (file) {
      const extensionIndex = file.name.lastIndexOf('.')

      this.extension =
        extensionIndex > -1
          ? file.name
              .substring(extensionIndex + 1, file.name.length)
              .toLowerCase()
          : undefined
    } else {
      this.extension = undefined
    }

    this.details = Object.assign(
      { ...this.details },
      {
        name: file.name,
        extension: this.extension,
        type: CONTENT_TYPE_MAP.file
      }
    )

    this.form.patchValue({
      file: file
    })

    this.file.nativeElement.value = ''
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      file: [undefined, [Validators.required]]
    })
  }
}
