import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { CareManagementService, CareServiceType } from '@app/service'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { TranslateService } from '@ngx-translate/core'
import { first } from 'rxjs'

@Component({
  selector: 'app-dialog-care-mgmt-card',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" class="card">
      <!-- Header section -->
      <div fxLayout="row" fxLayoutAlign="stretch center" class="card-header">
        <div fxFlex>{{ careServiceType.serviceType.name }}</div>

        <div *ngIf="hasConflict" class="conflict-container" fxFlex="50%">
          {{
            'CARE_SERVICES.SERVICE_ACTIVATION_CONFLICT_ERROR'
              | translate
                : {
                    name: careServiceType.serviceType.name,
                    conflictServices: conflictingTypesWithSlash
                  }
          }}
        </div>

        <div fxFlex fxLayoutAlign="end center" fxLayoutGap="5px">
          <button
            *ngIf="careEntry"
            (click)="emitInspectCareEntry(careEntry)"
            class="inspect-button"
            mat-icon-button
            color="text"
          >
            <mat-icon fontSet="material-icons-outlined">navigate_next</mat-icon>
          </button>

          <button
            *ngIf="!careEntry"
            [disabled]="hasConflict || !canEnableCareEntry"
            (click)="emitAddCareEntry(careServiceType)"
            class="add-button"
            mat-icon-button
            color="primary"
          >
            <mat-icon>add_circle</mat-icon>
          </button>
        </div>
      </div>

      <!-- Body section -->
      <div
        *ngIf="careEntry"
        class="card-body"
        fxLayout="column"
        fxLayoutAlign="start stretch"
        fxLayoutGap="10px"
      >
        <!-- Start date and supervisor -->
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
          <div
            fxFlex="50%"
            fxLayout="row"
            fxLayoutAlign="start center"
            fxLayoutGap="10px"
          >
            <label fxFlex="27%">{{ 'BOARD.START_DATE' | translate }}</label>
            <span>{{
              careEntry.rpmState.startedAt | amDateFormat: 'MMMM D, YYYY'
            }}</span>
          </div>

          <div
            *ngIf="careEntry.rpmState.supervisingProvider"
            fxFlex="50%"
            fxLayout="row"
            fxLayoutAlign="start center"
            fxLayoutGap="10px"
          >
            <label fxFlex="27%">{{
              'CARE_SERVICES.SUPERVISOR' | translate
            }}</label>
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
              <ccr-avatar
                [account]="careEntry.rpmState.supervisingProvider.id"
                size="messages"
              ></ccr-avatar>
              <span
                >{{ careEntry.rpmState.supervisingProvider.firstName }}
                {{ careEntry.rpmState.supervisingProvider.lastName }}</span
              >
            </div>
          </div>
        </div>

        <!-- Device -->
        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
          <div
            *ngIf="careEntry.rpmState.plan"
            fxFlex="50%"
            fxLayout="row"
            fxLayoutAlign="start center"
            fxLayoutGap="10px"
          >
            <label fxFlex="27%">{{ 'BOARD.DEVICES' | translate }}</label>
            <span>{{ careEntry.rpmState.plan.device.name }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      label {
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .card {
        border: 2px solid var(--bg-bar-dark);
      }

      .card-body {
        padding: 20px 20px 25px 20px;
      }

      .card-header {
        background-color: var(--sidenav-light);
        padding: 5px 20px;
        width: 100%;
      }

      .conflict-container {
        font-style: oblique;
      }

      .mat-icon-button {
        height: 24px;
        line-height: 24px;
        width: 24px;
      }

      .add-button mat-icon,
      .inspect-button mat-icon {
        margin-top: -3px;
      }

      .inspect-button mat-icon {
        color: var(--text);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareManagementCardComponent {
  @Input() canEnableCareEntry: boolean = false
  @Input() careEntry?: RPMStateEntry
  @Input() careServiceType: CareServiceType
  @Input() hasConflict: boolean

  @Output() addCareEntry: EventEmitter<CareServiceType> =
    new EventEmitter<CareServiceType>()
  @Output() inspectCareEntry: EventEmitter<RPMStateEntry> =
    new EventEmitter<RPMStateEntry>()

  private translations: Record<string, string> = {}

  get conflictingTypesWithSlash(): string {
    if (
      !this.careServiceType.conflicts ||
      this.careServiceType.conflicts.length <= 0
    ) {
      return ''
    }

    return Object.values(this.careManagementService.serviceTypeMap)
      .filter((type) =>
        this.careServiceType.conflicts.includes(type.serviceType.id)
      )
      .map((type) => type.serviceType.name)
      .join('/')
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private careManagementService: CareManagementService
  ) {}

  ngOnInit(): void {
    this.translate
      .get(
        Object.values(this.careManagementService.serviceTypeMap).map(
          (type) => type.serviceType.name
        )
      )
      .pipe(first())
      .subscribe((translations) => {
        this.translations = translations
        // we mark it for check to cover the unlikely event that this loads after conflictingTypesWithSlash is read
        this.cdr.markForCheck()
      })
  }

  emitAddCareEntry(type: CareServiceType): void {
    this.addCareEntry.emit(type)
  }

  emitInspectCareEntry(entry: RPMStateEntry): void {
    this.inspectCareEntry.emit(entry)
  }
}
