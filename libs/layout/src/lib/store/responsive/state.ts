export interface State {
  screen: string;
  columns: number;
  colspan: number;
  rowspan: boolean;
}

export const initialState: State = {
  screen: 'xl',
  columns: 4,
  colspan: 2,
  rowspan: false
};
