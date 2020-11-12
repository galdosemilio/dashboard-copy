/**
 * Interface for POST /feedback
 */

import { ImageTypeInterface } from './imageType.interface'

export interface FeedbackRequest {
  description: string
  organization?: string
  title?: string
  rating?: number
  images?: Array<ImageTypeInterface>
}
