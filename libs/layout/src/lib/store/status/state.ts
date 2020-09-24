export interface State {
  menu: {
    opened: boolean;
  };
  panel: {
    opened: boolean;
    enabled: boolean;
    component: string;
  };
}

export const initialState: State = {
  menu: {
    opened: false
  },
  panel: {
    opened: false,
    enabled: false,
    component: ''
  }
};
