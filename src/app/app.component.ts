import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date1 = new Date('02.15.2018');
  date2 = new Date('02.12.2018');

  constructor() {
  }
}
