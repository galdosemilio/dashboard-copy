import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@coachcare/common/material';
import { ContextService } from '@app/service';
import {
  localeList,
  SupportedLocale,
} from '@app/shared/dialogs/languages.locales';
import { differenceWith, get } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MessagePreviewDialog } from '../../dialogs/message-preview';
import { MessageType, MessageTypes } from '../../models';

@Component({
  selector: 'sequencing-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MessageInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @Input()
  set blocked(blocked: boolean) {
    this._blocked = blocked;
  }

  get blocked(): boolean {
    return this._blocked;
  }

  @Input() markAsTouched: Subject<void>;

  @Input()
  set hardBlocked(hardBlocked: boolean) {
    this._hardBlocked = hardBlocked || false;
    if (this.form && this._hardBlocked) {
      this.disableForm();
    } else if (this.form) {
      this.enableForm();
    }
  }

  get hardBlocked(): boolean {
    return this._hardBlocked;
  }

  actionIds: string[] = ['4'];
  actionTypes: MessageType[] = [];
  addLangForm: FormGroup;
  allowTranslations: boolean;
  availLangs: SupportedLocale['language'][] = [];
  form: FormGroup;
  message: any;
  messageType: MessageType;
  messageTypes: MessageType[] = [];
  /** Contains all the currently used translation languages to filter them out from the dropdowns and prevent duplication */
  translations: string[] = [];
  translationForm: FormArray;

  private _blocked: boolean;
  private _hardBlocked: boolean;

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.resolveAvailLangs();
    this.resolveMessageTypes();
    this.createForms();
    this.subscribeToFormEvents();

    this.form.controls.type.setValue('2');
    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched();
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched();
      });
    });

    if (this.hardBlocked) {
      this.form.controls.allowTranslations.disable({ emitEvent: false });
    }
  }

  onDeleteMessage(): void {
    this.form.controls.syncState.patchValue({
      ...this.form.value.syncState,
      deleted: true,
    });
  }

  onRemoveLanguage(index: number): void {
    this.translations.splice(index, 1);
    this.translationForm.removeAt(index);
  }

  onShowMessagePreview(): void {
    this.dialog.open(MessagePreviewDialog, {
      data: { type: this.form.value.type || this.message.type.id },
      panelClass: 'ccr-full-dialog',
      width: '80vw',
    });
  }

  propagateChange(data: any): void {}

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  resolveSelectableLangs(current: any = {}): any[] {
    return this.availLangs.filter(
      (lang) =>
        lang.code === current.language ||
        this.translations.indexOf(lang.code) === -1
    );
  }

  undoDeletion() {
    this.form.controls.syncState.patchValue({
      ...this.form.value.syncState,
      deleted: false,
    });
  }

  writeValue(value: any): void {
    if (value) {
      if (Array.isArray(value) && value.length) {
        this.message = {
          createdAt: '',
          id: value[0].id,
          localizations: value.map((localization) => ({
            ...localization,
            locale: localization.language,
            payload: localization.content,
          })),
          payload: value[0].content,
          syncState: value[0].syncState,
          type: { id: value[0].type, name: '' },
          updatedAt: '',
        };
      } else {
        this.message = value.message ? value.message : value;
      }

      this.form.patchValue({
        id: this.message.id,
        content: this.message.payload || this.message.content,
        type: this.message.type.id || this.message.type,
        syncState: this.message.syncState,
      });

      if (this.message.id) {
        this.form.controls.type.disable();
      }

      if (this.message.localizations && this.message.localizations.length) {
        this.form.patchValue({ allowTranslations: true });

        this.message.localizations.forEach((localization) => {
          this.translationForm.push(
            this.createTranslationGroup({
              id: localization.id,
              language: localization.locale,
              content: {
                ...localization.payload,
                text: localization.payload.message || localization.payload.text,
              },
              syncState: { new: false, inServer: true, edited: true },
            })
          );
          this.translations.push(localization.locale);
        });

        setTimeout(() => this.translationForm.updateValueAndValidity(), 200);
      } else {
        setTimeout(() => this.form.updateValueAndValidity(), 100);
      }
    }
  }

  private createForms(): void {
    this.form = this.fb.group({
      id: '',
      allowTranslations: [null],
      content: [null, Validators.required],
      syncState: [
        {
          deleted: false,
          edited: false,
          inServer: false,
          new: true,
        },
      ],
      type: ['', Validators.required],
    });

    this.translationForm = this.fb.array([]);

    this.addLangForm = this.fb.group({
      language: [''],
    });
  }

  private createTranslationGroup(initialValue?: any): FormGroup {
    const group = this.fb.group({
      id: [''],
      language: ['', Validators.required],
      content: [null, Validators.required],
      syncState: [
        {
          deleted: false,
          edited: false,
          inServer: false,
          new: false,
        },
      ],
    });

    group.patchValue(initialValue);

    group.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      group.patchValue(
        { syncState: { ...controls.syncState, edited: true } },
        { emitEvent: false }
      );
    });

    return group;
  }

  private disableForm(): void {
    this.form.controls.content.disable({ emitEvent: false });
    this.form.controls.type.disable({ emitEvent: false });
    this.form.controls.allowTranslations.disable({ emitEvent: false });
    this.addLangForm.controls.language.disable({ emitEvent: false });
    this.translationForm.disable({ emitEvent: false });
  }

  private enableForm(): void {
    this.form.controls.content.enable({ emitEvent: false });
    this.form.controls.type.enable({ emitEvent: false });
    this.form.controls.allowTranslations.enable({ emitEvent: false });
    this.addLangForm.controls.language.enable({ emitEvent: false });
    this.translationForm.enable({ emitEvent: false });
  }

  private resolveAvailLangs(): void {
    this.availLangs = differenceWith(
      localeList,
      get(this.context.organization, 'mala.localesBlacklist', []),
      (viewValue, value) => viewValue.language.code === value
    ).map((lang) => lang.language);
  }

  private resolveMessageTypes(): void {
    this.messageTypes = Object.keys(MessageTypes).map(
      (key) => MessageTypes[key]
    );
    this.actionTypes = this.messageTypes.filter(
      (type) => this.actionIds.indexOf(type.id) > -1
    );
    this.messageTypes = this.messageTypes.filter(
      (type) => !this.actionTypes.find((t) => t.id === type.id)
    );
  }

  private subscribeToFormEvents(): void {
    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(50))
      .subscribe((controls) => {
        this.propagateChange(
          this.form.valid || controls.syncState.deleted
            ? {
                id: controls.id,
                content: controls.content,
                syncState: { ...controls.syncState, edited: true },
                type:
                  controls.type || this.message.type.id || this.message.type,
              }
            : null
        );
      });

    this.form.controls.type.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(
        (type) =>
          (this.messageType =
            this.messageTypes.find((messageType) => messageType.id === type) ||
            this.actionTypes.find((actionType) => actionType.id === type))
      );

    this.form.controls.allowTranslations.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((allowTranslations) => {
        this.allowTranslations = allowTranslations;
        if (!allowTranslations) {
          this.translations = [];
          this.translationForm = this.fb.array([]);
        }
      });

    this.addLangForm.controls.language.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((lang: string) => {
        if (lang) {
          this.addLangForm.reset({ language: '' }, { emitEvent: false });
          this.translationForm.push(
            this.createTranslationGroup({
              language: lang,
              content: null,
              syncState: { new: true },
            })
          );
          this.translations.push(lang);
        }
      });

    this.translationForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        if (controls && controls.length === this.translations.length) {
          controls.forEach((control, index) => {
            this.translations[index] = control.language;
          });
        }

        this.propagateChange(
          this.translationForm.valid
            ? controls.map((c) => ({
                ...c,
                syncState: this.form.value.syncState
                  ? { ...this.form.value.syncState, ...c.syncState }
                  : c.syncState,
                id: this.form.value.id || (this.message ? this.message.id : ''),
                type:
                  this.form.value.type ||
                  (this.message ? this.message.type.id : ''),
              }))
            : null
        );
      });
  }
}
