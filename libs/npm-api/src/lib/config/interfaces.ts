export interface Config {
  apiUrl: string
}

export type CascadingPartial<T> = { [P in keyof T]?: Partial<T[P]> }

export type PartialConfig = CascadingPartial<Config>
