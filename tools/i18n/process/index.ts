import * as glob from 'glob'

import { Catalog } from '../catalog'
import { locales } from '../locales'

export function merge() {
  const base: any = {}

  // remove the undefined of the base catalogs
  let files = glob.sync(`./apps/admin/src/i18n/base/*.json`)
  for (const srcFile of files) {
    const catalog = new Catalog(srcFile)
    catalog.cleanup().save()
    base[`admin.${catalog.code}`] = catalog
  }

  files = glob.sync(`./apps/provider/src/assets/i18n/base/*.json`)
  for (const srcFile of files) {
    const catalog = new Catalog(srcFile)
    catalog.cleanup().save()
    base[`provider.${catalog.code}`] = catalog
  }

  // for each locale, check customizations and merge with the base
  for (const locale of locales) {
    const loc = locale.toLowerCase()
    const parent = locale.slice(0, 2)

    let catalog = new Catalog(`./apps/admin/src/i18n/${loc}.json`)

    if (base.hasOwnProperty(`admin.${parent}`)) {
      catalog.union(base[`admin.${parent}`])
    }

    catalog.srcFile = `./apps/admin/src/i18n/${loc}.json`
    catalog.save()

    catalog = new Catalog(`./apps/provider/src/assets/i18n/${loc}.json`)

    if (base.hasOwnProperty(`provider.${parent}`)) {
      catalog.union(base[`provider.${parent}`])
    }

    catalog.srcFile = `./apps/provider/src/assets/i18n/${loc}.json`
    catalog.save()
  }
}
