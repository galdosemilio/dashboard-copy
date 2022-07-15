import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormUtils } from '@coachcare/common/shared'
import { AccountAddress } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'

export interface StoreFrontAddressData {
  title: string
  address?: AccountAddress
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
export class StorefrontAddressDialog implements OnInit {
  public title: string
  public form: FormGroup
  public states = stateList

  get isUnitedStates() {
    return this.form?.value.country === 'US'
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StoreFrontAddressData,
    private dialogRef: MatDialogRef<{ id: string; qty: number }>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.title = this.data.title

    if (this.data.address) {
      this.patchValues(this.data.address)
    }

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

    this.dialogRef.close(this.form.value)
  }
}
