import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AddressLabelType } from '@coachcare/common/model'
import { CurrentAccount } from '@coachcare/common/services'
import { FormUtils } from '@coachcare/common/shared'
import { AccountAddress, AddressProvider, SmartyAddress } from '@coachcare/sdk'
import { StorefrontService } from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap
} from 'rxjs/operators'

export interface StoreFrontAddressData {
  title: string
  address?: AccountAddress
  otherAddress?: AccountAddress
  invalidAddress?: boolean
  label?: string
  user?: CurrentAccount
}

const stateList = [
  {
    displayValue: 'Alabama',
    value: 'AL'
  },
  {
    displayValue: 'Alaska',
    value: 'AK'
  },
  {
    displayValue: 'American Samoa',
    value: 'AS'
  },
  {
    displayValue: 'Arizona',
    value: 'AZ'
  },
  {
    displayValue: 'Arkansas',
    value: 'AR'
  },
  {
    displayValue: 'Armed Forces Europe',
    value: 'AE'
  },
  {
    displayValue: 'Armed Forces Americas',
    value: 'AA'
  },
  {
    displayValue: 'Armed Forces Pacific',
    value: 'AP'
  },
  {
    displayValue: 'California',
    value: 'CA'
  },
  {
    displayValue: 'Colorado',
    value: 'CO'
  },
  {
    displayValue: 'Connecticut',
    value: 'CT'
  },
  {
    displayValue: 'Delaware',
    value: 'DE'
  },
  {
    displayValue: 'District Of Columbia',
    value: 'DC'
  },
  {
    displayValue: 'Federated States Of Micronesia',
    value: 'FM'
  },
  {
    displayValue: 'Florida',
    value: 'FL'
  },
  {
    displayValue: 'Georgia',
    value: 'GA'
  },
  {
    displayValue: 'Guam',
    value: 'GU'
  },
  {
    displayValue: 'Hawaii',
    value: 'HI'
  },
  {
    displayValue: 'Idaho',
    value: 'ID'
  },
  {
    displayValue: 'Illinois',
    value: 'IL'
  },
  {
    displayValue: 'Indiana',
    value: 'IN'
  },
  {
    displayValue: 'Iowa',
    value: 'IA'
  },
  {
    displayValue: 'Kansas',
    value: 'KS'
  },
  {
    displayValue: 'Kentucky',
    value: 'KY'
  },
  {
    displayValue: 'Louisiana',
    value: 'LA'
  },
  {
    displayValue: 'Maine',
    value: 'ME'
  },
  {
    displayValue: 'Marshall Islands',
    value: 'MH'
  },
  {
    displayValue: 'Maryland',
    value: 'MD'
  },
  {
    displayValue: 'Massachusetts',
    value: 'MA'
  },
  {
    displayValue: 'Michigan',
    value: 'MI'
  },
  {
    displayValue: 'Minnesota',
    value: 'MN'
  },
  {
    displayValue: 'Mississippi',
    value: 'MS'
  },
  {
    displayValue: 'Missouri',
    value: 'MO'
  },
  {
    displayValue: 'Montana',
    value: 'MT'
  },
  {
    displayValue: 'Nebraska',
    value: 'NE'
  },
  {
    displayValue: 'Nevada',
    value: 'NV'
  },
  {
    displayValue: 'New Hampshire',
    value: 'NH'
  },
  {
    displayValue: 'New Jersey',
    value: 'NJ'
  },
  {
    displayValue: 'New Mexico',
    value: 'NM'
  },
  {
    displayValue: 'New York',
    value: 'NY'
  },
  {
    displayValue: 'North Carolina',
    value: 'NC'
  },
  {
    displayValue: 'North Dakota',
    value: 'ND'
  },
  {
    displayValue: 'Northern Mariana Islands',
    value: 'MP'
  },
  {
    displayValue: 'Ohio',
    value: 'OH'
  },
  {
    displayValue: 'Oklahoma',
    value: 'OK'
  },
  {
    displayValue: 'Oregon',
    value: 'OR'
  },
  {
    displayValue: 'Palau',
    value: 'PW'
  },
  {
    displayValue: 'Pennsylvania',
    value: 'PA'
  },
  {
    displayValue: 'Puerto Rico',
    value: 'PR'
  },
  {
    displayValue: 'Rhode Island',
    value: 'RI'
  },
  {
    displayValue: 'South Carolina',
    value: 'SC'
  },
  {
    displayValue: 'South Dakota',
    value: 'SD'
  },
  {
    displayValue: 'Tennessee',
    value: 'TN'
  },
  {
    displayValue: 'Texas',
    value: 'TX'
  },
  {
    displayValue: 'Utah',
    value: 'UT'
  },
  {
    displayValue: 'Vermont',
    value: 'VT'
  },
  {
    displayValue: 'Virgin Islands',
    value: 'VI'
  },
  {
    displayValue: 'Virginia',
    value: 'VA'
  },
  {
    displayValue: 'Washington',
    value: 'WA'
  },
  {
    displayValue: 'West Virginia',
    value: 'WV'
  },
  {
    displayValue: 'Wisconsin',
    value: 'WI'
  },
  {
    displayValue: 'Wyoming',
    value: 'WY'
  }
]

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-address-dialog',
  templateUrl: './address.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./address.dialog.scss']
})
export class StorefrontAddressDialog implements OnInit, AfterViewInit {
  public title: string
  public form: FormGroup
  public invalidAddress: boolean
  public states = stateList
  public autocomplete = new FormControl('')
  public autocompleteOptions: string[] = []
  public filteredOptions: SmartyAddress[] = []
  public isLoading: boolean = false

  @ViewChild(MatAutocompleteTrigger) inputAutoComplete: MatAutocompleteTrigger

  get isUnitedStates() {
    return this.form?.value.country === 'US'
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StoreFrontAddressData,
    private dialogRef: MatDialogRef<{ id: string; qty: number }>,
    private fb: FormBuilder,
    private storefront: StorefrontService,
    private addressProvider: AddressProvider
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.title = this.data.title
    this.invalidAddress = !!this.data.invalidAddress
    this.isLoading = this.invalidAddress

    if (this.data.address) {
      this.patchValues(this.data.address)
    }

    merge(
      this.autocomplete.valueChanges,
      this.form.get('address1').valueChanges
    )
      .pipe(
        startWith(null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((val) => {
          return this.storefront.spreeProvider.getSuggestedAddresses({
            search: val || ''
          })
        }),
        map((res) => res.data)
      )
      .subscribe((addresses) => {
        this.isLoading = false
        if (addresses.length > 0) {
          this.filteredOptions = addresses
          setTimeout(() => {
            this.inputAutoComplete.openPanel()
          }, 0)
        }
      })

    this.form
      .get('country')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter((country) => country === 'US')
      )
      .subscribe(() => {
        if (
          !this.states
            .map((state) => state.value)
            .includes(this.form.value.stateProvince)
        ) {
          this.form.patchValue({
            stateProvince: ''
          })
        }
      })
  }

  ngAfterViewInit(): void {
    if (this.invalidAddress) {
      this.autocomplete.setValue(this.data.address.address1)
    }
  }

  public resetError(e: Event) {
    e.preventDefault()
    this.invalidAddress = false
  }

  public selectSmartyAddress(address: SmartyAddress) {
    this.form.patchValue(
      {
        address1: address.street_line,
        address2: address.secondary,
        city: address.city,
        stateProvince: address.state,
        postalCode: address.zipcode
      },
      { emitEvent: false }
    )
    this.invalidAddress = false
  }

  private patchValues(address: AccountAddress) {
    this.form.patchValue({
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      stateProvince: address.stateProvince,
      country: address.country?.id,
      postalCode: address.postalCode
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      address1: ['', Validators.required],
      address2: null,
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['US', Validators.required]
    })
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      FormUtils.markAsTouched(this.form)
      return
    }

    const address = this.form.value

    try {
      if (
        this.data.address &&
        this.data.address.id !== this.data.otherAddress?.id
      ) {
        await this.addressProvider.updateAddress({
          account: this.data.user.id,
          id: this.data.address.id,
          name: `${this.data.user.firstName} ${this.data.user.lastName}`,
          address1: address.address1,
          address2: address.address2 ?? null,
          city: address.city,
          stateProvince: address.stateProvince,
          country: address.country,
          postalCode: address.postalCode,
          labels: [this.data.label],
          verification:
            this.data.label === AddressLabelType.SHIPPING
              ? 'enabled'
              : 'disabled'
        })
      } else {
        await this.addressProvider.createAddress({
          account: this.data.user.id,
          name: `${this.data.user.firstName} ${this.data.user.lastName}`,
          address1: address.address1,
          address2: address.address2 ?? undefined,
          city: address.city,
          stateProvince: address.stateProvince,
          country: address.country,
          postalCode: address.postalCode,
          labels: [this.data.label],
          verification:
            this.data.label === AddressLabelType.SHIPPING
              ? 'enabled'
              : 'disabled'
        })
      }
      this.dialogRef.close(address)
    } catch (err) {
      this.autocomplete.setValue(address.address1)
      this.invalidAddress = true
      setTimeout(() => {
        this.inputAutoComplete.openPanel()
      }, 0)
    }
  }
}
