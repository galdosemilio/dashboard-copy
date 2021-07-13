export interface DataTypeInputPropsEntry {
  dependsOn: string[]
  hasWeightProportion?: boolean
}

export const DATA_TYPE_INPUT_PROPS: {
  [key: string]: DataTypeInputPropsEntry
} = {
  '3': { dependsOn: ['1'], hasWeightProportion: true },
  '12': { dependsOn: ['1'], hasWeightProportion: true },
  '13': { dependsOn: ['1'], hasWeightProportion: true },
  '5': { dependsOn: ['6'] },
  '6': { dependsOn: ['5'] }
}
