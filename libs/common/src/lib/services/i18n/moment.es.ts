// moment.js locale configuration
// locale : Spanish [es]

import * as momentNs from 'moment-timezone'
const moment = momentNs

const monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i
const monthsShortRegex = /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i
const monthsParse = [
  /^ene/i,
  /^feb/i,
  /^mar/i,
  /^abr/i,
  /^may/i,
  /^jun/i,
  /^jul/i,
  /^ago/i,
  /^sep/i,
  /^oct/i,
  /^nov/i,
  /^dic/i
]

const es = {
  months: 'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'.split(
    ' '
  ),
  monthsShort: 'Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic'.split(' '),
  monthsRegex: new RegExp(monthsRegex.source + monthsShortRegex.source, 'i'),
  monthsShortRegex: monthsRegex,
  monthsStrictRegex: monthsRegex,
  monthsShortStrictRegex: monthsShortRegex,
  monthsParse: monthsParse,
  longMonthsParse: monthsParse,
  shortMonthsParse: monthsParse,
  weekdays: 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado'.split(' '),
  weekdaysShort: 'Dom Lun Mar Mié Jue Vie Sáb'.split(' '),
  weekdaysMin: 'Do Lu Ma Mi Ju Vi Sá'.split(' '),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h:mm a',
    LTS: 'h:mm:ss a',
    L: 'DD/MM/YYYY',
    l: 'D/M/YYYY',
    LL: 'MMMM D, YYYY',
    ll: 'MMM D, YYYY',
    LLL: 'MMMM D [de] YYYY, [a las] h:mm a',
    lll: 'MMM D [de] YYYY [a las] h:mm a',
    LLLL: 'dddd, MMMM D [de] YYYY [a las] h:mm a',
    llll: 'ddd, MMM D [de] YYYY [a las] h:mm a'
  },
  calendar: {
    sameDay: function (): string {
      // tslint:disable-next-line:no-invalid-this
      return '[hoy a la' + (Number(this.hours()) !== 1 ? 's' : '') + '] LT'
    },
    nextDay: function (): string {
      // tslint:disable-next-line:no-invalid-this
      return '[mañana a la' + (Number(this.hours()) !== 1 ? 's' : '') + '] LT'
    },
    nextWeek: function (): string {
      // tslint:disable-next-line:no-invalid-this
      return 'dddd [a la' + (Number(this.hours()) !== 1 ? 's' : '') + '] LT'
    },
    lastDay: function (): string {
      // tslint:disable-next-line:no-invalid-this
      return '[ayer a la' + (Number(this.hours()) !== 1 ? 's' : '') + '] LT'
    },
    lastWeek: function (): string {
      // tslint:disable-next-line:no-invalid-this
      return (
        '[el] dddd [pasado a la' +
        (Number(this.hours()) !== 1 ? 's' : '') +
        '] LT'
      )
    },
    sameElse: 'L',
    hours: () => '' // lint workaround
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    ss: 'unos pocos segundos',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años'
  },
  dayOfMonthOrdinalParse: /\d{1,2}º/,
  ordinal: function (n: number): string {
    return `${n}º`
  },
  week: {
    dow: 0, // CCR: Sunday as first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
}

moment.defineLocale('es', es)
