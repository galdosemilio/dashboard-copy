import { TranslatedOption } from '@coachcare/common/shared/interfaces'

export interface StateSegment extends TranslatedOption {
  viewValue: {
    [lang: string]: string
  }
  value: string
  country?: string // default: US
}

export const STATES: Array<StateSegment> = [
  // United States
  {
    viewValue: { en: 'Alabama', es: 'Alabama' },
    value: 'AL',
    country: 'US'
  },
  {
    viewValue: { en: 'Alaska', es: 'Alaska' },
    value: 'AK',
    country: 'US'
  },
  {
    viewValue: { en: 'American Samoa', es: 'Samoa Americana' },
    value: 'AS',
    country: 'US'
  },
  {
    viewValue: { en: 'Arizona', es: 'Arizona' },
    value: 'AZ',
    country: 'US'
  },
  {
    viewValue: { en: 'Arkansas', es: 'Arkansas' },
    value: 'AR',
    country: 'US'
  },
  {
    viewValue: { en: 'California', es: 'California' },
    value: 'CA',
    country: 'US'
  },
  {
    viewValue: { en: 'Colorado', es: 'Colorado' },
    value: 'CO',
    country: 'US'
  },
  {
    viewValue: { en: 'Connecticut', es: 'Connecticut' },
    value: 'CT',
    country: 'US'
  },
  {
    viewValue: { en: 'Delaware', es: 'Delaware' },
    value: 'DE',
    country: 'US'
  },
  {
    viewValue: { en: 'District Of Columbia', es: 'Distrito de Columbia' },
    value: 'DC',
    country: 'US'
  },
  {
    viewValue: {
      en: 'Federated States Of Micronesia',
      es: 'Estados Federados de Micronesia'
    },
    value: 'FM',
    country: 'US'
  },
  {
    viewValue: { en: 'Florida', es: 'Florida' },
    value: 'FL',
    country: 'US'
  },
  {
    viewValue: { en: 'Georgia', es: 'Georgia' },
    value: 'GA',
    country: 'US'
  },
  {
    viewValue: { en: 'Guam', es: 'Guam' },
    value: 'GU',
    country: 'US'
  },
  {
    viewValue: { en: 'Hawaii', es: 'Hawai' },
    value: 'HI',
    country: 'US'
  },
  {
    viewValue: { en: 'Idaho', es: 'Idaho' },
    value: 'ID',
    country: 'US'
  },
  {
    viewValue: { en: 'Illinois', es: 'Illinois' },
    value: 'IL',
    country: 'US'
  },
  {
    viewValue: { en: 'Indiana', es: 'Indiana' },
    value: 'IN',
    country: 'US'
  },
  {
    viewValue: { en: 'Iowa', es: 'Iowa' },
    value: 'IA',
    country: 'US'
  },
  {
    viewValue: { en: 'Kansas', es: 'Kansas' },
    value: 'KS',
    country: 'US'
  },
  {
    viewValue: { en: 'Kentucky', es: 'Kentucky' },
    value: 'KY',
    country: 'US'
  },
  {
    viewValue: { en: 'Louisiana', es: 'Luisiana' },
    value: 'LA',
    country: 'US'
  },
  {
    viewValue: { en: 'Maine', es: 'Maine' },
    value: 'ME',
    country: 'US'
  },
  {
    viewValue: { en: 'Marshall Islands', es: 'Islas Marshall' },
    value: 'MH',
    country: 'US'
  },
  {
    viewValue: { en: 'Maryland', es: 'Maryland' },
    value: 'MD',
    country: 'US'
  },
  {
    viewValue: { en: 'Massachusetts', es: 'Massachusetts' },
    value: 'MA',
    country: 'US'
  },
  {
    viewValue: { en: 'Michigan', es: 'Michigan' },
    value: 'MI',
    country: 'US'
  },
  {
    viewValue: { en: 'Minnesota', es: 'Minnesota' },
    value: 'MN',
    country: 'US'
  },
  {
    viewValue: { en: 'Mississippi', es: 'Mississippi' },
    value: 'MS',
    country: 'US'
  },
  {
    viewValue: { en: 'Missouri', es: 'Missouri' },
    value: 'MO',
    country: 'US'
  },
  {
    viewValue: { en: 'Montana', es: 'Montana' },
    value: 'MT',
    country: 'US'
  },
  {
    viewValue: { en: 'Nebraska', es: 'Nebraska' },
    value: 'NE',
    country: 'US'
  },
  {
    viewValue: { en: 'Nevada', es: 'Nevada' },
    value: 'NV',
    country: 'US'
  },
  {
    viewValue: { en: 'New Hampshire', es: 'New Hampshire' },
    value: 'NH',
    country: 'US'
  },
  {
    viewValue: { en: 'New Jersey', es: 'New Jersey' },
    value: 'NJ',
    country: 'US'
  },
  {
    viewValue: { en: 'New Mexico', es: 'Nuevo Mexico' },
    value: 'NM',
    country: 'US'
  },
  {
    viewValue: { en: 'New York', es: 'Nueva York' },
    value: 'NY',
    country: 'US'
  },
  {
    viewValue: { en: 'North Carolina', es: 'Carolina del Norte' },
    value: 'NC',
    country: 'US'
  },
  {
    viewValue: { en: 'North Dakota', es: 'Dakota del Norte' },
    value: 'ND',
    country: 'US'
  },
  {
    viewValue: {
      en: 'Northern Mariana Islands',
      es: 'Islas Marianas del Norte'
    },
    value: 'MP',
    country: 'US'
  },
  {
    viewValue: { en: 'Ohio', es: 'Ohio' },
    value: 'OH',
    country: 'US'
  },
  {
    viewValue: { en: 'Oklahoma', es: 'Oklahoma' },
    value: 'OK',
    country: 'US'
  },
  {
    viewValue: { en: 'Oregon', es: 'Oregon' },
    value: 'OR',
    country: 'US'
  },
  {
    viewValue: { en: 'Palau', es: 'Palau' },
    value: 'PW',
    country: 'US'
  },
  {
    viewValue: { en: 'Pennsylvania', es: 'Pennsylvania' },
    value: 'PA',
    country: 'US'
  },
  {
    viewValue: { en: 'Puerto Rico', es: 'Puerto Rico' },
    value: 'PR',
    country: 'US'
  },
  {
    viewValue: { en: 'Rhode Island', es: 'Rhode Island' },
    value: 'RI',
    country: 'US'
  },
  {
    viewValue: { en: 'South Carolina', es: 'Carolina del Sur' },
    value: 'SC',
    country: 'US'
  },
  {
    viewValue: { en: 'South Dakota', es: 'Dakota del Sur' },
    value: 'SD',
    country: 'US'
  },
  {
    viewValue: { en: 'Tennessee', es: 'Tennessee' },
    value: 'TN',
    country: 'US'
  },
  {
    viewValue: { en: 'Texas', es: 'Texas' },
    value: 'TX',
    country: 'US'
  },
  {
    viewValue: { en: 'Utah', es: 'Utah' },
    value: 'UT',
    country: 'US'
  },
  {
    viewValue: { en: 'Vermont', es: 'Vermont' },
    value: 'VT',
    country: 'US'
  },
  {
    viewValue: { en: 'Virgin Islands', es: 'Islas Virgenes' },
    value: 'VI',
    country: 'US'
  },
  {
    viewValue: { en: 'Virginia', es: 'Virginia' },
    value: 'VA',
    country: 'US'
  },
  {
    viewValue: { en: 'Washington', es: 'Washington' },
    value: 'WA',
    country: 'US'
  },
  {
    viewValue: { en: 'West Virginia', es: 'Virginia del Oeste' },
    value: 'WV',
    country: 'US'
  },
  {
    viewValue: { en: 'Wisconsin', es: 'Wisconsin' },
    value: 'WI',
    country: 'US'
  },
  {
    viewValue: { en: 'Wyoming', es: 'Wyoming' },
    value: 'WY',
    country: 'US'
  },

  // Canada
  {
    viewValue: { en: 'British Columbia', es: 'Columbia Británica' },
    value: 'BC',
    country: 'CA'
  },
  {
    viewValue: { en: 'Ontario', es: 'Ontario' },
    value: 'ON',
    country: 'CA'
  },
  {
    viewValue: {
      en: 'Newfoundland and Labrador',
      es: 'Newfoundland y Labrador'
    },
    value: 'NL',
    country: 'CA'
  },
  {
    viewValue: { en: 'Nova Scotia', es: 'Nueva Escocia' },
    value: 'NS',
    country: 'CA'
  },
  {
    viewValue: { en: 'Prince Edward Island', es: 'Isla del Príncipe Eduardo' },
    value: 'PE',
    country: 'CA'
  },
  {
    viewValue: { en: 'New Brunswick', es: 'Nuevo Brunswick' },
    value: 'NB',
    country: 'CA'
  },
  {
    viewValue: { en: 'Quebec', es: 'Quebec' },
    value: 'QC',
    country: 'CA'
  },
  {
    viewValue: { en: 'Manitoba', es: 'Manitoba' },
    value: 'MB',
    country: 'CA'
  },
  {
    viewValue: { en: 'Saskatchewan', es: 'Saskatchewan' },
    value: 'SK',
    country: 'CA'
  },
  {
    viewValue: { en: 'Alberta', es: 'Alberta' },
    value: 'AB',
    country: 'CA'
  },
  {
    viewValue: { en: 'Northwest Territories', es: 'Territorios del Noroeste' },
    value: 'NT',
    country: 'CA'
  },
  {
    viewValue: { en: 'Nunavut', es: 'Nunavut' },
    value: 'NU',
    country: 'CA'
  },
  {
    viewValue: { en: 'Yukon Territory', es: 'Territorio Yukon' },
    value: 'YT',
    country: 'CA'
  }
]
