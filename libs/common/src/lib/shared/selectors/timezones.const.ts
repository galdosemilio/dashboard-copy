import { TranslatedOption } from '@coachcare/common/shared/interfaces'

export interface TimezoneItem extends TranslatedOption {
  viewValue: {
    [viewValue: string]: string
  }
  value: string
}

export const TIMEZONES: Array<TimezoneItem> = [
  {
    value: 'America/St_Johns',
    viewValue: {
      en: 'Newfoundland',
      es: 'Terranova'
    }
  },
  {
    value: 'America/Halifax',
    viewValue: {
      en: 'Atlantic Time (Canada)',
      es: 'Hora del Atlántico (Canadá)'
    }
  },
  {
    value: 'America/New_York',
    viewValue: {
      en: 'Eastern Time (US & Canada)',
      es: 'Hora del Este (EE.UU. y Canadá)'
    }
  },
  {
    value: 'America/Indiana/Indianapolis',
    viewValue: {
      en: 'Indiana (East)',
      es: 'Indiana (Este)'
    }
  },
  {
    value: 'America/Chicago',
    viewValue: {
      en: 'Central Time (US & Canada)',
      es: 'Hora Central (EE.UU. y Canadá)'
    }
  },
  {
    value: 'America/Regina',
    viewValue: {
      en: 'Saskatchewan',
      es: 'Saskatchewan'
    }
  },
  {
    value: 'America/Denver',
    viewValue: {
      en: 'Mountain Time (US & Canada)',
      es: 'Hora de la Montaña (EE.UU. y Canadá)'
    }
  },
  {
    value: 'America/Phoenix',
    viewValue: {
      en: 'Arizona',
      es: 'Arizona'
    }
  },
  {
    value: 'America/Los_Angeles',
    viewValue: {
      en: 'Pacific Time (US & Canada)',
      es: 'Hora del Pacífico (EE.UU. y Canadá)'
    }
  },
  {
    value: 'America/Juneau',
    viewValue: {
      en: 'Alaska',
      es: 'Alaska'
    }
  },
  {
    value: 'Pacific/Honolulu',
    viewValue: {
      en: 'Hawaii',
      es: 'Hawái'
    }
  },
  {
    value: 'Pacific/Pago_Pago',
    viewValue: {
      en: '-11:00 American Samoa',
      es: '-11:00 Samoa Estadounidense'
    }
  },
  {
    value: 'Pacific/Midway',
    viewValue: {
      en: '-11:00 International Date Line West',
      es: '-11:00 Línea Internacional de Cambio de Fecha Occidental'
    }
  },
  {
    value: 'Pacific/Midway',
    viewValue: {
      en: '-11:00 Midway Island',
      es: '-11:00 Islas Midway'
    }
  },
  {
    value: 'Pacific/Apia',
    viewValue: {
      en: '-11:00 Samoa',
      es: '-11:00 Samoa'
    }
  },
  {
    value: 'America/Tijuana',
    viewValue: {
      en: '-08:00 Tijuana',
      es: '-08:00 Tijuana'
    }
  },
  {
    value: 'America/Chihuahua',
    viewValue: {
      en: '-07:00 Chihuahua',
      es: '-07:00 Chihuahua'
    }
  },
  {
    value: 'America/Mazatlan',
    viewValue: {
      en: '-07:00 Mazatlan',
      es: '-07:00 Mazatlán'
    }
  },
  {
    value: 'America/Guatemala',
    viewValue: {
      en: '-06:00 Central America',
      es: '-06:00 América Central'
    }
  },
  {
    value: 'America/Mexico_City',
    viewValue: {
      en: '-06:00 Guadalajara',
      es: '-06:00 Guadalajara'
    }
  },
  {
    value: 'America/Mexico_City',
    viewValue: {
      en: '-06:00 Mexico City',
      es: '-06:00 Ciudad de México'
    }
  },
  {
    value: 'America/Monterrey',
    viewValue: {
      en: '-06:00 Monterrey',
      es: '-06:00 Monterrey'
    }
  },
  {
    value: 'America/Bogota',
    viewValue: {
      en: '-05:00 Bogota',
      es: '-05:00 Bogotá'
    }
  },
  {
    value: 'America/Lima',
    viewValue: {
      en: '-05:00 Lima',
      es: '-05:00 Lima'
    }
  },
  {
    value: 'America/Lima',
    viewValue: {
      en: '-05:00 Quito',
      es: '-05:00 Quito'
    }
  },
  {
    value: 'America/Caracas',
    viewValue: {
      en: '-04:30 Caracas',
      es: '-04:30 Caracas'
    }
  },
  {
    value: 'America/Guyana',
    viewValue: {
      en: '-04:00 Georgetown',
      es: '-04:00 Georgetown'
    }
  },
  {
    value: 'America/La_Paz',
    viewValue: {
      en: '-04:00 La Paz',
      es: '-04:00 La Paz'
    }
  },
  {
    value: 'America/Sao_Paulo',
    viewValue: {
      en: '-03:00 Brasilia',
      es: '-03:00 Brasilia'
    }
  },
  {
    value: 'America/Argentina/Buenos_Aires',
    viewValue: {
      en: '-03:00 Buenos Aires',
      es: '-03:00 Buenos Aires'
    }
  },
  {
    value: 'America/Godthab',
    viewValue: {
      en: '-03:00 Greenland',
      es: '-03:00 Groenlandia'
    }
  },
  {
    value: 'America/Montevideo',
    viewValue: {
      en: '-03:00 Montevideo',
      es: '-03:00 Montevideo'
    }
  },
  {
    value: 'America/Santiago',
    viewValue: {
      en: '-03:00 Santiago',
      es: '-03:00 Santiago'
    }
  },
  {
    value: 'Atlantic/South_Georgia',
    viewValue: {
      en: '-02:00 Mid-Atlantic',
      es: '-02:00 Atlántico Central'
    }
  },
  {
    value: 'Atlantic/Azores',
    viewValue: {
      en: '-01:00 Azores',
      es: '-01:00 Azores'
    }
  },
  {
    value: 'Atlantic/Cape_Verde',
    viewValue: {
      en: '-01:00 Cape Verde Is.',
      es: '-01:00 Islas de Cabo Verde'
    }
  },
  {
    value: 'Africa/Casablanca',
    viewValue: {
      en: '+00:00 Casablanca',
      es: '+00:00 Casablanca'
    }
  },
  {
    value: 'Europe/Dublin',
    viewValue: {
      en: '+00:00 Dublin',
      es: '+00:00 Dublín'
    }
  },
  {
    value: 'Europe/London',
    viewValue: {
      en: '+00:00 Edinburgh',
      es: '+00:00 Edimburgo'
    }
  },
  {
    value: 'Europe/Lisbon',
    viewValue: {
      en: '+00:00 Lisbon',
      es: '+00:00 Lisboa'
    }
  },
  {
    value: 'Europe/London',
    viewValue: {
      en: '+00:00 London',
      es: '+00:00 Londres'
    }
  },
  {
    value: 'Africa/Monrovia',
    viewValue: {
      en: '+00:00 Monrovia',
      es: '+00:00 Monrovia'
    }
  },
  {
    value: 'Etc/UTC',
    viewValue: {
      en: '+00:00 UTC',
      es: '+00:00 UTC'
    }
  },
  {
    value: 'Europe/Amsterdam',
    viewValue: {
      en: '+01:00 Amsterdam',
      es: '+01:00 Ámsterdam'
    }
  },
  {
    value: 'Europe/Belgrade',
    viewValue: {
      en: '+01:00 Belgrade',
      es: '+01:00 Belgrado'
    }
  },
  {
    value: 'Europe/Berlin',
    viewValue: {
      en: '+01:00 Berlin',
      es: '+01:00 Berlín'
    }
  },
  {
    value: 'Europe/Berlin',
    viewValue: {
      en: '+01:00 Bern',
      es: '+01:00 Berna'
    }
  },
  {
    value: 'Europe/Bratislava',
    viewValue: {
      en: '+01:00 Bratislava',
      es: '+01:00 Bratislava'
    }
  },
  {
    value: 'Europe/Brussels',
    viewValue: {
      en: '+01:00 Brussels',
      es: '+01:00 Bruselas'
    }
  },
  {
    value: 'Europe/Budapest',
    viewValue: {
      en: '+01:00 Budapest',
      es: '+01:00 Budapest'
    }
  },
  {
    value: 'Europe/Copenhagen',
    viewValue: {
      en: '+01:00 Copenhagen',
      es: '+01:00 Copenhague'
    }
  },
  {
    value: 'Europe/Ljubljana',
    viewValue: {
      en: '+01:00 Ljubljana',
      es: '+01:00 Liubliana'
    }
  },
  {
    value: 'Europe/Madrid',
    viewValue: {
      en: '+01:00 Madrid',
      es: '+01:00 Madrid'
    }
  },
  {
    value: 'Europe/Paris',
    viewValue: {
      en: '+01:00 Paris',
      es: '+01:00 París'
    }
  },
  {
    value: 'Europe/Prague',
    viewValue: {
      en: '+01:00 Prague',
      es: '+01:00 Praga'
    }
  },
  {
    value: 'Europe/Rome',
    viewValue: {
      en: '+01:00 Rome',
      es: '+01:00 Roma'
    }
  },
  {
    value: 'Europe/Sarajevo',
    viewValue: {
      en: '+01:00 Sarajevo',
      es: '+01:00 Sarajevo'
    }
  },
  {
    value: 'Europe/Skopje',
    viewValue: {
      en: '+01:00 Skopje',
      es: '+01:00 Skopie'
    }
  },
  {
    value: 'Europe/Stockholm',
    viewValue: {
      en: '+01:00 Stockholm',
      es: '+01:00 Estocolmo'
    }
  },
  {
    value: 'Europe/Vienna',
    viewValue: {
      en: '+01:00 Vienna',
      es: '+01:00 Viena'
    }
  },
  {
    value: 'Europe/Warsaw',
    viewValue: {
      en: '+01:00 Warsaw',
      es: '+01:00 Varsovia'
    }
  },
  {
    value: 'Africa/Algiers',
    viewValue: {
      en: '+01:00 West Central Africa',
      es: '+01:00 Africa Central Occidental'
    }
  },
  {
    value: 'Europe/Zagreb',
    viewValue: {
      en: '+01:00 Zagreb',
      es: '+01:00 Zagreb'
    }
  },
  {
    value: 'Europe/Athens',
    viewValue: {
      en: '+02:00 Athens',
      es: '+02:00 Atenas'
    }
  },
  {
    value: 'Europe/Bucharest',
    viewValue: {
      en: '+02:00 Bucharest',
      es: '+02:00 Bucarest'
    }
  },
  {
    value: 'Africa/Cairo',
    viewValue: {
      en: '+02:00 Cairo',
      es: '+02:00 El Cairo'
    }
  },
  {
    value: 'Africa/Harare',
    viewValue: {
      en: '+02:00 Harare',
      es: '+02:00 Harare'
    }
  },
  {
    value: 'Europe/Helsinki',
    viewValue: {
      en: '+02:00 Helsinki',
      es: '+02:00 Helsinki'
    }
  },
  {
    value: 'Europe/Istanbul',
    viewValue: {
      en: '+02:00 Istanbul',
      es: '+02:00 Estambul'
    }
  },
  {
    value: 'Asia/Jerusalem',
    viewValue: {
      en: '+02:00 Jerusalem',
      es: '+02:00 Jerusalén'
    }
  },
  {
    value: 'Europe/Kaliningrad',
    viewValue: {
      en: '+02:00 Kaliningrad',
      es: '+02:00 Kaliningrado'
    }
  },
  {
    value: 'Europe/Kiev',
    viewValue: {
      en: '+02:00 Kyiv',
      es: '+02:00 Kiev'
    }
  },
  {
    value: 'Africa/Johannesburg',
    viewValue: {
      en: '+02:00 Pretoria',
      es: '+02:00 Pretoria'
    }
  },
  {
    value: 'Europe/Riga',
    viewValue: {
      en: '+02:00 Riga',
      es: '+02:00 Riga'
    }
  },
  {
    value: 'Europe/Sofia',
    viewValue: {
      en: '+02:00 Sofia',
      es: '+02:00 Sofía'
    }
  },
  {
    value: 'Europe/Tallinn',
    viewValue: {
      en: '+02:00 Tallinn',
      es: '+02:00 Tallin'
    }
  },
  {
    value: 'Europe/Vilnius',
    viewValue: {
      en: '+02:00 Vilnius',
      es: '+02:00 Vilna'
    }
  },
  {
    value: 'Asia/Baghdad',
    viewValue: {
      en: '+03:00 Baghdad',
      es: '+03:00 Bagdad'
    }
  },
  {
    value: 'Asia/Kuwait',
    viewValue: {
      en: '+03:00 Kuwait',
      es: '+03:00 Kuwait'
    }
  },
  {
    value: 'Europe/Minsk',
    viewValue: {
      en: '+03:00 Minsk',
      es: '+03:00 Minsk'
    }
  },
  {
    value: 'Europe/Moscow',
    viewValue: {
      en: '+03:00 Moscow',
      es: '+03:00 Moscú'
    }
  },
  {
    value: 'Africa/Nairobi',
    viewValue: {
      en: '+03:00 Nairobi',
      es: '+03:00 Nairobi'
    }
  },
  {
    value: 'Asia/Riyadh',
    viewValue: {
      en: '+03:00 Riyadh',
      es: '+03:00 Riad'
    }
  },
  {
    value: 'Europe/Moscow',
    viewValue: {
      en: '+03:00 St. Petersburg',
      es: '+03:00 San Petersburgo'
    }
  },
  {
    value: 'Europe/Volgograd',
    viewValue: {
      en: '+03:00 Volgograd',
      es: '+03:00 Volgogrado'
    }
  },
  {
    value: 'Asia/Tehran',
    viewValue: {
      en: '+03:30 Tehran',
      es: '+03:30 Teherán'
    }
  },
  {
    value: 'Asia/Muscat',
    viewValue: {
      en: '+04:00 Abu Dhabi',
      es: '+04:00 Abu Dabi'
    }
  },
  {
    value: 'Asia/Baku',
    viewValue: {
      en: '+04:00 Baku',
      es: '+04:00 Bakú'
    }
  },
  {
    value: 'Asia/Muscat',
    viewValue: {
      en: '+04:00 Muscat',
      es: '+04:00 Mascate'
    }
  },
  {
    value: 'Europe/Samara',
    viewValue: {
      en: '+04:00 Samara',
      es: '+04:00 Samara'
    }
  },
  {
    value: 'Asia/Tbilisi',
    viewValue: {
      en: '+04:00 Tbilisi',
      es: '+04:00 Tiflis'
    }
  },
  {
    value: 'Asia/Yerevan',
    viewValue: {
      en: '+04:00 Yerevan',
      es: '+04:00 Ereván'
    }
  },
  {
    value: 'Asia/Kabul',
    viewValue: {
      en: '+04:30 Kabul',
      es: '+04:30 Kabul'
    }
  },
  {
    value: 'Asia/Yekaterinburg',
    viewValue: {
      en: '+05:00 Ekaterinburg',
      es: '+05:00 Ekaterimburgo'
    }
  },
  {
    value: 'Asia/Karachi',
    viewValue: {
      en: '+05:00 Islamabad',
      es: '+05:00 Islamabad'
    }
  },
  {
    value: 'Asia/Karachi',
    viewValue: {
      en: '+05:00 Karachi',
      es: '+05:00 Karachi'
    }
  },
  {
    value: 'Asia/Tashkent',
    viewValue: {
      en: '+05:00 Tashkent',
      es: '+05:00 Taskent'
    }
  },
  {
    value: 'Asia/Kolkata',
    viewValue: {
      en: '+05:30 Chennai',
      es: '+05:30 Chennai'
    }
  },
  {
    value: 'Asia/Kolkata',
    viewValue: {
      en: '+05:30 Kolkata',
      es: '+05:30 Calcuta'
    }
  },
  {
    value: 'Asia/Kolkata',
    viewValue: {
      en: '+05:30 Mumbai',
      es: '+05:30 Bombay'
    }
  },
  {
    value: 'Asia/Kolkata',
    viewValue: {
      en: '+05:30 New Delhi',
      es: '+05:30 Nueva Delhi'
    }
  },
  {
    value: 'Asia/Colombo',
    viewValue: {
      en: '+05:30 Sri Jayawardenepura',
      es: '+05:30 Sri Jayawardenapura'
    }
  },
  {
    value: 'Asia/Kathmandu',
    viewValue: {
      en: '+05:45 Kathmandu',
      es: '+05:45 Katmandú'
    }
  },
  {
    value: 'Asia/Almaty',
    viewValue: {
      en: '+06:00 Almaty',
      es: '+06:00 Almatý'
    }
  },
  {
    value: 'Asia/Dhaka',
    viewValue: {
      en: '+06:00 Astana',
      es: '+06:00 Astaná'
    }
  },
  {
    value: 'Asia/Dhaka',
    viewValue: {
      en: '+06:00 Dhaka',
      es: '+06:00 Daca'
    }
  },
  {
    value: 'Asia/Novosibirsk',
    viewValue: {
      en: '+06:00 Novosibirsk',
      es: '+06:00 Novosibirsk'
    }
  },
  {
    value: 'Asia/Omsk',
    viewValue: {
      en: '+06:00 Omsk',
      es: '+06:00 Omsk'
    }
  },
  {
    value: 'Asia/Urumqi',
    viewValue: {
      en: '+06:00 Urumqi',
      es: '+06:00 Urumchi'
    }
  },
  {
    value: 'Asia/Rangoon',
    viewValue: {
      en: '+06:30 Rangoon',
      es: '+06:30 Rangún'
    }
  },
  {
    value: 'Asia/Bangkok',
    viewValue: {
      en: '+07:00 Bangkok',
      es: '+07:00 Bangkok'
    }
  },
  {
    value: 'Asia/Bangkok',
    viewValue: {
      en: '+07:00 Hanoi',
      es: '+07:00 Hanói'
    }
  },
  {
    value: 'Asia/Jakarta',
    viewValue: {
      en: '+07:00 Jakarta',
      es: '+07:00 Yakarta'
    }
  },
  {
    value: 'Asia/Krasnoyarsk',
    viewValue: {
      en: '+07:00 Krasnoyarsk',
      es: '+07:00 Krasnoyarsk'
    }
  },
  {
    value: 'Asia/Shanghai',
    viewValue: {
      en: '+08:00 Beijing',
      es: '+08:00 Pekín'
    }
  },
  {
    value: 'Asia/Chongqing',
    viewValue: {
      en: '+08:00 Chongqing',
      es: '+08:00 Chongqing'
    }
  },
  {
    value: 'Asia/Hong_Kong',
    viewValue: {
      en: '+08:00 Hong Kong',
      es: '+08:00 Hong Kong'
    }
  },
  {
    value: 'Asia/Irkutsk',
    viewValue: {
      en: '+08:00 Irkutsk',
      es: '+08:00 Irkutsk'
    }
  },
  {
    value: 'Asia/Kuala_Lumpur',
    viewValue: {
      en: '+08:00 Kuala Lumpur',
      es: '+08:00 Kuala Lumpur'
    }
  },
  {
    value: 'Australia/Perth',
    viewValue: {
      en: '+08:00 Perth',
      es: '+08:00 Perth'
    }
  },
  {
    value: 'Asia/Singapore',
    viewValue: {
      en: '+08:00 Singapore',
      es: '+08:00 Singapur'
    }
  },
  {
    value: 'Asia/Taipei',
    viewValue: {
      en: '+08:00 Taipei',
      es: '+08:00 Taipéi'
    }
  },
  {
    value: 'Asia/Ulaanbaatar',
    viewValue: {
      en: '+08:00 Ulaanbaatar',
      es: '+08:00 Ulán Bator'
    }
  },
  {
    value: 'Asia/Tokyo',
    viewValue: {
      en: '+09:00 Osaka',
      es: '+09:00 Osaka'
    }
  },
  {
    value: 'Asia/Tokyo',
    viewValue: {
      en: '+09:00 Sapporo',
      es: '+09:00 Sapporo'
    }
  },
  {
    value: 'Asia/Seoul',
    viewValue: {
      en: '+09:00 Seoul',
      es: '+09:00 Seúl'
    }
  },
  {
    value: 'Asia/Tokyo',
    viewValue: {
      en: '+09:00 Tokyo',
      es: '+09:00 Tokio'
    }
  },
  {
    value: 'Asia/Yakutsk',
    viewValue: {
      en: '+09:00 Yakutsk',
      es: '+09:00 Yakutsk'
    }
  },
  {
    value: 'Australia/Adelaide',
    viewValue: {
      en: '+09:30 Adelaide',
      es: '+09:30 Adelaida'
    }
  },
  {
    value: 'Australia/Darwin',
    viewValue: {
      en: '+09:30 Darwin',
      es: '+09:30 Darwin'
    }
  },
  {
    value: 'Australia/Brisbane',
    viewValue: {
      en: '+10:00 Brisbane',
      es: '+10:00 Brisbane'
    }
  },
  {
    value: 'Australia/Melbourne',
    viewValue: {
      en: '+10:00 Canberra',
      es: '+10:00 Canberra'
    }
  },
  {
    value: 'Pacific/Guam',
    viewValue: {
      en: '+10:00 Guam',
      es: '+10:00 Guam'
    }
  },
  {
    value: 'Australia/Hobart',
    viewValue: {
      en: '+10:00 Hobart',
      es: '+10:00 Hobart'
    }
  },
  {
    value: 'Asia/Magadan',
    viewValue: {
      en: '+10:00 Magadan',
      es: '+10:00 Magadán'
    }
  },
  {
    value: 'Australia/Melbourne',
    viewValue: {
      en: '+10:00 Melbourne',
      es: '+10:00 Melbourne'
    }
  },
  {
    value: 'Pacific/Port_Moresby',
    viewValue: {
      en: '+10:00 Port Moresby',
      es: '+10:00 Puerto Moresby'
    }
  },
  {
    value: 'Australia/Sydney',
    viewValue: {
      en: '+10:00 Sydney',
      es: '+10:00 Sídney'
    }
  },
  {
    value: 'Asia/Vladivostok',
    viewValue: {
      en: '+10:00 Vladivostok',
      es: '+10:00 Vladivostok'
    }
  },
  {
    value: 'Pacific/Noumea',
    viewValue: {
      en: '+11:00 New Caledonia',
      es: '+11:00 Nueva Caledonia'
    }
  },
  {
    value: 'Pacific/Guadalcanal',
    viewValue: {
      en: '+11:00 Solomon Is.',
      es: '+11:00 Islas Salomón'
    }
  },
  {
    value: 'Asia/Srednekolymsk',
    viewValue: {
      en: '+11:00 Srednekolymsk',
      es: '+11:00 Srednekolimsk'
    }
  },
  {
    value: 'Pacific/Auckland',
    viewValue: {
      en: '+12:00 Auckland',
      es: '+12:00 Auckland'
    }
  },
  {
    value: 'Pacific/Fiji',
    viewValue: {
      en: '+12:00 Fiji',
      es: '+12:00 Fiyi'
    }
  },
  {
    value: 'Asia/Kamchatka',
    viewValue: {
      en: '+12:00 Kamchatka',
      es: '+12:00 Kamchatka'
    }
  },
  {
    value: 'Pacific/Majuro',
    viewValue: {
      en: '+12:00 Marshall Is.',
      es: '+12:00 Islas Marshall'
    }
  },
  {
    value: 'Pacific/Auckland',
    viewValue: {
      en: '+12:00 Wellington',
      es: '+12:00 Wellington'
    }
  },
  {
    value: 'Pacific/Chatham',
    viewValue: {
      en: '+12:45 Chatham Is.',
      es: '+12:45 Islas Chatham'
    }
  },
  {
    value: 'Pacific/Tongatapu',
    viewValue: {
      en: "+13:00 Nuku'alofa",
      es: '+13:00 Nukualofa'
    }
  },
  {
    value: 'Pacific/Fakaofo',
    viewValue: {
      en: '+13:00 Tokelau Is.',
      es: '+13:00 Islas Tokelau'
    }
  }
]
