/**
 * UI Responsive State.
 */

export interface UIResponsiveState {
  screen: string;
  columns: number;
  colspan: number;
  rowspan: boolean;
}

export const initialResponsiveState: UIResponsiveState = {
  screen: 'xl',
  columns: 4,
  colspan: 2,
  rowspan: false
};
