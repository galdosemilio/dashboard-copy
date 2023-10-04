export class DataPointSummary {
  public count: number | null = null
  public average: number | null = null
  public max: number | null = null
  public min: number | null = null
  public recent: number | null = null
  public unit: string | null = null
  public isLoading = true

  update(response, id): this {
    const record = response.data.find(
      (measurement) => measurement.type.id === id
    )

    this.recent = record?.last?.value
    this.average = record?.average
    this.count = record?.count
    this.max = record?.maximum
    this.min = record?.minimum
    this.unit = record?.type?.unit?.display
    this.isLoading = false

    return this
  }
}
