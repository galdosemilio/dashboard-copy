import { CurrentAccount } from '@app/service'
import { _, TranslationsObject } from '@app/shared/utils'
import { TranslateService } from '@ngx-translate/core'

export function configViewLangAttrs(
  document: Document,
  lang: string,
  dir: 'ltr' | 'rtl'
): void {
  document.body.classList.remove('ltr', 'rtl')
  document.body.classList.add(dir)
  document.documentElement.setAttribute('lang', lang)
  document.body.setAttribute('dir', dir)
}

export async function translateTexts(
  translate: TranslateService,
  user: CurrentAccount
): Promise<TranslationsObject> {
  try {
    const userName = user.firstName + ' ' + user.lastName.charAt(0)

    return await translate
      .get([_('MENU.HELLO')], {
        userName: userName
      })
      .toPromise()
  } catch (error) {
    return {}
  }
}
