/**
 * Generic typescript utilities
 */

// FIXME replace these for a generic object
export interface DataObject {
  [s: string]: any
}
export interface TranslationsObject {
  [key: string]: string
}

export type UnitFormatter = (v: number) => number | string
export interface UnitFormatters {
  // [ string: label, UnitFormatter: v => format(v), FilterEmpty ]
  [data: string]: [string, UnitFormatter, boolean]
}

// remember the included ones in lib.es5.d.ts
// export type Readonly<T> = { readonly [P in keyof T]: T[P] };
// export type Nullable<T> = { [P in keyof T]: T[P] | null };
// export type Partial<T> = { [P in keyof T]?: T[P] };
// export type Pick<T, K extends keyof T> = { [P in K]: T[P] };
// export type Record<K extends string, T> = { [P in K]: T };

export type DeepPartial<T> = { [P in keyof T]?: Partial<T[P]> }
