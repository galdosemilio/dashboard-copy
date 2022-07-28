import { Environment } from '../../../../libs/common/src/lib//environments/environment.interface'
import { resolveApiUrl } from '../../../../libs/common/src/lib/sdk.barrel'

describe('Dynamically resolving API URL', () => {
  const config: Environment = {
    ccrApiEnv: 'test',
    enableThrottling: true,
    hostWhitelist: ['example.com']
  }

  const withOverride = [
    {
      origin: 'https://test.dashboard.example.com',
      apiUrl: 'https://test.api.example.com/'
    },
    {
      origin: 'http://dashboard.example.com',
      apiUrl: 'http://api.example.com/'
    }
  ]

  const nonOverride = ['https://example.com', 'https://dashboard.sample.com']

  for (const item of withOverride) {
    it(`should resolve the URL to a matching domain for dashboard white list origin: ${item.origin}`, () => {
      const apiUrl = resolveApiUrl(config, item.origin)

      expect(apiUrl).to.equal(item.apiUrl)
    })
  }

  for (const origin of nonOverride) {
    it(`should not return apiUrl with does not match domain for origin: ${origin}`, () => {
      const apiUrl = resolveApiUrl(config, origin)

      expect(apiUrl).to.be.undefined
    })
  }
})
