import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ccr-wellcore-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class WellcoreThankYouComponent implements OnInit {
  public ngOnInit(): void {
    window.top.postMessage({ type: 'ccr-thank-you-screen' }, '*')
  }
}
