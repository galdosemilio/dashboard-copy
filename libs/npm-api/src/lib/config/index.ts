import { merge } from 'lodash'
import { config as defaultCfg } from './env/default'
import { Environment } from './environment.interface'
import { Config } from './interfaces'
declare var require

export function getConfig(env: Environment): Config {
  const config = { ...defaultCfg }
  let overrides
  switch (env) {
    case 'ccrDemo':
      overrides = require(`./env/ccrDemo`)
      break
    case 'dev':
      overrides = require(`./env/dev`)
      break
    case 'prod':
      overrides = require(`./env/prod`)
      break
    case 'test':
      overrides = require(`./env/test`)
      break
  }
  merge(config, overrides.config)
  return config
}

export { Config, Environment }
