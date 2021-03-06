import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewChild
} from "@angular/core";
import { MatDatePickerRangeValue } from './datepicker-input';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";


@Component({
  selector: 'mat-rangepicker-inline',
  exportAs: 'mat-rangepicker-inline',
  templateUrl: './rangepicker-inline.html',
  styleUrls: ['./rangepicker-inline.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MatRangepickerInline<D> {
  @ViewChild('rightCalendar') rightCalendar;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is or, in range mode, start from beginning of interval.
    // if (this.rangeMode) {
    //   return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
    //     (<MatDatePickerRangeValue<D>>this._datepickerInput.value).begin : null);
    // }
    // || (this._datepickerInput ? <D|null>this._datepickerInput.value : null)
    return this._startAt;
  }
  set startAt(date: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
  }
  _startAt: D | null;

  /** Whenever datepicker is for selecting range of dates. */
  @Input()
  get rangeMode(): boolean {
    return this._rangeMode;
  }
  set rangeMode(mode: boolean) {
    this._rangeMode = mode;
    if (this.rangeMode) {
      this._validSelected = null;
    } else {
      this._beginDate = this._endDate = this._beginCollDate = this._endCollDate = null;
    }
  }
  private _rangeMode;

  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  @Output() selectedChanged = new EventEmitter<MatDatePickerRangeValue<D>|D>();

  @Output() selectedComparisonChanged = new EventEmitter<MatDatePickerRangeValue<D>|D>();
  @Output() selectedCollectionChanged = new EventEmitter<MatDatePickerRangeValue<D>|D>();

  /** Start of dates interval. */
  @Input()
  get beginDate(): D | null { return this._beginDate; }
  set beginDate(value: D | null) {
    this._validSelected = null;
    this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
  }
  _beginDate: D | null;

  /** End of dates interval. */
  @Input()
  get endDate(): D | null { return this._endDate; }
  set endDate(value: D | null) {
    this._validSelected = null;
    this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
  }
  _endDate: D | null;

  /** The currently selected date. */
  get _selected(): D | null { return this._validSelected; }
  set _selected(value: D | null) {
    this._beginDate = this._endDate = null;
    this._validSelected = value;
  }
  private _validSelected: D | null = null;

  /** Start of dates interval. */
  @Input()
  get beginCollDate(): D | null { return this._beginCollDate; }
  set beginCollDate(value: D | null) {
    this._validSelected = null;
    this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this.collectionModel = this.prepareFormat(this._beginCollDate, this._endCollDate);
    this.rightCalendar['startAt'] = this._beginCollDate;
    this.rightCalendar['_activeDate'] = this._beginCollDate;
  }
  _beginCollDate: D | null;

  /** End of dates interval. */
  @Input()
  get endCollDate(): D | null { return this._endCollDate; }
  set endCollDate(value: D | null) {
    this._validSelected = null;
    this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this.collectionModel = this.prepareFormat(this._beginCollDate, this._endCollDate);
  }
  _endCollDate: D | null;

  _beginDateSelected = false;
  _beginCollDateSelected = false;
  _collSelectingMode = true;

  constructor(@Optional() private _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
              public zone: NgZone) {}

  _setRangeType(mode = false) {
    this._collSelectingMode = mode;
  }

  public comparisonModel: string = '';
  public collectionModel: string = '';

  /** Selects the given date range */
  _selectRange(date: D): void {
    if (!this._collSelectingMode) {
      this._selectCompRange(date);
      // if (!this._beginDateSelected) {
        this.selectedComparisonChanged.emit({begin: this._beginDate, end: this._endDate});
        this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
      // }
    } else {
      this._selectCollRange(date);
      // if (!this._beginCollDateSelected) {
        this.selectedCollectionChanged.emit({begin: this._beginCollDate, end: this.endCollDate});
        this.collectionModel = this.prepareFormat(this._beginCollDate, this.endCollDate);
      // }
    }
    this.selectedChanged.emit({begin: this._beginDate, end: this._endDate});
  }

  public prepareFormat(begin: D, end: D): string {
    if (this._getValidDateOrNull(begin) && this._getValidDateOrNull(end)) {
      const date1 = this._dateAdapter.format(begin, this._dateFormats.display.dateInput);
      const date2 = this._dateAdapter.format(end, this._dateFormats.display.dateInput);
      return `${date1} - ${date2}`;
    }
    return '';
  }

  private _selectCompRange(date: D): void {
    // if (!this._dateAdapter.sameDate(this.beginDate, date) ||
    //   !this._dateAdapter.sameDate(this.endDate, date)) {
      if (!this._beginDateSelected) {
        this._beginDateSelected = true;
        this._setCompDateRange({begin: date, end: date});
      } else {
        this._beginDateSelected = false;
        if (this._dateAdapter.compareDate(<D>this.beginDate, date) <= 0) {
          this._setCompDateRange({begin: <D>this.beginDate, end: date});
        } else {
          this._setCompDateRange({begin: date, end: <D>this.beginDate});
        }
      }
    // }
  }

  private _selectCollRange(date: D): void {
    // if (!this._dateAdapter.sameDate(this.beginCollDate, date) ||
    //   !this._dateAdapter.sameDate(this.endCollDate, date)) {
      if (!this._beginCollDateSelected) {
        this._beginCollDateSelected = true;
        this._setCollDateRange({begin: date, end: date});
      } else {
        this._beginCollDateSelected = false;
        if (this._dateAdapter.compareDate(<D>this.beginCollDate, date) <= 0) {
          this._setCollDateRange({begin: <D>this.beginCollDate, end: date});
        } else {
          this._setCollDateRange({begin: date, end: <D>this.beginCollDate});
        }
      }
    // }
  }

  private _setCompDateRange(dates: { begin: D, end: D }) {
    this._beginDate = dates.begin;
    this._endDate = dates.end;
  }

  private _setCollDateRange(dates: { begin: D, end: D }) {
    this._beginCollDate = dates.begin;
    this._endCollDate = dates.end;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
