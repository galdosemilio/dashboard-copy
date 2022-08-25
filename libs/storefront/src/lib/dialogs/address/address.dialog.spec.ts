import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CountryFormFieldComponent } from '@coachcare/common/components'
import { ContextService } from '@coachcare/common/services'
import { CcrMaterialModule } from '@coachcare/material'
import { AddressProvider, CountryProvider, SmartyAddress } from '@coachcare/sdk'
import { StorefrontService } from '@coachcare/storefront/services'
import { TranslateModule } from '@ngx-translate/core'
import { render, screen, within } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { of } from 'rxjs'
import { StorefrontAddressDialog } from './address.dialog'

const addresses: SmartyAddress[] = [
  {
    street_line: '22 St Agnes Ln',
    secondary: '',
    city: 'Albany',
    state: 'NY',
    zipcode: '12211',
    entries: 0
  },
  {
    street_line: '22 St Albans Rd',
    secondary: '',
    city: 'Corinna',
    state: 'ME',
    zipcode: '04928',
    entries: 0
  }
]

describe.skip('StorefrontAddressDialog', () => {
  it('should use smartly suggestions to autocomplete fields', async () => {
    await render(StorefrontAddressDialog, {
      declarations: [CountryFormFieldComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CcrMaterialModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Shipping Address' }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: StorefrontService,
          useValue: {
            spreeProvider: {
              getSuggestedAddresses() {
                return of({
                  data: addresses
                })
              }
            }
          }
        },
        {
          provide: AddressProvider,
          useValue: {}
        },
        { provide: ContextService, useValue: {} },
        { provide: CountryProvider, useValue: {} }
      ]
    })

    const address1 = screen.getByTestId('address1')
    const city = screen.getByTestId('city')
    const postalCode = screen.getByTestId('postalCode')
    const state = screen.getByTestId('state')
    await userEvent.type(address1, '22 st')
    const autocomplete = screen.getByRole('listbox')
    const options = within(autocomplete).getAllByRole('option')
    await userEvent.click(options[0])

    expect(address1).toHaveValue('22 St Agnes Ln')
    expect(city).toHaveValue('Albany')
    expect(postalCode).toHaveValue('12211')
    expect(state).toHaveTextContent('New York')
  })
})
