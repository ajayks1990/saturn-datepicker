import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { MatDatePickerRangeValue } from './datepicker-input';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'mat-rangepicker-inline',
  exportAs: 'mat-rangepicker-inline',
  templateUrl: './rangepicker-inline.html',
  styleUrls: ['./rangepicker-inline.css']
})
export class MatRangepickerInline<D> {

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is or, in range mode, start from beginning of interval.
    // if (this.rangeMode) {
    //   return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
    //     (<MatDatePickerRangeValue<D>>this._datepickerInput.value).begin : null);
    // }
    // return this._startAt || (this._datepickerInput ? <D|null>this._datepickerInput.value : null);
    return null;
  }
  set startAt(date: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
  }
  private _startAt: D | null;

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
      this._beginDate = this._endDate = null;
    }
  }
  private _rangeMode;

  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
   */
  @Output() selectedChanged = new EventEmitter<MatDatePickerRangeValue<D>|D>();

  /** Start of dates interval. */
  @Input()
  get beginDate(): D | null { return this._beginDate; }
  set beginDate(value: D | null) {
    this._validSelected = null;
    this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _beginDate: D | null;

  /** End of dates interval. */
  @Input()
  get endDate(): D | null { return this._endDate; }
  set endDate(value: D | null) {
    this._validSelected = null;
    this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _endDate: D | null;

  /** The currently selected date. */
  get _selected(): D | null { return this._validSelected; }
  set _selected(value: D | null) {
    this._beginDate = this._endDate = null;
    this._validSelected = value;
  }
  private _validSelected: D | null = null;

  _beginDateSelected = false;

  constructor(@Optional() private _dateAdapter: DateAdapter<D>) {
  }

  /** Selects the given date range */
  _selectRange(date: D): void {
    if (!this._dateAdapter.sameDate(this.beginDate, date) ||
      !this._dateAdapter.sameDate(this.endDate, date)) {
      if (!this._beginDateSelected) {
        this._beginDateSelected = true;
        this._setDateRange({begin: date, end: date});
      } else {
        this._beginDateSelected = false;
        if (this._dateAdapter.compareDate(<D>this.beginDate, date) <= 0) {
          this._setDateRange({begin: <D>this.beginDate, end: date});
        } else {
          this._setDateRange({begin: date, end: <D>this.beginDate});
        }
      }
    }

    this.selectedChanged.emit({begin: this._beginDate, end: this._endDate});
  }

  private _setDateRange(dates: { begin: D, end: D }) {
    this._beginDate = dates.begin;
    this._endDate = dates.end;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
