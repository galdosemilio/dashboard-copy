import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class SectionProps {
  events: { [key: string]: Subject<any> }
}
