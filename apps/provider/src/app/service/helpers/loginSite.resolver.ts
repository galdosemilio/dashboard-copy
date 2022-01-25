import { environment } from '../../../environments/environment'

interface DomainPatternEntryDetails {
  pattern: RegExp
  url: string
}

interface DomainPatternEntry {
  test: DomainPatternEntryDetails
  prod: DomainPatternEntryDetails
}

const domainPatterns: { [key: string]: DomainPatternEntry } = {
  wellcore: {
    test: {
      pattern: /my.teamwellcore.com/i,
      url: 'https://test.my.teamwellcore.com/'
    },
    prod: {
      pattern: /my.teamwellcore.com/i,
      url: 'https://my.teamwellcore.com/'
    }
  }
}

export function resolveHardcodedLoginSite(): string | null {
  const href = window.location.href

  const foundDomainPattern = Object.values(domainPatterns).find(
    (patternEntry) => {
      const envPatternEntry: DomainPatternEntryDetails =
        patternEntry[environment.selveraApiEnv]

      if (!envPatternEntry) {
        return
      }

      return envPatternEntry.pattern.test(href)
    }
  )

  if (!foundDomainPattern) {
    return null
  }

  return foundDomainPattern[environment.selveraApiEnv].url
}
