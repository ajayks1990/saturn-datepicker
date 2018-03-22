import { EventEmitter, NgZone } from "@angular/core";
import { MatDatePickerRangeValue } from './datepicker-input';
import { DateAdapter, MatDateFormats } from "@angular/material/core";
export declare class MatRangepickerInline<D> {
    private _dateAdapter;
    private _dateFormats;
    zone: NgZone;
    /** The date to open the calendar to initially. */
    startAt: D | null;
    _startAt: D | null;
    /** Whenever datepicker is for selecting range of dates. */
    rangeMode: boolean;
    private _rangeMode;
    /**
     * Emits new selected date when selected date changes.
     * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
     */
    selectedChanged: EventEmitter<D | MatDatePickerRangeValue<D>>;
    selectedComparisonChanged: EventEmitter<D | MatDatePickerRangeValue<D>>;
    selectedCollectionChanged: EventEmitter<D | MatDatePickerRangeValue<D>>;
    /** Start of dates interval. */
    beginDate: D | null;
    _beginDate: D | null;
    /** End of dates interval. */
    endDate: D | null;
    _endDate: D | null;
    /** The currently selected date. */
    _selected: D | null;
    private _validSelected;
    /** Start of dates interval. */
    beginCollDate: D | null;
    _beginCollDate: D | null;
    /** End of dates interval. */
    endCollDate: D | null;
    _endCollDate: D | null;
    _beginDateSelected: boolean;
    _beginCollDateSelected: boolean;
    _collSelectingMode: boolean;
    constructor(_dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, zone: NgZone);
    _setRangeType(mode?: boolean): void;
    comparisonModel: string;
    collectionModel: string;
    /** Selects the given date range */
    _selectRange(date: D): void;
    prepareFormat(begin: D, end: D): string;
    private _selectCompRange(date);
    private _selectCollRange(date);
    private _setCompDateRange(dates);
    private _setCollDateRange(dates);
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    private _getValidDateOrNull(obj);
}
