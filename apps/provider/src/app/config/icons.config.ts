import { MatIconRegistry } from '@coachcare/material'
import { DomSanitizer } from '@angular/platform-browser'

interface IconConfigItem {
  name: string
  url: string
}

export const SVG_ICONS: IconConfigItem[] = [
  {
    name: 'svg-document',
    url: './assets/svg/document.svg'
  },
  {
    name: 'svg-folder',
    url: './assets/svg/folder.svg'
  },
  {
    name: 'svg-form',
    url: './assets/svg/form.svg'
  },
  {
    name: 'svg-photo',
    url: './assets/svg/photo.svg'
  },
  {
    name: 'svg-url',
    url: './assets/svg/URLlink.svg'
  },
  {
    name: 'svg-video',
    url: './assets/svg/video.svg'
  }
]

export const IconsConfig = {
  registerIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer): void {
    SVG_ICONS.forEach((icon: IconConfigItem) =>
      iconRegistry.addSvgIcon(
        icon.name,
        sanitizer.bypassSecurityTrustResourceUrl(icon.url)
      )
    )
  }
}
