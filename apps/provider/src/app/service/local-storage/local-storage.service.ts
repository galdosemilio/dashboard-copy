import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public setWithExpiry(key: string, value: any, ttl: moment.Duration): void {
    const instant = new Date()
    const item = {
      value: value,
      expiry: instant.getTime() + ttl.asMilliseconds()
    }

    localStorage.setItem(key, JSON.stringify(item))
  }

  get(key) {
    const instant = new Date()
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) {
        return null
      }
      const item = JSON.parse(itemStr)

      if (instant.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
      }
      return item.value
    } catch (err) {
      return null
    }
  }
}
