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
