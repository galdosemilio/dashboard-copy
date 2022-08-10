export const updateFavIcon = (faviconUrl = 'assets/favicon/favicon.png') => {
  const favIconElement: HTMLLinkElement = document.querySelector('#favicon')

  if (!favIconElement) {
    return
  }

  favIconElement.href = faviconUrl
}
