import { VIMEO_REGEX } from '@app/config'

const pattern: RegExp = VIMEO_REGEX

describe('Vimeo URL parsing', () => {
  describe('Should properly parse id and hash parts of Vimeo video URL', () => {
    ;[
      {
        description: 'Should return id and hash for test url #1, no www.',
        url: 'https://vimeo.com/747120447/ba01f113d8',
        first: '747120447',
        second: 'ba01f113d8'
      },
      {
        description: 'Should return id and hash for test url #1, with www.',
        url: 'https://www.vimeo.com/747120447/ba01f113d8',
        first: '747120447',
        second: 'ba01f113d8'
      },
      {
        description: 'Should return id and hash for test url #2, no www.',
        url: 'https://vimeo.com/747135214/0bbf8f1bc4',
        first: '747135214',
        second: '0bbf8f1bc4'
      },
      {
        description: 'Should return id and hash for test url #2, with www.',
        url: 'https://www.vimeo.com/747135214/0bbf8f1bc4',
        first: '747135214',
        second: '0bbf8f1bc4'
      },
      {
        description: 'Should only return hash for test url #1, no www.',
        url: 'https://vimeo.com/158050352',
        first: '158050352',
        second: undefined
      },
      {
        description: 'Should only return hash for test url #1, with www.',
        url: 'https://www.vimeo.com/158050352',
        first: '158050352',
        second: undefined
      },
      {
        description: 'Should only return hash for test url #2, no www.',
        url: 'https://vimeo.com/76979871',
        first: '76979871',
        second: undefined
      },
      {
        description: 'Should only return hash for test url #2, with www.',
        url: 'https://www.vimeo.com/76979871',
        first: '76979871',
        second: undefined
      }
    ].forEach((e) => {
      it(e.description, () => {
        const parsed = e.url.match(pattern)

        expect(parsed[1]).toBe(e.first)
        expect(parsed[2]).toBe(e.second)
      })
    })
  })
})
