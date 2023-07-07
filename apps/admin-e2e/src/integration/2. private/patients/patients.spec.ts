import { standardSetup } from '../../../support'
import { checkAccountList, checkForEditAndDeleteAccount } from '../../helper'

const patients = [
  {
    id: '6784',
    name: '00000000000000sdkjnaskjdn dnaskjnadkj',
    email: 'kajsnkasjdn@gmail.com'
  },
  {
    id: '6783',
    name: '00000000000aaaaaateeest kjnkdansd',
    email: 'dkadkha@gmail.com'
  },
  {
    id: '6786',
    name: '00000000test test2',
    email: 'aksdkasnjasdj@gmail.com'
  }
]

describe('Patients Listing Page', () => {
  describe('CRUD', () => {
    beforeEach(() => {
      cy.setTimezone('et')
      standardSetup()
    })

    it('Patient Listing', () => {
      checkAccountList('/admin/accounts/patients', patients)
    })

    it('Patient Deletion', () => {
      checkForEditAndDeleteAccount('/admin/accounts/patients', 'delete')
    })

    it('Patient Editing', () => {
      checkForEditAndDeleteAccount('/admin/accounts/patients', 'edit')
    })
  })

  it('Patient Editing without countryCode', () => {
    cy.setTimezone('et')
    standardSetup(true, undefined, [
      {
        url: `2.0/account/${Cypress.env('patientId')}`,
        fixture: '/api/account/patientSingleWithoutCountryCode'
      }
    ])
    checkForEditAndDeleteAccount('/admin/accounts/patients', 'edit')
  })
})
