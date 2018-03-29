import { Injectable, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, Inject, Optional, ChangeDetectorRef, Attribute, ElementRef, NgZone, ViewChild, InjectionToken, ViewContainerRef, Directive, forwardRef, NgModule } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import { take } from 'rxjs/operators/take';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { filter } from 'rxjs/operators/filter';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { of } from 'rxjs/observable/of';
import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@docs-private
 * @param {?} provider
 * @return {?}
 */
function createMissingDateImplError(provider) {
    return Error(`MatDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a ` +
        `custom implementation.`);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Datepicker data that requires internationalization.
 */
class MatDatepickerIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * A label for the calendar popup (used by screen readers).
         */
        this.calendarLabel = 'Calendar';
        /**
         * A label for the button used to open the calendar popup (used by screen readers).
         */
        this.openCalendarLabel = 'Open calendar';
        /**
         * A label for the previous month button (used by screen readers).
         */
        this.prevMonthLabel = 'Previous month';
        /**
         * A label for the next month button (used by screen readers).
         */
        this.nextMonthLabel = 'Next month';
        /**
         * A label for the previous year button (used by screen readers).
         */
        this.prevYearLabel = 'Previous year';
        /**
         * A label for the next year button (used by screen readers).
         */
        this.nextYearLabel = 'Next year';
        /**
         * A label for the previous multi-year button (used by screen readers).
         */
        this.prevMultiYearLabel = 'Previous 20 years';
        /**
         * A label for the next multi-year button (used by screen readers).
         */
        this.nextMultiYearLabel = 'Next 20 years';
        /**
         * A label for the 'switch to month view' button (used by screen readers).
         */
        this.switchToMonthViewLabel = 'Choose date';
        /**
         * A label for the 'switch to year view' button (used by screen readers).
         */
        this.switchToMultiYearViewLabel = 'Choose month and year';
    }
}
MatDatepickerIntl.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MatDatepickerIntl.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * \@docs-private
 */
class MatCalendarCell {
    /**
     * @param {?} value
     * @param {?} displayValue
     * @param {?} ariaLabel
     * @param {?} enabled
     */
    constructor(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
}
/**
 * An internal component used to display calendar data in a table.
 * \@docs-private
 */
class MatCalendarBody {
    constructor() {
        this.collectionRange = false;
        /**
         * Whether to use date range selection behaviour.
         */
        this.rangeMode = false;
        /**
         * The number of columns in the table.
         */
        this.numCols = 7;
        /**
         * Whether to allow selection of disabled cells.
         */
        this.allowDisabledSelection = false;
        /**
         * The cell number of the active cell in the table.
         */
        this.activeCell = 0;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /**
         * Emits when a new value is selected.
         */
        this.selectedValueChange = new EventEmitter();
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    _cellClicked(cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    }
    /**
     * The number of blank cells to put at the beginning for the first row.
     * @return {?}
     */
    get _firstRowOffset() {
        return this.rows && this.rows.length && this.rows[0].length ?
            this.numCols - this.rows[0].length : 0;
    }
    /**
     * @param {?} rowIndex
     * @param {?} colIndex
     * @return {?}
     */
    _isActiveCell(rowIndex, colIndex) {
        let /** @type {?} */ cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    }
    /**
     * Whenever to mark cell as semi-selected (inside dates interval).
     * @param {?} date
     * @return {?}
     */
    _isSemiSelected(date) {
        if (!this.rangeMode) {
            return false;
        }
        if (this.rangeFull) {
            return true;
        }
        /** Do not mark start and end of interval. */
        if (date === this.begin || date === this.end) {
            return false;
        }
        if (this.begin && !this.end) {
            return date > this.begin;
        }
        if (this.end && !this.begin) {
            return date < this.end;
        }
        return date > /** @type {?} */ (this.begin) && date < /** @type {?} */ (this.end);
    }
    /**
     * Whenever to mark cell as semi-selected (inside dates interval).
     * @param {?} date
     * @return {?}
     */
    _isSemiCollectionSelected(date) {
        if (!this.rangeMode) {
            return false;
        }
        if (this.rangeFull) {
            return true;
        }
        /** Do not mark start and end of interval. */
        if (date === this.collectionBegin || date === this.collectionEnd) {
            return false;
        }
        if (this.collectionBegin && !this.collectionEnd) {
            return date > this.collectionBegin;
        }
        if (this.collectionEnd && !this.collectionBegin) {
            return date < this.collectionEnd;
        }
        return date > /** @type {?} */ (this.collectionBegin) && date < /** @type {?} */ (this.collectionEnd);
    }
}
MatCalendarBody.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: '[mat-calendar-body]',
                template: `<!--
  If there's not enough space in the first row, create a separate label row. We mark this row as
  aria-hidden because we don't want it to be read out as one of the weeks in the month.
-->
<!--<tr *ngIf="_firstRowOffset < labelMinRequiredCells" aria-hidden="true">-->
  <!--<td class="mat-calendar-body-label"-->
      <!--[attr.colspan]="numCols"-->
      <!--[style.paddingTop.%]="50 * cellAspectRatio / numCols"-->
      <!--[style.paddingBottom.%]="50 * cellAspectRatio / numCols">-->
    <!--&lt;!&ndash;{{label}}&ndash;&gt;-->
  <!--</td>-->
<!--</tr>-->
<!-- Create the first row separately so we can include a special spacer cell. -->
<tr *ngFor="let row of rows; let rowIndex = index" role="row">
  <!--
    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.
    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a
    percentage of the width (a variant of the trick described here:
    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).
  -->
  <td *ngIf="rowIndex === 0 && _firstRowOffset"
      aria-hidden="true"
      class="mat-calendar-body-label"
      [attr.colspan]="_firstRowOffset"
      [style.paddingTop.%]="50 * cellAspectRatio / numCols"
      [style.paddingBottom.%]="50 * cellAspectRatio / numCols">
    <!--{{_firstRowOffset >= labelMinRequiredCells ? label : ''}}-->
  </td>
  <td *ngFor="let item of row; let colIndex = index"
      role="gridcell"
      class="mat-calendar-body-cell"
      [tabindex]="_isActiveCell(rowIndex, colIndex) ? 0 : -1"
      [class.mat-calendar-body-disabled]="!item.enabled"
      [class.mat-calendar-body-active]="_isActiveCell(rowIndex, colIndex)"
      [class.mat-calendar-body-begin-range]="begin === item.value"
      [class.mat-calendar-body-end-range]="end === item.value"
      [class.mat-calendar-cell-semi-selected]="_isSemiSelected(item.value)"
      [class.mat-calendar-body-begin-collection-range]="collectionBegin === item.value"
      [class.mat-calendar-body-end-collection-range]="collectionEnd === item.value"
      [class.mat-calendar-cell-semi-collection-selected]="_isSemiCollectionSelected(item.value)"
      [attr.aria-label]="item.ariaLabel"
      [attr.aria-disabled]="!item.enabled || null"
      (click)="_cellClicked(item)"
      [style.width.%]="100 / numCols"
      [style.paddingTop.%]="50 * cellAspectRatio / numCols"
      [style.paddingBottom.%]="50 * cellAspectRatio / numCols">
    <div class="mat-calendar-body-cell-content"
         [class.mat-calendar-body-selected]="begin === item.value || end === item.value || selectedValue === item.value"
         [class.mat-calendar-body-collection-selected]="collectionBegin === item.value || collectionEnd === item.value"
         [class.mat-calendar-body-semi-selected]="_isSemiSelected(item.value)"
         [class.mat-calendar-body-semi-collection-selected]="_isSemiCollectionSelected(item.value)"
         [class.mat-calendar-body-today]="todayValue === item.value">
      {{item.displayValue}}
    </div>
  </td>
</tr>
`,
                styles: [`.mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.71429%;padding-right:4.71429%}.mat-calendar-body-cell{position:relative;height:0;line-height:0;text-align:center;outline:0;cursor:pointer}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}[dir=rtl] .mat-calendar-body-label{text-align:right}`],
                host: {
                    'class': 'mat-calendar-body',
                    'role': 'grid',
                    'attr.aria-readonly': 'true'
                },
                exportAs: 'matCalendarBody',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatCalendarBody.ctorParameters = () => [];
MatCalendarBody.propDecorators = {
    "label": [{ type: Input },],
    "rows": [{ type: Input },],
    "todayValue": [{ type: Input },],
    "selectedValue": [{ type: Input },],
    "begin": [{ type: Input },],
    "end": [{ type: Input },],
    "collectionRange": [{ type: Input },],
    "collectionBegin": [{ type: Input },],
    "collectionEnd": [{ type: Input },],
    "rangeFull": [{ type: Input },],
    "rangeMode": [{ type: Input },],
    "labelMinRequiredCells": [{ type: Input },],
    "numCols": [{ type: Input },],
    "allowDisabledSelection": [{ type: Input },],
    "activeCell": [{ type: Input },],
    "cellAspectRatio": [{ type: Input },],
    "selectedValueChange": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * \@docs-private
 * @template D
 */
class MatMonthView {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _changeDetectorRef
     */
    constructor(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Allow selecting range of dates.
         */
        this.rangeMode = false;
        /**
         * Emits when a new date is selected.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits when any date is selected.
         */
        this._userSelection = new EventEmitter();
        /**
         * Whenever full month is inside dates interval.
         */
        this._rangeFull = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        const /** @type {?} */ firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        const /** @type {?} */ narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        const /** @type {?} */ longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        let /** @type {?} */ weekdays = longWeekdays.map((long, i) => {
            return { long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     * @return {?}
     */
    get activeDate() { return this._activeDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        let /** @type {?} */ oldActiveDate = this._activeDate;
        this._activeDate =
            this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
        if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
            this._init();
        }
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._selectedDate = this._getDateInCurrentMonth(this._selected);
    }
    /**
     * Current start of interval.
     * @return {?}
     */
    get beginDate() { return this._beginDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginDate(value) {
        this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.updateRangeSpecificValues();
    }
    /**
     * Current end of interval.
     * @return {?}
     */
    get endDate() { return this._endDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endDate(value) {
        this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.updateRangeSpecificValues();
    }
    /**
     * Current start of interval.
     * @return {?}
     */
    get beginCollDate() { return this._beginCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginCollDate(value) {
        this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.updateCollRangeSpecificValues();
    }
    /**
     * Current end of interval.
     * @return {?}
     */
    get endCollDate() { return this._endCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endCollDate(value) {
        this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.updateCollRangeSpecificValues();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._init();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _getDateInstanceFromSelectedDate(date) {
        const /** @type {?} */ selectedYear = this._dateAdapter.getYear(this.activeDate);
        const /** @type {?} */ selectedMonth = this._dateAdapter.getMonth(this.activeDate);
        return this._dateAdapter.createDate(selectedYear, selectedMonth, date);
    }
    /**
     * Handles when a new date is selected.
     * @param {?} date
     * @return {?}
     */
    _dateSelected(date) {
        const /** @type {?} */ selectedDate = this._getDateInstanceFromSelectedDate(date);
        if (this.rangeMode) {
            this.selectedChange.emit(selectedDate);
            // if (!this._beginDateSelected) { // At first click emit the same start and end of interval
            //   this._beginDateSelected = true;
            //
            // } else {
            //   this._beginDateSelected = false;
            //   this.selectedChange.emit(selectedDate);
            //   this._userSelection.emit();
            // }
        }
        else if (this._selectedDate != date) {
            this.selectedChange.emit(selectedDate);
            this._userSelection.emit();
        }
    }
    /**
     * Initializes this month view.
     * @return {?}
     */
    _init() {
        this.updateRangeSpecificValues();
        this.updateCollRangeSpecificValues();
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        let /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Creates MatCalendarCells for the dates in this month.
     * @return {?}
     */
    _createWeekCells() {
        let /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        let /** @type {?} */ dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (let /** @type {?} */ i = 0, /** @type {?} */ cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            let /** @type {?} */ date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            let /** @type {?} */ enabled = !this.dateFilter ||
                this.dateFilter(date);
            let /** @type {?} */ ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    }
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     * @param {?} date
     * @return {?}
     */
    _getDateInCurrentMonth(date) {
        return date && this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    }
    /**
     * Checks whether the 2 dates are non-null and fall within the same month of the same year.
     * @param {?} d1
     * @param {?} d2
     * @return {?}
     */
    _hasSameMonthAndYear(d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
    /**
     * Updates range full parameter on each begin or end of interval update.
     * Necessary to display calendar-body correctly
     * @return {?}
     */
    updateRangeSpecificValues() {
        if (this.rangeMode) {
            this._beginDateNumber = this._getDateInCurrentMonth(this._beginDate);
            this._endDateNumber = this._getDateInCurrentMonth(this._endDate);
            this._rangeFull = this.beginDate && this.endDate && !this._beginDateNumber &&
                !this._endDateNumber &&
                this._dateAdapter.compareDate(this.beginDate, this.activeDate) <= 0 &&
                this._dateAdapter.compareDate(this.activeDate, this.endDate) <= 0;
        }
        else {
            this._beginDateNumber = this._endDateNumber = null;
            this._rangeFull = false;
        }
    }
    /**
     * @return {?}
     */
    updateCollRangeSpecificValues() {
        if (this.rangeMode) {
            this._beginCollDateNumber = this._getDateInCurrentMonth(this._beginCollDate);
            this._endCollDateNumber = this._getDateInCurrentMonth(this._endCollDate);
            this._rangeFull = this.beginDate && this.endDate && !this._beginCollDateNumber &&
                !this._endCollDateNumber &&
                this._dateAdapter.compareDate(this.beginCollDate, this.activeDate) <= 0 &&
                this._dateAdapter.compareDate(this.activeDate, this.endCollDate) <= 0;
        }
        else {
            this._beginCollDateNumber = this._endCollDateNumber = null;
            this._rangeFull = false;
        }
    }
}
MatMonthView.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-month-view',
                template: `<table class="mat-calendar-table">
  <thead class="mat-calendar-table-header">
    <tr><th *ngFor="let day of _weekdays" [attr.aria-label]="day.long">{{day.narrow}}</th></tr>
    <tr><th class="mat-calendar-table-header-divider" colspan="7" aria-hidden="true"></th></tr>
  </thead>
  <tbody mat-calendar-body
         [label]="_monthLabel"
         [rows]="_weeks"
         [todayValue]="_todayDate"
         [selectedValue]="_selectedDate"
         [begin]="_beginDateNumber"
         [end]="_endDateNumber"
         [collectionBegin]="_beginCollDateNumber"
         [collectionEnd]="_endCollDateNumber"
         [rangeFull]="_rangeFull"
         [rangeMode]="rangeMode"
         [labelMinRequiredCells]="3"
         [activeCell]="_dateAdapter.getDate(activeDate) - 1"
         (selectedValueChange)="_dateSelected($event)">
  </tbody>
</table>
`,
                exportAs: 'matMonthView',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatMonthView.ctorParameters = () => [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] },] },
    { type: ChangeDetectorRef, },
];
MatMonthView.propDecorators = {
    "activeDate": [{ type: Input },],
    "selected": [{ type: Input },],
    "beginDate": [{ type: Input },],
    "endDate": [{ type: Input },],
    "beginCollDate": [{ type: Input },],
    "endCollDate": [{ type: Input },],
    "rangeMode": [{ type: Input },],
    "dateFilter": [{ type: Input },],
    "selectedChange": [{ type: Output },],
    "_userSelection": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const yearsPerPage = 24;
const yearsPerRow = 4;
/**
 * An internal component used to display a year selector in the datepicker.
 * \@docs-private
 * @template D
 */
class MatMultiYearView {
    /**
     * @param {?} _dateAdapter
     * @param {?} _changeDetectorRef
     */
    constructor(_dateAdapter, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Emits when a new month is selected.
         */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this multi-year view (everything other than the year is ignored).
     * @return {?}
     */
    get activeDate() { return this._activeDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        let /** @type {?} */ oldActiveDate = this._activeDate;
        this._activeDate =
            this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
        if (Math.floor(this._dateAdapter.getYear(oldActiveDate) / yearsPerPage) !=
            Math.floor(this._dateAdapter.getYear(this._activeDate) / yearsPerPage)) {
            this._init();
        }
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._selectedYear = this._selected && this._dateAdapter.getYear(this._selected);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._init();
    }
    /**
     * Initializes this multi-year view.
     * @return {?}
     */
    _init() {
        this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
        let /** @type {?} */ activeYear = this._dateAdapter.getYear(this._activeDate);
        let /** @type {?} */ activeOffset = activeYear % yearsPerPage;
        this._years = [];
        for (let /** @type {?} */ i = 0, /** @type {?} */ row = []; i < yearsPerPage; i++) {
            row.push(activeYear - activeOffset + i);
            if (row.length == yearsPerRow) {
                this._years.push(row.map(year => this._createCellForYear(year)));
                row = [];
            }
        }
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Handles when a new year is selected.
     * @param {?} year
     * @return {?}
     */
    _yearSelected(year) {
        let /** @type {?} */ month = this._dateAdapter.getMonth(this.activeDate);
        let /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(year, month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    }
    /**
     * @return {?}
     */
    _getActiveCell() {
        return this._dateAdapter.getYear(this.activeDate) % yearsPerPage;
    }
    /**
     * Creates an MatCalendarCell for the given year.
     * @param {?} year
     * @return {?}
     */
    _createCellForYear(year) {
        let /** @type {?} */ yearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(year, 0, 1));
        return new MatCalendarCell(year, yearName, yearName, true);
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatMultiYearView.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-multi-year-view',
                template: `<table class="mat-calendar-table">
  <thead class="mat-calendar-table-header">
    <tr><th class="mat-calendar-table-header-divider" colspan="4"></th></tr>
  </thead>
  <tbody mat-calendar-body
         allowDisabledSelection="true"
         [rows]="_years"
         [todayValue]="_todayYear"
         [selectedValue]="_selectedYear"
         [numCols]="4"
         [cellAspectRatio]="4 / 7"
         [activeCell]="_getActiveCell()"
         (selectedValueChange)="_yearSelected($event)">
  </tbody>
</table>
`,
                exportAs: 'matMultiYearView',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatMultiYearView.ctorParameters = () => [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
];
MatMultiYearView.propDecorators = {
    "activeDate": [{ type: Input },],
    "selected": [{ type: Input },],
    "dateFilter": [{ type: Input },],
    "selectedChange": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An internal component used to display a single year in the datepicker.
 * \@docs-private
 * @template D
 */
class MatYearView {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _changeDetectorRef
     */
    constructor(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Emits when a new month is selected.
         */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this year view (everything other than the year is ignored).
     * @return {?}
     */
    get activeDate() { return this._activeDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set activeDate(value) {
        let /** @type {?} */ oldActiveDate = this._activeDate;
        this._activeDate =
            this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
        if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
            this._init();
        }
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._selectedMonth = this._getMonthInCurrentYear(this._selected);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._init();
    }
    /**
     * Handles when a new month is selected.
     * @param {?} month
     * @return {?}
     */
    _monthSelected(month) {
        let /** @type {?} */ daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    }
    /**
     * Initializes this year view.
     * @return {?}
     */
    _init() {
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        let /** @type {?} */ monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(row => row.map(month => this._createCellForMonth(month, monthNames[month])));
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {?} date
     * @return {?}
     */
    _getMonthInCurrentYear(date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    }
    /**
     * Creates an MatCalendarCell for the given month.
     * @param {?} month
     * @param {?} monthName
     * @return {?}
     */
    _createCellForMonth(month, monthName) {
        let /** @type {?} */ ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    }
    /**
     * Whether the given month is enabled.
     * @param {?} month
     * @return {?}
     */
    _isMonthEnabled(month) {
        if (!this.dateFilter) {
            return true;
        }
        let /** @type {?} */ firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (let /** @type {?} */ date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatYearView.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-year-view',
                template: `<table class="mat-calendar-table">
  <thead class="mat-calendar-table-header">
    <tr><th class="mat-calendar-table-header-divider" colspan="4"></th></tr>
  </thead>
  <tbody mat-calendar-body
         allowDisabledSelection="true"
         [label]="_yearLabel"
         [rows]="_months"
         [todayValue]="_todayMonth"
         [selectedValue]="_selectedMonth"
         [labelMinRequiredCells]="2"
         [numCols]="4"
         [cellAspectRatio]="4 / 7"
         [activeCell]="_dateAdapter.getMonth(activeDate)"
         (selectedValueChange)="_monthSelected($event)">
  </tbody>
</table>
`,
                exportAs: 'matYearView',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatYearView.ctorParameters = () => [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] },] },
    { type: ChangeDetectorRef, },
];
MatYearView.propDecorators = {
    "activeDate": [{ type: Input },],
    "selected": [{ type: Input },],
    "dateFilter": [{ type: Input },],
    "selectedChange": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A calendar that is used as part of the datepicker.
 * \@docs-private
 * @template D
 */
class MatCalendar {
    /**
     * @param {?} _elementRef
     * @param {?} _intl
     * @param {?} _ngZone
     * @param {?} mode
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} changeDetectorRef
     * @param {?} zone
     */
    constructor(_elementRef, _intl, _ngZone, mode, _dateAdapter, _dateFormats, changeDetectorRef, zone) {
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this.mode = mode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.zone = zone;
        /**
         * Whether the calendar should be started in month or year view.
         */
        this.startView = 'month';
        /**
         * Whenever datepicker is for selecting range of dates.
         */
        this.rangeMode = false;
        /**
         * Emits when the currently selected date changes.
         */
        this.selectedChange = new EventEmitter();
        /**
         * Emits when any date is selected.
         */
        this._userSelection = new EventEmitter();
        /**
         * Emits when new pair of dates selected.
         */
        this.dateRangesChange = new EventEmitter();
        /**
         * Whenever user already selected start of dates interval.
         */
        this._beginDateSelected = false;
        /**
         * Date filter for the month, year, and multi-year views.
         */
        this._dateFilterForViews = (date) => {
            return !!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
                (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0);
        };
        this.selectMonthView = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }
    /**
     * A date representing the period (month or year) to start the calendar in.
     * @return {?}
     */
    get startAt() { return this._startAt; }
    /**
     * @param {?} value
     * @return {?}
     */
    set startAt(value) {
        this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get selected() { return this._selected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The minimum selectable date.
     * @return {?}
     */
    get minDate() { return this._minDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set minDate(value) {
        this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The maximum selectable date.
     * @return {?}
     */
    get maxDate() { return this._maxDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set maxDate(value) {
        this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * Beginning of date range.
     * @return {?}
     */
    get beginDate() { return this._beginDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginDate(value) {
        this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * Date range end.
     * @return {?}
     */
    get endDate() { return this._endDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endDate(value) {
        this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * Beginning of date range.
     * @return {?}
     */
    get beginCollDate() { return this._beginCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginCollDate(value) {
        this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * Date range end.
     * @return {?}
     */
    get endCollDate() { return this._endCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endCollDate(value) {
        this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     * @return {?}
     */
    get _activeDate() { return this._clampedActiveDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set _activeDate(value) {
        this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        this.selectMonthView.emit(value);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    setActiveNextMonth(date) {
        const /** @type {?} */ nextMonth = this._dateAdapter.addCalendarMonths(date, 1);
        this._clampedActiveDate = this._dateAdapter.clampDate(nextMonth, this.minDate, this.maxDate);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    setActivePreviousMonth(date) {
        const /** @type {?} */ nextMonth = this._dateAdapter.addCalendarMonths(date, -1);
        this._clampedActiveDate = this._dateAdapter.clampDate(nextMonth, this.minDate, this.maxDate);
    }
    /**
     * The label for the current calendar view.
     * @return {?}
     */
    get _periodButtonText() {
        if (this._currentView == 'month') {
            return this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                .toLocaleUpperCase();
        }
        if (this._currentView == 'year') {
            return this._dateAdapter.getYearName(this._activeDate);
        }
        const /** @type {?} */ activeYear = this._dateAdapter.getYear(this._activeDate);
        const /** @type {?} */ firstYearInView = this._dateAdapter.getYearName(this._dateAdapter.createDate(activeYear - activeYear % 24, 0, 1));
        const /** @type {?} */ lastYearInView = this._dateAdapter.getYearName(this._dateAdapter.createDate(activeYear + yearsPerPage - 1 - activeYear % 24, 0, 1));
        return `${firstYearInView} \u2013 ${lastYearInView}`;
    }
    /**
     * @return {?}
     */
    get _periodButtonLabel() {
        return this._currentView == 'month' ?
            this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
    }
    /**
     * The label for the the previous button.
     * @return {?}
     */
    get _prevButtonLabel() {
        return {
            'month': this._intl.prevMonthLabel,
            'year': this._intl.prevYearLabel,
            'multi-year': this._intl.prevMultiYearLabel
        }[this._currentView];
    }
    /**
     * The label for the the next button.
     * @return {?}
     */
    get _nextButtonLabel() {
        return {
            'month': this._intl.nextMonthLabel,
            'year': this._intl.nextYearLabel,
            'multi-year': this._intl.nextMultiYearLabel
        }[this._currentView];
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._currentView = this.startView;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ change = changes["minDate"] || changes["maxDate"] || changes["dateFilter"];
        if (change && !change.firstChange) {
            const /** @type {?} */ view = this.monthView || this.yearView || this.multiYearView;
            if (view) {
                view._init();
            }
        }
    }
    /**
     * Handles date selection in the month view.
     * @param {?} date
     * @return {?}
     */
    _dateSelected(date) {
        if (this.rangeMode) {
            this.dateRangesChange.emit(date);
        }
        else if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    }
    /**
     * @return {?}
     */
    _userSelected() {
        this._userSelection.emit();
    }
    /**
     * Handles month selection in the multi-year view.
     * @param {?} date
     * @param {?} view
     * @return {?}
     */
    _goToDateInView(date, view) {
        this._activeDate = date;
        this._currentView = view;
    }
    /**
     * Handles user clicks on the period label.
     * @return {?}
     */
    _currentPeriodClicked() {
        this._currentView = this._currentView == 'month' ? 'multi-year' : 'month';
    }
    /**
     * Handles user clicks on the previous button.
     * @return {?}
     */
    _previousClicked() {
        this._activeDate = this._currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, this._currentView == 'year' ? -1 : -yearsPerPage);
    }
    /**
     * Handles user clicks on the next button.
     * @return {?}
     */
    _nextClicked() {
        this._activeDate = this._currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, this._currentView == 'year' ? 1 : yearsPerPage);
    }
    /**
     * Whether the previous period button is enabled.
     * @return {?}
     */
    _previousEnabled() {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    }
    /**
     * Whether the next period button is enabled.
     * @return {?}
     */
    _nextEnabled() {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    }
    /**
     * Handles keydown events on the calendar body.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._currentView == 'month') {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else if (this._currentView == 'year') {
            this._handleCalendarBodyKeydownInYearView(event);
        }
        else {
            this._handleCalendarBodyKeydownInMultiYearView(event);
        }
    }
    /**
     * Focuses the active cell after the microtask queue is empty.
     * @return {?}
     */
    _focusActiveCell() {
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this._elementRef.nativeElement.querySelector('.mat-calendar-body-active').focus();
            });
        });
    }
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {?} date1
     * @param {?} date2
     * @return {?}
     */
    _isSameView(date1, date2) {
        if (this._currentView == 'month') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
        }
        if (this._currentView == 'year') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
        }
        // Otherwise we are in 'multi-year' view.
        return Math.floor(this._dateAdapter.getYear(date1) / yearsPerPage) ==
            Math.floor(this._dateAdapter.getYear(date2) / yearsPerPage);
    }
    /**
     * Handles keydown events on the calendar body when calendar is in month view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydownInMonthView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    if (this.rangeMode && !this._beginDateSelected) {
                        // emit only after second date selected
                        this._userSelected();
                    }
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /**
     * Handles keydown events on the calendar body when calendar is in year view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydownInYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -4);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 4);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._goToDateInView(this._activeDate, 'month');
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /**
     * Handles keydown events on the calendar body when calendar is in multi-year view.
     * @param {?} event
     * @return {?}
     */
    _handleCalendarBodyKeydownInMultiYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -yearsPerRow);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerRow);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -this._dateAdapter.getYear(this._activeDate) % yearsPerPage);
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerPage - this._dateAdapter.getYear(this._activeDate) % yearsPerPage - 1);
                break;
            case PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                break;
            case PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                break;
            case ENTER:
                this._goToDateInView(this._activeDate, 'year');
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatCalendar.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-calendar',
                template: `<div class="mat-calendar-header">
  <div class="mat-calendar-controls">
    <button mat-icon-button class="mat-calendar-previous-button"
            [disabled]="!_previousEnabled()" (click)="_previousClicked()"
            [attr.aria-label]="_prevButtonLabel"
            *ngIf="mode !== 'right'">
    </button>
    <button mat-button class="mat-calendar-period-button"
            (click)="_currentPeriodClicked()" [attr.aria-label]="_periodButtonLabel">
      {{_periodButtonText}}
      <div class="mat-calendar-arrow" [class.mat-calendar-invert]="_currentView != 'month'"></div>
    </button>
    <button mat-icon-button class="mat-calendar-next-button"
            style="float: right"
            [disabled]="!_nextEnabled()" (click)="_nextClicked()"
            [attr.aria-label]="_nextButtonLabel"
            *ngIf="mode !== 'left'">
    </button>
  </div>
</div>
<div class="mat-calendar-content" (keydown)="_handleCalendarBodyKeydown($event)"
    [ngSwitch]="_currentView" cdkMonitorSubtreeFocus>
  <mat-month-view
      *ngSwitchCase="'month'"
      [activeDate]="_activeDate"
      [selected]="selected"
      [beginDate]="beginDate"
      [endDate]="endDate"
      [beginCollDate]="beginCollDate"
      [endCollDate]="endCollDate"
      [rangeMode]="rangeMode"
      [dateFilter]="_dateFilterForViews"
      (selectedChange)="_dateSelected($event)"
      (_userSelection)="_userSelected()">
  </mat-month-view>
  <mat-year-view
      *ngSwitchCase="'year'"
      [activeDate]="_activeDate"
      [selected]="selected"
      [dateFilter]="_dateFilterForViews"
      (selectedChange)="_goToDateInView($event, 'month')">
  </mat-year-view>
  <mat-multi-year-view
      *ngSwitchCase="'multi-year'"
      [activeDate]="_activeDate"
      [selected]="selected"
      [dateFilter]="_dateFilterForViews"
      (selectedChange)="_goToDateInView($event, 'year')">
  </mat-multi-year-view>
</div>
`,
                styles: [`.mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0}.mat-calendar-content{padding:0 8px 8px;outline:0}.mat-calendar-controls{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin:5% calc(33% / 7 - 16px)}.mat-calendar-spacer{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir=rtl].mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-next-button,.mat-calendar-previous-button{position:relative}.mat-calendar-next-button::after,.mat-calendar-previous-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:'';margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-next-button,[dir=rtl] .mat-calendar-previous-button{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;-webkit-transform:translateX(2px) rotate(-45deg);transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;-webkit-transform:translateX(-2px) rotate(45deg);transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:'';position:absolute;top:0;left:-8px;right:-8px;height:1px}`],
                host: {
                    'class': 'mat-calendar',
                },
                exportAs: 'matCalendar',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.Default,
            },] },
];
/** @nocollapse */
MatCalendar.ctorParameters = () => [
    { type: ElementRef, },
    { type: MatDatepickerIntl, },
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Attribute, args: ['mode',] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] },] },
    { type: ChangeDetectorRef, },
    { type: NgZone, },
];
MatCalendar.propDecorators = {
    "startAt": [{ type: Input },],
    "startView": [{ type: Input },],
    "selected": [{ type: Input },],
    "minDate": [{ type: Input },],
    "maxDate": [{ type: Input },],
    "beginDate": [{ type: Input },],
    "endDate": [{ type: Input },],
    "beginCollDate": [{ type: Input },],
    "endCollDate": [{ type: Input },],
    "rangeMode": [{ type: Input },],
    "dateFilter": [{ type: Input },],
    "selectedChange": [{ type: Output },],
    "_userSelection": [{ type: Output },],
    "dateRangesChange": [{ type: Output },],
    "monthView": [{ type: ViewChild, args: [MatMonthView,] },],
    "yearView": [{ type: ViewChild, args: [MatYearView,] },],
    "multiYearView": [{ type: ViewChild, args: [MatMultiYearView,] },],
    "selectMonthView": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Used to generate a unique ID for each datepicker instance.
 */
let datepickerUid = 0;
/**
 * Injection token that determines the scroll handling while the calendar is open.
 */
const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/**
 * \@docs-private
 */
const MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * \@docs-private
 * @template D
 */
class MatDatepickerContent {
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._calendar._focusActiveCell();
    }
}
MatDatepickerContent.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker-content',
                template: `<table>
  <tr>
    <td>
      <mat-calendar cdkTrapFocus
                    [id]="datepicker.id"
                    [ngClass]="datepicker.panelClass"
                    [startAt]="datepicker.startAt"
                    [startView]="datepicker.startView"
                    [minDate]="datepicker._minDate"
                    [maxDate]="datepicker._maxDate"
                    [dateFilter]="datepicker._dateFilter"
                    [beginDate]="datepicker._beginDate"
                    [endDate]="datepicker._endDate"
                    [rangeMode]="datepicker.rangeMode"
                    [selected]="datepicker._selected"
                    (selectedChange)="datepicker._select($event)"
                    (dateRangesChange)="datepicker._selectRange($event)"
                    (_userSelection)="datepicker.close()">
      </mat-calendar>
    </td>
    <td>
      <mat-calendar cdkTrapFocus
                    [id]="datepicker.id"
                    [ngClass]="datepicker.panelClass"
                    [startAt]="datepicker.startAt"
                    [startView]="datepicker.startView"
                    [minDate]="datepicker._minDate"
                    [maxDate]="datepicker._maxDate"
                    [dateFilter]="datepicker._dateFilter"
                    [beginDate]="datepicker._beginDate"
                    [endDate]="datepicker._endDate"
                    [rangeMode]="datepicker.rangeMode"
                    [selected]="datepicker._selected"
                    (selectedChange)="datepicker._select($event)"
                    (dateRangesChange)="datepicker._selectRange($event)"
                    (_userSelection)="datepicker.close()">
      </mat-calendar>
    </td>
  </tr>
</table>
`,
                styles: [`.mat-datepicker-content{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content-touch{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation:landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation:portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}`],
                host: {
                    'class': 'mat-datepicker-content',
                    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                },
                exportAs: 'matDatepickerContent',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatDatepickerContent.ctorParameters = () => [];
MatDatepickerContent.propDecorators = {
    "_calendar": [{ type: ViewChild, args: [MatCalendar,] },],
};
/**
 * Component responsible for managing the datepicker popup/dialog.
 * @template D
 */
class MatDatepicker {
    /**
     * @param {?} _dialog
     * @param {?} _overlay
     * @param {?} _ngZone
     * @param {?} _viewContainerRef
     * @param {?} _scrollStrategy
     * @param {?} _dateAdapter
     * @param {?} _dir
     * @param {?} _document
     */
    constructor(_dialog, _overlay, _ngZone, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        /**
         * The view that the calendar should start in.
         */
        this.startView = 'month';
        this._touchUi = false;
        /**
         * Emits new selected date when selected date changes.
         * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
         */
        this.selectedChanged = new EventEmitter();
        /**
         * Emits when the datepicker has been opened.
         */
        this.openedStream = new EventEmitter();
        /**
         * Emits when the datepicker has been closed.
         */
        this.closedStream = new EventEmitter();
        this._opened = false;
        /**
         * The id for the datepicker calendar.
         */
        this.id = `mat-datepicker-${datepickerUid++}`;
        this._validSelected = null;
        /**
         * The element that was focused before the datepicker was opened.
         */
        this._focusedElementBeforeOpen = null;
        this._inputSubscription = Subscription.EMPTY;
        this._beginDateSelected = false;
        /**
         * Emits when the datepicker is disabled.
         */
        this._disabledChange = new Subject();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    /**
     * The date to open the calendar to initially.
     * @return {?}
     */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is or, in range mode, start from beginning of interval.
        if (this.rangeMode) {
            return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
                (/** @type {?} */ (this._datepickerInput.value)).begin : null);
        }
        return this._startAt || (this._datepickerInput ? /** @type {?} */ (this._datepickerInput.value) : null);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set startAt(date) {
        this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
    }
    /**
     * Whenever datepicker is for selecting range of dates.
     * @return {?}
     */
    get rangeMode() {
        return this._rangeMode;
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    set rangeMode(mode) {
        this._rangeMode = mode;
        if (this.rangeMode) {
            this._validSelected = null;
        }
        else {
            this._beginDate = this._endDate = null;
        }
    }
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     * @return {?}
     */
    get touchUi() {
        return this._touchUi;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    /**
     * Whether the datepicker pop-up should be disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled === undefined && this._datepickerInput ?
            this._datepickerInput.disabled : !!this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        const /** @type {?} */ newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._disabledChange.next(newValue);
        }
    }
    /**
     * Whether the calendar is open.
     * @return {?}
     */
    get opened() { return this._opened; }
    /**
     * @param {?} shouldOpen
     * @return {?}
     */
    set opened(shouldOpen) { shouldOpen ? this.open() : this.close(); }
    /**
     * The currently selected date.
     * @return {?}
     */
    get _selected() { return this._validSelected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set _selected(value) {
        this._beginDate = this._endDate = null;
        this._validSelected = value;
    }
    /**
     * Start of dates interval.
     * @return {?}
     */
    get beginDate() { return this._beginDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginDate(value) {
        this._validSelected = null;
        this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * End of dates interval.
     * @return {?}
     */
    get endDate() { return this._endDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endDate(value) {
        this._validSelected = null;
        this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /**
     * The minimum selectable date.
     * @return {?}
     */
    get _minDate() {
        return this._datepickerInput && this._datepickerInput.min;
    }
    /**
     * The maximum selectable date.
     * @return {?}
     */
    get _maxDate() {
        return this._datepickerInput && this._datepickerInput.max;
    }
    /**
     * @return {?}
     */
    get _dateFilter() {
        return this._datepickerInput && this._datepickerInput._dateFilter;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._inputSubscription.unsubscribe();
        this._disabledChange.complete();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
    }
    /**
     * Selects the given date
     * @param {?} date
     * @return {?}
     */
    _select(date) {
        let /** @type {?} */ oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    }
    /**
     * Selects the given date range
     * @param {?} date
     * @return {?}
     */
    _selectRange(date) {
        if (!this._dateAdapter.sameDate(this.beginDate, date) ||
            !this._dateAdapter.sameDate(this.endDate, date)) {
            if (!this._beginDateSelected) {
                this._beginDateSelected = true;
                this._setDateRange({ begin: date, end: date });
            }
            else {
                this._beginDateSelected = false;
                if (this._dateAdapter.compareDate(/** @type {?} */ (this.beginDate), date) <= 0) {
                    this._setDateRange({ begin: /** @type {?} */ (this.beginDate), end: date });
                }
                else {
                    this._setDateRange({ begin: date, end: /** @type {?} */ (this.beginDate) });
                }
            }
        }
        this.selectedChanged.emit({ begin: this._beginDate, end: this._endDate });
    }
    /**
     * @param {?} dates
     * @return {?}
     */
    _setDateRange(dates) {
        this._beginDate = dates.begin;
        this._endDate = dates.end;
    }
    /**
     * Register an input with this datepicker.
     * @param {?} input The datepicker input to register with this datepicker.
     * @return {?}
     */
    _registerInput(input) {
        if (this._datepickerInput) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        this._inputSubscription =
            this._datepickerInput._valueChange
                .subscribe((value) => {
                if (value === null) {
                    this.beginDate = this.endDate = this._selected = null;
                    return;
                }
                if (this.rangeMode) {
                    value = /** @type {?} */ (value);
                    if (value.begin && value.end &&
                        this._dateAdapter.compareDate(value.begin, value.end) <= 0) {
                        this.beginDate = value.begin;
                        this.endDate = value.end;
                    }
                    else {
                        this.beginDate = this.endDate = null;
                    }
                }
                else {
                    this._selected = /** @type {?} */ (value);
                }
            });
    }
    /**
     * Open the calendar.
     * @return {?}
     */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this._opened = true;
        this.openedStream.emit();
    }
    /**
     * Close the calendar.
     * @return {?}
     */
    close() {
        if (!this._opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        const /** @type {?} */ completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
                this._focusedElementBeforeOpen = null;
            }
        };
        if (this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /**
     * Open the calendar as a dialog.
     * @return {?}
     */
    _openAsDialog() {
        this._dialogRef = this._dialog.open(MatDatepickerContent, {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            panelClass: 'mat-datepicker-dialog',
        });
        this._dialogRef.afterClosed().subscribe(() => this.close());
        this._dialogRef.componentInstance.datepicker = this;
    }
    /**
     * Open the calendar as a popup.
     * @return {?}
     */
    _openAsPopup() {
        if (!this._calendarPortal) {
            this._calendarPortal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            let /** @type {?} */ componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
            // Update the position once the calendar has rendered.
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this._popupRef.updatePosition();
            });
        }
    }
    /**
     * Create the popup.
     * @return {?}
     */
    _createPopup() {
        const /** @type {?} */ overlayConfig = new OverlayConfig({
            positionStrategy: this._createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'mat-overlay-transparent-backdrop',
            direction: this._dir ? this._dir.value : 'ltr',
            scrollStrategy: this._scrollStrategy(),
            panelClass: 'mat-datepicker-popup',
        });
        this._popupRef = this._overlay.create(overlayConfig);
        merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))).subscribe(() => this.close());
    }
    /**
     * Create the popup PositionStrategy.
     * @return {?}
     */
    _createPopupPositionStrategy() {
        const /** @type {?} */ fallbackOffset = this._datepickerInput._getPopupFallbackOffset();
        return this._overlay.position()
            .connectedTo(this._datepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }, undefined, fallbackOffset)
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }, undefined, fallbackOffset);
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatDatepicker.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker',
                template: '',
                exportAs: 'matDatepicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/** @nocollapse */
MatDatepicker.ctorParameters = () => [
    { type: MatDialog, },
    { type: Overlay, },
    { type: NgZone, },
    { type: ViewContainerRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATEPICKER_SCROLL_STRATEGY,] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
];
MatDatepicker.propDecorators = {
    "startAt": [{ type: Input },],
    "rangeMode": [{ type: Input },],
    "startView": [{ type: Input },],
    "touchUi": [{ type: Input },],
    "disabled": [{ type: Input },],
    "selectedChanged": [{ type: Output },],
    "panelClass": [{ type: Input },],
    "openedStream": [{ type: Output, args: ['opened',] },],
    "closedStream": [{ type: Output, args: ['closed',] },],
    "opened": [{ type: Input },],
    "beginDate": [{ type: Input },],
    "endDate": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true
};
const MAT_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatDatepickerInput),
    multi: true
};
/**
 * Special interface to input and output dates interval.
 * @record
 * @template D
 */

/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 * @template D
 */
class MatDatepickerInputEvent {
    /**
     * @param {?} target
     * @param {?} targetElement
     */
    constructor(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
/**
 * Directive used to connect an input to a MatDatepicker.
 * @template D
 */
class MatDatepickerInput {
    /**
     * @param {?} _elementRef
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} _formField
     */
    constructor(_elementRef, _dateAdapter, _dateFormats, _formField) {
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        /**
         * Emits when a `change` event is fired on this `<input>`.
         */
        this.dateChange = new EventEmitter();
        /**
         * Emits when an `input` event is fired on this `<input>`.
         */
        this.dateInput = new EventEmitter();
        /**
         * Emits when the value changes (either due to user input or programmatic change).
         */
        this._valueChange = new EventEmitter();
        /**
         * Emits when the disabled state has changed
         */
        this._disabledChange = new EventEmitter();
        this._onTouched = () => { };
        this._cvaOnChange = () => { };
        this._validatorOnChange = () => { };
        this._datepickerSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /**
         * The form control validator for whether the input parses.
         */
        this._parseValidator = () => {
            return this._lastValueValid ?
                null : { 'matDatepickerParse': { 'text': this._elementRef.nativeElement.value } };
        };
        /**
         * The form control validator for the min date.
         */
        this._minValidator = (control) => {
            if (this._datepicker.rangeMode && control.value) {
                const /** @type {?} */ beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.begin));
                const /** @type {?} */ endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.end));
                if (this.min) {
                    if (beginDate && this._dateAdapter.compareDate(this.min, beginDate) > 0) {
                        return { 'matDatepickerMin': { 'min': this.min, 'actual': beginDate } };
                    }
                    if (endDate && this._dateAdapter.compareDate(this.min, endDate) > 0) {
                        return { 'matDatepickerMin': { 'min': this.min, 'actual': endDate } };
                    }
                }
                return null;
            }
            const /** @type {?} */ controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return (!this.min || !controlValue ||
                this._dateAdapter.compareDate(this.min, controlValue) <= 0) ?
                null : { 'matDatepickerMin': { 'min': this.min, 'actual': controlValue } };
        };
        /**
         * The form control validator for the max date.
         */
        this._maxValidator = (control) => {
            if (this._datepicker.rangeMode && control.value) {
                const /** @type {?} */ beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.begin));
                const /** @type {?} */ endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.end));
                if (this.max) {
                    if (beginDate && this._dateAdapter.compareDate(this.max, beginDate) < 0) {
                        return { 'matDatepickerMax': { 'max': this.max, 'actual': beginDate } };
                    }
                    if (endDate && this._dateAdapter.compareDate(this.max, endDate) < 0) {
                        return { 'matDatepickerMax': { 'max': this.max, 'actual': endDate } };
                    }
                }
                return null;
            }
            const /** @type {?} */ controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return (!this.max || !controlValue ||
                this._dateAdapter.compareDate(this.max, controlValue) >= 0) ?
                null : { 'matDatepickerMax': { 'max': this.max, 'actual': controlValue } };
        };
        /**
         * The form control validator for the date filter.
         */
        this._filterValidator = (control) => {
            if (this._datepicker.rangeMode && control.value) {
                const /** @type {?} */ beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.begin));
                const /** @type {?} */ endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.end));
                return !this._dateFilter || !beginDate && !endDate ||
                    this._dateFilter(beginDate) && this._dateFilter(endDate) ?
                    null : { 'matDatepickerFilter': true };
            }
            const /** @type {?} */ controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this._dateFilter || !controlValue || this._dateFilter(controlValue) ?
                null : { 'matDatepickerFilter': true };
        };
        /**
         * The form control validator for the date filter.
         */
        this._rangeValidator = (control) => {
            if (this._datepicker.rangeMode && control.value) {
                const /** @type {?} */ beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.begin));
                const /** @type {?} */ endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value.end));
                return !beginDate || !endDate || this._dateAdapter.compareDate(beginDate, endDate) <= 0 ?
                    null : { 'matDatepickerRange': true };
            }
            return null;
        };
        /**
         * The combined form control validator for this input.
         */
        this._validator = Validators.compose([this._parseValidator, this._minValidator, this._maxValidator,
            this._filterValidator, this._rangeValidator]);
        /**
         * Whether the last value set on the input was valid.
         */
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
            this.value = this.value;
        });
    }
    /**
     * The datepicker that this input is associated with.
     * @param {?} value
     * @return {?}
     */
    set matDatepicker(value) {
        this.registerDatepicker(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    registerDatepicker(value) {
        if (value) {
            this._datepicker = value;
            this._datepicker._registerInput(this);
        }
    }
    /**
     * Function that can be used to filter out dates within the datepicker.
     * @param {?} filter
     * @return {?}
     */
    set matDatepickerFilter(filter$$1) {
        this._dateFilter = filter$$1;
        this._validatorOnChange();
    }
    /**
     * The value of the input.
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (value && value.hasOwnProperty('begin') && value.hasOwnProperty('end')) {
            /**
             * Range mode
             */
            const /** @type {?} */ rangeValue = /** @type {?} */ (value);
            rangeValue.begin = this._dateAdapter.deserialize(rangeValue.begin);
            rangeValue.end = this._dateAdapter.deserialize(rangeValue.end);
            this._lastValueValid = !rangeValue.begin || !rangeValue.end ||
                this._dateAdapter.isValid(rangeValue.begin) && this._dateAdapter.isValid(rangeValue.end);
            rangeValue.begin = this._getValidDateOrNull(rangeValue.begin);
            rangeValue.end = this._getValidDateOrNull(rangeValue.end);
            let /** @type {?} */ oldDate = /** @type {?} */ (this.value);
            this._elementRef.nativeElement.value =
                rangeValue && rangeValue.begin && rangeValue.end
                    ? this._dateAdapter.format(rangeValue.begin, this._dateFormats.display.dateInput) +
                        ' - ' +
                        this._dateAdapter.format(rangeValue.end, this._dateFormats.display.dateInput)
                    : '';
            if (oldDate == null && rangeValue != null || oldDate != null && rangeValue == null ||
                !this._dateAdapter.sameDate((/** @type {?} */ (oldDate)).begin, rangeValue.begin) ||
                !this._dateAdapter.sameDate((/** @type {?} */ (oldDate)).end, rangeValue.end)) {
                if (rangeValue.end && rangeValue.begin &&
                    this._dateAdapter
                        .compareDate(rangeValue.begin, rangeValue.end) > 0) {
                    // if begin > end
                    value = null;
                }
                this._value = value;
                this._valueChange.emit(value);
            }
        }
        else {
            /** Not range mode */
            value = this._dateAdapter.deserialize(value);
            this._lastValueValid = !value || this._dateAdapter.isValid(value);
            value = this._getValidDateOrNull(value);
            let /** @type {?} */ oldDate = this.value;
            this._value = value;
            this._elementRef.nativeElement.value =
                value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
            if (!this._dateAdapter.sameDate(/** @type {?} */ (oldDate), value)) {
                this._valueChange.emit(value);
            }
        }
    }
    /**
     * The minimum valid date.
     * @return {?}
     */
    get min() { return this._min; }
    /**
     * @param {?} value
     * @return {?}
     */
    set min(value) {
        this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /**
     * The maximum valid date.
     * @return {?}
     */
    get max() { return this._max; }
    /**
     * @param {?} value
     * @return {?}
     */
    set max(value) {
        this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /**
     * Whether the datepicker-input is disabled.
     * @return {?}
     */
    get disabled() { return !!this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        const /** @type {?} */ newValue = coerceBooleanProperty(value);
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this._disabledChange.emit(newValue);
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this._datepicker) {
            this._datepickerSubscription =
                this._datepicker.selectedChanged.subscribe((selected) => {
                    this.value = selected;
                    this._cvaOnChange(selected);
                    this._onTouched();
                    this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                    this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
                });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._datepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return {?} The element to connect the popup to.
     */
    getPopupConnectionElementRef() {
        return this._formField ? this._formField.underlineRef : this._elementRef;
    }
    /**
     * Determines the offset to be used when the calendar goes into a fallback position.
     * Primarily used to prevent the calendar from overlapping the input.
     * @return {?}
     */
    _getPopupFallbackOffset() {
        return this._formField ? -this._formField._inputContainerRef.nativeElement.clientHeight : 0;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} disabled
     * @return {?}
     */
    setDisabledState(disabled) {
        this.disabled = disabled;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onKeydown(event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this._datepicker.open();
            event.preventDefault();
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _onInput(value) {
        let /** @type {?} */ date = null;
        if (this._datepicker.rangeMode) {
            let /** @type {?} */ parts = value.split('-');
            if (parts.length > 1) {
                const /** @type {?} */ position = Math.floor(parts.length / 2);
                const /** @type {?} */ beginDateString = parts.slice(0, position).join('-');
                const /** @type {?} */ endDateString = parts.slice(position).join('-');
                let /** @type {?} */ beginDate = this._dateAdapter.parse(beginDateString, this._dateFormats.parse.dateInput);
                let /** @type {?} */ endDate = this._dateAdapter.parse(endDateString, this._dateFormats.parse.dateInput);
                this._lastValueValid = !beginDate || !endDate || this._dateAdapter.isValid(beginDate) &&
                    this._dateAdapter.isValid(endDate);
                beginDate = this._getValidDateOrNull(beginDate);
                endDate = this._getValidDateOrNull(endDate);
                if (beginDate && endDate) {
                    date = /** @type {?} */ ({ begin: beginDate, end: endDate });
                }
            }
        }
        else {
            date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
            this._lastValueValid = !date || this._dateAdapter.isValid(date);
            date = this._getValidDateOrNull(date);
        }
        this._value = date;
        this._cvaOnChange(date);
        this._valueChange.emit(date);
        this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /**
     * @return {?}
     */
    _onChange() {
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatDatepickerInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[matDatepicker]',
                providers: [
                    MAT_DATEPICKER_VALUE_ACCESSOR,
                    MAT_DATEPICKER_VALIDATORS,
                    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatepickerInput },
                ],
                host: {
                    '[attr.aria-haspopup]': 'true',
                    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                    '[disabled]': 'disabled',
                    '(input)': '_onInput($event.target.value)',
                    '(change)': '_onChange()',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_onKeydown($event)',
                },
                exportAs: 'matDatepickerInput',
            },] },
];
/** @nocollapse */
MatDatepickerInput.ctorParameters = () => [
    { type: ElementRef, },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] },] },
    { type: MatFormField, decorators: [{ type: Optional },] },
];
MatDatepickerInput.propDecorators = {
    "matDatepicker": [{ type: Input },],
    "matDatepickerFilter": [{ type: Input },],
    "value": [{ type: Input },],
    "min": [{ type: Input },],
    "max": [{ type: Input },],
    "disabled": [{ type: Input },],
    "dateChange": [{ type: Output },],
    "dateInput": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @template D
 */
class MatDatepickerToggle {
    /**
     * @param {?} _intl
     * @param {?} _changeDetectorRef
     */
    constructor(_intl, _changeDetectorRef) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
    }
    /**
     * Whether the toggle button is disabled.
     * @return {?}
     */
    get disabled() {
        return this._disabled === undefined ? this.datepicker.disabled : !!this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["datepicker"]) {
            this._watchStateChanges();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _open(event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    }
    /**
     * @return {?}
     */
    _watchStateChanges() {
        const /** @type {?} */ datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : of();
        const /** @type {?} */ inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
            this.datepicker._datepickerInput._disabledChange : of();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled)
            .subscribe(() => this._changeDetectorRef.markForCheck());
    }
}
MatDatepickerToggle.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker-toggle',
                template: `<button mat-icon-button type="button" [attr.aria-label]="_intl.openCalendarLabel"
        [disabled]="disabled" (click)="_open($event)">
  <mat-icon>
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"
        style="vertical-align: top" focusable="false">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  </mat-icon>
</button>
`,
                host: {
                    'class': 'mat-datepicker-toggle',
                },
                exportAs: 'matDatepickerToggle',
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatDatepickerToggle.ctorParameters = () => [
    { type: MatDatepickerIntl, },
    { type: ChangeDetectorRef, },
];
MatDatepickerToggle.propDecorators = {
    "datepicker": [{ type: Input, args: ['for',] },],
    "disabled": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template D
 */
class MatRangepickerInline {
    /**
     * @param {?} _dateAdapter
     * @param {?} _dateFormats
     * @param {?} zone
     */
    constructor(_dateAdapter, _dateFormats, zone) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.zone = zone;
        /**
         * Emits new selected date when selected date changes.
         * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
         */
        this.selectedChanged = new EventEmitter();
        this.selectedComparisonChanged = new EventEmitter();
        this.selectedCollectionChanged = new EventEmitter();
        this._validSelected = null;
        this._beginDateSelected = false;
        this._beginCollDateSelected = false;
        this._collSelectingMode = false;
        this.comparisonModel = '';
        this.collectionModel = '';
    }
    /**
     * The date to open the calendar to initially.
     * @return {?}
     */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is or, in range mode, start from beginning of interval.
        // if (this.rangeMode) {
        //   return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
        //     (<MatDatePickerRangeValue<D>>this._datepickerInput.value).begin : null);
        // }
        // || (this._datepickerInput ? <D|null>this._datepickerInput.value : null)
        return this._startAt;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set startAt(date) {
        this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
    }
    /**
     * Whenever datepicker is for selecting range of dates.
     * @return {?}
     */
    get rangeMode() {
        return this._rangeMode;
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    set rangeMode(mode) {
        this._rangeMode = mode;
        if (this.rangeMode) {
            this._validSelected = null;
        }
        else {
            this._beginDate = this._endDate = this._beginCollDate = this._endCollDate = null;
        }
    }
    /**
     * Start of dates interval.
     * @return {?}
     */
    get beginDate() { return this._beginDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginDate(value) {
        this._validSelected = null;
        this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
    }
    /**
     * End of dates interval.
     * @return {?}
     */
    get endDate() { return this._endDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endDate(value) {
        this._validSelected = null;
        this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
    }
    /**
     * The currently selected date.
     * @return {?}
     */
    get _selected() { return this._validSelected; }
    /**
     * @param {?} value
     * @return {?}
     */
    set _selected(value) {
        this._beginDate = this._endDate = null;
        this._validSelected = value;
    }
    /**
     * Start of dates interval.
     * @return {?}
     */
    get beginCollDate() { return this._beginCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set beginCollDate(value) {
        this._validSelected = null;
        this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.collectionModel = this.prepareFormat(this._beginCollDate, this._endCollDate);
        this.rightCalendar['startAt'] = this._beginCollDate;
        this.rightCalendar['_activeDate'] = this._beginCollDate;
    }
    /**
     * End of dates interval.
     * @return {?}
     */
    get endCollDate() { return this._endCollDate; }
    /**
     * @param {?} value
     * @return {?}
     */
    set endCollDate(value) {
        this._validSelected = null;
        this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        this.collectionModel = this.prepareFormat(this._beginCollDate, this._endCollDate);
    }
    /**
     * @param {?=} mode
     * @return {?}
     */
    _setRangeType(mode = false) {
        this._collSelectingMode = mode;
    }
    /**
     * Selects the given date range
     * @param {?} date
     * @return {?}
     */
    _selectRange(date) {
        if (this._collSelectingMode) {
            this._selectCollRange(date);
            if (!this._beginCollDateSelected) {
                this.selectedCollectionChanged.emit({ begin: this._beginDate, end: this._endDate });
                this.collectionModel = this.prepareFormat(this._beginCollDate, this.endCollDate);
            }
        }
        else {
            this._selectCompRange(date);
            if (!this._beginDateSelected) {
                this.selectedComparisonChanged.emit({ begin: this._beginCollDate, end: this.endCollDate });
                this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
            }
        }
        this.selectedChanged.emit({ begin: this._beginDate, end: this._endDate });
    }
    /**
     * @param {?} begin
     * @param {?} end
     * @return {?}
     */
    prepareFormat(begin, end) {
        if (this._getValidDateOrNull(begin) && this._getValidDateOrNull(end)) {
            const /** @type {?} */ date1 = this._dateAdapter.format(begin, this._dateFormats.display.dateInput);
            const /** @type {?} */ date2 = this._dateAdapter.format(end, this._dateFormats.display.dateInput);
            return `${date1} - ${date2}`;
        }
        return '';
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _selectCompRange(date) {
        if (!this._dateAdapter.sameDate(this.beginDate, date) ||
            !this._dateAdapter.sameDate(this.endDate, date)) {
            if (!this._beginDateSelected) {
                this._beginDateSelected = true;
                this._setCompDateRange({ begin: date, end: date });
            }
            else {
                this._beginDateSelected = false;
                if (this._dateAdapter.compareDate(/** @type {?} */ (this.beginDate), date) <= 0) {
                    this._setCompDateRange({ begin: /** @type {?} */ (this.beginDate), end: date });
                }
                else {
                    this._setCompDateRange({ begin: date, end: /** @type {?} */ (this.beginDate) });
                }
            }
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _selectCollRange(date) {
        if (!this._dateAdapter.sameDate(this.beginCollDate, date) ||
            !this._dateAdapter.sameDate(this.endCollDate, date)) {
            if (!this._beginCollDateSelected) {
                this._beginCollDateSelected = true;
                this._setCollDateRange({ begin: date, end: date });
            }
            else {
                this._beginCollDateSelected = false;
                if (this._dateAdapter.compareDate(/** @type {?} */ (this.beginCollDate), date) <= 0) {
                    this._setCollDateRange({ begin: /** @type {?} */ (this.beginCollDate), end: date });
                }
                else {
                    this._setCollDateRange({ begin: date, end: /** @type {?} */ (this.beginCollDate) });
                }
            }
        }
    }
    /**
     * @param {?} dates
     * @return {?}
     */
    _setCompDateRange(dates) {
        this._beginDate = dates.begin;
        this._endDate = dates.end;
    }
    /**
     * @param {?} dates
     * @return {?}
     */
    _setCollDateRange(dates) {
        this._beginCollDate = dates.begin;
        this._endCollDate = dates.end;
    }
    /**
     * @param {?} obj The object to check.
     * @return {?} The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    }
}
MatRangepickerInline.decorators = [
    { type: Component, args: [{
                selector: 'mat-rangepicker-inline',
                exportAs: 'mat-rangepicker-inline',
                template: `<div>
  <table>
    <tr>
      <td>
        <mat-input-container [class.active]="!_collSelectingMode" class="active comp">
          <input matInput placeholder="Comparison period" [ngModel]="comparisonModel" (focus)="_setRangeType()">
        </mat-input-container>
      </td>
      <td>
        <mat-input-container class="coll" [class.active]="_collSelectingMode">
          <input matInput placeholder="Collection period" [ngModel]="collectionModel" (focus)="_setRangeType(true)">
        </mat-input-container>
      </td>
    </tr>
    <tr>
      <td>
        <mat-calendar #leftCalendar
                      [rangeMode]="true"
                      [startAt]="_startAt"
                      [beginDate]="_beginDate"
                      [endDate]="_endDate"
                      [beginCollDate]="_beginCollDate"
                      [endCollDate]="_endCollDate"
                      (selectMonthView)="rightCalendar.setActiveNextMonth($event)"
                      (dateRangesChange)="_selectRange($event)"
                      mode="left">
        </mat-calendar>
      </td>
      <td>
        <mat-calendar #rightCalendar
                      [rangeMode]="true"
                      [beginDate]="_beginDate"
                      [endDate]="_endDate"
                      [beginCollDate]="_beginCollDate"
                      [endCollDate]="_endCollDate"
                      (selectMonthView)="leftCalendar.setActivePreviousMonth($event)"
                      (dateRangesChange)="_selectRange($event)"
                      mode="right">
        </mat-calendar>
      </td>
    </tr>
  </table>
</div>
`,
                styles: [`/deep/ :host{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}/deep/ .mat-calendar{width:296px;height:354px}/deep/ .mat-datepicker-content-touch{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}/deep/ .mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation:landscape){/deep/ .mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation:portrait){/deep/ .mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}`, `/deep/ mat-input-container{width:100%;padding:0 8px;-webkit-box-sizing:border-box;box-sizing:border-box}mat-input-container.coll.active /deep/ .mat-input-underline,mat-input-container.comp.active /deep/ .mat-input-underline{height:2px}mat-input-container.coll /deep/ .mat-input-underline{background-color:#3f54af}mat-input-container /deep/ .mat-form-field-label{color:rgba(0,0,0,.54)!important}mat-input-container.comp.active /deep/ .mat-input-ripple{display:none!important}`],
                changeDetection: ChangeDetectionStrategy.Default
            },] },
];
/** @nocollapse */
MatRangepickerInline.ctorParameters = () => [
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_FORMATS,] },] },
    { type: NgZone, },
];
MatRangepickerInline.propDecorators = {
    "rightCalendar": [{ type: ViewChild, args: ['rightCalendar',] },],
    "startAt": [{ type: Input },],
    "rangeMode": [{ type: Input },],
    "selectedChanged": [{ type: Output },],
    "selectedComparisonChanged": [{ type: Output },],
    "selectedCollectionChanged": [{ type: Output },],
    "beginDate": [{ type: Input },],
    "endDate": [{ type: Input },],
    "beginCollDate": [{ type: Input },],
    "endCollDate": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class MatDatepickerModule {
}
MatDatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MatButtonModule,
                    FormsModule,
                    MatInputModule,
                    MatDialogModule,
                    MatIconModule,
                    OverlayModule,
                    A11yModule,
                ],
                exports: [
                    MatCalendar,
                    MatCalendarBody,
                    MatDatepicker,
                    MatDatepickerContent,
                    MatDatepickerInput,
                    MatDatepickerToggle,
                    MatMonthView,
                    MatYearView,
                    MatMultiYearView,
                    MatRangepickerInline
                ],
                declarations: [
                    MatCalendar,
                    MatRangepickerInline,
                    MatCalendarBody,
                    MatDatepicker,
                    MatDatepickerContent,
                    MatDatepickerInput,
                    MatDatepickerToggle,
                    MatMonthView,
                    MatYearView,
                    MatMultiYearView,
                ],
                providers: [
                    MatDatepickerIntl,
                    MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER,
                ],
                entryComponents: [
                    MatDatepickerContent,
                ]
            },] },
];
/** @nocollapse */
MatDatepickerModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatDatepickerModule, MatCalendar, MatCalendarCell, MatCalendarBody, MAT_DATEPICKER_SCROLL_STRATEGY, MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER, MatDatepickerContent, MatDatepicker, MAT_DATEPICKER_VALUE_ACCESSOR, MAT_DATEPICKER_VALIDATORS, MatDatepickerInputEvent, MatDatepickerInput, MatDatepickerIntl, MatDatepickerToggle, MatMonthView, MatYearView, MatMultiYearView as ɵa, MatRangepickerInline as ɵb };
//# sourceMappingURL=saturn-datepicker.js.map
