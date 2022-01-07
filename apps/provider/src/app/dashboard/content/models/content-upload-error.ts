import { HttpHeaderResponse } from '@angular/common/http'

interface ContentUploadErrorArgs {
  message: string
  response?: HttpHeaderResponse
}

export class ContentUploadError extends Error {
  public response: HttpHeaderResponse

  constructor(args: ContentUploadErrorArgs) {
    super(args.message)
    this.response = args.response ?? null
  }
}
