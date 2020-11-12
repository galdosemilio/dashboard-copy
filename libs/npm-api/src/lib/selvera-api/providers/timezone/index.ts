import { TimezoneResponse } from './responses'

/**
 * User authentication and fetching/updating info of authenticated user
 */
class Timezone {
  private timezones: Array<TimezoneResponse> = [
    {
      code: 'America/St_Johns',
      lang: {
        en: 'Newfoundland',
        es: 'Terranova',
        da: 'Newfoundland',
        he: 'ניופאונדלנד',
        ar: 'نيوفاوندلاند',
        pt: 'Terra Nova',
        it: 'Terranova',
        de: 'Neufundland',
        fr: 'Terre-Neuve'
      }
    },
    {
      code: 'America/Halifax',
      lang: {
        en: 'Atlantic Time (Canada)',
        es: 'Hora del Atlántico (Canadá)',
        da: 'Atlanterhavet (Canada)',
        he: 'שעון האוקיינוס   האטלנטי (קנדה)',
        ar: 'توقيت الأطلسي (كندا)',
        pt: 'Hora do Atlântico (Canadá)',
        it: 'Tempo Atlantico (Canada)',
        de: 'Atlantic Time (Canada)',
        fr: "Heure de l'Atlantique (Canada)"
      }
    },
    {
      code: 'America/New_York',
      lang: {
        en: 'Eastern Time (US & Canada)',
        es: 'Hora del Este (EE.UU. y Canadá)',
        da: 'Eastern Time (USA og Canada)',
        he: 'זמן מזרחי (ארה"ב וקנדה)',
        ar: 'التوقيت الشرقي (الولايات المتحدة وكندا)',
        pt: 'Hora do Leste (EUA e Canadá)',
        it: 'Eastern Time (USA e Canada)',
        de: 'Eastern Time (US & Canada)',
        fr: "Heure de l'Est (Etats-Unis et Canada)"
      }
    },
    {
      code: 'America/Indiana/Indianapolis',
      lang: {
        en: 'Indiana (East)',
        es: 'Indiana (Este)',
        da: 'Indiana (øst)',
        he: 'אינדיאנה (מזרח)',
        ar: 'إنديانا (الشرق)',
        pt: 'Indiana (Leste)',
        it: 'Indiana (Est)',
        de: 'Indiana (Ost)',
        fr: 'Indiana (Est)'
      }
    },
    {
      code: 'America/Chicago',
      lang: {
        en: 'Central Time (US & Canada)',
        es: 'Hora Central (EE.UU. y Canadá)',
        da: 'Central Time (USA og Canada)',
        he: 'זמן מרכזי (ארה"ב וקנדה)',
        ar: 'التوقيت المركزي (الولايات المتحدة وكندا)',
        pt: 'Hora Central (EUA e Canadá)',
        it: 'Central Standard Time (USA e Canada)',
        de: 'Central Time (US & Canada)',
        fr: 'Heure centrale (Etats-Unis et Canada)'
      }
    },
    {
      code: 'America/Regina',
      lang: {
        en: 'Saskatchewan',
        es: 'Saskatchewan',
        da: 'Saskatchewan',
        he: "ססקצ 'ואן",
        ar: 'ساسكاتشوان',
        pt: 'Saskatchewan',
        it: 'Saskatchewan',
        de: 'Saskatchewan',
        fr: 'Saskatchewan'
      }
    },
    {
      code: 'America/Denver',
      lang: {
        en: 'Mountain Time (US & Canada)',
        es: 'Hora de la Montaña (EE.UU. y Canadá)',
        da: 'Bjergtid (USA og Canada)',
        he: 'שעון הרים (ארה"ב וקנדה)',
        ar: 'التوقيت الجبلي (الولايات المتحدة وكندا)',
        pt: 'Mountain Time (US & Canada)',
        it: 'Mountain Time (USA e Canada)',
        de: 'Mountain Time (US & Canada)',
        fr: 'Heure Mountain (États-Unis et Canada)'
      }
    },
    {
      code: 'America/Phoenix',
      lang: {
        en: 'Arizona',
        es: 'Arizona',
        da: 'Arizona',
        he: 'אריזונה',
        ar: 'أريزونا',
        pt: 'Arizona',
        it: 'Arizona',
        de: 'Arizona',
        fr: 'Arizona'
      }
    },
    {
      code: 'America/Los_Angeles',
      lang: {
        en: 'Pacific Time (US & Canada)',
        es: 'Hora del Pacífico (EE.UU. y Canadá)',
        da: 'Stillehavstid (USA og Canada)',
        he: 'שעון האוקיינוס   השקט (ארה"ב וקנדה)',
        ar: 'توقيت المحيط الهادي (الولايات المتحدة وكندا)',
        pt: 'Hora do Pacífico (EUA e Canadá)',
        it: 'Ora del Pacifico (USA e Canada)',
        de: 'Pacific Time (US & Canada)',
        fr: 'Heure normale du Pacifique (Etats-Unis et Canada)'
      }
    },
    {
      code: 'America/Juneau',
      lang: {
        en: 'Alaska',
        es: 'Alaska',
        da: 'Alaska',
        he: 'אלסקה',
        ar: 'ألاسكا',
        pt: 'Alasca',
        it: 'Alaska',
        de: 'Alaska',
        fr: 'Alaska'
      }
    },
    {
      code: 'Pacific/Honolulu',
      lang: {
        en: 'Hawaii',
        es: 'Hawái',
        da: 'Hawaii',
        he: 'הוואי',
        ar: 'هاواي',
        pt: 'Havaí',
        it: 'Hawaii',
        de: 'Hawaii',
        fr: 'Hawaii'
      }
    },
    {
      code: 'Pacific/Pago_Pago',
      lang: {
        en: '-11:00 American Samoa',
        es: '-11:00 Samoa Estadounidense',
        da: '-11:00 Amerikanske Samoa',
        he: '-11:00 סמואה האמריקאית',
        ar: '-11:00 ساموا الأمريكية',
        pt: '-11: 00 Samoa Americana',
        it: '-11: 00 Samoa americane',
        de: '-11: 00 Amerikanisch-Samoa',
        fr: '-11: 00 Samoa américaines'
      }
    },
    {
      code: 'Pacific/Midway',
      lang: {
        en: '-11:00 International Date Line West',
        es: '-11:00 Línea Internacional de Cambio de Fecha Occidental',
        da: '-11:00 International Date Line West',
        he: '-11:00 קו זמן בינלאומי מערב',
        ar: '-11:00 International Date Line West',
        pt: '-11: 00 Internacional Data Linha do Oeste',
        it: '-11: 00 Internazionale Data linea West',
        de: '-11: 00 Datumsgrenze West-',
        fr: '-11: 00 International Date Line West'
      }
    },
    {
      code: 'Pacific/Midway',
      lang: {
        en: '-11:00 Midway Island',
        es: '-11:00 Islas Midway',
        da: '-11:00 Midway Island',
        he: '-11:00 מידוויי איילנד',
        ar: '-11:00 جزيرة ميدواي',
        pt: '-11: 00 Midway Ilha',
        it: '-11: 00 Isole Midway',
        de: '-11: 00 Midway-Inseln',
        fr: '-11: 00 île de Midway'
      }
    },
    {
      code: 'Pacific/Apia',
      lang: {
        en: '-11:00 Samoa',
        es: '-11:00 Samoa',
        da: '-11:00 Samoa',
        he: '-11:00 סמואה',
        ar: '-11:00 ساموا',
        pt: '-11: 00 Samoa',
        it: '-11: 00 Samoa',
        de: '-11: 00 Samoa',
        fr: '-11: 00 Samoa'
      }
    },
    {
      code: 'America/Tijuana',
      lang: {
        en: '-08:00 Tijuana',
        es: '-08:00 Tijuana',
        da: '-08:00 Tijuana',
        he: '-08:00 טיחואנה',
        ar: '-08:00 تيجوانا',
        pt: '-08: 00 Tijuana',
        it: '-08: 00 Tijuana',
        de: '-08: 00 Tijuana',
        fr: '-08: 00 Tijuana'
      }
    },
    {
      code: 'America/Chihuahua',
      lang: {
        en: '-07:00 Chihuahua',
        es: '-07:00 Chihuahua',
        da: '-07:00 Chihuahua',
        he: "-07:00 צ'יוואווה",
        ar: '-07:00 شيواوا',
        pt: '-07: 00 Chihuahua',
        it: '-07: 00 Chihuahua',
        de: '-07: 00 Chihuahua',
        fr: '-07: 00 Chihuahua'
      }
    },
    {
      code: 'America/Mazatlan',
      lang: {
        en: '-07:00 Mazatlan',
        es: '-07:00 Mazatlán',
        da: '-07:00 Mazatlan',
        he: '-07:00 מזטלן',
        ar: '-07:00 مازاتلان',
        pt: '-07: 00 Mazatlan',
        it: '-07: 00 Mazatlan',
        de: '-07: 00 Mazatlan',
        fr: '-07: 00 Mazatlan'
      }
    },
    {
      code: 'America/Guatemala',
      lang: {
        en: '-06:00 Central America',
        es: '-06:00 América Central',
        da: '-06:00 Mellemamerika',
        he: '-06:00 מרכז אמריקה',
        ar: '-06:00 أمريكا الوسطى',
        pt: '-06: 00 América Central',
        it: '-06: 00 America Centrale',
        de: '-06: 00 Mittelamerika',
        fr: '-06: 00 Amérique centrale'
      }
    },
    {
      code: 'America/Mexico_City',
      lang: {
        en: '-06:00 Guadalajara',
        es: '-06:00 Guadalajara',
        da: '-06:00 Guadalajara',
        he: "-06:00 גואדלג'ארה",
        ar: '-06:00 غوادالاخارا',
        pt: '-06: 00 Guadalajara',
        it: '-06: 00 Guadalajara',
        de: '-06: 00 Guadalajara',
        fr: '-06: 00 Guadalajara'
      }
    },
    {
      code: 'America/Mexico_City',
      lang: {
        en: '-06:00 Mexico City',
        es: '-06:00 Ciudad de México',
        da: '-06:00 Mexico City',
        he: '-06:00 מקסיקו סיטי',
        ar: '-06:00 مكسيكو سيتي',
        pt: '-06: 00 Cidade do México',
        it: '-06: 00 Città del Messico',
        de: '-06: 00 Mexiko-Stadt',
        fr: '-06: 00 Mexico'
      }
    },
    {
      code: 'America/Monterrey',
      lang: {
        en: '-06:00 Monterrey',
        es: '-06:00 Monterrey',
        da: '-06:00 Monterrey',
        he: '-06:00 מונטריי',
        ar: '-06:00 مونتيري',
        pt: '-06: 00 Monterrey',
        it: '-06: 00 Monterrey',
        de: '-06: 00 Monterrey',
        fr: '-06: 00 Monterrey'
      }
    },
    {
      code: 'America/Bogota',
      lang: {
        en: '-05:00 Bogota',
        es: '-05:00 Bogotá',
        da: '-05:00 Bogota',
        he: '-05:00 בוגוטה',
        ar: '-05:00 بوغوتا',
        pt: '-05: 00 Bogotá',
        it: '-05: 00 Bogota',
        de: '-05: 00 Bogota',
        fr: '-05: 00 Bogota'
      }
    },
    {
      code: 'America/Lima',
      lang: {
        en: '-05:00 Lima',
        es: '-05:00 Lima',
        da: '-05:00 Lima',
        he: '-05:00 לימה',
        ar: '-05:00 ليما',
        pt: '-05: 00 Lima',
        it: '-05: 00 Lima',
        de: '-05: 00 Lima',
        fr: '-05: 00 Lima'
      }
    },
    {
      code: 'America/Lima',
      lang: {
        en: '-05:00 Quito',
        es: '-05:00 Quito',
        da: '-05:00 Quito',
        he: '-05:00 קיטו',
        ar: '-05:00 كويتو',
        pt: '-05: 00 Quito',
        it: '-05: 00 Quito',
        de: '-05: 00 Quito',
        fr: '-05: 00 Quito'
      }
    },
    {
      code: 'America/Caracas',
      lang: {
        en: '-04:30 Caracas',
        es: '-04:30 Caracas',
        da: '-04:30 Caracas',
        he: '-04:30 קראקס',
        ar: '-04:30 كراكاس',
        pt: '-04: 30 Caracas',
        it: '-04: 30 Caracas',
        de: '-04: 30 Caracas',
        fr: '-04: 30 Caracas'
      }
    },
    {
      code: 'America/Guyana',
      lang: {
        en: '-04:00 Georgetown',
        es: '-04:00 Georgetown',
        da: '-04:00 Georgetown',
        he: "-04:00 ג'ורג'טאון",
        ar: '-04:00 جورج تاون',
        pt: '-04: 00 Georgetown',
        it: '-04: 00 Georgetown',
        de: '-04: 00 Georgetown',
        fr: '-04: 00 Georgetown'
      }
    },
    {
      code: 'America/La_Paz',
      lang: {
        en: '-04:00 La Paz',
        es: '-04:00 La Paz',
        da: '-04:00 La Paz',
        he: '-04:00 לה פאס',
        ar: '-04:00 لاباز',
        pt: '-04: 00 La Paz',
        it: '-04: 00 La Paz',
        de: '-04: 00 La Paz',
        fr: '-04: 00 La Paz'
      }
    },
    {
      code: 'America/Sao_Paulo',
      lang: {
        en: '-03:00 Brasilia',
        es: '-03:00 Brasilia',
        da: '-03:00 Brasilia',
        he: '-03:00 ברזיליה',
        ar: '-03:00 برازيليا',
        pt: '-03: 00 Brasília',
        it: '-03: 00 Brasilia',
        de: '-03: 00 Brasilia',
        fr: '-03: 00 Brasilia'
      }
    },
    {
      code: 'America/Argentina/Buenos_Aires',
      lang: {
        en: '-03:00 Buenos Aires',
        es: '-03:00 Buenos Aires',
        da: '-03:00 Buenos Aires',
        he: '-03:00 בואנוס איירס',
        ar: '-03:00 بوينس آيرس',
        pt: '-03: 00 Buenos Aires',
        it: '-03: 00 Buenos Aires',
        de: '-03: 00 Buenos Aires',
        fr: '-03: 00 Buenos Aires'
      }
    },
    {
      code: 'America/Godthab',
      lang: {
        en: '-03:00 Greenland',
        es: '-03:00 Groenlandia',
        da: '-03:00 Grønland',
        he: '-03:00 גרינלנד',
        ar: '-03:00 غرينلاند',
        pt: '-03: 00 Greenland',
        it: '-03: 00 Greenland',
        de: '-03: 00 Grönland',
        fr: '-03: 00 Groenland'
      }
    },
    {
      code: 'America/Montevideo',
      lang: {
        en: '-03:00 Montevideo',
        es: '-03:00 Montevideo',
        da: '-03:00 Montevideo',
        he: '-03:00 מונטווידאו',
        ar: '-03:00 مونتيفيديو',
        pt: '-03: 00 Montevideo',
        it: '-03: 00 Montevideo',
        de: '-03: 00 Montevideo',
        fr: '-03: 00 Montevideo'
      }
    },
    {
      code: 'America/Santiago',
      lang: {
        en: '-03:00 Santiago',
        es: '-03:00 Santiago',
        da: '-03:00 Santiago',
        he: '-03:00 סנטיאגו',
        ar: '-03:00 سانتياغو',
        pt: '-03: 00 Santiago',
        it: '-03: 00 Santiago',
        de: '-03: 00 Santiago',
        fr: '-03: 00 Santiago'
      }
    },
    {
      code: 'Atlantic/South_Georgia',
      lang: {
        en: '-02:00 Mid-Atlantic',
        es: '-02:00 Atlántico Central',
        da: '-02:00 Midtatlantiske',
        he: '-02:00 אמצע האוקיינוס   האטלנטי',
        ar: '-02:00 منتصف المحيط الأطلسي',
        pt: '-02: 00 Atlântico',
        it: '-02: 00 Mid-Atlantic',
        de: '-02: 00 Mid-Atlantic',
        fr: '-02: 00 Mid-Atlantic'
      }
    },
    {
      code: 'Atlantic/Azores',
      lang: {
        en: '-01:00 Azores',
        es: '-01:00 Azores',
        da: '-01:00 Azorerne',
        he: '-01:00 האיים האזוריים',
        ar: '-01:  00 أزور',
        pt: '-01:',
        it: '-01:',
        de: '-01:',
        fr: '-01:'
      }
    },
    {
      code: 'Atlantic/Cape_Verde',
      lang: {
        en: '-01:00 Cape Verde Is.',
        es: '-01:00 Islas de Cabo Verde',
        da: '-01:00 Cape Verde Island',
        he: '-01:00 האי כף ורדה',
        ar: '-01:  00 جزيرة الرأس الأخضر',
        pt: '-01:',
        it: '-01:',
        de: '-01:',
        fr: '-01:'
      }
    },
    {
      code: 'Africa/Casablanca',
      lang: {
        en: '+00:00 Casablanca',
        es: '+00:00 Casablanca',
        da: '+00:00 Casablanca',
        he: '+00:00 קזבלנקה',
        ar: '+00:00 الدار البيضاء',
        pt: '+00: 00 Casablanca',
        it: '+00: 00 Casablanca',
        de: '+00: 00 Casablanca',
        fr: '+00: 00 Casablanca'
      }
    },
    {
      code: 'Europe/Dublin',
      lang: {
        en: '+00:00 Dublin',
        es: '+00:00 Dublín',
        da: '+00:00 Dublin',
        he: '+00:00 דבלין',
        ar: '+00:00 دبلن',
        pt: '+00: 00 Dublin',
        it: '+00: 00 Dublin',
        de: '+00: 00 Dublin',
        fr: '+00: 00 Dublin'
      }
    },
    {
      code: 'Europe/London',
      lang: {
        en: '+00:00 Edinburgh',
        es: '+00:00 Edimburgo',
        da: '+00:00 Edinburgh',
        he: '+00:00 אדינבורו',
        ar: '+00:00 إدنبره',
        pt: '+00: 00 Edinburgh',
        it: '+00: 00 Edinburgh',
        de: '+00: 00 Edinburgh',
        fr: '+00: 00 Edinburgh'
      }
    },
    {
      code: 'Europe/Lisbon',
      lang: {
        en: '+00:00 Lisbon',
        es: '+00:00 Lisboa',
        da: '+00:00 Lissabon',
        he: '+00:00 ליסבון',
        ar: '+00:00 لشبونة',
        pt: '+00: 00 Lisbon',
        it: '+00: 00 Lisbon',
        de: '+00: 00 Lissabon',
        fr: '+00: 00 Lisbonne'
      }
    },
    {
      code: 'Europe/London',
      lang: {
        en: '+00:00 London',
        es: '+00:00 Londres',
        da: '+00:00 London',
        he: '+00:00 לונדון',
        ar: '+00:00 لندن',
        pt: '+00: 00 Londres',
        it: '+00: 00 London',
        de: '+00: 00 London',
        fr: '+00: 00 London'
      }
    },
    {
      code: 'Africa/Monrovia',
      lang: {
        en: '+00:00 Monrovia',
        es: '+00:00 Monrovia',
        da: '+00:00 Monrovia',
        he: '+00:00 מונרוביה',
        ar: '+00:00 مونروفيا',
        pt: '+00: 00 Monrovia',
        it: '+00: 00 Monrovia',
        de: '+00: 00 Monrovia',
        fr: '+00: 00 Monrovia'
      }
    },
    {
      code: 'Etc/UTC',
      lang: {
        en: '+00:00 UTC',
        es: '+00:00 UTC',
        da: '+00:00 UTC',
        he: '+00:00 UTC',
        ar: '+00:00 UTC',
        pt: '+00: 00 UTC',
        it: '00: 00 UTC',
        de: '+00: 00 UTC',
        fr: '+00: 00 UTC'
      }
    },
    {
      code: 'Europe/Amsterdam',
      lang: {
        en: '+01:00 Amsterdam',
        es: '+01:00 Ámsterdam',
        da: '+01:00 Amsterdam',
        he: '+01:00 אמסטרדם',
        ar: '+01:00 أمستردام',
        pt: '+01: 00 Amsterdam',
        it: '+01: 00 Amsterdam',
        de: '+01: 00 Amsterdam',
        fr: '+01: 00 Amsterdam'
      }
    },
    {
      code: 'Europe/Belgrade',
      lang: {
        en: '+01:00 Belgrade',
        es: '+01:00 Belgrado',
        da: '+01:00 Beograd',
        he: '+01:00 בלגרד',
        ar: '+01:00 بلغراد',
        pt: '+01: 00 Belgrade',
        it: '+01: 00 Belgrado',
        de: '+01: 00 Belgrade',
        fr: '+01: 00 Belgrade'
      }
    },
    {
      code: 'Europe/Berlin',
      lang: {
        en: '+01:00 Berlin',
        es: '+01:00 Berlín',
        da: '+01:00 Berlin',
        he: '+01:00 ברלין',
        ar: '+01:00 برلين',
        pt: '+01: 00 Berlim',
        it: '+01: 00 Berlino',
        de: '+01: 00 Berlin',
        fr: '+01: 00 Berlin'
      }
    },
    {
      code: 'Europe/Berlin',
      lang: {
        en: '+01:00 Bern',
        es: '+01:00 Berna',
        da: '+01:00 Bern',
        he: '+01:00 ברן',
        ar: '+01:00 برن',
        pt: '+01: 00 Bern',
        it: '+01: 00 Bern',
        de: '+01: 00 Bern',
        fr: '+01: 00 Berne'
      }
    },
    {
      code: 'Europe/Bratislava',
      lang: {
        en: '+01:00 Bratislava',
        es: '+01:00 Bratislava',
        da: '+01:00 Bratislava',
        he: '+01:00 ברטיסלבה',
        ar: '+01:00 براتيسلافا',
        pt: '+01: 00 Bratislava',
        it: '+01: 00 Bratislava',
        de: '+01: 00 Bratislava',
        fr: '+01: 00 Bratislava'
      }
    },
    {
      code: 'Europe/Brussels',
      lang: {
        en: '+01:00 Brussels',
        es: '+01:00 Bruselas',
        da: '+01:00 Bruxelles',
        he: '+01:00 בריסל',
        ar: '+01:00 بروكسل',
        pt: '+01: 00 Brussels',
        it: '+01: 00 Brussels',
        de: '+01: 00 Brussels',
        fr: '+01: 00 Bruxelles'
      }
    },
    {
      code: 'Europe/Budapest',
      lang: {
        en: '+01:00 Budapest',
        es: '+01:00 Budapest',
        da: '+ 01:00 Budapest',
        he: '+01:00 בודפשט',
        ar: '+01:00 بودابست',
        pt: '+01: 00 Budapest',
        it: '+01: 00 Budapest',
        de: '+01: 00 Budapest',
        fr: '+01: 00 Budapest'
      }
    },
    {
      code: 'Europe/Copenhagen',
      lang: {
        en: '+01:00 Copenhagen',
        es: '+01:00 Copenhague',
        da: '+01:00 København',
        he: '+01:00 קופנהגן',
        ar: '+01:00 كوبنهاجن',
        pt: '+01: 00 Copenhagen',
        it: '+01: 00 Copenhagen',
        de: '+01: 00 Kopenhagen',
        fr: '+01: 00 Copenhague'
      }
    },
    {
      code: 'Europe/Ljubljana',
      lang: {
        en: '+01:00 Ljubljana',
        es: '+01:00 Liubliana',
        da: '+01:00 Ljubljana',
        he: '+01:00 לובליאנה',
        ar: '+01:00 ليوبليانا',
        pt: '+01: 00 Ljubljana',
        it: '+01: 00 Lubiana',
        de: '+01: 00 Ljubljana',
        fr: '+01: 00 Ljubljana'
      }
    },
    {
      code: 'Europe/Madrid',
      lang: {
        en: '+01:00 Madrid',
        es: '+01:00 Madrid',
        da: '+01:00 Madrid',
        he: '+01:00 מדריד',
        ar: '+01:00 مدريد',
        pt: '+01: 00 Madrid',
        it: '+01: 00 Madrid',
        de: '+01: 00 Madrid',
        fr: '+01: 00 Madrid'
      }
    },
    {
      code: 'Europe/Paris',
      lang: {
        en: '+01:00 Paris',
        es: '+01:00 París',
        da: '+01:00 Paris',
        he: '+01:00 פריז',
        ar: '+01:00 باريس',
        pt: '+01: 00 Paris',
        it: '+01: 00 Paris',
        de: '+01: 00 Paris',
        fr: '+01: 00 Paris'
      }
    },
    {
      code: 'Europe/Prague',
      lang: {
        en: '+01:00 Prague',
        es: '+01:00 Praga',
        da: '+01:00 Prag',
        he: '+01:00 פראג',
        ar: '+01:00 براغ',
        pt: '+01: 00 Prague',
        it: '+01: 00 Praga',
        de: '+01: 00 Prag',
        fr: '+01: 00 Prague'
      }
    },
    {
      code: 'Europe/Rome',
      lang: {
        en: '+01:00 Rome',
        es: '+01:00 Roma',
        da: '+01:00 Rom',
        he: '+01:00 רומא',
        ar: '+01:00 روما',
        pt: '+01: 00 Rome',
        it: '+01: 00 Roma',
        de: '+01: 00 Rome',
        fr: '+01: 00 Rome'
      }
    },
    {
      code: 'Europe/Sarajevo',
      lang: {
        en: '+01:00 Sarajevo',
        es: '+01:00 Sarajevo',
        da: '+01:00 Sarajevo',
        he: '+01:00 סרייבו',
        ar: '+01:00 سراييفو',
        pt: '+01: 00 Sarajevo',
        it: '+01: 00 Sarajevo',
        de: '+01: 00 Sarajevo',
        fr: '+01: 00 Sarajevo'
      }
    },
    {
      code: 'Europe/Skopje',
      lang: {
        en: '+01:00 Skopje',
        es: '+01:00 Skopie',
        da: '+01:00 Skopje',
        he: '+01:00 סקופיה',
        ar: '+01:00 سكوبيي',
        pt: '+01: 00 Skopje',
        it: '+01: 00 Skopje',
        de: '+01: 00 Skopje',
        fr: '+01: 00 Skopje'
      }
    },
    {
      code: 'Europe/Stockholm',
      lang: {
        en: '+01:00 Stockholm',
        es: '+01:00 Estocolmo',
        da: '+01:00 Stockholm',
        he: '+01:00 סטוקהולם',
        ar: '+01:00 ستوكهولم',
        pt: '+01: 00 Stockholm',
        it: '+01: 00 Stockholm',
        de: '+01: 00 Stockholm',
        fr: '+01: 00 Stockholm'
      }
    },
    {
      code: 'Europe/Vienna',
      lang: {
        en: '+01:00 Vienna',
        es: '+01:00 Viena',
        da: '+01:00 Wien',
        he: '+01:00 וינה',
        ar: '+01:00 فيينا',
        pt: '+01: 00 Vienna',
        it: '+01: 00 Vienna',
        de: '+01: 00 Wien',
        fr: '+01: 00 Vienne'
      }
    },
    {
      code: 'Europe/Warsaw',
      lang: {
        en: '+01:00 Warsaw',
        es: '+01:00 Varsovia',
        da: '+01:00 Warszawa',
        he: '+01:00 ורשה',
        ar: '+01:00 وارسو',
        pt: '+01: 00 Warsaw',
        it: '+01: 00 Varsavia',
        de: '+01: 00 Warsaw',
        fr: '+01: 00 Varsovie'
      }
    },
    {
      code: 'Africa/Algiers',
      lang: {
        en: '+01:00 West Central Africa',
        es: '+01:00 Africa Central Occidental',
        da: '+01:00 Vestlige Centralafrika',
        he: '+01:00 מערב מרכז אפריקה',
        ar: '+01:00 غرب وسط إفريقيا',
        pt: '+01: 00 da África Ocidental Central',
        it: '+01: 00 West Central Africa',
        de: '+01: 00 West Central Africa',
        fr: '+01: 00 Afrique du Centre-Ouest'
      }
    },
    {
      code: 'Europe/Zagreb',
      lang: {
        en: '+01:00 Zagreb',
        es: '+01:00 Zagreb',
        da: '+01:00 Zagreb',
        he: '+01:00 זאגרב',
        ar: '+01:00 زغرب',
        pt: '+01: 00 Zagreb',
        it: '+01: 00 Zagreb',
        de: '+01: 00 Zagreb',
        fr: '+01: 00 Zagreb'
      }
    },
    {
      code: 'Europe/Athens',
      lang: {
        en: '+02:00 Athens',
        es: '+02:00 Atenas',
        da: '+02:00 Athen',
        he: '+02:00 אתונה',
        ar: '+02:00 أثينا',
        pt: '+02: 00 Athens',
        it: '+02: 00 Athens',
        de: '+02: 00 Athen',
        fr: '+02: 00 Athènes'
      }
    },
    {
      code: 'Europe/Bucharest',
      lang: {
        en: '+02:00 Bucharest',
        es: '+02:00 Bucarest',
        da: '+02:00 Bukarest',
        he: '+02:00 בוקרשט',
        ar: '+02:00 بوخارست',
        pt: '+02: 00 Bucharest',
        it: '+02: 00 Bucharest',
        de: '+02: 00 Bukarest',
        fr: '+02: 00 Bucarest'
      }
    },
    {
      code: 'Africa/Cairo',
      lang: {
        en: '+02:00 Cairo',
        es: '+02:00 El Cairo',
        da: '+02:00 Cairo',
        he: '+02:00 קהיר',
        ar: '+02:00 القاهرة',
        pt: '+02: 00 Cairo',
        it: '02: 00 Il Cairo',
        de: '+02: 00 Cairo',
        fr: '+02: 00 Cairo'
      }
    },
    {
      code: 'Africa/Harare',
      lang: {
        en: '+02:00 Harare',
        es: '+02:00 Harare',
        da: '+02:00 Harare',
        he: '+02:00 הרארה',
        ar: '+02:00 هراري',
        pt: '+02: 00 Harare',
        it: '+02: 00 Harare',
        de: '+02: 00 Harare',
        fr: '+02: 00 Harare'
      }
    },
    {
      code: 'Europe/Helsinki',
      lang: {
        en: '+02:00 Helsinki',
        es: '+02:00 Helsinki',
        da: '+02:00 Helsinki',
        he: '+02:00 הלסינקי',
        ar: '+02:00 هلسنكي',
        pt: '+02: 00 Helsinki',
        it: '+02: 00 Helsinki',
        de: '+02: 00 Helsinki',
        fr: '+02: 00 Helsinki'
      }
    },
    {
      code: 'Europe/Istanbul',
      lang: {
        en: '+02:00 Istanbul',
        es: '+02:00 Estambul',
        da: '+02:00 Istanbul',
        he: '+02:00 איסטנבול',
        ar: '+02:00 اسطنبول',
        pt: '+02: 00 Istanbul',
        it: '+02: 00 Istanbul',
        de: '+02: 00 Istanbul',
        fr: '+02: 00 Istanbul'
      }
    },
    {
      code: 'Asia/Jerusalem',
      lang: {
        en: '+02:00 Jerusalem',
        es: '+02:00 Jerusalén',
        da: '+02:00 Jerusalem',
        he: '+02:00 ירושלים',
        ar: '+02:00 القدس',
        pt: '+02: 00 Jerusalem',
        it: '+02: 00 Jerusalem',
        de: '+02: 00 Jerusalem',
        fr: '+02: 00 Jérusalem'
      }
    },
    {
      code: 'Europe/Kaliningrad',
      lang: {
        en: '+02:00 Kaliningrad',
        es: '+02:00 Kaliningrado',
        da: '+02:00 Kaliningrad',
        he: '+02:00 קלינינגרד',
        ar: '+02:00 كالينينجراد',
        pt: '+02: 00 Kaliningrad',
        it: '+02: 00 Kaliningrad',
        de: '+02: 00 Kaliningrad',
        fr: '+02: 00 Kaliningrad'
      }
    },
    {
      code: 'Europe/Kiev',
      lang: {
        en: '+02:00 Kyiv',
        es: '+02:00 Kiev',
        da: '+02:00 Kyiv',
        he: '+02:00 קייב',
        ar: '+02:00 كييف',
        pt: '+02: 00 Kyiv',
        it: '+02: 00 Kyiv',
        de: '+02: 00 Kiew',
        fr: '+02: 00 Kiev'
      }
    },
    {
      code: 'Africa/Johannesburg',
      lang: {
        en: '+02:00 Pretoria',
        es: '+02:00 Pretoria',
        da: '+02:00 Pretoria',
        he: '+02:00 פרטוריה',
        ar: '+02:00 بريتوريا',
        pt: '+02: 00 Pretoria',
        it: '+02: 00 Pretoria',
        de: '+02: 00 Pretoria',
        fr: '+02: 00 Pretoria'
      }
    },
    {
      code: 'Europe/Riga',
      lang: {
        en: '+02:00 Riga',
        es: '+02:00 Riga',
        da: '+02:00 Riga',
        he: '+02:00 ריגה',
        ar: '+02:00 ريغا',
        pt: '+02: 00 Riga',
        it: '+02: 00 Riga',
        de: '+02: 00 Riga',
        fr: '+02: 00 Riga'
      }
    },
    {
      code: 'Europe/Sofia',
      lang: {
        en: '+02:00 Sofia',
        es: '+02:00 Sofía',
        da: '+02:00 Sofia',
        he: '+02:00 סופיה',
        ar: '+02:00 صوفيا',
        pt: '+02: 00 Sofia',
        it: '+02: 00 Sofia',
        de: '+02: 00 Sofia',
        fr: '+02: 00 Sofia'
      }
    },
    {
      code: 'Europe/Tallinn',
      lang: {
        en: '+02:00 Tallinn',
        es: '+02:00 Tallin',
        da: '+02:00 Tallinn',
        he: '+02:00 טאלין',
        ar: '+02:00 تالين',
        pt: '+02: 00 Tallinn',
        it: '+02: 00 Tallinn',
        de: '+02: 00 Tallinn',
        fr: '+02: 00 Tallinn'
      }
    },
    {
      code: 'Europe/Vilnius',
      lang: {
        en: '+02:00 Vilnius',
        es: '+02:00 Vilna',
        da: '+02:00 Vilnius',
        he: '+02:00 וילנה',
        ar: '+02:00 فيلنيوس',
        pt: '+02: 00 Vilnius',
        it: '+02: 00 Vilnius',
        de: '+02: 00 Vilnius',
        fr: '+02: 00 Vilnius'
      }
    },
    {
      code: 'Asia/Baghdad',
      lang: {
        en: '+03:00 Baghdad',
        es: '+03:00 Bagdad',
        da: '+03:00 Bagdad',
        he: '+03:00 בגדד',
        ar: '+03:00 بغداد',
        pt: '+03: 00 Bagdad',
        it: '03: 00 Baghdad',
        de: '+03: 00 Bagdad',
        fr: '+03: 00 Bagdad'
      }
    },
    {
      code: 'Asia/Kuwait',
      lang: {
        en: '+03:00 Kuwait',
        es: '+03:00 Kuwait',
        da: '+03:00 Kuwait',
        he: '+03:00 כווית',
        ar: '+03:00 الكويت',
        pt: '+03: 00 Kuwait',
        it: '+03: 00 Kuwait',
        de: '+03: 00 Kuwait',
        fr: '+03: 00 Koweït'
      }
    },
    {
      code: 'Europe/Minsk',
      lang: {
        en: '+03:00 Minsk',
        es: '+03:00 Minsk',
        da: '+03:00 Minsk',
        he: '+03:00 מינסק',
        ar: '+03:00 مينسك',
        pt: '+03: 00 Minsk',
        it: '+03: 00 Minsk',
        de: '+03: 00 Minsk',
        fr: '+03: 00 Minsk'
      }
    },
    {
      code: 'Europe/Moscow',
      lang: {
        en: '+03:00 Moscow',
        es: '+03:00 Moscú',
        da: '+03:00 Moskva',
        he: '+03:00 מוסקווה',
        ar: '+03:00 موسكو',
        pt: '+03: 00 Moscow',
        it: '+03: 00 Moscow',
        de: '+03: 00 Moskau',
        fr: '+03: 00 Moscou'
      }
    },
    {
      code: 'Africa/Nairobi',
      lang: {
        en: '+03:00 Nairobi',
        es: '+03:00 Nairobi',
        da: '+03:00 Nairobi',
        he: '+03:00 ניירובי',
        ar: '+03:00 نيروبي',
        pt: '+03: 00 Nairobi',
        it: '+03: 00 Nairobi',
        de: '+03: 00 Nairobi',
        fr: '+03: 00 Nairobi'
      }
    },
    {
      code: 'Asia/Riyadh',
      lang: {
        en: '+03:00 Riyadh',
        es: '+03:00 Riad',
        da: '+03:00 Riyadh',
        he: '+03:00 Riyadh',
        ar: '+03:00 الرياض',
        pt: '+03: 00 Riyadh',
        it: '+03: 00 Riyadh',
        de: '+03: 00 Riyadh',
        fr: '+03: 00 Riyadh'
      }
    },
    {
      code: 'Europe/Moscow',
      lang: {
        en: '+03:00 St. Petersburg',
        es: '+03:00 San Petersburgo',
        da: '+03:00 St. Petersborg',
        he: '+03:00 סנט פטרסבורג',
        ar: '+03:00 سانت بطرسبرغ',
        pt: '+03: 00 St. Petersburg',
        it: '+03: 00 St. Petersburg',
        de: '+03: 00 St. Petersburg',
        fr: '+03: 00 Saint-Pétersbourg'
      }
    },
    {
      code: 'Europe/Volgograd',
      lang: {
        en: '+03:00 Volgograd',
        es: '+03:00 Volgogrado',
        da: '+03:00 Volgograd',
        he: '+03:00 וולגוגרד',
        ar: '+03:00 فولغوغراد',
        pt: '+03: 00 Volgograd',
        it: '+03: 00 Volgograd',
        de: '+03: 00 Volgograd',
        fr: '+03: 00 Volgograd'
      }
    },
    {
      code: 'Asia/Tehran',
      lang: {
        en: '+03:30 Tehran',
        es: '+03:30 Teherán',
        da: '+03:30 Teheran',
        he: '+03:30 טהראן',
        ar: '+03:30 طهران',
        pt: '+03: 30 Teerã',
        it: '+03: 30 Tehran',
        de: '+03: 30 Tehran',
        fr: '+03: 30 Téhéran'
      }
    },
    {
      code: 'Asia/Muscat',
      lang: {
        en: '+04:00 Abu Dhabi',
        es: '+04:00 Abu Dabi',
        da: '+04:00 Abu Dhabi',
        he: '+04:00 אבו דאבי',
        ar: '+04:00 أبو ظبي',
        pt: '+04: 00 Abu Dhabi',
        it: '+04: 00 Abu Dhabi',
        de: '+04: 00 Abu Dhabi',
        fr: '+04: 00 Abu Dhabi'
      }
    },
    {
      code: 'Asia/Baku',
      lang: {
        en: '+04:00 Baku',
        es: '+04:00 Bakú',
        da: '+04:00 Baku',
        he: '+04:00 באקו',
        ar: '+04:00 باكو',
        pt: '+04: 00 Baku',
        it: '+04: 00 Baku',
        de: '+04: 00 Baku',
        fr: '+04: 00 Baku'
      }
    },
    {
      code: 'Asia/Muscat',
      lang: {
        en: '+04:00 Muscat',
        es: '+04:00 Mascate',
        da: '+04:00 Muscat',
        he: '+04:00 מוסקט',
        ar: '+04:00 مسقط',
        pt: '+04: 00 Muscat',
        it: '+04: 00 Muscat',
        de: '+04: 00 Muscat',
        fr: '+04: 00 Muscat'
      }
    },
    {
      code: 'Europe/Samara',
      lang: {
        en: '+04:00 Samara',
        es: '+04:00 Samara',
        da: '+04:00 Samara',
        he: '+04:00 סמארה',
        ar: '+04:00 سمارة',
        pt: '+04: 00 Samara',
        it: '+04: 00 Samara',
        de: '+04: 00 Samara',
        fr: '+04: 00 Samara'
      }
    },
    {
      code: 'Asia/Tbilisi',
      lang: {
        en: '+04:00 Tbilisi',
        es: '+04:00 Tiflis',
        da: '+04:00 Tbilisi',
        he: '+04:00 Tbilisi',
        ar: '+04:00 تبليسي',
        pt: '+04: 00 Tbilisi',
        it: '+04: 00 Tbilisi',
        de: '+04: 00 Tbilisi',
        fr: '+04: 00 Tbilissi'
      }
    },
    {
      code: 'Asia/Yerevan',
      lang: {
        en: '+04:00 Yerevan',
        es: '+04:00 Ereván',
        da: '+04:00 Yerevan',
        he: '+04:00 ירבאן',
        ar: '+04:00 يريفان',
        pt: '+04: 00 Yerevan',
        it: '+04: 00 Yerevan',
        de: '+04: 00 Yerevan',
        fr: '+04: 00 Erevan'
      }
    },
    {
      code: 'Asia/Kabul',
      lang: {
        en: '+04:30 Kabul',
        es: '+04:30 Kabul',
        da: '+04:30 Kabul',
        he: '+04:30 קאבול',
        ar: '+04:30 كابول',
        pt: '+04: 30 Kabul',
        it: '+04: 30 Kabul',
        de: '+04: 30 Kabul',
        fr: '+04: 30 Kaboul'
      }
    },
    {
      code: 'Asia/Yekaterinburg',
      lang: {
        en: '+05:00 Ekaterinburg',
        es: '+05:00 Ekaterimburgo',
        da: '+05:00 Ekaterinburg',
        he: '+05:00 יקטרינבורג',
        ar: '+05:00 ايكاترينبرغ',
        pt: '+05: 00 Ekaterinburg',
        it: '+05: 00 Ekaterinburg',
        de: '+05: 00 Ekaterinburg',
        fr: '+05: 00 Ekaterinburg'
      }
    },
    {
      code: 'Asia/Karachi',
      lang: {
        en: '+05:00 Islamabad',
        es: '+05:00 Islamabad',
        da: '+05:00 Islamabad',
        he: '+05:00 איסלמבאד',
        ar: '+05:00 إسلام آباد',
        pt: '+05: 00 Islamabad',
        it: '+05: 00 Islamabad',
        de: '+05: 00 Islamabad',
        fr: '+05: 00 Islamabad'
      }
    },
    {
      code: 'Asia/Karachi',
      lang: {
        en: '+05:00 Karachi',
        es: '+05:00 Karachi',
        da: '+05:00 Karachi',
        he: "+05:00 קראצ'י",
        ar: '+05:00 كراتشي',
        pt: '+05: 00 Karachi',
        it: '+05: 00 Karachi',
        de: '+05: 00 Karachi',
        fr: '+05: 00 Karachi'
      }
    },
    {
      code: 'Asia/Tashkent',
      lang: {
        en: '+05:00 Tashkent',
        es: '+05:00 Taskent',
        da: '+05:00 Tasjkent',
        he: '+05:00 טשקנט',
        ar: '+05:00 طشقند',
        pt: '+05: 00 Tashkent',
        it: '+05: 00 Tashkent',
        de: '+05: 00 Tashkent',
        fr: '+05: 00 Tachkent'
      }
    },
    {
      code: 'Asia/Kolkata',
      lang: {
        en: '+05:30 Chennai',
        es: '+05:30 Chennai',
        da: '+05:30 Chennai',
        he: "+05:30 צ'נאי",
        ar: '+05:30 تشيناي',
        pt: '+05: 30 Chennai',
        it: '+05: 30 Chennai',
        de: '+05: 30 Chennai',
        fr: '+05: 30 Chennai'
      }
    },
    {
      code: 'Asia/Kolkata',
      lang: {
        en: '+05:30 Kolkata',
        es: '+05:30 Calcuta',
        da: '+05:30 Kolkata',
        he: '+05:30 קולקטה',
        ar: '+05:30 كولكاتا',
        pt: '+05: 30 Kolkata',
        it: '+05: 30 Kolkata',
        de: '+05: 30 Kolkata',
        fr: '+05: 30 Kolkata'
      }
    },
    {
      code: 'Asia/Kolkata',
      lang: {
        en: '+05:30 Mumbai',
        es: '+05:30 Bombay',
        da: '+05:30 Mumbai',
        he: '+05:30 מומבאי',
        ar: '+05:30 مومباي',
        pt: '+05: 30 Mumbai',
        it: '+05: 30 Mumbai',
        de: '+05: 30 Mumbai',
        fr: '+05: 30 Mumbai'
      }
    },
    {
      code: 'Asia/Kolkata',
      lang: {
        en: '+05:30 New Delhi',
        es: '+05:30 Nueva Delhi',
        da: '+05:30 New Delhi',
        he: '+05:30 ניו דלהי',
        ar: '+05:30 نيودلهي',
        pt: '+05: 30 New Delhi',
        it: '+05: 30 Nuova Delhi',
        de: '+05: 30 Neu-Delhi',
        fr: '+05: 30 New Delhi'
      }
    },
    {
      code: 'Asia/Colombo',
      lang: {
        en: '+05:30 Sri Jayawardenepura',
        es: '+05:30 Sri Jayawardenapura',
        da: '+05:30 Sri Jayawardenepura',
        he: '+05:30 סרי Jayawardenepura',
        ar: '+05:30 Sri Jayawardenepura',
        pt: '+05: 30 Sri Jayawardenepura',
        it: '+05: 30 Sri Jayawardenepura',
        de: '+05: 30 Sri Jayawardenepura',
        fr: '+05: 30 Sri Jayawardenepura'
      }
    },
    {
      code: 'Asia/Kathmandu',
      lang: {
        en: '+05:45 Kathmandu',
        es: '+05:45 Katmandú',
        da: '+05:45 Kathmandu',
        he: '+05:45 קטמנדו',
        ar: '+05:45 كاتماندو',
        pt: '05: 45 Catmandu',
        it: '+05: 45 Kathmandu',
        de: '+05: 45 Kathmandu',
        fr: '+05: 45 Katmandou'
      }
    },
    {
      code: 'Asia/Almaty',
      lang: {
        en: '+06:00 Almaty',
        es: '+06:00 Almatý',
        da: '+06:00 Almaty',
        he: '+06:00 אלמטי',
        ar: '+06:00 ألماتي',
        pt: '+06: 00 Almaty',
        it: '+06: 00 Almaty',
        de: '+06: 00 Almaty',
        fr: '+06: 00 Almaty'
      }
    },
    {
      code: 'Asia/Dhaka',
      lang: {
        en: '+06:00 Astana',
        es: '+06:00 Astaná',
        da: '+06:00 Astana',
        he: '+06:00 אסטאנה',
        ar: '+06:00 أستانا',
        pt: '+06: 00 Astana',
        it: '+06: 00 Astana',
        de: '+06: 00 Astana',
        fr: '+06: 00 Astana'
      }
    },
    {
      code: 'Asia/Dhaka',
      lang: {
        en: '+06:00 Dhaka',
        es: '+06:00 Daca',
        da: '+06:00 Dhaka',
        he: '+06:00 דאקה',
        ar: '+06:00 دكا',
        pt: '+06: 00 Dhaka',
        it: '+06: 00 Dacca',
        de: '+06: 00 Dhaka',
        fr: '+06: 00 Dhaka'
      }
    },
    {
      code: 'Asia/Novosibirsk',
      lang: {
        en: '+06:00 Novosibirsk',
        es: '+06:00 Novosibirsk',
        da: '+06:00 Novosibirsk',
        he: '+06:00 נובוסיבירסק',
        ar: '+06:00 نوفوسيبيرسك',
        pt: '+06: 00 Novosibirsk',
        it: '+06: 00 Novosibirsk',
        de: '+06: 00 Novosibirsk',
        fr: '+06: 00 Novossibirsk'
      }
    },
    {
      code: 'Asia/Urumqi',
      lang: {
        en: '+06:00 Urumqi',
        es: '+06:00 Urumchi',
        da: '+06:00 Urumqi',
        he: '+06:00 אורומקי',
        ar: '+06:00 اورومتشى',
        pt: '+06: 00 Urumqi',
        it: '+06: 00 Urumqi',
        de: '+06: 00 Urumqi',
        fr: '+06: 00 Urumqi'
      }
    },
    {
      code: 'Asia/Rangoon',
      lang: {
        en: '+06:30 Rangoon',
        es: '+06:30 Rangún',
        da: '+06:30 Rangoon',
        he: '+06:30 רנגון',
        ar: '+06:30 رانجون',
        pt: '+06: 30 Rangoon',
        it: '+06: 30 Rangoon',
        de: '+06: 30 Rangoon',
        fr: '+06: 30 Rangoon'
      }
    },
    {
      code: 'Asia/Bangkok',
      lang: {
        en: '+07:00 Bangkok',
        es: '+07:00 Bangkok',
        da: '+07:00 Bangkok',
        he: '+07:00 בנגקוק',
        ar: '+07:00 بانكوك',
        pt: '+07: 00 Bangkok',
        it: '+07: 00 Bangkok',
        de: '+07: 00 Bangkok',
        fr: '+07: 00 Bangkok'
      }
    },
    {
      code: 'Asia/Bangkok',
      lang: {
        en: '+07:00 Hanoi',
        es: '+07:00 Hanói',
        da: '+07:00 Hanoi',
        he: '+07:00 האנוי',
        ar: '+07:00 هانوي',
        pt: '+07: 00 Hanoi',
        it: '+07: 00 Hanoi',
        de: '+07: 00 Hanoi',
        fr: '+07: 00 Hanoi'
      }
    },
    {
      code: 'Asia/Jakarta',
      lang: {
        en: '+07:00 Jakarta',
        es: '+07:00 Yakarta',
        da: '+07:00 Jakarta',
        he: "+07:00 ג'קרטה",
        ar: '+07:00 جاكرتا',
        pt: '+07: 00 Jakarta',
        it: '+07: 00 Jakarta',
        de: '+07: 00 Jakarta',
        fr: '+07: 00 Jakarta'
      }
    },
    {
      code: 'Asia/Krasnoyarsk',
      lang: {
        en: '+07:00 Krasnoyarsk',
        es: '+07:00 Krasnoyarsk',
        da: '+07:00 Krasnoyarsk',
        he: '+07:00 קרסנויארסק',
        ar: '+07:00 كراسنويارسك',
        pt: '+07: 00 Krasnoyarsk',
        it: '+07: 00 Krasnoyarsk',
        de: '+07: 00 Krasnoyarsk',
        fr: '+07: 00 Krasnoyarsk'
      }
    },
    {
      code: 'Asia/Shanghai',
      lang: {
        en: '+08:00 Beijing',
        es: '+08:00 Pekín',
        da: '+08:00 Beijing',
        he: "+08:00 בייג'ינג",
        ar: '+08:00 بكين',
        pt: '+08: 00 Beijing',
        it: '08: 00 Pechino',
        de: '+08: 00 Peking',
        fr: '+08: 00 Pékin'
      }
    },
    {
      code: 'Asia/Chongqing',
      lang: {
        en: '+08:00 Chongqing',
        es: '+08:00 Chongqing',
        da: '+08:00 Chongqing',
        he: "+08:00 צ'ונגצ'ינג",
        ar: '+08:00 تشونغتشينغ',
        pt: '+08: 00 Chongqing',
        it: '+08: 00 Chongqing',
        de: '+08: 00 Chongqing',
        fr: '+08: 00 Chongqing'
      }
    },
    {
      code: 'Asia/Hong_Kong',
      lang: {
        en: '+08:00 Hong Kong',
        es: '+08:00 Hong Kong',
        da: '+08:00 Hong Kong',
        he: '+08:00 הונג קונג',
        ar: '+08:00 هونغ كونغ',
        pt: '+08: 00 Hong Kong',
        it: '+08: 00 Hong Kong',
        de: '+08: 00 Hong Kong',
        fr: '+08: 00 Hong Kong'
      }
    },
    {
      code: 'Asia/Irkutsk',
      lang: {
        en: '+08:00 Irkutsk',
        es: '+08:00 Irkutsk',
        da: '+08:00 Irkutsk',
        he: '+08:00 אירקוטסק',
        ar: '+08:00 إيركوتسك',
        pt: '+08: 00 Irkutsk',
        it: '+08: 00 Irkutsk',
        de: '+08: 00 Irkutsk',
        fr: '+08: 00 Irkoutsk'
      }
    },
    {
      code: 'Asia/Kuala_Lumpur',
      lang: {
        en: '+08:00 Kuala Lumpur',
        es: '+08:00 Kuala Lumpur',
        da: '+08:00 Kuala Lumpur',
        he: '+08:00 קואלה לומפור',
        ar: '+08:00 كوالا لمبور',
        pt: '+08: 00 Kuala Lumpur',
        it: '+08: 00 Kuala Lumpur',
        de: '+08: 00 Kuala Lumpur',
        fr: '+08: 00 Kuala Lumpur'
      }
    },
    {
      code: 'Australia/Perth',
      lang: {
        en: '+08:00 Perth',
        es: '+08:00 Perth',
        da: '+08:00 Perth',
        he: "+08:00 פרת '",
        ar: '+08:00 بيرث',
        pt: '+08: 00 Perth',
        it: '+08: 00 Perth',
        de: '+08: 00 Perth',
        fr: '+08: 00 Perth'
      }
    },
    {
      code: 'Asia/Singapore',
      lang: {
        en: '+08:00 Singapore',
        es: '+08:00 Singapur',
        da: '+08:00 Singapore',
        he: '+08:00 סינגפור',
        ar: '+08:00 سنغافورة',
        pt: '+08: 00 Singapore',
        it: '+08: 00 Singapore',
        de: '+08: 00 Singapore',
        fr: '+08: 00 Singapour'
      }
    },
    {
      code: 'Asia/Taipei',
      lang: {
        en: '+08:00 Taipei',
        es: '+08:00 Taipéi',
        da: '+08:00 Taipei',
        he: '+08:00 טייפה',
        ar: '+08:00 تايبيه',
        pt: '+08: 00 Taipei',
        it: '+08: 00 Taipei',
        de: '+08: 00 Taipei',
        fr: '+08: 00 Taipei'
      }
    },
    {
      code: 'Asia/Ulaanbaatar',
      lang: {
        en: '+08:00 Ulaanbaatar',
        es: '+08:00 Ulán Bator',
        da: '+08:00 Ulaanbaatar',
        he: '+08:00 אולאנבאטאר',
        ar: '+08:00 أولان باتور',
        pt: '+08: 00 Ulaanbaatar',
        it: '+08: 00 Ulaanbaatar',
        de: '+08: 00 Ulaanbaatar',
        fr: '+08: 00 Oulan-Bator'
      }
    },
    {
      code: 'Asia/Tokyo',
      lang: {
        en: '+09:00 Osaka',
        es: '+09:00 Osaka',
        da: '+09:00 Osaka',
        he: '+09:00 אוסקה',
        ar: '+09:00 أوساكا',
        pt: '+09: 00 Osaka',
        it: '+09: 00 Osaka',
        de: '+09: 00 Osaka',
        fr: '+09: 00 Osaka'
      }
    },
    {
      code: 'Asia/Tokyo',
      lang: {
        en: '+09:00 Sapporo',
        es: '+09:00 Sapporo',
        da: '+09:00 Sapporo',
        he: '+09:00 סאפורו',
        ar: '+09:00 سابورو',
        pt: '+09: 00 Sapporo',
        it: '+09: 00 Sapporo',
        de: '+09: 00 Sapporo',
        fr: '+09: 00 Sapporo'
      }
    },
    {
      code: 'Asia/Seoul',
      lang: {
        en: '+09:00 Seoul',
        es: '+09:00 Seúl',
        da: '+09:00 Seoul',
        he: '+09:00 סיאול',
        ar: '+09:00 سيول',
        pt: '+09: 00 Seoul',
        it: '+09: 00 Seoul',
        de: '+09: 00 Seoul',
        fr: '+09: 00 Séoul'
      }
    },
    {
      code: 'Asia/Tokyo',
      lang: {
        en: '+09:00 Tokyo',
        es: '+09:00 Tokio',
        da: '+09:00 Tokyo',
        he: '+09:00 טוקיו',
        ar: '+09:00 طوكيو',
        pt: '+09: 00 Tokyo',
        it: '+09: 00 Tokyo',
        de: '+09: 00 Tokyo',
        fr: '+09: 00 Tokyo'
      }
    },
    {
      code: 'Asia/Yakutsk',
      lang: {
        en: '+09:00 Yakutsk',
        es: '+09:00 Yakutsk',
        da: '+09:00 Yakutsk',
        he: '+09:00 יאקוטסק',
        ar: '+09:00 ياكوتسك',
        pt: '+09: 00 Yakutsk',
        it: '+09: 00 Yakutsk',
        de: '+09: 00 Yakutsk',
        fr: '+09: 00 Yakutsk'
      }
    },
    {
      code: 'Australia/Adelaide',
      lang: {
        en: '+09:30 Adelaide',
        es: '+09:30 Adelaida',
        da: '+09:30 Adelaide',
        he: '+09:30 אדלייד',
        ar: '+09:30 أديلايد',
        pt: '+09: 30 Adelaide',
        it: '+09: 30 Adelaide',
        de: '+09: 30 Adelaide',
        fr: '+09: 30 Adelaide'
      }
    },
    {
      code: 'Australia/Darwin',
      lang: {
        en: '+09:30 Darwin',
        es: '+09:30 Darwin',
        da: '+09:30 Darwin',
        he: '+09:30 דרווין',
        ar: '+09:30 داروين',
        pt: '+09: 30 Darwin',
        it: '+09: 30 Darwin',
        de: '+09: 30 Darwin',
        fr: '+09: 30 Darwin'
      }
    },
    {
      code: 'Australia/Brisbane',
      lang: {
        en: '+10:00 Brisbane',
        es: '+10:00 Brisbane',
        da: '+10:00 Brisbane',
        he: '+10:00 בריסביין',
        ar: '+10:00 بريزبن',
        pt: '+10: 00 Brisbane',
        it: '+10: 00 Brisbane',
        de: '+10: 00 Brisbane',
        fr: '10: 00 Brisbane'
      }
    },
    {
      code: 'Australia/Melbourne',
      lang: {
        en: '+10:00 Canberra',
        es: '+10:00 Canberra',
        da: '+10:00 Canberra',
        he: '+10:00 קנברה',
        ar: '+10:00 كانبيرا',
        pt: '+10: 00 Canberra',
        it: '+10: 00 Canberra',
        de: '+10: 00 Canberra',
        fr: '10: 00 Canberra'
      }
    },
    {
      code: 'Pacific/Guam',
      lang: {
        en: '+10:00 Guam',
        es: '+10:00 Guam',
        da: '+10:00 Guam',
        he: '+10:00 גואם',
        ar: '+10:00 غوام',
        pt: '+10: 00 Guam',
        it: '+10: 00 Guam',
        de: '+10: 00 Guam',
        fr: '10: 00 Guam'
      }
    },
    {
      code: 'Australia/Hobart',
      lang: {
        en: '+10:00 Hobart',
        es: '+10:00 Hobart',
        da: '+10:00 Hobart',
        he: '+10:00 הובארט',
        ar: '+10:00 هوبارت',
        pt: '+10: 00 Hobart',
        it: '+10: 00 Hobart',
        de: '+10: 00 Hobart',
        fr: '10: 00 Hobart'
      }
    },
    {
      code: 'Asia/Magadan',
      lang: {
        en: '+10:00 Magadan',
        es: '+10:00 Magadán',
        da: '+10:00 Magadan',
        he: '+10:00 Magadan',
        ar: '+10:00 ماجادان',
        pt: '+10: 00 Magadan',
        it: '+10: 00 Magadan',
        de: '+10: 00 Magadan',
        fr: '10: 00 Magadan'
      }
    },
    {
      code: 'Australia/Melbourne',
      lang: {
        en: '+10:00 Melbourne',
        es: '+10:00 Melbourne',
        da: '+10:00 Melbourne',
        he: '+10:00 מלבורן',
        ar: '',
        pt: '+10: 00 Melbourne',
        it: '+10: 00 Melbourne',
        de: '+10: 00 Melbourne',
        fr: '10: 00 Melbourne'
      }
    },
    {
      code: 'Pacific/Port_Moresby',
      lang: {
        en: '+10:00 Port Moresby',
        es: '+10:00 Puerto Moresby',
        da: '+10:00 Port Moresby',
        he: '+10:00 פורט מורסבי',
        ar: '+10:00 ملبورن',
        pt: '+10: 00 Port Moresby',
        it: '+10: 00 Port Moresby',
        de: '+10: 00 Port Moresby',
        fr: '10: 00 Port Moresby'
      }
    },
    {
      code: 'Australia/Sydney',
      lang: {
        en: '+10:00 Sydney',
        es: '+10:00 Sídney',
        da: '+10:00 Sydney',
        he: '+10:00 סידני',
        ar: '+10:00 بورت مورسبي',
        pt: '+10: 00 Sydney',
        it: '+10: 00 Sydney',
        de: '+10: 00 Sydney',
        fr: '10: 00 Sydney'
      }
    },
    {
      code: 'Asia/Vladivostok',
      lang: {
        en: '+10:00 Vladivostok',
        es: '+10:00 Vladivostok',
        da: '+10:00 Vladivostok',
        he: '+10:00 ולדיווסטוק',
        ar: '+10:00 سيدني',
        pt: '+10: 00 Vladivostok',
        it: '+10: 00 Vladivostok',
        de: '+10: 00 Wladiwostok',
        fr: '10: 00 Vladivostok'
      }
    },
    {
      code: 'Pacific/Noumea',
      lang: {
        en: '+11:00 New Caledonia',
        es: '+11:00 Nueva Caledonia',
        da: '+11:00 Ny Kaledonien',
        he: '+11:00 קלדוניה החדשה',
        ar: '+11:00 كاليدونيا الجديدة',
        pt: '+11: 00 New Caledonia',
        it: '+11: 00 Nuova Caledonia',
        de: '+11: 00 Neukaledonien',
        fr: '+11: 00 Nouvelle-Calédonie'
      }
    },
    {
      code: 'Pacific/Guadalcanal',
      lang: {
        en: '+11:00 Solomon Is.',
        es: '+11:00 Islas Salomón',
        da: '+11:00 Solomon Island',
        he: '+11:00 האי סלומון',
        ar: '+11:00 جزيرة سليمان',
        pt: '+11: 00 Solomon Is.',
        it: '+11: 00 Solomon Is.',
        de: '+11: 00 Solomon.',
        fr: '+11: 00 Îles Salomon.'
      }
    },
    {
      code: 'Asia/Srednekolymsk',
      lang: {
        en: '+11:00 Srednekolymsk',
        es: '+11:00 Srednekolimsk',
        da: '+11:00 Srednekolymsk',
        he: '+11:00 Srednekolymsk',
        ar: '+11:00 سريدنكوليمسك',
        pt: '+11: 00 Srednekolymsk',
        it: '+11: 00 Srednekolymsk',
        de: '+11: 00 Srednekolymsk',
        fr: '+11: 00 Srednekolymsk'
      }
    },
    {
      code: 'Pacific/Auckland',
      lang: {
        en: '+12:00 Auckland',
        es: '+12:00 Auckland',
        da: '+12:00 Auckland',
        he: '+12:00 אוקלנד',
        ar: '+12:00 أوكلاند',
        pt: '+12: 00 Auckland',
        it: '+12: 00 Auckland',
        de: '+12: 00 Auckland',
        fr: '12: 00 Auckland'
      }
    },
    {
      code: 'Pacific/Fiji',
      lang: {
        en: '+12:00 Fiji',
        es: '+12:00 Fiyi',
        da: '+12:00 Fiji',
        he: "+12:00 פיג'י",
        ar: '+12:00 فيجي',
        pt: '+12: 00 Fiji',
        it: '+12: 00 Fiji',
        de: '+12: 00 Fiji',
        fr: '12: 00 Fidji'
      }
    },
    {
      code: 'Asia/Kamchatka',
      lang: {
        en: '+12:00 Kamchatka',
        es: '+12:00 Kamchatka',
        da: '+12:00 Kamchatka',
        he: "+12:00 קמצ'טקה",
        ar: '+12:00 كمشاتكا',
        pt: '+12: 00 Kamchatka',
        it: '+12: 00 Kamchatka',
        de: '+12: 00 Kamchatka',
        fr: '12 00 Kamtchatka'
      }
    },
    {
      code: 'Pacific/Majuro',
      lang: {
        en: '+12:00 Marshall Is.',
        es: '+12:00 Islas Marshall',
        da: '+12:00 Marshall Island',
        he: '+12:00 אי מרשל',
        ar: '+12:00 جزيرة مارشال',
        pt: '+12: 00 Marshall Is.',
        it: '+12: 00 Marshall Is.',
        de: '+12: 00 Marshall.',
        fr: '12: 00 Marshall.'
      }
    },
    {
      code: 'Pacific/Auckland',
      lang: {
        en: '+12:00 Wellington',
        es: '+12:00 Wellington',
        da: '+12:00 Wellington',
        he: '+12:00 וולינגטון',
        ar: '+12:00 ولنجتون',
        pt: '+12: 00 Wellington',
        it: '+12: 00 Wellington',
        de: '+12: 00 Wellington',
        fr: '12: 00 Wellington'
      }
    },
    {
      code: 'Pacific/Chatham',
      lang: {
        en: '+12:45 Chatham Is.',
        es: '+12:45 Islas Chatham',
        da: '+12:45 Chatham Island',
        he: "+12:45 האי צ'ת'אם",
        ar: '+12:45 جزيرة تشاتام',
        pt: '+12: 45 Chatham é.',
        it: '+12: 45 Chatham è.',
        de: '+12: 45 Chatham.',
        fr: '12: 45 Chatham.'
      }
    },
    {
      code: 'Pacific/Tongatapu',
      lang: {
        en: "+13:00 Nuku'alofa",
        es: '+13:00 Nukualofa',
        da: "+13:00 Nuku'alofa",
        he: '+13:00 נוקאלופה',
        ar: '+13:00 نوكوألوفا',
        pt: "+13: 00 Nuku'alofa",
        it: "+13: 00 Nuku'alofa",
        de: "+13: 00 Nuku'alofa",
        fr: "+13: 00 Nuku'alofa"
      }
    },
    {
      code: 'Pacific/Fakaofo',
      lang: {
        en: '+13:00 Tokelau Is.',
        es: '+13:00 Islas Tokelau',
        da: '+13:00 Tokelau Island',
        he: '+13:00 טוקלאו איילנד',
        ar: '+13:00 جزيرة توكيلاو',
        pt: '+13: 00 Tokelau Is.',
        it: '+13: 00 Tokelau Is.',
        de: '+13: 00 Tokelau Is.',
        fr: '+13: 00 Tokélaou.'
      }
    }
  ]

  public fetch(): Array<TimezoneResponse> {
    return this.timezones
  }
}

export { Timezone }
