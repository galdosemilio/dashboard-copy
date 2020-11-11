import { TranslationCollection } from '@biesbjerg/ngx-translate-extract/dist/utils/translation.collection'

import * as flat from 'flat'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'

export class Catalog {
  public indentation = '  '
  public extension = 'json'
  public code: string

  public collection: TranslationCollection

  public constructor(public srcFile: string) {
    this.code = basename(srcFile, '.json')
    this.collection = new TranslationCollection()
    if (existsSync(srcFile)) {
      this.parse(readFileSync(srcFile, 'utf-8'))
    }
  }

  public parse(contents: string) {
    const values: {} = flat.flatten(JSON.parse(contents))
    this.collection = new TranslationCollection(values)
  }

  public cleanup() {
    if (this.collection.has('undefined')) {
      this.collection = this.collection.remove('undefined')
    }
    return this
  }

  public union(base: Catalog) {
    this.collection = base.collection
      .union(this.collection)
      .intersect(base.collection)
      .sort()
  }

  public compile(): string {
    const values: {} = flat.unflatten(this.collection.values, { object: true })

    return JSON.stringify(values, null, this.indentation) + `\n`
  }

  public save() {
    writeFileSync(this.srcFile, this.compile(), 'utf-8')
  }

  protected _isNamespacedJsonFormat(values: any): boolean {
    return Object.keys(values).some((key) => typeof values[key] === 'object')
  }
}
