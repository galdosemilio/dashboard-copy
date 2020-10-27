import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatSort, MatTable } from '@coachcare/common/material';

import {
  ClinicsDatabase,
  ClinicsDataSource,
} from '@app/dashboard/accounts/clinics/services';
import { ContextService, NotifierService } from '@app/service';
import { CcrPaginator } from '@app/shared';
import { OrganizationAccess } from '@app/shared/selvera-api';
import { forOwn } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface ClinicsPickerValue {
  clinicId: string;
  picked: boolean;
  admin: boolean;
  accessall: boolean;
  initial: {
    picked: boolean;
    admin: boolean;
    accessall: boolean;
  };
}

@Component({
  selector: 'app-clinics-table-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClinicsPickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ClinicsPickerComponent),
      multi: true,
    },
  ],
})
export class ClinicsPickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @HostBinding('class')
  classList = 'ccr-table-picker'; // to write new classes without Renderer
  @ViewChild('table', { static: true })
  table: MatTable<any>;
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @Input()
  coachId: number;
  @Input()
  source: ClinicsDataSource | null;
  columns: Array<string>;
  searchForm: FormGroup;

  @Input()
  disabled = null;
  @Input()
  required = null;

  propagator = (data: any) => {};
  touchedFn = () => {};

  clinics: Array<OrganizationAccess> = [];
  isLoading = true;
  isOwnProfile = true;

  // object mapping the table
  data: { [id: string]: ClinicsPickerValue } = {};

  // getters
  get isDisabled() {
    return this.disabled === '' || this.disabled === true;
  }
  get isRequired() {
    return this.required === '' || this.required === true;
  }

  constructor(
    private element: ElementRef,
    private builder: FormBuilder,
    private context: ContextService,
    private notifier: NotifierService,
    private database: ClinicsDatabase
  ) {}

  ngOnInit() {
    this.isOwnProfile = this.coachId === +this.context.user.id;

    this.columns = this.isOwnProfile
      ? ['name', 'perm_viewall', 'perm_admin']
      : ['actions', 'name', 'perm_viewall', 'perm_admin'];

    // setup the table source
    this.source = new ClinicsDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    );
    this.searchForm = this.builder.group({
      query: '',
      strict: false,
    });

    const searchStream = this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      untilDestroyed(this)
    );
    searchStream.subscribe(() => {
      this.source.resetPaginator();
    });

    this.source.addDefault({
      admin: true, // show those with admin permissions
      status: 'active',
    });
    this.source.addOptional(searchStream, () => this.searchForm.value);

    // build the data index
    this.source.connect().subscribe((clinics) => {
      // initialize the associations
      if (!Object.values(this.data).length && this.coachId) {
        this.database
          .fetch({
            account: this.coachId.toString(),
            limit: 'all',
            strict: true,
          })
          .subscribe((res) => {
            // process the initial state here
            res.data.map((c) => {
              const id = c.organization.id;
              this.data[id] = {
                clinicId: id,
                picked: true,
                admin: c.permissions.admin,
                accessall: c.permissions.viewAll,
                initial: {
                  picked: true,
                  admin: c.permissions.admin,
                  accessall: c.permissions.viewAll,
                },
              };
            });
            this.onChange();
          });
      }

      clinics.map((c) => {
        const id = c.organization.id;
        if (!this.data[id]) {
          this.data[id] = {
            clinicId: id,
            picked: false,
            admin: false,
            accessall: false,
            initial: {
              picked: false,
              admin: false,
              accessall: false,
            },
          };
        }
      });

      this.clinics = clinics;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.source.disconnect();
  }

  markAsSubmitted() {
    forOwn(this.data, (val, id) => {
      this.data[id] = {
        ...val,
        initial: {
          picked: val.picked,
          admin: val.admin,
          accessall: val.accessall,
        },
      };
    });
  }

  toggleHelp(contentClass = '') {
    // checks the nativeElement because this.classList doesn't update changes
    const classList = this.element.nativeElement.classList;
    // removes if already exists or if empty
    const baseClasses = [];
    let exists = false;
    classList.forEach((c) => {
      if (contentClass && c === contentClass) {
        exists = true;
      } else if (c.indexOf('ng') === 0 || c.indexOf('ccr') === 0) {
        baseClasses.push(c);
      }
    });

    if (contentClass && !exists) {
      baseClasses.push(`help-enabled ${contentClass}`);
    }
    this.classList = baseClasses.join(' ');
  }

  onSelect(id) {
    const enabled = this.data[id].picked;
    this.data[id].picked = !enabled;
    this.onChange();
    this.touchedFn();
  }

  onChange() {
    const changed = Object.values(this.data).filter(
      (c) =>
        c.picked !== c.initial.picked ||
        c.accessall !== c.initial.accessall ||
        c.admin !== c.initial.admin
    );
    // prevent required validator to detect an empty array
    this.propagator(changed.length ? changed : [null]);
  }

  /**
   * Control Value Accesor Methods
   */
  writeValue(value: any): void {
    // do not receive existing values but a coachId
  }

  registerOnChange(fn: any): void {
    this.propagator = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    if (!this.isDisabled && this.isRequired) {
      const hasOrg = Object.values(this.data).reduce(
        (prev, curr) => (prev.picked ? prev : curr),
        { picked: false }
      );
      // if has no picked organizations
      return !hasOrg.picked ? { clinicRequired: true } : null;
    }
  }
}
