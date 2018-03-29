import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date1 = new Date('01.12.2018');
  date2 = new Date('01.15.2018');
  date3 = new Date('01.16.2018');
  date4 = new Date('03.15.2018');

  constructor() {
  }

  test(e, i) {
    console.log('test', e, i);
  }
}
