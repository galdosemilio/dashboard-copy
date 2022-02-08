export interface GenerateCSVArgs {
  content: string
  filename: string
}

export class CSVUtils {
  public static generateCSV(args: GenerateCSVArgs): void {
    const csv = args.content
    const filename = CSVUtils.sanitizeFileName(args.filename)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('visibility', 'hidden')
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  public static escapeCSVText(original: string): string {
    const pattern = new RegExp(/"/, 'g')
    return original.replace(pattern, `$&$&`)
  }

  public static sanitizeFileName(filename: string): string {
    return filename.replace(/\W/gi, '_')
  }
}
