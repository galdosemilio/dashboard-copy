import { AfterViewInit, Component, ViewChild } from '@angular/core'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements AfterViewInit {
  @ViewChild('helpIframe', { static: false }) helpIframe

  ngAfterViewInit() {
    const helpIframe = this.helpIframe.nativeElement
    const iframeWin = helpIframe.contentWindow || helpIframe
    const iframeDoc = helpIframe.contentDocument || iframeWin.document

    iframeDoc.open()
    iframeDoc.write(
      `<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=1192685a-849b-4793-9820-a06d1526fd90"> </script>
      <script>
      document.addEventListener("DOMContentLoaded", () => {
        zE('webWidget', 'open');
        zE('webWidget', 'updateSettings', {
            cookies: false
          });
      });
      </script>`
    )
    iframeDoc.close()
  }
}
