// moment.js locale configuration
// locale : English [en]

import * as momentNs from 'moment-timezone'
const moment = momentNs

const monthsRegex = /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
const monthsShortRegex = /^(jan\.?|feb\.?|mar\.?|apr\.?|may\.?|jun\.?|jul\.?|aug\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i
const monthsParse = [
  /^jan/i,
  /^feb/i,
  /^mar/i,
  /^apr/i,
  /^may/i,
  /^jun/i,
  /^jul/i,
  /^aug/i,
  /^sep/i,
  /^oct/i,
  /^nov/i,
  /^dec/i
]

const en = {
  months: 'January February March April May June July August September October November December'.split(
    ' '
  ),
  monthsShort: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
  monthsRegex: new RegExp(monthsRegex.source + monthsShortRegex.source, 'i'),
  monthsShortRegex: monthsRegex,
  monthsStrictRegex: monthsRegex,
  monthsShortStrictRegex: monthsShortRegex,
  monthsParse: monthsParse,
  longMonthsParse: monthsParse,
  shortMonthsParse: monthsParse,
  weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(
    ' '
  ),
  weekdaysShort: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
  weekdaysMin: 'Su Mo Tu We Th Fr Sa'.split(' '),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h:mm a',
    LTS: 'h:mm:ss a',
    L: 'MM/DD/YYYY',
    l: 'M/D/YYYY',
    LL: 'MMMM D, YYYY',
    ll: 'MMM D, YYYY',
    LLL: 'MMMM D, YYYY [at] h:mm a',
    lll: 'MMM D, YYYY [at] h:mm a',
    LLLL: 'dddd, MMMM D, YYYY [at] h:mm a',
    llll: 'ddd, MMM D, YYYY [at] h:mm a'
  },
  calendar: {
    sameDay: '[today at] LT',
    nextDay: '[tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[yesterday at] LT',
    lastWeek: '[last] dddd [at] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    ss: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
  ordinal: function (n: number): string {
    const b = n % 10
    const output =
      ~~((n % 100) / 10) === 1
        ? 'th'
        : b === 1
        ? 'st'
        : b === 2
        ? 'nd'
        : b === 3
        ? 'rd'
        : 'th'
    return n + output
  },
  week: {
    dow: 0, // CCR: Sunday as first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
}

moment.updateLocale('en', en)
