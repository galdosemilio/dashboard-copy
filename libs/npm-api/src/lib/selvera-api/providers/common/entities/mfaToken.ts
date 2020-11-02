export interface MFAToken {
  type: 'backup' | 'totp'
  value: string
}
