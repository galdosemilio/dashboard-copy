export interface CountryCode {
    name: string;
    code: string;
    lang: {
        en: string;
        es: string;
        da: string;
        he: string;
        ar: string;
        pt: string;
        it: string;
        de: string;
        fr: string;
    };
    locale: string;
    flagIcon?: string;
}

export const COUNTRY_CODES: CountryCode[] = [
    {
        name: 'Afghanistan',
        code: '+93',
        lang: {
            en: 'Afghanistan',
            es: 'Afganistán',
            da: 'Afghanistan',
            he: 'אפגניסטן',
            ar: 'أفغانستان',
            pt: 'Afeganistão',
            it: 'Afghanistan',
            de: 'Afghanistan',
            fr: 'Afghanistan'
        },
        locale: 'AF'
    },
    {
        name: 'Åland Islands',
        code: '+358 18',
        lang: {
            en: 'Åland Islands',
            es: 'Islas Aland',
            da: 'Ålandsøerne',
            he: 'איי אלנד',
            ar: 'جزر آلاند',
            pt: 'Ilhas Aland',
            it: 'Isole Aland',
            de: 'Åland-Inseln',
            fr: 'Iles Aland'
        },
        locale: 'AX'
    },
    {
        name: 'Albania',
        code: '+355',
        lang: {
            en: 'Albania',
            es: 'Albania',
            da: 'Albanien',
            he: 'אלבניה',
            ar: 'ألبانيا',
            pt: 'Albânia',
            it: 'Albania',
            de: 'Albanien',
            fr: 'Albanie'
        },
        locale: 'AL'
    },
    {
        name: 'Algeria',
        code: '+213',
        lang: {
            en: 'Algeria',
            es: 'Argelia',
            da: 'Algeriet',
            he: "אלג'יריה",
            ar: 'الجزائر',
            pt: 'Argélia',
            it: 'algeria',
            de: 'Algerien',
            fr: 'Algérie'
        },
        locale: 'DZ'
    },
    {
        name: 'American Samoa',
        code: '+1 684',
        lang: {
            en: 'American Samoa',
            es: 'Samoa Americana',
            da: 'Amerikansk Samoa',
            he: 'סמואה האמריקנית',
            ar: 'ساموا الأمريكية',
            pt: 'Samoa Americana',
            it: 'Samoa americane',
            de: 'Amerikanischen Samoa-Inseln',
            fr: 'Samoa américaines'
        },
        locale: 'AS'
    },
    {
        name: 'Andorra',
        code: '+376',
        lang: {
            en: 'Andorra',
            es: 'Andorra',
            da: 'Andorra',
            he: 'אנדורה',
            ar: 'أندورا',
            pt: 'Andorra',
            it: 'Andorra',
            de: 'Andorra',
            fr: 'Andorre'
        },
        locale: 'AD'
    },
    {
        name: 'Angola',
        code: '+244',
        lang: {
            en: 'Angola',
            es: 'Angola',
            da: 'Angola',
            he: 'אנגולה',
            ar: 'أنغولا',
            pt: 'Angola',
            it: 'angola',
            de: 'Angola',
            fr: 'Angola'
        },
        locale: 'AO'
    },
    {
        name: 'Anguilla',
        code: '+1 264',
        lang: {
            en: 'Anguilla',
            es: 'Anguilla',
            da: 'Anguilla',
            he: 'אנגווילה',
            ar: 'أنغيلا',
            pt: 'Anguilla',
            it: 'Anguilla',
            de: 'Anguilla',
            fr: 'Anguilla'
        },
        locale: 'AI'
    },
    {
        name: 'Antigua and Barbuda',
        code: '+1 268',
        lang: {
            en: 'Antigua and Barbuda',
            es: 'Antigua y Barbuda',
            da: 'Antigua og Barbuda',
            he: 'אנטיגואה וברבודה',
            ar: 'أنتيغوا وبربودا',
            pt: 'Antígua e Barbuda',
            it: 'Antigua e Barbuda',
            de: 'Antigua und Barbuda',
            fr: 'Antigua-et-Barbuda'
        },
        locale: 'AG'
    },
    {
        name: 'Argentina',
        code: '+54',
        lang: {
            en: 'Argentina',
            es: 'Argentina',
            da: 'Argentina',
            he: 'ארגנטינה',
            ar: 'الأرجنتين',
            pt: 'Argentina',
            it: 'Argentina',
            de: 'Argentinien',
            fr: 'Argentine'
        },
        locale: 'AR'
    },
    {
        name: 'Armenia',
        code: '+374',
        lang: {
            en: 'Armenia',
            es: 'Armenia',
            da: 'Armenien',
            he: 'ארמניה',
            ar: 'أرمينيا',
            pt: 'Armênia',
            it: 'Armenia',
            de: 'Armenien',
            fr: 'Arménie'
        },
        locale: 'AM'
    },
    {
        name: 'Aruba',
        code: '+297',
        lang: {
            en: 'Aruba',
            es: 'Aruba',
            da: 'Aruba',
            he: 'ארובה',
            ar: 'أروبا',
            pt: 'Aruba',
            it: 'aruba',
            de: 'Aruba',
            fr: 'Aruba'
        },
        locale: 'AW'
    },
    {
        name: 'Australia',
        code: '+61',
        lang: {
            en: 'Australia',
            es: 'Australia',
            da: 'Australien',
            he: 'אוסטרליה',
            ar: 'أستراليا',
            pt: 'Austrália',
            it: 'Australia',
            de: 'Australien',
            fr: 'Australie'
        },
        locale: 'AU',
        flagIcon: '130-australia.png'
    },
    {
        name: 'Austria',
        code: '+43',
        lang: {
            en: 'Austria',
            es: 'Austria',
            da: 'Østrig',
            he: 'אוסטריה',
            ar: 'النمسا',
            pt: 'Áustria',
            it: 'Austria',
            de: 'Österreich',
            fr: "L'Autriche"
        },
        locale: 'AT'
    },
    {
        name: 'Azerbaijan',
        code: '+994',
        lang: {
            en: 'Azerbaijan',
            es: 'Azerbaiyán',
            da: 'Aserbajdsjan',
            he: "אזרבייג'ן",
            ar: 'أذربيجان',
            pt: 'Azerbaijão',
            it: 'Azerbaijan',
            de: 'Aserbaidschan',
            fr: 'Azerbaïdjan'
        },
        locale: 'AZ'
    },
    {
        name: 'Bahamas',
        code: '+1 242',
        lang: {
            en: 'Bahamas',
            es: 'Bahamas',
            da: 'Bahamas',
            he: 'איי בהאמה',
            ar: 'الباهاما',
            pt: 'Bahamas',
            it: 'Bahamas',
            de: 'Bahamas',
            fr: 'Bahamas'
        },
        locale: 'BS'
    },
    {
        name: 'Bahrain',
        code: '+973',
        lang: {
            en: 'Bahrain',
            es: 'Bahrein',
            da: 'Bahrain',
            he: 'בחריין',
            ar: 'البحرين',
            pt: 'Bahrain',
            it: 'Bahrain',
            de: 'Bahrein',
            fr: 'Bahreïn'
        },
        locale: 'BH'
    },
    {
        name: 'Bangladesh',
        code: '+880',
        lang: {
            en: 'Bangladesh',
            es: 'Bangladesh',
            da: 'Bangladesh',
            he: 'בנגלדש',
            ar: 'بنغلاديش',
            pt: 'Bangladesh',
            it: 'Bangladesh',
            de: 'Bangladesch',
            fr: 'Bangladesh'
        },
        locale: 'BD'
    },
    {
        name: 'Barbados',
        code: '+1 246',
        lang: {
            en: 'Barbados',
            es: 'Barbados',
            da: 'Barbados',
            he: 'ברבדוס',
            ar: 'بربادوس',
            pt: 'Barbados',
            it: 'Barbados',
            de: 'Barbados',
            fr: 'Barbade'
        },
        locale: 'BB'
    },
    {
        name: 'Belarus',
        code: '+375',
        lang: {
            en: 'Belarus',
            es: 'Bielorrusia',
            da: 'Hviderusland',
            he: 'בלארוס',
            ar: 'روسيا البيضاء',
            pt: 'Belarus',
            it: 'Bielorussia',
            de: 'Weißrussland',
            fr: 'Biélorussie'
        },
        locale: 'BY'
    },
    {
        name: 'Belgium',
        code: '+32',
        lang: {
            en: 'Belgium',
            es: 'Bélgica',
            da: 'Belgien',
            he: 'בלגיה',
            ar: 'بلجيكا',
            pt: 'Bélgica',
            it: 'Belgio',
            de: 'Belgien',
            fr: 'Belgique'
        },
        locale: 'BE'
    },
    {
        name: 'Belize',
        code: '+501',
        lang: {
            en: 'Belize',
            es: 'Belice',
            da: 'Belize',
            he: 'בליז',
            ar: 'بليز',
            pt: 'Belize',
            it: 'Belize',
            de: 'Belize',
            fr: 'Belize'
        },
        locale: 'BZ'
    },
    {
        name: 'Benin',
        code: '+229',
        lang: {
            en: 'Benin',
            es: 'Benin',
            da: 'Benin',
            he: 'בנין',
            ar: 'بنين',
            pt: 'Benin',
            it: 'Benin',
            de: 'Benin',
            fr: 'Bénin'
        },
        locale: 'BJ'
    },
    {
        name: 'Bermuda',
        code: '+1 441',
        lang: {
            en: 'Bermuda',
            es: 'islas Bermudas',
            da: 'Bermuda',
            he: 'ברמודה',
            ar: 'برمودا',
            pt: 'Bermudas',
            it: 'Bermuda',
            de: 'Bermuda',
            fr: 'Bermudes'
        },
        locale: 'BM'
    },
    {
        name: 'Bhutan',
        code: '+975',
        lang: {
            en: 'Bhutan',
            es: 'Bután',
            da: 'Bhutan',
            he: 'בהוטן',
            ar: 'بوتان',
            pt: 'Butão',
            it: 'Bhutan',
            de: 'Bhutan',
            fr: 'Bhoutan'
        },
        locale: 'BT'
    },
    {
        name: 'Bolivia',
        code: '+591',
        lang: {
            en: 'Bolivia',
            es: 'Bolivia',
            da: 'Bolivia',
            he: 'בוליביה',
            ar: 'بوليفيا',
            pt: 'Bolívia',
            it: 'Bolivia',
            de: 'Bolivien',
            fr: 'Bolivie'
        },
        locale: 'BO'
    },
    {
        name: 'Bosnia and Herzegovina',
        code: '+387',
        lang: {
            en: 'Bosnia and Herzegovina',
            es: 'Bosnia y Herzegovina',
            da: 'Bosnien-Hercegovina',
            he: 'בוסניה והרצגובינה',
            ar: 'البوسنة والهرسك',
            pt: 'Bósnia e Herzegovina',
            it: 'Bosnia Erzegovina',
            de: 'Bosnien und Herzegowina',
            fr: 'Bosnie Herzégovine'
        },
        locale: 'BA'
    },
    {
        name: 'Botswana',
        code: '+267',
        lang: {
            en: 'Botswana',
            es: 'Botswana',
            da: 'Botswana',
            he: 'בוצוואנה',
            ar: 'بوتسوانا',
            pt: 'Botswana',
            it: 'Botswana',
            de: 'Botswana',
            fr: 'Botswana'
        },
        locale: 'BW'
    },
    {
        name: 'Brazil',
        code: '+55',
        lang: {
            en: 'Brazil',
            es: 'Brasil',
            da: 'Brasilien',
            he: 'ברזיל',
            ar: 'البرازيل',
            pt: 'Brasil',
            it: 'Brasile',
            de: 'Brasilien',
            fr: 'Brésil'
        },
        locale: 'BR'
    },
    {
        name: 'British Indian Ocean Territory',
        code: '+246',
        lang: {
            en: 'British Indian Ocean Territory',
            es: 'Territorio Británico del Océano Índico',
            da: 'British Indian Ocean Territory',
            he: 'טריטוריה בריטית באוקיינוס',
            ar: 'إقليم المحيط البريطاني الهندي',
            pt: 'Território Britânico do Oceano Índico',
            it: "Territorio britannico dell'Oceano Indiano",
            de: 'Britisches Territorium des Indischen Ozeans',
            fr: "Territoire britannique de l'océan Indien"
        },
        locale: 'IO'
    },
    {
        name: 'British Virgin Islands',
        code: '+1 284',
        lang: {
            en: 'British Virgin Islands',
            es: 'Islas Vírgenes Británicas',
            da: 'Britiske Jomfruøer',
            he: 'איי בתולה בריטיים',
            ar: 'جزر فيرجن البريطانية',
            pt: 'Ilhas Virgens Britânicas',
            it: 'Isole Vergini Britanniche',
            de: 'Britische Jungferninseln',
            fr: 'Îles Vierges britanniques'
        },
        locale: 'VG'
    },
    {
        name: 'Bulgaria',
        code: '+359',
        lang: {
            en: 'Bulgaria',
            es: 'Bulgaria',
            da: 'Bulgarien',
            he: 'בולגריה',
            ar: 'بلغاريا',
            pt: 'Bulgária',
            it: 'Bulgaria',
            de: 'Bulgarien',
            fr: 'Bulgarie'
        },
        locale: 'BG'
    },
    {
        name: 'Burkina Faso',
        code: '+226',
        lang: {
            en: 'Burkina Faso',
            es: 'Burkina Faso',
            da: 'Burkina Faso',
            he: 'בורקינה פאסו',
            ar: 'بوركينا فاسو',
            pt: 'Burkina Faso',
            it: 'Burkina Faso',
            de: 'Burkina Faso',
            fr: 'Burkina Faso'
        },
        locale: 'BF'
    },
    {
        name: 'Burundi',
        code: '+257',
        lang: {
            en: 'Burundi',
            es: 'Burundi',
            da: 'Burundi',
            he: 'בורונדי',
            ar: 'بوروندي',
            pt: 'Burundi',
            it: 'Burundi',
            de: 'Burundi',
            fr: 'Burundi'
        },
        locale: 'BI'
    },
    {
        name: 'Cape Verde',
        code: '+238',
        lang: {
            en: 'Cape Verde',
            es: 'Cabo Verde',
            da: 'Kap Verde',
            he: 'קייפ ורדה',
            ar: 'الرأس الأخضر',
            pt: 'cabo Verde',
            it: 'capo Verde',
            de: 'Kap Verde',
            fr: 'Cap-Vert'
        },
        locale: 'CV'
    },
    {
        name: 'Cambodia',
        code: '+855',
        lang: {
            en: 'Cambodia',
            es: 'Camboya',
            da: 'Cambodja',
            he: 'קמבודיה',
            ar: 'كمبوديا',
            pt: 'Camboja',
            it: 'Cambogia',
            de: 'Kambodscha',
            fr: 'Cambodge'
        },
        locale: 'KH'
    },
    {
        name: 'Cameroon',
        code: '+237',
        lang: {
            en: 'Cameroon',
            es: 'Camerún',
            da: 'Cameroun',
            he: 'קמרון',
            ar: 'الكاميرون',
            pt: 'Camarões',
            it: 'Camerun',
            de: 'Kamerun',
            fr: 'Cameroun'
        },
        locale: 'CM'
    },
    {
        name: 'Cayman Islands',
        code: '+1 345',
        lang: {
            en: 'Cayman Islands',
            es: 'Islas Caimán',
            da: 'Caymanøerne',
            he: 'איי קיימן',
            ar: 'جزر كايمان',
            pt: 'Ilhas Cayman',
            it: 'Isole Cayman',
            de: 'Cayman Inseln',
            fr: 'Îles Caïmans'
        },
        locale: 'KY'
    },
    {
        name: 'Central African Republic',
        code: '+236',
        lang: {
            en: 'Central African Republic',
            es: 'República Centroafricana',
            da: 'Den Centralafrikanske Republik',
            he: 'הרפובליקה המרכז - אפריקאית',
            ar: 'جمهورية افريقيا الوسطى',
            pt: 'República Centro-Africano',
            it: 'Repubblica Centrafricana',
            de: 'Zentralafrikanische Republik',
            fr: 'République centrafricaine'
        },
        locale: 'CF'
    },
    {
        name: 'Chad',
        code: '+235',
        lang: {
            en: 'Chad',
            es: 'Chad',
            da: 'Tchad',
            he: "צ'אד",
            ar: 'تشاد',
            pt: 'Chade',
            it: 'Chad',
            de: 'Tschad',
            fr: 'Tchad'
        },
        locale: 'TD'
    },
    {
        name: 'Chile',
        code: '+56',
        lang: {
            en: 'Chile',
            es: 'Chile',
            da: 'Chile',
            he: "צ'ילה",
            ar: 'تشيلي',
            pt: 'Chile',
            it: 'Chile',
            de: 'Chile',
            fr: 'Chili'
        },
        locale: 'CL'
    },
    {
        name: 'China',
        code: '+86',
        lang: {
            en: 'China',
            es: 'China',
            da: 'Kina',
            he: 'סין',
            ar: 'الصين',
            pt: 'China',
            it: 'Cina',
            de: 'China',
            fr: 'Chine'
        },
        locale: 'CN'
    },
    {
        name: 'Christmas Island',
        code: '+61 89164',
        lang: {
            en: 'Christmas Island',
            es: 'Isla de Navidad',
            da: 'Juleøen',
            he: 'אי חג המולד',
            ar: 'جزيرة الكريسماس',
            pt: 'Ilha do Natal',
            it: 'Isola di Natale',
            de: 'Weihnachtsinsel',
            fr: "L'île de noël"
        },
        locale: 'CX'
    },
    {
        name: 'Colombia',
        code: '+57',
        lang: {
            en: 'Colombia',
            es: 'Colombia',
            da: 'Colombia',
            he: 'קולומביה',
            ar: 'كولومبيا',
            pt: 'Colômbia',
            it: 'Colombia',
            de: 'Kolumbien',
            fr: 'Colombie'
        },
        locale: 'CO'
    },
    {
        name: 'Comoros',
        code: '+269',
        lang: {
            en: 'Comoros',
            es: 'Comoras',
            da: 'Comorerne',
            he: 'קומורו',
            ar: 'جزر القمر',
            pt: 'Comores',
            it: 'Comoros',
            de: 'Komoren',
            fr: 'Comores'
        },
        locale: 'KM'
    },
    {
        name: 'Cook Islands',
        code: '+682',
        lang: {
            en: 'Cook Islands',
            es: 'Islas Cook',
            da: 'cook-øerne',
            he: 'איי קוק',
            ar: 'جزر كوك',
            pt: 'Ilhas Cook',
            it: 'Isole Cook',
            de: 'Cookinseln',
            fr: 'les Îles Cook'
        },
        locale: 'CK'
    },
    {
        name: 'Costa Rica',
        code: '+506',
        lang: {
            en: 'Costa Rica',
            es: 'Costa Rica',
            da: 'Costa Rica',
            he: 'קוסטה ריקה',
            ar: 'كوستا ريكا',
            pt: 'Costa Rica',
            it: 'Costa Rica',
            de: 'Costa Rica',
            fr: 'Costa Rica'
        },
        locale: 'CR'
    },
    {
        name: 'Croatia',
        code: '+385',
        lang: {
            en: 'Croatia',
            es: 'Croacia',
            da: 'Kroatien',
            he: 'קרואטיה',
            ar: 'كرواتيا',
            pt: 'Croácia',
            it: 'Croazia',
            de: 'Kroatien',
            fr: 'Croatie'
        },
        locale: 'HR'
    },
    {
        name: 'Cuba',
        code: '+53',
        lang: {
            en: 'Cuba',
            es: 'Cuba',
            da: 'Cuba',
            he: 'קובה',
            ar: 'كوبا',
            pt: 'Cuba',
            it: 'Cuba',
            de: 'Kuba',
            fr: 'Cuba'
        },
        locale: 'CU'
    },
    {
        name: 'Cyprus',
        code: '+357',
        lang: {
            en: 'Cyprus',
            es: 'Chipre',
            da: 'Cypern',
            he: 'קפריסין',
            ar: 'قبرص',
            pt: 'Chipre',
            it: 'Cipro',
            de: 'Zypern',
            fr: 'Chypre'
        },
        locale: 'CY'
    },
    {
        name: 'Czech Republic',
        code: '+420',
        lang: {
            en: 'Czech Republic',
            es: 'Republica checa',
            da: 'Tjekkiet',
            he: "הרפובליקה הצ'כית",
            ar: 'جمهورية التشيك',
            pt: 'República Checa',
            it: 'Repubblica Ceca',
            de: 'Tschechische Republik',
            fr: 'République Tchèque'
        },
        locale: 'CZ'
    },
    {
        name: 'Denmark',
        code: '+45',
        lang: {
            en: 'Denmark',
            es: 'Dinamarca',
            da: 'Danmark',
            he: 'דנמרק',
            ar: 'الدنمارك',
            pt: 'Dinamarca',
            it: 'Danimarca',
            de: 'Dänemark',
            fr: 'Danemark'
        },
        locale: 'DK'
    },
    {
        name: 'Djibouti',
        code: '+253',
        lang: {
            en: 'Djibouti',
            es: 'Djibouti',
            da: 'Djibouti',
            he: "ג'יבוטי",
            ar: 'جيبوتي',
            pt: 'Djibouti',
            it: 'Gibuti',
            de: 'Dschibuti',
            fr: 'Djibouti'
        },
        locale: 'DJ'
    },
    {
        name: 'Dominica',
        code: '+1 767',
        lang: {
            en: 'Dominica',
            es: 'dominica',
            da: 'Dominica',
            he: 'דומיניקה',
            ar: 'دومينيكا',
            pt: 'Dominica',
            it: 'Dominica',
            de: 'Dominica',
            fr: 'Dominique'
        },
        locale: 'DM'
    },
    {
        name: 'Dominican Republic',
        code: '+1 829',
        lang: {
            en: 'Dominican Republic',
            es: 'República Dominicana',
            da: 'Dominikanske republik',
            he: 'הרפובליקה הדומיניקנית',
            ar: 'جمهورية الدومنيكان',
            pt: 'República Dominicana',
            it: 'Repubblica Dominicana',
            de: 'Dominikanische Republik',
            fr: 'République Dominicaine'
        },
        locale: 'DO'
    },
    {
        name: 'Ecuador',
        code: '+593',
        lang: {
            en: 'Ecuador',
            es: 'Ecuador',
            da: 'Ecuador',
            he: 'אקוודור',
            ar: 'الإكوادور',
            pt: 'Equador',
            it: 'Ecuador',
            de: 'Ecuador',
            fr: 'Equateur'
        },
        locale: 'EC'
    },
    {
        name: 'Egypt',
        code: '+20',
        lang: {
            en: 'Egypt',
            es: 'Egipto',
            da: 'Egypten',
            he: 'מצרים',
            ar: 'مصر',
            pt: 'Egito',
            it: 'Egitto',
            de: 'Ägypten',
            fr: 'Egypte'
        },
        locale: 'EG'
    },
    {
        name: 'El Salvador',
        code: '+503',
        lang: {
            en: 'El Salvador',
            es: 'El Salvador',
            da: 'El Salvador',
            he: 'אל סלבדור',
            ar: 'السلفادور',
            pt: 'El Salvador',
            it: 'El Salvador',
            de: 'El Salvador',
            fr: 'Le Salvador'
        },
        locale: 'SV'
    },
    {
        name: 'Equatorial Guinea',
        code: '+240',
        lang: {
            en: 'Equatorial Guinea',
            es: 'Guinea Ecuatorial',
            da: 'Ækvatorial Guinea',
            he: 'גיניאה המשוונית',
            ar: 'غينيا الإستوائية',
            pt: 'Guiné Equatorial',
            it: 'Guinea Equatoriale',
            de: 'Äquatorialguinea',
            fr: 'Guinée Équatoriale'
        },
        locale: 'GQ'
    },
    {
        name: 'Eritrea',
        code: '+291',
        lang: {
            en: 'Eritrea',
            es: 'Eritrea',
            da: 'Eritrea',
            he: 'אריתריאה',
            ar: 'إريتريا',
            pt: 'Eritrea',
            it: "l'Eritrea",
            de: 'Eritrea',
            fr: 'Érythrée'
        },
        locale: 'ER'
    },
    {
        name: 'Estonia',
        code: '+372',
        lang: {
            en: 'Estonia',
            es: 'Estonia',
            da: 'Estland',
            he: 'אסטוניה',
            ar: 'استونيا',
            pt: 'Estônia',
            it: 'Estonia',
            de: 'Estland',
            fr: 'Estonie'
        },
        locale: 'EE'
    },
    {
        name: 'Ethiopia',
        code: '+251',
        lang: {
            en: 'Ethiopia',
            es: 'Etiopía',
            da: 'Etiopien',
            he: 'אתיופיה',
            ar: 'أثيوبيا',
            pt: 'Etiópia',
            it: 'Etiopia',
            de: 'Äthiopien',
            fr: 'Ethiopie'
        },
        locale: 'ET'
    },
    {
        name: 'Falkland Islands',
        code: '+500',
        lang: {
            en: 'Falkland Islands',
            es: 'Islas Malvinas',
            da: 'Falklandsøerne',
            he: 'איי פוקלנד',
            ar: 'جزر فوكلاند',
            pt: 'Ilhas Falkland',
            it: 'Isole Falkland',
            de: 'Falkland Inseln',
            fr: 'les îles Falkland'
        },
        locale: 'FK'
    },
    {
        name: 'Faroe Islands',
        code: '+298',
        lang: {
            en: 'Faroe Islands',
            es: 'Islas Faroe',
            da: 'Færøerne',
            he: 'איי פרו',
            ar: 'جزر صناعية',
            pt: 'ilhas Faroe',
            it: 'Isole Faroe',
            de: 'Färöer Inseln',
            fr: 'Îles Féroé'
        },
        locale: 'FO'
    },
    {
        name: 'Fiji',
        code: '+679',
        lang: {
            en: 'Fiji',
            es: 'Fiji',
            da: 'Fiji',
            he: "פיג'י",
            ar: 'فيجي',
            pt: 'Fiji',
            it: 'Fiji',
            de: 'Fidschi',
            fr: 'Fidji'
        },
        locale: 'FJ'
    },
    {
        name: 'Finland',
        code: '+358',
        lang: {
            en: 'Finland',
            es: 'Finlandia',
            da: 'Finland',
            he: 'פינלנד',
            ar: 'فنلندا',
            pt: 'Finlândia',
            it: 'Finlandia',
            de: 'Finnland',
            fr: 'Finlande'
        },
        locale: 'FI'
    },
    {
        name: 'France',
        code: '+33',
        lang: {
            en: 'France',
            es: 'Francia',
            da: 'Frankrig',
            he: 'צרפת',
            ar: 'فرنسا',
            pt: 'França',
            it: 'Francia',
            de: 'Frankreich',
            fr: 'France'
        },
        locale: 'FR'
    },
    {
        name: 'French Guiana',
        code: '+594',
        lang: {
            en: 'French Guiana',
            es: 'Guayana francés',
            da: 'Fransk Guiana',
            he: 'גיאנה הצרפתית',
            ar: 'غيانا الفرنسية',
            pt: 'Guiana Francesa',
            it: 'Guiana francese',
            de: 'Französisch-Guayana',
            fr: 'Guinée Française'
        },
        locale: 'GF'
    },
    {
        name: 'French Polynesia',
        code: '+689',
        lang: {
            en: 'French Polynesia',
            es: 'Polinesia francés',
            da: 'Fransk Polynesien',
            he: 'פולינזיה הצרפתית',
            ar: 'بولينيزيا الفرنسية',
            pt: 'Polinésia Francesa',
            it: 'Polinesia francese',
            de: 'Französisch Polynesien',
            fr: 'Polynésie française'
        },
        locale: 'PF'
    },
    {
        name: 'Gabon',
        code: '+241',
        lang: {
            en: 'Gabon',
            es: 'Gabón',
            da: 'Gabon',
            he: 'גבון',
            ar: 'الغابون',
            pt: 'Gabão',
            it: 'Gabon',
            de: 'Gabun',
            fr: 'Gabon'
        },
        locale: 'GA'
    },
    {
        name: 'Gambia',
        code: '+220',
        lang: {
            en: 'Gambia',
            es: 'Gambia',
            da: 'Gambia',
            he: 'גמביה',
            ar: 'غامبيا',
            pt: 'Gâmbia',
            it: 'Gambia',
            de: 'Gambia',
            fr: 'Gambie'
        },
        locale: 'GM'
    },
    {
        name: 'Georgia',
        code: '+995',
        lang: {
            en: 'Georgia',
            es: 'Georgia',
            da: 'Georgien',
            he: 'גיאורגיה',
            ar: 'جورجيا',
            pt: 'Georgia',
            it: 'Georgia',
            de: 'Georgia',
            fr: 'Géorgie'
        },
        locale: 'GE'
    },
    {
        name: 'Germany',
        code: '+49',
        lang: {
            en: 'Germany',
            es: 'Alemania',
            da: 'Tyskland',
            he: 'גרמניה',
            ar: 'ألمانيا',
            pt: 'Alemanha',
            it: 'Germania',
            de: 'Deutschland',
            fr: 'Allemagne'
        },
        locale: 'DE'
    },
    {
        name: 'Ghana',
        code: '+233',
        lang: {
            en: 'Ghana',
            es: 'Ghana',
            da: 'Ghana',
            he: 'גאנה',
            ar: 'غانا',
            pt: 'Gana',
            it: 'Ghana',
            de: 'Ghana',
            fr: 'Ghana'
        },
        locale: 'GH'
    },
    {
        name: 'Gibraltar',
        code: '+350',
        lang: {
            en: 'Gibraltar',
            es: 'Gibraltar',
            da: 'Gibraltar',
            he: 'גיברלטר',
            ar: 'جبل طارق',
            pt: 'Gibraltar',
            it: 'Gibilterra',
            de: 'Gibraltar',
            fr: 'Gibraltar'
        },
        locale: 'GI'
    },
    {
        name: 'Greece',
        code: '+30',
        lang: {
            en: 'Greece',
            es: 'Grecia',
            da: 'Grækenland',
            he: 'יוון',
            ar: 'اليونان',
            pt: 'Grécia',
            it: 'Grecia',
            de: 'Griechenland',
            fr: 'Grèce'
        },
        locale: 'GR'
    },
    {
        name: 'Greenland',
        code: '+299',
        lang: {
            en: 'Greenland',
            es: 'Tierra Verde',
            da: 'Grønland',
            he: 'גרינלנד',
            ar: 'الأرض الخضراء',
            pt: 'Groenlândia',
            it: 'Groenlandia',
            de: 'Grönland',
            fr: 'Groenland'
        },
        locale: 'GL'
    },
    {
        name: 'Grenada',
        code: '+1 473',
        lang: {
            en: 'Grenada',
            es: 'Granada',
            da: 'Grenada',
            he: 'גרנדה',
            ar: 'غرينادا',
            pt: 'Grenada',
            it: 'Grenada',
            de: 'Grenada',
            fr: 'Grenade'
        },
        locale: 'GD'
    },
    {
        name: 'Guadeloupe',
        code: '+590',
        lang: {
            en: 'Guadeloupe',
            es: 'Guadalupe',
            da: 'Guadeloupe',
            he: 'גוואדלופ',
            ar: 'جوادلوب',
            pt: 'Guadalupe',
            it: 'Guadeloupe',
            de: 'Guadeloupe',
            fr: 'Guadeloupe'
        },
        locale: 'GP'
    },
    {
        name: 'Guam',
        code: '+1 671',
        lang: {
            en: 'Guam',
            es: 'Guam',
            da: 'Guam',
            he: 'גואם',
            ar: 'غوام',
            pt: 'Guam',
            it: 'Guam',
            de: 'Guam',
            fr: 'Guam'
        },
        locale: 'GU'
    },
    {
        name: 'Guatemala',
        code: '+502',
        lang: {
            en: 'Guatemala',
            es: 'Guatemala',
            da: 'Guatemala',
            he: 'גואטמלה',
            ar: 'غواتيمالا',
            pt: 'Guatemala',
            it: 'Guatemala',
            de: 'Guatemala',
            fr: 'Guatemala'
        },
        locale: 'GT'
    },
    {
        name: 'Guernsey',
        code: '+44 1481 +44 7781',
        lang: {
            en: 'Guernsey',
            es: 'Guernesey',
            da: 'Guernsey',
            he: 'גרנזי',
            ar: 'غيرنسي',
            pt: 'Guernsey',
            it: 'maglione',
            de: 'Guernsey',
            fr: 'Guernesey'
        },
        locale: 'GG'
    },
    {
        name: 'Guinea',
        code: '+224',
        lang: {
            en: 'Guinea',
            es: 'Guinea',
            da: 'Guinea',
            he: 'גיניאה',
            ar: 'غينيا',
            pt: 'Guiné',
            it: 'Guinea',
            de: 'Guinea',
            fr: 'Guinée'
        },
        locale: 'GN'
    },
    {
        name: 'Guinea-Bissau',
        code: '+245',
        lang: {
            en: 'Guinea-Bissau',
            es: 'Guinea-Bissau',
            da: 'Guinea-Bissau',
            he: 'גינאה ביסאו',
            ar: 'غينيا بيساو',
            pt: 'Guiné-Bissau',
            it: 'Guinea-Bissau',
            de: 'Guinea-Bissau',
            fr: 'Guinée-Bissau'
        },
        locale: 'GW'
    },
    {
        name: 'Guyana',
        code: '+592',
        lang: {
            en: 'Guyana',
            es: 'Guayana',
            da: 'Guyana',
            he: 'גיאנה',
            ar: 'غيانا',
            pt: 'Guiana',
            it: 'Guyana',
            de: 'Guyana',
            fr: 'Guyane'
        },
        locale: 'GY'
    },
    {
        name: 'Haiti',
        code: '+509',
        lang: {
            en: 'Haiti',
            es: 'Haití',
            da: 'Haiti',
            he: 'איטי',
            ar: 'هايتي',
            pt: 'Haiti',
            it: 'Haiti',
            de: 'Haiti',
            fr: 'Haïti'
        },
        locale: 'HT'
    },
    {
        name: 'Honduras',
        code: '+504',
        lang: {
            en: 'Honduras',
            es: 'Honduras',
            da: 'Honduras',
            he: 'הונדורס',
            ar: 'هندوراس',
            pt: 'Honduras',
            it: 'Honduras',
            de: 'Honduras',
            fr: 'Honduras'
        },
        locale: 'HN'
    },
    {
        name: 'Hong Kong',
        code: '+852',
        lang: {
            en: 'Hong Kong',
            es: 'Hong Kong',
            da: 'Hong Kong',
            he: 'הונג קונג',
            ar: 'هونج كونج',
            pt: 'Hong Kong',
            it: 'Hong Kong',
            de: 'Hongkong',
            fr: 'Hong Kong'
        },
        locale: 'HK'
    },
    {
        name: 'Hungary',
        code: '+36',
        lang: {
            en: 'Hungary',
            es: 'Hungría',
            da: 'Ungarn',
            he: 'הונגריה',
            ar: 'اليونان',
            pt: 'Hungria',
            it: 'Ungheria',
            de: 'Ungarn',
            fr: 'Hongrie'
        },
        locale: 'HU'
    },
    {
        name: 'Iceland',
        code: '+354',
        lang: {
            en: 'Iceland',
            es: 'Islandia',
            da: 'Island',
            he: 'איסלנד',
            ar: 'أيسلندا',
            pt: 'Islândia',
            it: 'Islanda',
            de: 'Island',
            fr: 'Islande'
        },
        locale: 'IS'
    },
    {
        name: 'India',
        code: '+91',
        lang: {
            en: 'India',
            es: 'India',
            da: 'Indien',
            he: 'הודו',
            ar: 'الهند',
            pt: 'Índia',
            it: 'India',
            de: 'Indien',
            fr: 'Inde'
        },
        locale: 'IN'
    },
    {
        name: 'Indonesia',
        code: '+62',
        lang: {
            en: 'Indonesia',
            es: 'Indonesia',
            da: 'Indonesien',
            he: 'אינדונזיה',
            ar: 'أندونيسيا',
            pt: 'Indonésia',
            it: 'Indonesia',
            de: 'Indonesien',
            fr: 'Indonésie'
        },
        locale: 'ID'
    },
    {
        name: 'Iran',
        code: '+98',
        lang: {
            en: 'Iran',
            es: 'Corrí',
            da: 'Iran',
            he: 'איראן',
            ar: 'إيران',
            pt: 'Irã',
            it: 'Ho corso',
            de: 'Ich rannte',
            fr: 'Iran'
        },
        locale: 'IR'
    },
    {
        name: 'Iraq',
        code: '+964',
        lang: {
            en: 'Iraq',
            es: 'Irak',
            da: 'Irak',
            he: 'עיראק',
            ar: 'العراق',
            pt: 'Iraque',
            it: 'Iraq',
            de: 'Irak',
            fr: 'Irak'
        },
        locale: 'IQ'
    },
    {
        name: 'Ireland',
        code: '+353',
        lang: {
            en: 'Ireland',
            es: 'Irlanda',
            da: 'Irland',
            he: 'אירלנד',
            ar: 'أيرلندا',
            pt: 'Irlanda',
            it: 'Irlanda',
            de: 'Irland',
            fr: 'Irlande'
        },
        locale: 'IE',
        flagIcon: '070-ireland.png'
    },
    {
        name: 'Isle of Man',
        code: '+44 1624 +44 7524',
        lang: {
            en: 'Isle of Man',
            es: 'Isla del hombre',
            da: 'Isle of Man',
            he: 'האי מאן',
            ar: 'جزيرة آيل أوف مان',
            pt: 'Isle of Man',
            it: 'Isola di Man',
            de: 'Isle of Man',
            fr: 'Isle of Man'
        },
        locale: 'IM'
    },
    {
        name: 'Israel',
        code: '+972',
        lang: {
            en: 'Israel',
            es: 'Israel',
            da: 'Israel',
            he: 'ישראל',
            ar: 'إسرائيل',
            pt: 'Israel',
            it: 'Israele',
            de: 'Israel',
            fr: 'Israël'
        },
        locale: 'IL',
        flagIcon: '060-israel.png'
    },
    {
        name: 'Italy',
        code: '+39',
        lang: {
            en: 'Italy',
            es: 'Italia',
            da: 'Italien',
            he: 'איטליה',
            ar: 'إيطاليا',
            pt: 'Itália',
            it: 'Italia',
            de: 'Italien',
            fr: 'Italie'
        },
        locale: 'IT'
    },
    {
        name: 'Jamaica',
        code: '+1 876',
        lang: {
            en: 'Jamaica',
            es: 'Jamaica',
            da: 'Jamaica',
            he: "בג'מייקה",
            ar: 'جامايكا',
            pt: 'Jamaica',
            it: 'Giamaica',
            de: 'Jamaika',
            fr: 'Jamaïque'
        },
        locale: 'JM'
    },
    {
        name: 'Japan',
        code: '+81',
        lang: {
            en: 'Japan',
            es: 'Japón',
            da: 'Japan',
            he: 'יפן',
            ar: 'اليابان',
            pt: 'Japão',
            it: 'Giappone',
            de: 'Japan',
            fr: 'Japon'
        },
        locale: 'JP'
    },
    {
        name: 'Jersey',
        code: '+44 1534',
        lang: {
            en: 'Jersey',
            es: 'Jersey',
            da: 'Jersey',
            he: "ג'רזי",
            ar: 'جيرسي',
            pt: 'camisola',
            it: 'maglia',
            de: 'Jersey',
            fr: 'Jersey'
        },
        locale: 'JE'
    },
    {
        name: 'Jordan',
        code: '+962',
        lang: {
            en: 'Jordan',
            es: 'Jordán',
            da: 'Jordan',
            he: 'ירדן',
            ar: 'الأردن',
            pt: 'Jordânia',
            it: 'Giordania',
            de: 'Jordan',
            fr: 'Jordan'
        },
        locale: 'JO'
    },
    {
        name: 'Kazakhstan',
        code: '+7 6 +7 7',
        lang: {
            en: 'Kazakhstan',
            es: 'Kazajstán',
            da: 'Kasakhstan',
            he: 'קזחסטן',
            ar: 'كازاخستان',
            pt: 'Cazaquistão',
            it: 'Kazakistan',
            de: 'Kasachstan',
            fr: 'Kazakhstan'
        },
        locale: 'KZ'
    },
    {
        name: 'Kenya',
        code: '+254',
        lang: {
            en: 'Kenya',
            es: 'Kenia',
            da: 'Kenya',
            he: 'קנייה',
            ar: 'كينيا',
            pt: 'Quênia',
            it: 'Kenia',
            de: 'Kenia',
            fr: 'Kenya'
        },
        locale: 'KE'
    },
    {
        name: 'Kiribati',
        code: '+686',
        lang: {
            en: 'Kiribati',
            es: 'Kiribati',
            da: 'Kiribati',
            he: 'קיריבטי',
            ar: 'كيريباس',
            pt: 'Kiribati',
            it: 'Kiribati',
            de: 'Kiribati',
            fr: 'Kiribati'
        },
        locale: 'KI'
    },
    {
        name: 'Kosovo',
        code: '+383',
        lang: {
            en: 'Kosovo',
            es: 'Kosovo',
            da: 'Kosovo',
            he: 'קוסובו',
            ar: 'كوسوفو',
            pt: 'Kosovo',
            it: 'Kosovo',
            de: 'Kosovo',
            fr: 'Kosovo'
        },
        locale: 'KV'
    },
    {
        name: 'Kuwait',
        code: '+965',
        lang: {
            en: 'Kuwait',
            es: 'Kuwait',
            da: 'Kuwait',
            he: 'כווית',
            ar: 'الكويت',
            pt: 'Kuweit',
            it: 'Kuwait',
            de: 'Kuwait',
            fr: 'Koweit'
        },
        locale: 'KW'
    },
    {
        name: 'Kyrgyzstan',
        code: '+996',
        lang: {
            en: 'Kyrgyzstan',
            es: 'Kirguizistán',
            da: 'Kirgisistan',
            he: 'קירגיזסטן',
            ar: 'قرغيزستان',
            pt: 'Quirguistão',
            it: 'Kyrgyzstan',
            de: 'Kirgisistan',
            fr: 'Kirghizistan'
        },
        locale: 'KG'
    },
    {
        name: 'Laos',
        code: '+856',
        lang: {
            en: 'Laos',
            es: 'Laos',
            da: 'Laos',
            he: 'לאוס',
            ar: 'لاوس',
            pt: 'Laos',
            it: 'Laos',
            de: 'Laos',
            fr: 'Laos'
        },
        locale: 'LA'
    },
    {
        name: 'Latvia',
        code: '+371',
        lang: {
            en: 'Latvia',
            es: 'Letonia',
            da: 'Letland',
            he: 'לטביה',
            ar: 'لاتفيا',
            pt: 'Letônia',
            it: 'Lettonia',
            de: 'Lettland',
            fr: 'Lettonie'
        },
        locale: 'LV'
    },
    {
        name: 'Lebanon',
        code: '+961',
        lang: {
            en: 'Lebanon',
            es: 'Líbano',
            da: 'Libanon',
            he: 'לבנון',
            ar: 'لبنان',
            pt: 'Líbano',
            it: 'Libano',
            de: 'Libanon',
            fr: 'Liban'
        },
        locale: 'LB'
    },
    {
        name: 'Lesotho',
        code: '+266',
        lang: {
            en: 'Lesotho',
            es: 'Lesoto',
            da: 'Lesotho',
            he: 'לסוטו',
            ar: 'ليسوتو',
            pt: 'Lesoto',
            it: 'Lesoto',
            de: 'Lesotho',
            fr: 'Lesotho'
        },
        locale: 'LS'
    },
    {
        name: 'Liberia',
        code: '+231',
        lang: {
            en: 'Liberia',
            es: 'Liberia',
            da: 'Liberia',
            he: 'ליבריה',
            ar: 'ليبيريا',
            pt: 'Libéria',
            it: 'Liberia',
            de: 'Liberia',
            fr: 'Libéria'
        },
        locale: 'LR'
    },
    {
        name: 'Libya',
        code: '+218',
        lang: {
            en: 'Libya',
            es: 'Libia',
            da: 'Libyen',
            he: 'לוב',
            ar: 'ليبيا',
            pt: 'Líbia',
            it: 'Libia',
            de: 'Libyen',
            fr: 'Libye'
        },
        locale: 'LY'
    },
    {
        name: 'Liechtenstein',
        code: '+423',
        lang: {
            en: 'Liechtenstein',
            es: 'Liechtenstein',
            da: 'Liechtenstein',
            he: 'ליכטנשטיין',
            ar: 'ليختنشتاين',
            pt: 'Liechtenstein',
            it: 'Liechtenstein',
            de: 'Liechtenstein',
            fr: 'Liechtenstein'
        },
        locale: 'LI'
    },
    {
        name: 'Lithuania',
        code: '+370',
        lang: {
            en: 'Lithuania',
            es: 'Lituania',
            da: 'Litauen',
            he: 'ליטא',
            ar: 'ليتوانيا',
            pt: 'Lituânia',
            it: 'Lituania',
            de: 'Litauen',
            fr: 'Lituanie'
        },
        locale: 'LT'
    },
    {
        name: 'Luxembourg',
        code: '+352',
        lang: {
            en: 'Luxembourg',
            es: 'Luxemburgo',
            da: 'Luxembourg',
            he: 'לוקסמבורג',
            ar: 'لوكسمبورغ',
            pt: 'Luxemburgo',
            it: 'Lussemburgo',
            de: 'Luxemburg',
            fr: 'Luxembourg'
        },
        locale: 'LU'
    },
    {
        name: 'Macao',
        code: '+853',
        lang: {
            en: 'Macao',
            es: 'Macao',
            da: 'Macao',
            he: 'מקאו',
            ar: 'ماكاو',
            pt: 'Macau',
            it: 'Macao',
            de: 'Macao',
            fr: 'Macao'
        },
        locale: 'MO'
    },
    {
        name: 'Madagascar',
        code: '+261',
        lang: {
            en: 'Madagascar',
            es: 'Madagascar',
            da: 'Madagaskar',
            he: 'מדגסקר',
            ar: 'مدغشقر',
            pt: 'Madagáscar',
            it: 'Madagascar',
            de: 'Madagaskar',
            fr: 'Madagascar'
        },
        locale: 'MG'
    },
    {
        name: 'Malawi',
        code: '+265',
        lang: {
            en: 'Malawi',
            es: 'Malawi',
            da: 'Malawi',
            he: 'מלאווי',
            ar: 'مالاوي',
            pt: 'Malavi',
            it: 'Malawi',
            de: 'Malawi',
            fr: 'Malawi'
        },
        locale: 'MW'
    },
    {
        name: 'Malaysia',
        code: '+60',
        lang: {
            en: 'Malaysia',
            es: 'Malasia',
            da: 'Malaysia',
            he: 'מלזיה',
            ar: 'ماليزيا',
            pt: 'Malásia',
            it: 'Malaysia',
            de: 'Malaysia',
            fr: 'Malaisie'
        },
        locale: 'MY'
    },
    {
        name: 'Maldives',
        code: '+960',
        lang: {
            en: 'Maldives',
            es: 'Maldivas',
            da: 'Maldiverne',
            he: 'האיים המלדיביים',
            ar: 'جزر المالديف',
            pt: 'Maldivas',
            it: 'Maldive',
            de: 'Malediven',
            fr: 'Maldives'
        },
        locale: 'MV'
    },
    {
        name: 'Mali',
        code: '+223',
        lang: {
            en: 'Mali',
            es: 'mali',
            da: 'Mali',
            he: 'מאלי',
            ar: 'مالي',
            pt: 'Mali',
            it: 'Mali',
            de: 'Mali',
            fr: 'Mali'
        },
        locale: 'ML'
    },
    {
        name: 'Malta',
        code: '+356',
        lang: {
            en: 'Malta',
            es: 'Malta',
            da: 'Malta',
            he: 'מלטה',
            ar: 'مالطا',
            pt: 'Malta',
            it: 'Malta',
            de: 'Malta',
            fr: 'Malte'
        },
        locale: 'MT'
    },
    {
        name: 'Marshall Islands',
        code: '+692',
        lang: {
            en: 'Marshall Islands',
            es: 'Islas Marshall',
            da: 'Marshalløerne',
            he: 'איי מרשל',
            ar: 'جزر مارشال',
            pt: 'Ilhas Marshall',
            it: 'Isole Marshall',
            de: 'Marshallinseln',
            fr: 'Iles Marshall'
        },
        locale: 'MH'
    },
    {
        name: 'Martinique',
        code: '+596',
        lang: {
            en: 'Martinique',
            es: 'Martinica',
            da: 'Martinique',
            he: 'מרטיניק',
            ar: 'مارتينيك',
            pt: 'Martinique',
            it: 'Martinique',
            de: 'Martinique',
            fr: 'Martinique'
        },
        locale: 'MQ'
    },
    {
        name: 'Mauritania',
        code: '+222',
        lang: {
            en: 'Mauritania',
            es: 'Mauritania',
            da: 'Mauretanien',
            he: 'מאוריטניה',
            ar: 'موريتانيا',
            pt: 'Mauritânia',
            it: 'Mauritania',
            de: 'Mauretanien',
            fr: 'Mauritanie'
        },
        locale: 'MR'
    },
    {
        name: 'Mauritius',
        code: '+230',
        lang: {
            en: 'Mauritius',
            es: 'Isla mauricio',
            da: 'Mauritius',
            he: 'מאוריציוס',
            ar: 'موريشيوس',
            pt: 'Mauritius',
            it: 'Mauritius',
            de: 'Mauritius',
            fr: 'Ile Maurice'
        },
        locale: 'MU'
    },
    {
        name: 'Mayotte',
        code: '+262 269 +262 639',
        lang: {
            en: 'Mayotte',
            es: 'Mayotte',
            da: 'Mayotte',
            he: 'מיוט',
            ar: 'مايوت',
            pt: 'Mayotte',
            it: 'Mayotte',
            de: 'Mayotte',
            fr: 'Mayotte'
        },
        locale: 'YT'
    },
    {
        name: 'Mexico',
        code: '+52',
        lang: {
            en: 'Mexico',
            es: 'México',
            da: 'Mexico',
            he: 'מקסיקו',
            ar: 'المكسيك',
            pt: 'México',
            it: 'Messico',
            de: 'Mexiko',
            fr: 'Mexique'
        },
        locale: 'MX'
    },
    {
        name: 'Moldova',
        code: '+373',
        lang: {
            en: 'Moldova',
            es: 'Moldavia',
            da: 'Moldova',
            he: 'מולדובה',
            ar: 'مولدوفا',
            pt: 'Moldova',
            it: 'Moldova',
            de: 'Moldawien',
            fr: 'Moldavie'
        },
        locale: 'MD'
    },
    {
        name: 'Monaco',
        code: '+377',
        lang: {
            en: 'Monaco',
            es: 'Mónaco',
            da: 'Monaco',
            he: 'מונקו',
            ar: 'موناكو',
            pt: 'Monaco',
            it: 'Monaco',
            de: 'Monaco',
            fr: 'Monaco'
        },
        locale: 'MC'
    },
    {
        name: 'Mongolia',
        code: '+976',
        lang: {
            en: 'Mongolia',
            es: 'Mongolia',
            da: 'Mongoliet',
            he: 'מונגוליה',
            ar: 'منغوليا',
            pt: 'Mongólia',
            it: 'Mongolia',
            de: 'Mongolei',
            fr: 'Mongolie'
        },
        locale: 'MN'
    },
    {
        name: 'Montenegro',
        code: '+382',
        lang: {
            en: 'Montenegro',
            es: 'Montenegro',
            da: 'Montenegro',
            he: 'מונטנגרו',
            ar: 'الجبل الأسود',
            pt: 'Montenegro',
            it: 'Montenegro',
            de: 'Montenegro',
            fr: 'Monténégro'
        },
        locale: 'ME'
    },
    {
        name: 'Montserrat',
        code: '+1 664',
        lang: {
            en: 'Montserrat',
            es: 'Montserrat',
            da: 'Montserrat',
            he: 'מונטסראט',
            ar: 'مونتسيرات',
            pt: 'Montserrat',
            it: 'Montserrat',
            de: 'Montserrat',
            fr: 'Montserrat'
        },
        locale: 'MS'
    },
    {
        name: 'Morocco',
        code: '+212',
        lang: {
            en: 'Morocco',
            es: 'Marruecos',
            da: 'Marokko',
            he: 'מרוקו',
            ar: 'المغرب',
            pt: 'Marrocos',
            it: 'Marocco',
            de: 'Marokko',
            fr: 'Maroc'
        },
        locale: 'MA'
    },
    {
        name: 'Mozambique',
        code: '+258',
        lang: {
            en: 'Mozambique',
            es: 'Mozambique',
            da: 'Mozambique',
            he: 'מוזמביק',
            ar: 'موزمبيق',
            pt: 'Moçambique',
            it: 'Mozambico',
            de: 'Mosambik',
            fr: 'Mozambique'
        },
        locale: 'MZ'
    },
    {
        name: 'Namibia',
        code: '+264',
        lang: {
            en: 'Namibia',
            es: 'Namibia',
            da: 'Namibia',
            he: 'נמיביה',
            ar: 'ناميبيا',
            pt: 'Namíbia',
            it: 'Namibia',
            de: 'Namibia',
            fr: 'Namibie'
        },
        locale: 'NA'
    },
    {
        name: 'Nauru',
        code: '+674',
        lang: {
            en: 'Nauru',
            es: 'Nauru',
            da: 'Nauru',
            he: 'נאורו',
            ar: 'ناورو',
            pt: 'Nauru',
            it: 'Nauru',
            de: 'Nauru',
            fr: 'Nauru'
        },
        locale: 'NR'
    },
    {
        name: 'Nepal',
        code: '+977',
        lang: {
            en: 'Nepal',
            es: 'Nepal',
            da: 'Nepal',
            he: 'נפאל',
            ar: 'نيبال',
            pt: 'Nepal',
            it: 'Nepal',
            de: 'Nepal',
            fr: 'Népal'
        },
        locale: 'NP'
    },
    {
        name: 'Netherlands',
        code: '+31',
        lang: {
            en: 'Netherlands',
            es: 'Países Bajos',
            da: 'Holland',
            he: 'הולנד',
            ar: 'هولندا',
            pt: 'Países Baixos',
            it: 'Olanda',
            de: 'Niederlande',
            fr: 'Pays-Bas'
        },
        locale: 'NL'
    },
    {
        name: 'New Caledonia',
        code: '+687',
        lang: {
            en: 'New Caledonia',
            es: 'Nueva Caledonia',
            da: 'Ny Kaledonien',
            he: 'קלדוניה החדשה',
            ar: 'كاليدونيا الجديدة',
            pt: 'Nova Caledônia',
            it: 'Nuova Caledonia',
            de: 'Neu-Kaledonien',
            fr: 'Nouvelle Calédonie'
        },
        locale: 'NC'
    },
    {
        name: 'New Zealand',
        code: '+64',
        lang: {
            en: 'New Zealand',
            es: 'Nueva Zelanda',
            da: 'New Zealand',
            he: 'ניו זילנד',
            ar: 'نيوزيلاندا',
            pt: 'Nova Zelândia',
            it: 'Nuova Zelanda',
            de: 'Neuseeland',
            fr: 'Nouvelle-Zélande'
        },
        locale: 'NZ',
        flagIcon: '048-new-zealand.png'
    },
    {
        name: 'Nicaragua',
        code: '+505',
        lang: {
            en: 'Nicaragua',
            es: 'Nicaragua',
            da: 'Nicaragua',
            he: 'ניקרגואה',
            ar: 'نيكاراغوا',
            pt: 'Nicarágua',
            it: 'Nicaragua',
            de: 'Nicaragua',
            fr: 'Nicaragua'
        },
        locale: 'NI'
    },
    {
        name: 'Niger',
        code: '+227',
        lang: {
            en: 'Niger',
            es: 'Níger',
            da: 'Niger',
            he: "ניז'ר",
            ar: 'النيجر',
            pt: 'Níger',
            it: 'Niger',
            de: 'Niger',
            fr: 'Niger'
        },
        locale: 'NE'
    },
    {
        name: 'Nigeria',
        code: '+234',
        lang: {
            en: 'Nigeria',
            es: 'Nigeria',
            da: 'Nigeria',
            he: 'ניגריה',
            ar: 'نيجيريا',
            pt: 'Nigéria',
            it: 'Nigeria',
            de: 'Nigeria',
            fr: 'Nigeria'
        },
        locale: 'NG'
    },
    {
        name: 'Niue',
        code: '+683',
        lang: {
            en: 'Niue',
            es: 'Niue',
            da: 'Niue',
            he: 'ניואה',
            ar: 'نيوي',
            pt: 'Niue',
            it: 'Niue',
            de: 'Niue',
            fr: 'Niue'
        },
        locale: 'NU'
    },
    {
        name: 'Norfolk Island',
        code: '+672 3',
        lang: {
            en: 'Norfolk Island',
            es: 'Isla Norfolk',
            da: 'Norfolk Island',
            he: 'Norfolk Island',
            ar: 'جزيرة نورفولك',
            pt: 'Ilha Norfolk',
            it: 'Norfolk Island',
            de: 'Norfolkinsel',
            fr: "l'ile de Norfolk"
        },
        locale: 'NF'
    },
    {
        name: 'Northern Mariana Islands',
        code: '+1 670',
        lang: {
            en: 'Northern Mariana Islands',
            es: 'Islas Marianas del Norte',
            da: 'Nordmarianerne',
            he: 'איי מריאנה הצפוניים',
            ar: 'جزر مريانا الشمالية',
            pt: 'Ilhas Marianas do Norte',
            it: 'Isole Marianne settentrionali',
            de: 'Nördliche Marianneninseln',
            fr: 'Îles Mariannes du Nord'
        },
        locale: 'MP'
    },
    {
        name: 'Norway',
        code: '+47',
        lang: {
            en: 'Norway',
            es: 'Noruega',
            da: 'Norge',
            he: 'נורווגיה',
            ar: 'النرويج',
            pt: 'Noruega',
            it: 'Norvegia',
            de: 'Norwegen',
            fr: 'Norvège'
        },
        locale: 'NO'
    },
    {
        name: 'Oman',
        code: '+968',
        lang: {
            en: 'Oman',
            es: 'Omán',
            da: 'Oman',
            he: 'עומאן',
            ar: 'سلطنة عمان',
            pt: 'Omã',
            it: 'Oman',
            de: 'Oman',
            fr: 'Oman'
        },
        locale: 'OM'
    },
    {
        name: 'Pakistan',
        code: '+92',
        lang: {
            en: 'Pakistan',
            es: 'Pakistán',
            da: 'Pakistan',
            he: 'פקיסטן',
            ar: 'باكستان',
            pt: 'Paquistão',
            it: 'Pakistan',
            de: 'Pakistan',
            fr: 'Pakistan'
        },
        locale: 'PK'
    },
    {
        name: 'Palau',
        code: '+680',
        lang: {
            en: 'Palau',
            es: 'Palau',
            da: 'Palau',
            he: 'פאלאו',
            ar: 'بالاو',
            pt: 'Palau',
            it: 'Palau',
            de: 'Palau',
            fr: 'Palau'
        },
        locale: 'PW'
    },
    {
        name: 'Panama',
        code: '+507',
        lang: {
            en: 'Panama',
            es: 'Panamá',
            da: 'Panama',
            he: 'פנמה',
            ar: 'بناما',
            pt: 'Panamá',
            it: 'Panama',
            de: 'Panama',
            fr: 'Panama'
        },
        locale: 'PA'
    },
    {
        name: 'Papua New Guinea',
        code: '+675',
        lang: {
            en: 'Papua New Guinea',
            es: 'Papúa Nueva Guinea',
            da: 'Papua Ny Guinea',
            he: 'פפואה גינאה החדשה',
            ar: 'بابوا غينيا الجديدة',
            pt: 'Papua Nova Guiné',
            it: 'Papua Nuova Guinea',
            de: 'Papua Neu-Guinea',
            fr: 'Papouasie Nouvelle Guinée'
        },
        locale: 'PG'
    },
    {
        name: 'Paraguay',
        code: '+595',
        lang: {
            en: 'Paraguay',
            es: 'Paraguay',
            da: 'Paraguay',
            he: 'פרגוואי',
            ar: 'باراغواي',
            pt: 'Paraguai',
            it: 'Paraguay',
            de: 'Paraguay',
            fr: 'Paraguay'
        },
        locale: 'PY'
    },
    {
        name: 'Peru',
        code: '+51',
        lang: {
            en: 'Peru',
            es: 'Perú',
            da: 'Peru',
            he: 'פרו',
            ar: 'بيرو',
            pt: 'Peru',
            it: 'Perù',
            de: 'Peru',
            fr: 'Pérou'
        },
        locale: 'PE'
    },
    {
        name: 'Philippines',
        code: '+63',
        lang: {
            en: 'Philippines',
            es: 'Filipinas',
            da: 'Filippinerne',
            he: 'פיליפיני',
            ar: 'الفلبين',
            pt: 'Filipinas',
            it: 'Filippine',
            de: 'Philippinen',
            fr: 'Philippines'
        },
        locale: 'PH'
    },
    {
        name: 'Pitcairn Islands',
        code: '+64',
        lang: {
            en: 'Pitcairn Islands',
            es: 'Islas Pitcairn',
            da: 'Pitcairn',
            he: 'פיטקרן',
            ar: 'جزر بيتكيرن',
            pt: 'Ilhas Pitcairn',
            it: 'Isole Pitcairn',
            de: 'Pitcairn',
            fr: 'Pitcairn'
        },
        locale: 'PN'
    },
    {
        name: 'Poland',
        code: '+48',
        lang: {
            en: 'Poland',
            es: 'Polonia',
            da: 'Polen',
            he: 'פולין',
            ar: 'بولندا',
            pt: 'Polônia',
            it: 'Polonia',
            de: 'Polen',
            fr: 'Pologne'
        },
        locale: 'PL'
    },
    {
        name: 'Portugal',
        code: '+351',
        lang: {
            en: 'Portugal',
            es: 'Portugal',
            da: 'Portugal',
            he: 'פורטוגל',
            ar: 'البرتغال',
            pt: 'Portugal',
            it: 'Portogallo',
            de: 'Portugal',
            fr: 'le Portugal'
        },
        locale: 'PT'
    },
    {
        name: 'Puerto Rico',
        code: '+1 939',
        lang: {
            en: 'Puerto Rico',
            es: 'Puerto Rico',
            da: 'Puerto Rico',
            he: 'פוארטו ריקו',
            ar: 'بورتوريكو',
            pt: 'Porto Rico',
            it: 'Porto Rico',
            de: 'Puerto Rico',
            fr: 'Porto Rico'
        },
        locale: 'PR'
    },
    {
        name: 'Qatar',
        code: '+974',
        lang: {
            en: 'Qatar',
            es: 'Katar',
            da: 'Qatar',
            he: 'קטאר',
            ar: 'دولة قطر',
            pt: 'Catar',
            it: 'Qatar',
            de: 'Katar',
            fr: 'Qatar'
        },
        locale: 'QA'
    },
    {
        name: 'Réunion',
        code: '+262',
        lang: {
            en: 'Réunion',
            es: 'Reunión',
            da: 'Genforening',
            he: 'איחוד',
            ar: 'جمع شمل',
            pt: 'Reunião',
            it: 'Riunione',
            de: 'Wiedervereinigung',
            fr: 'Réunion'
        },
        locale: 'RE'
    },
    {
        name: 'Romania',
        code: '+40',
        lang: {
            en: 'Romania',
            es: 'Rumania',
            da: 'Rumænien',
            he: 'רומני',
            ar: 'رومانيا',
            pt: 'Romênia',
            it: 'Romania',
            de: 'Rumänien',
            fr: 'Roumanie'
        },
        locale: 'RO'
    },
    {
        name: 'Russia',
        code: '+7',
        lang: {
            en: 'Russia',
            es: 'Rusia',
            da: 'Rusland',
            he: 'רוסיה',
            ar: 'روسيا',
            pt: 'Rússia',
            it: 'Russia',
            de: 'Russland',
            fr: 'Russie'
        },
        locale: 'RU'
    },
    {
        name: 'Rwanda',
        code: '+250',
        lang: {
            en: 'Rwanda',
            es: 'Ruanda',
            da: 'Rwanda',
            he: 'רואנדה',
            ar: 'رواندا',
            pt: 'Ruanda',
            it: 'Ruanda',
            de: 'Ruanda',
            fr: 'Rwanda'
        },
        locale: 'RW'
    },
    {
        name: 'Saint Barthélemy',
        code: '+590',
        lang: {
            en: 'Saint Barthélemy',
            es: 'San Bartolomé',
            da: 'Saint Barthélemy',
            he: 'סנט ברתולומיאו',
            ar: 'سانت بارتيليمي',
            pt: 'São Bartolomeu',
            it: 'saint-Barthélemy',
            de: 'saint Barthélemy',
            fr: 'Saint Barthélemy'
        },
        locale: 'BL'
    },
    {
        name: 'Saint Helena',
        code: '+290',
        lang: {
            en: 'Saint Helena',
            es: 'Santa Helena',
            da: 'Saint Helena',
            he: 'סנט הלנה',
            ar: 'سانت هيلانة',
            pt: 'Santa Helena',
            it: 'Santa Helena',
            de: 'St. Helena',
            fr: 'Sainte-Hélène'
        },
        locale: 'SH'
    },
    {
        name: 'Saint Kitts and Nevis',
        code: '+1 869',
        lang: {
            en: 'Saint Kitts and Nevis',
            es: 'Saint Kitts y Nevis',
            da: 'Saint Kitts og Nevis',
            he: 'סנט קיטס ונוויס',
            ar: 'سانت كيتس ونيفيس',
            pt: 'São Cristóvão e Nevis',
            it: 'Saint Kitts e Nevis',
            de: 'St. Kitts und Nevis',
            fr: 'Saint-Christophe-et-Niévès'
        },
        locale: 'KN'
    },
    {
        name: 'Saint Lucia',
        code: '+1 758',
        lang: {
            en: 'Saint Lucia',
            es: 'Santa Lucía',
            da: 'Saint Lucia',
            he: 'סנט לוסיה',
            ar: 'القديسة لوسيا',
            pt: 'Santa Lúcia',
            it: 'Santa Lucia',
            de: 'St. Lucia',
            fr: 'Sainte-Lucie'
        },
        locale: 'LC'
    },
    {
        name: 'Saint Pierre and Miquelon',
        code: '+508',
        lang: {
            en: 'Saint Pierre and Miquelon',
            es: 'San Pedro y Miquelón',
            da: 'Saint Pierre og Miquelon',
            he: 'סנט פייר ומיקלון',
            ar: 'سانت بيير وميكلون',
            pt: 'Saint Pierre e Miquelon',
            it: 'Saint Pierre e Miquelon',
            de: 'Saint-Pierre und Miquelon',
            fr: 'Saint-Pierre-et-Miquelon'
        },
        locale: 'PM'
    },
    {
        name: 'Saint Vincent and the Grenadines',
        code: '+1 784',
        lang: {
            en: 'Saint Vincent and the Grenadines',
            es: 'San Vicente y las Granadinas',
            da: 'Saint Vincent og Grenadinerne',
            he: 'וינסנט הקדוש ו ה - גרנידיים',
            ar: 'سانت فنسنت وجزر غرينادين',
            pt: 'São Vicente e Granadinas',
            it: 'Saint Vincent e Grenadine',
            de: 'St. Vincent und die Grenadinen',
            fr: 'Saint-Vincent-et-les-Grenadines'
        },
        locale: 'VC'
    },
    {
        name: 'Samoa',
        code: '+685',
        lang: {
            en: 'Samoa',
            es: 'Samoa',
            da: 'Samoa',
            he: 'סמואה',
            ar: 'ساموا',
            pt: 'Samoa',
            it: 'Samoa',
            de: 'Samoa',
            fr: 'Samoa'
        },
        locale: 'WS'
    },
    {
        name: 'San Marino',
        code: '+378',
        lang: {
            en: 'San Marino',
            es: 'San Marino',
            da: 'San Marino',
            he: 'סן מרינו',
            ar: 'سان مارينو',
            pt: 'San Marino',
            it: 'San Marino',
            de: 'San Marino',
            fr: 'Saint Marin'
        },
        locale: 'SM'
    },
    {
        name: 'São Tomé and Príncipe',
        code: '+239',
        lang: {
            en: 'São Tomé and Príncipe',
            es: 'Santo Tomé y Príncipe',
            da: 'Sao Tome og Principe',
            he: 'סאו טומה ופרינסיפה',
            ar: 'ساو تومي وبرينسيبي',
            pt: 'São Tomé e Príncipe',
            it: 'São Tomé e Príncipe',
            de: 'São Tomé und Príncipe',
            fr: 'São Tomé-et-Principe'
        },
        locale: 'ST'
    },
    {
        name: 'Saudi Arabia',
        code: '+966',
        lang: {
            en: 'Saudi Arabia',
            es: 'Arabia Saudita',
            da: 'Saudi Arabien',
            he: 'ערב הסעודית',
            ar: 'المملكة العربية السعودية',
            pt: 'Arábia Saudita',
            it: 'Arabia Saudita',
            de: 'Saudi Arabien',
            fr: 'Arabie Saoudite'
        },
        locale: 'SA'
    },
    {
        name: 'Senegal',
        code: '+221',
        lang: {
            en: 'Senegal',
            es: 'Senegal',
            da: 'Senegal',
            he: 'סנגל',
            ar: 'السنغال',
            pt: 'Senegal',
            it: 'Senegal',
            de: 'Senegal',
            fr: 'Sénégal'
        },
        locale: 'SN'
    },
    {
        name: 'Serbia',
        code: '+381',
        lang: {
            en: 'Serbia',
            es: 'Serbia',
            da: 'Serbien',
            he: 'סרביה',
            ar: 'صربيا',
            pt: 'Sérvia',
            it: 'Serbia',
            de: 'Serbien',
            fr: 'Serbie'
        },
        locale: 'RS'
    },
    {
        name: 'Seychelles',
        code: '+248',
        lang: {
            en: 'Seychelles',
            es: 'Seychelles',
            da: 'Seychellerne',
            he: 'איי סיישל',
            ar: 'سيشيل',
            pt: 'Seychelles',
            it: 'Seychelles',
            de: 'Seychellen',
            fr: 'les Seychelles'
        },
        locale: 'SC'
    },
    {
        name: 'Sierra Leone',
        code: '+232',
        lang: {
            en: 'Sierra Leone',
            es: 'Sierra Leona',
            da: 'Sierra Leone',
            he: 'סיירה לאונה',
            ar: 'سيرا ليون',
            pt: 'Serra Leoa',
            it: 'Sierra Leone',
            de: 'Sierra Leone',
            fr: 'Sierra Leone'
        },
        locale: 'SL'
    },
    {
        name: 'Singapore',
        code: '+65',
        lang: {
            en: 'Singapore',
            es: 'Singapur',
            da: 'Singapore',
            he: 'סינגפור',
            ar: 'سنغافورة',
            pt: 'Cingapura',
            it: 'Singapore',
            de: 'Singapur',
            fr: 'Singapour'
        },
        locale: 'SG'
    },
    {
        name: 'Slovakia',
        code: '+421',
        lang: {
            en: 'Slovakia',
            es: 'Eslovaquia',
            da: 'Slovakiet',
            he: 'סלובקיה',
            ar: 'سلوفاكيا',
            pt: 'Eslováquia',
            it: 'Slovacchia',
            de: 'Slowakei',
            fr: 'Slovaquie'
        },
        locale: 'SK'
    },
    {
        name: 'Slovenia',
        code: '+386',
        lang: {
            en: 'Slovenia',
            es: 'Eslovenia',
            da: 'Slovenien',
            he: 'סלובניה',
            ar: 'سلوفينيا',
            pt: 'Eslovenia',
            it: 'Slovenia',
            de: 'Slowenien',
            fr: 'Slovénie'
        },
        locale: 'SI'
    },
    {
        name: 'Solomon Islands',
        code: '+677',
        lang: {
            en: 'Solomon Islands',
            es: 'Islas Salomón',
            da: 'Salomonøerne',
            he: 'איי שלמה',
            ar: 'جزر سليمان',
            pt: 'Ilhas Salomão',
            it: 'Isole Salomone',
            de: 'Salomon-Inseln',
            fr: 'îles Salomon'
        },
        locale: 'SB'
    },
    {
        name: 'Somalia',
        code: '+252',
        lang: {
            en: 'Somalia',
            es: 'Somalia',
            da: 'Somalia',
            he: 'סומליה',
            ar: 'الصومال',
            pt: 'Somália',
            it: 'Somalia',
            de: 'Somalia',
            fr: 'Somalie'
        },
        locale: 'SO'
    },
    {
        name: 'South Africa',
        code: '+27',
        lang: {
            en: 'South Africa',
            es: 'Sudáfrica',
            da: 'Sydafrika',
            he: 'דרום אפריקה',
            ar: 'جنوب أفريقيا',
            pt: 'África do Sul',
            it: 'Sud Africa',
            de: 'Südafrika',
            fr: 'Afrique du Sud'
        },
        locale: 'ZA'
    },
    {
        name: 'South Georgia and the South Sandwich Islands',
        code: '+500',
        lang: {
            en: 'South Georgia and the South Sandwich Islands',
            es: 'Georgia del sur y las islas Sandwich del sur',
            da: 'South Georgia og De Sydlige Sandwichøer',
            he: "ג'ורג'יה הדרומית ואיי סנדוויץ 'הדרומיים",
            ar: 'جورجيا الجنوبية وجزر ساندويتش الجنوبية',
            pt: 'Geórgia do Sul e Sandwich do Sul',
            it: 'Georgia del Sud e isole Sandwich del Sud',
            de: 'Süd-Georgien und die südlichen Sandwich-Inseln',
            fr: 'Géorgie du Sud et les îles Sandwich du Sud'
        },
        locale: 'GS'
    },
    {
        name: 'Spain',
        code: '+34',
        lang: {
            en: 'Spain',
            es: 'España',
            da: 'Spanien',
            he: 'ספרד',
            ar: 'إسبانيا',
            pt: 'Espanha',
            it: 'Spagna',
            de: 'Spanien',
            fr: 'Espagne'
        },
        locale: 'ES'
    },
    {
        name: 'Sri Lanka',
        code: '+94',
        lang: {
            en: 'Sri Lanka',
            es: 'Sri Lanka',
            da: 'Sri Lanka',
            he: 'סרי לנקה',
            ar: 'سيريلانكا',
            pt: 'Sri Lanka',
            it: 'Sri Lanka',
            de: 'Sri Lanka',
            fr: 'Sri Lanka'
        },
        locale: 'LK'
    },
    {
        name: 'Sudan',
        code: '+249',
        lang: {
            en: 'Sudan',
            es: 'Sudán',
            da: 'Sudan',
            he: 'סודן',
            ar: 'سودان',
            pt: 'Sudão',
            it: 'Sudan',
            de: 'Sudan',
            fr: 'Soudan'
        },
        locale: 'SD'
    },
    {
        name: 'Suriname',
        code: '+597',
        lang: {
            en: 'Suriname',
            es: 'Surinam',
            da: 'Surinam',
            he: 'סורינאם',
            ar: 'سورينام',
            pt: 'Suriname',
            it: 'Suriname',
            de: 'Suriname',
            fr: 'Suriname'
        },
        locale: 'SR'
    },
    {
        name: 'Sweden',
        code: '+46',
        lang: {
            en: 'Sweden',
            es: 'Suecia',
            da: 'Sverige',
            he: 'שוודיה',
            ar: 'السويد',
            pt: 'Suécia',
            it: 'Svezia',
            de: 'Schweden',
            fr: 'Suède'
        },
        locale: 'SE'
    },
    {
        name: 'Switzerland',
        code: '+41',
        lang: {
            en: 'Switzerland',
            es: 'Suiza',
            da: 'Schweiz',
            he: 'שווייץ',
            ar: 'سويسرا',
            pt: 'Suíça',
            it: 'Svizzera',
            de: 'Schweiz',
            fr: 'Suisse'
        },
        locale: 'CH'
    },
    {
        name: 'Syria',
        code: '+963',
        lang: {
            en: 'Syria',
            es: 'Siria',
            da: 'Syrien',
            he: 'סוריה',
            ar: 'سوريا',
            pt: 'Síria',
            it: 'Siria',
            de: 'Syrien',
            fr: 'Syrie'
        },
        locale: 'SY'
    },
    {
        name: 'Taiwan',
        code: '+886',
        lang: {
            en: 'Taiwan',
            es: 'Taiwán',
            da: 'Taiwan',
            he: 'טייוואן',
            ar: 'تايوان',
            pt: 'Taiwan',
            it: 'Taiwan',
            de: 'Taiwan',
            fr: 'Taïwan'
        },
        locale: 'TW'
    },
    {
        name: 'Tajikistan',
        code: '+992',
        lang: {
            en: 'Tajikistan',
            es: 'Tayikistán',
            da: 'Tadsjikistan',
            he: "טג'יקיסטן",
            ar: 'طاجيكستان',
            pt: 'Tadjiquistão',
            it: 'Tajikistan',
            de: 'Tadschikistan',
            fr: 'Tadjikistan'
        },
        locale: 'TJ'
    },
    {
        name: 'Tanzania',
        code: '+255',
        lang: {
            en: 'Tanzania',
            es: 'Tanzania',
            da: 'Tanzania',
            he: 'טנזניה',
            ar: 'تنزانيا',
            pt: 'Tanzânia',
            it: 'Tanzania',
            de: 'Tansania',
            fr: 'Tanzanie'
        },
        locale: 'TZ'
    },
    {
        name: 'Thailand',
        code: '+66',
        lang: {
            en: 'Thailand',
            es: 'Tailandia',
            da: 'Thailand',
            he: 'תאילנד',
            ar: 'تايلاند',
            pt: 'Tailândia',
            it: 'Tailandia',
            de: 'Thailand',
            fr: 'Thaïlande'
        },
        locale: 'TH'
    },
    {
        name: 'Togo',
        code: '+228',
        lang: {
            en: 'Togo',
            es: 'Ir',
            da: 'At gå',
            he: 'ללכת',
            ar: 'ليذهب',
            pt: 'Ir',
            it: 'Andare',
            de: 'Gehen',
            fr: 'Aller'
        },
        locale: 'TG'
    },
    {
        name: 'Tokelau',
        code: '+690',
        lang: {
            en: 'Tokelau',
            es: 'Tokelau',
            da: 'Tokelau',
            he: 'טוקלאו',
            ar: 'توكيلاو',
            pt: 'Tokelau',
            it: 'Tokelau',
            de: 'Tokelau',
            fr: 'Tokelau'
        },
        locale: 'TK'
    },
    {
        name: 'Tonga',
        code: '+676',
        lang: {
            en: 'Tonga',
            es: 'Tonga',
            da: 'Tonga',
            he: 'טונגה',
            ar: 'تونغا',
            pt: 'Tonga',
            it: 'tonga',
            de: 'Tonga',
            fr: 'Tonga'
        },
        locale: 'TO'
    },
    {
        name: 'Trinidad and Tobago',
        code: '+1 868',
        lang: {
            en: 'Trinidad and Tobago',
            es: 'Trinidad y Tobago',
            da: 'Trinidad og Tobago',
            he: 'טרינידד וטובגו',
            ar: 'ترينداد وتوباغو',
            pt: 'Trinidad e Tobago',
            it: 'Trinidad e Tobago',
            de: 'Trinidad und Tobago',
            fr: 'Trinité-et-Tobago'
        },
        locale: 'TT'
    },
    {
        name: 'Tunisia',
        code: '+216',
        lang: {
            en: 'Tunisia',
            es: 'Túnez',
            da: 'Tunesien',
            he: 'תוניסיה',
            ar: 'تونس',
            pt: 'Tunísia',
            it: 'Tunisia',
            de: 'Tunesien',
            fr: 'Tunisie'
        },
        locale: 'TN'
    },
    {
        name: 'Turkey',
        code: '+90',
        lang: {
            en: 'Turkey',
            es: 'Turquía',
            da: 'Kalkun',
            he: 'טורקיה',
            ar: 'ديك رومي',
            pt: 'Peru',
            it: 'tacchino',
            de: 'Truthahn',
            fr: 'dinde'
        },
        locale: 'TR'
    },
    {
        name: 'Turkmenistan',
        code: '+993',
        lang: {
            en: 'Turkmenistan',
            es: 'Turkmenistán',
            da: 'Turkmenistan',
            he: 'טורקמניסטן',
            ar: 'تركمانستان',
            pt: 'Turcomenistão',
            it: 'Turkmenistan',
            de: 'Turkmenistan',
            fr: 'Turkménistan'
        },
        locale: 'TM'
    },
    {
        name: 'Turks and Caicos Islands',
        code: '+1 649',
        lang: {
            en: 'Turks and Caicos Islands',
            es: 'Islas Turcas y Caicos',
            da: 'Turks- og Caicosøerne',
            he: 'איי טורקס וקאיקוס',
            ar: 'جزر تركس وكايكوس',
            pt: 'Ilhas Turks e Caicos',
            it: 'Isole Turks e Caicos',
            de: 'Turks- und Caicosinseln',
            fr: 'îles Turques-et-Caïques'
        },
        locale: 'TC'
    },
    {
        name: 'Tuvalu',
        code: '+688',
        lang: {
            en: 'Tuvalu',
            es: 'Tuvalu',
            da: 'Tuvalu',
            he: 'טובאלו',
            ar: 'توفالو',
            pt: 'Tuvalu',
            it: 'Tuvalu',
            de: 'Tuvalu',
            fr: 'Tuvalu'
        },
        locale: 'TV'
    },
    {
        name: 'Uganda',
        code: '+256',
        lang: {
            en: 'Uganda',
            es: 'Uganda',
            da: 'Uganda',
            he: 'אוגנדה',
            ar: 'أوغندا',
            pt: 'Uganda',
            it: 'Uganda',
            de: 'Uganda',
            fr: 'Ouganda'
        },
        locale: 'UG'
    },
    {
        name: 'Ukraine',
        code: '+380',
        lang: {
            en: 'Ukraine',
            es: 'Ucrania',
            da: 'Ukraine',
            he: 'אוקראינה',
            ar: 'أوكرانيا',
            pt: 'Ucrânia',
            it: 'Ucraina',
            de: 'Ukraine',
            fr: 'Ukraine'
        },
        locale: 'UA'
    },
    {
        name: 'United Arab Emirates',
        code: '+971',
        lang: {
            en: 'United Arab Emirates',
            es: 'Emiratos Árabes Unidos',
            da: 'Forenede Arabiske Emirater',
            he: 'איחוד האמירויות הערביות',
            ar: 'الإمارات العربية المتحدة',
            pt: 'Emirados Árabes Unidos',
            it: 'Emirati Arabi Uniti',
            de: 'Vereinigte Arabische Emirate',
            fr: 'Emirats Arabes Unis'
        },
        locale: 'AE'
    },
    {
        name: 'United Kingdom',
        code: '+44',
        lang: {
            en: 'United Kingdom',
            es: 'Reino Unido',
            da: 'Det Forenede Kongerige',
            he: 'הממלכה המאוחדת',
            ar: 'المملكة المتحدة',
            pt: 'Reino Unido',
            it: 'Regno Unito',
            de: 'Großbritannien',
            fr: 'Royaume-Uni'
        },
        locale: 'GB',
        flagIcon: '262-united-kingdom.png'
    },
    {
        name: 'United States/Canada',
        code: '+1',
        lang: {
            en: 'United States/Canada',
            es: 'Estados Unidos / Canadá',
            da: 'USA / Canada',
            he: 'ארצות הברית / קנדה',
            ar: 'الولايات المتحدة / كندا',
            pt: 'Estados Unidos / Canadá',
            it: 'Stati Uniti / Canada',
            de: 'USA / Kanada',
            fr: 'États-Unis / Canada'
        },
        locale: 'US/CA',
        flagIcon: '153-united-states-of-america.png'
    },
    {
        name: 'Uruguay',
        code: '+598',
        lang: {
            en: 'Uruguay',
            es: 'Uruguay',
            da: 'Uruguay',
            he: 'אורוגוואי',
            ar: 'أوروغواي',
            pt: 'Uruguai',
            it: 'Uruguay',
            de: 'Uruguay',
            fr: 'Uruguay'
        },
        locale: 'UY'
    },
    {
        name: 'Uzbekistan',
        code: '+998',
        lang: {
            en: 'Uzbekistan',
            es: 'Uzbekistán',
            da: 'Usbekistan',
            he: 'אוזבקיסטן',
            ar: 'أوزبكستان',
            pt: 'Uzbequistão',
            it: 'Uzbekistan',
            de: 'Usbekistan',
            fr: 'Ouzbékistan'
        },
        locale: 'UZ'
    },
    {
        name: 'Vanuatu',
        code: '+678',
        lang: {
            en: 'Vanuatu',
            es: 'Vanuatu',
            da: 'Vanuatu',
            he: 'ונואטו',
            ar: 'فانواتو',
            pt: 'Vanuatu',
            it: 'Vanuatu',
            de: 'Vanuatu',
            fr: 'Vanuatu'
        },
        locale: 'VU'
    },
    {
        name: 'Venezuela',
        code: '+58',
        lang: {
            en: 'Venezuela',
            es: 'Venezuela',
            da: 'Venezuela',
            he: 'ונצואלה',
            ar: 'فنزويلا',
            pt: 'Venezuela',
            it: 'Venezuela',
            de: 'Venezuela',
            fr: 'Venezuela'
        },
        locale: 'VE'
    },
    {
        name: 'Vietnam',
        code: '+84',
        lang: {
            en: 'Vietnam',
            es: 'Vietnam',
            da: 'Vietnam',
            he: 'וייטנאם',
            ar: 'فيتنام',
            pt: 'Vietnã',
            it: 'Vietnam',
            de: 'Vietnam',
            fr: 'Viêt-Nam'
        },
        locale: 'VN'
    },
    {
        name: 'Wallis and Futuna',
        code: '+681',
        lang: {
            en: 'Wallis and Futuna',
            es: 'Wallis y Futuna',
            da: 'Wallis og Futuna',
            he: 'ואליס ופוטונה',
            ar: 'واليس وفوتونا',
            pt: 'Wallis e Futuna',
            it: 'Wallis e Futuna',
            de: 'Wallis und Futuna',
            fr: 'Wallis et Futuna'
        },
        locale: 'WF'
    },
    {
        name: 'Yemen',
        code: '+967',
        lang: {
            en: 'Yemen',
            es: 'Yemen',
            da: 'Yemen',
            he: 'תימן',
            ar: 'اليمن',
            pt: 'Iémen',
            it: 'yemen',
            de: 'Jemen',
            fr: 'Yémen'
        },
        locale: 'YE'
    },
    {
        name: 'Zambia',
        code: '+260',
        lang: {
            en: 'Zambia',
            es: 'Zambia',
            da: 'Zambia',
            he: 'זמביה',
            ar: 'زامبيا',
            pt: 'Zâmbia',
            it: 'Zambia',
            de: 'Sambia',
            fr: 'Zambie'
        },
        locale: 'ZM'
    },
    {
        name: 'Zimbabwe',
        code: '+263',
        lang: {
            en: 'Zimbabwe',
            es: 'Zimbabue',
            da: 'Zimbabwe',
            he: 'זימבבואה',
            ar: 'زيمبابوي',
            pt: 'Zimbábue',
            it: 'Zimbabwe',
            de: 'Zimbabwe',
            fr: 'Zimbabwe'
        },
        locale: 'ZW'
    }
];
