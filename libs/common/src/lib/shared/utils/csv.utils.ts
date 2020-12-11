export interface GenerateCSVArgs {
  content: string
  filename: string
}

export function generateCSV(args: GenerateCSVArgs): void {
  const csv = args.content
  const filename = args.filename.replace(/\W/gi, '_')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('visibility', 'hidden')
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
