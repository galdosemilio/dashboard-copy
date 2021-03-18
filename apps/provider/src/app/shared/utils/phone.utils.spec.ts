import { formatPhoneNumber } from '@app/shared/utils'

describe('FormatPhoneNumber Tests', () => {
  it('Should return formatted phone number with valid US phone number with contry code +1', () => {
    const phoneNumber = formatPhoneNumber('+13219998118')
    expect(phoneNumber).toEqual('+1 (321) 999-8118')
  })

  it('Should return formatted phone number with valid US phone number with contry code 1', () => {
    const phoneNumber = formatPhoneNumber('13219998118')
    expect(phoneNumber).toEqual('+1 (321) 999-8118')
  })

  it('Should return formatted phone number with valid US phone number without contry code', () => {
    const phoneNumber = formatPhoneNumber('3219998118')

    expect(phoneNumber).toEqual('(321) 999-8118')
  })

  it('Should not format phone number with invalid phone number', () => {
    const phoneNumber = '3029329'
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    expect(formattedPhoneNumber).toEqual(phoneNumber)
  })

  it('Should return null with phoneNumber null', () => {
    const phoneNumber = null
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    expect(formattedPhoneNumber).toEqual(phoneNumber)
  })
})
