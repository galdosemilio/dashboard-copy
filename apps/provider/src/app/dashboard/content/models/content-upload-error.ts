import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http'

interface ContentUploadErrorArgs {
  message: string
  response?: HttpHeaderResponse
}

export class ContentUploadError extends HttpErrorResponse {
  public response: HttpHeaderResponse | null

  constructor(args: ContentUploadErrorArgs) {
    super(args.response)
    this.response = args.response ?? null
  }
}
