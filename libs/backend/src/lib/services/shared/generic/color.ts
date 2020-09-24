/**
 * Organization Palette
 *
 * TODO extract this from web-gateway
 */

export interface Color {
  primary?: string;
  secondary?: string;
  accent?: string;
  warn?: string;
  primaryContrast?: string;
  accentContrast?: string;
  warnContrast?: string;
  base?: string;
  text?: string;
  secondaryText?: string;
  hintText?: string;
  icon?: string;
  divider?: string;
  slider?: string;
  hover?: string;
  selected?: string;
  disabled?: string;
  background?: string;
  bgLogo?: string;
  bgMenu?: string;
  bgPanel?: string;
  bgTools?: string;
  bgHeader?: string;
  bgEven?: string;
  bgOdd?: string;
  toolbar?: 'primary' | 'accent' | 'secondary';
}
