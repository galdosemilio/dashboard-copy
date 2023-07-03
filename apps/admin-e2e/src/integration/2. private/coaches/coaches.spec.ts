import { standardSetup } from '../../../support'
import { checkAccountList, checkForEditAndDeleteAccount } from '../../helper'

const coaches = [
  {
    id: '5606',
    name: '1030 232323',
    email: '232323_sss@grr.la'
  },
  {
    id: '5608',
    name: '1048 dsdsd',
    email: 'sdsds@grr.la'
  },
  {
    id: '6777',
    name: '11111111111aaaaakajnsdkajnkjnd askdjnakjnajd',
    email: 'dkansdkjasnd@gmail.com'
  }
]

describe('Coach Listing Page', () => {
  beforeEach(() => {
    cy.setTimezone('et')
    standardSetup()
  })

  it('Coach Listing', () => {
    checkAccountList('/admin/accounts/coaches', coaches)
  })

  it('Coach Deletion', () => {
    checkForEditAndDeleteAccount('/admin/accounts/coaches', 'delete')
  })

  it('Coach Edition', () => {
    checkForEditAndDeleteAccount('/admin/accounts/coaches', 'edit')
  })
})
