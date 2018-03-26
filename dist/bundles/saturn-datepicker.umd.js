(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('@angular/material/core'), require('@angular/cdk/keycodes'), require('rxjs/operators/take'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('rxjs/operators/filter'), require('@angular/material/dialog'), require('@angular/common'), require('rxjs/Subscription'), require('rxjs/observable/merge'), require('@angular/forms'), require('@angular/material/form-field'), require('@angular/material/input'), require('rxjs/observable/of'), require('@angular/cdk/a11y'), require('@angular/material/button'), require('@angular/material/icon'), require('@angular/material')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', '@angular/material/core', '@angular/cdk/keycodes', 'rxjs/operators/take', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/cdk/overlay', '@angular/cdk/portal', 'rxjs/operators/filter', '@angular/material/dialog', '@angular/common', 'rxjs/Subscription', 'rxjs/observable/merge', '@angular/forms', '@angular/material/form-field', '@angular/material/input', 'rxjs/observable/of', '@angular/cdk/a11y', '@angular/material/button', '@angular/material/icon', '@angular/material'], factory) :
	(factory((global['saturn-datepicker'] = {}),global.ng.core,global.Rx,global.ng.material.core,global.ng.cdk.keycodes,global.Rx.Observable.prototype,global.ng.cdk.bidi,global.ng.cdk.coercion,global.ng.cdk.overlay,global.ng.cdk.portal,global.Rx.Observable.prototype,global.ng.material.dialog,global.ng.common,global.Rx,global.Rx.Observable,global.ng.forms,global.ng.material['form-field'],global.ng.material.input,global.Rx.Observable,global.ng.cdk.a11y,global.ng.material.button,global.ng.material.icon,global.ng.material));
}(this, (function (exports,core,Subject,core$1,keycodes,take,bidi,coercion,overlay,portal,filter,dialog,common,Subscription,merge,forms,formField,input,of,a11y,button,icon,material) { 'use strict';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function createMissingDateImplError(provider) {
    return Error("MatDatepicker: No provider found for " + provider + ". You must import one of the following " +
        "modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a " +
        "custom implementation.");
}
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatDatepickerIntl = (function () {
    function MatDatepickerIntl() {
        this.changes = new Subject.Subject();
        this.calendarLabel = 'Calendar';
        this.openCalendarLabel = 'Open calendar';
        this.prevMonthLabel = 'Previous month';
        this.nextMonthLabel = 'Next month';
        this.prevYearLabel = 'Previous year';
        this.nextYearLabel = 'Next year';
        this.prevMultiYearLabel = 'Previous 20 years';
        this.nextMultiYearLabel = 'Next 20 years';
        this.switchToMonthViewLabel = 'Choose date';
        this.switchToMultiYearViewLabel = 'Choose month and year';
    }
    return MatDatepickerIntl;
}());
MatDatepickerIntl.decorators = [
    { type: core.Injectable },
];
MatDatepickerIntl.ctorParameters = function () { return []; };
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatCalendarCell = (function () {
    function MatCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MatCalendarCell;
}());
var MatCalendarBody = (function () {
    function MatCalendarBody() {
        this.collectionRange = false;
        this.rangeMode = false;
        this.numCols = 7;
        this.allowDisabledSelection = false;
        this.activeCell = 0;
        this.cellAspectRatio = 1;
        this.selectedValueChange = new core.EventEmitter();
    }
    MatCalendarBody.prototype._cellClicked = function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MatCalendarBody.prototype, "_firstRowOffset", {
        get: function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    MatCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var cellNumber = rowIndex * this.numCols + colIndex;
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    MatCalendarBody.prototype._isSemiSelected = function (date) {
        if (!this.rangeMode) {
            return false;
        }
        if (this.rangeFull) {
            return true;
        }
        if (date === this.begin || date === this.end) {
            return false;
        }
        if (this.begin && !this.end) {
            return date > this.begin;
        }
        if (this.end && !this.begin) {
            return date < this.end;
        }
        return date > (this.begin) && date < (this.end);
    };
    MatCalendarBody.prototype._isSemiCollectionSelected = function (date) {
        if (!this.rangeMode) {
            return false;
        }
        if (this.rangeFull) {
            return true;
        }
        if (date === this.collectionBegin || date === this.collectionEnd) {
            return false;
        }
        if (this.collectionBegin && !this.collectionEnd) {
            return date > this.collectionBegin;
        }
        if (this.collectionEnd && !this.collectionBegin) {
            return date < this.collectionEnd;
        }
        return date > (this.collectionBegin) && date < (this.collectionEnd);
    };
    return MatCalendarBody;
}());
MatCalendarBody.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: '[mat-calendar-body]',
                template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n<!--<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">-->\n  <!--<td class=\"mat-calendar-body-label\"-->\n      <!--[attr.colspan]=\"numCols\"-->\n      <!--[style.paddingTop.%]=\"50 * cellAspectRatio / numCols\"-->\n      <!--[style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\">-->\n    <!--&lt;!&ndash;{{label}}&ndash;&gt;-->\n  <!--</td>-->\n<!--</tr>-->\n<!-- Create the first row separately so we can include a special spacer cell. -->\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n  <!--\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\n    percentage of the width (a variant of the trick described here:\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n  -->\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\n      aria-hidden=\"true\"\n      class=\"mat-calendar-body-label\"\n      [attr.colspan]=\"_firstRowOffset\"\n      [style.paddingTop.%]=\"50 * cellAspectRatio / numCols\"\n      [style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\">\n    <!--{{_firstRowOffset >= labelMinRequiredCells ? label : ''}}-->\n  </td>\n  <td *ngFor=\"let item of row; let colIndex = index\"\n      role=\"gridcell\"\n      class=\"mat-calendar-body-cell\"\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n      [class.mat-calendar-body-begin-range]=\"begin === item.value\"\n      [class.mat-calendar-body-end-range]=\"end === item.value\"\n      [class.mat-calendar-cell-semi-selected]=\"_isSemiSelected(item.value)\"\n      [class.mat-calendar-body-begin-collection-range]=\"collectionBegin === item.value\"\n      [class.mat-calendar-body-end-collection-range]=\"collectionEnd === item.value\"\n      [class.mat-calendar-cell-semi-collection-selected]=\"_isSemiCollectionSelected(item.value)\"\n      [attr.aria-label]=\"item.ariaLabel\"\n      [attr.aria-disabled]=\"!item.enabled || null\"\n      (click)=\"_cellClicked(item)\"\n      [style.width.%]=\"100 / numCols\"\n      [style.paddingTop.%]=\"50 * cellAspectRatio / numCols\"\n      [style.paddingBottom.%]=\"50 * cellAspectRatio / numCols\">\n    <div class=\"mat-calendar-body-cell-content\"\n         [class.mat-calendar-body-selected]=\"begin === item.value || end === item.value || selectedValue === item.value\"\n         [class.mat-calendar-body-collection-selected]=\"collectionBegin === item.value || collectionEnd === item.value\"\n         [class.mat-calendar-body-semi-selected]=\"_isSemiSelected(item.value)\"\n         [class.mat-calendar-body-semi-collection-selected]=\"_isSemiCollectionSelected(item.value)\"\n         [class.mat-calendar-body-today]=\"todayValue === item.value\">\n      {{item.displayValue}}\n    </div>\n  </td>\n</tr>\n",
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;text-align:left;padding-left:4.71429%;padding-right:4.71429%}.mat-calendar-body-cell{position:relative;height:0;line-height:0;text-align:center;outline:0;cursor:pointer}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px}[dir=rtl] .mat-calendar-body-label{text-align:right}"],
                host: {
                    'class': 'mat-calendar-body',
                    'role': 'grid',
                    'attr.aria-readonly': 'true'
                },
                exportAs: 'matCalendarBody',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatCalendarBody.ctorParameters = function () { return []; };
MatCalendarBody.propDecorators = {
    "label": [{ type: core.Input },],
    "rows": [{ type: core.Input },],
    "todayValue": [{ type: core.Input },],
    "selectedValue": [{ type: core.Input },],
    "begin": [{ type: core.Input },],
    "end": [{ type: core.Input },],
    "collectionRange": [{ type: core.Input },],
    "collectionBegin": [{ type: core.Input },],
    "collectionEnd": [{ type: core.Input },],
    "rangeFull": [{ type: core.Input },],
    "rangeMode": [{ type: core.Input },],
    "labelMinRequiredCells": [{ type: core.Input },],
    "numCols": [{ type: core.Input },],
    "allowDisabledSelection": [{ type: core.Input },],
    "activeCell": [{ type: core.Input },],
    "cellAspectRatio": [{ type: core.Input },],
    "selectedValueChange": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var DAYS_PER_WEEK = 7;
var MatMonthView = (function () {
    function MatMonthView(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        this.rangeMode = false;
        this.selectedChange = new core.EventEmitter();
        this._userSelection = new core.EventEmitter();
        this._rangeFull = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        var firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        var narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        var longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        var weekdays = longWeekdays.map(function (long, i) {
            return { long: long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MatMonthView.prototype, "activeDate", {
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate =
                this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._selectedDate = this._getDateInCurrentMonth(this._selected);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "beginDate", {
        get: function () { return this._beginDate; },
        set: function (value) {
            this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.updateRangeSpecificValues();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "endDate", {
        get: function () { return this._endDate; },
        set: function (value) {
            this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.updateRangeSpecificValues();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "beginCollDate", {
        get: function () { return this._beginCollDate; },
        set: function (value) {
            this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.updateCollRangeSpecificValues();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMonthView.prototype, "endCollDate", {
        get: function () { return this._endCollDate; },
        set: function (value) {
            this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.updateCollRangeSpecificValues();
        },
        enumerable: true,
        configurable: true
    });
    MatMonthView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    MatMonthView.prototype._getDateInstanceFromSelectedDate = function (date) {
        var selectedYear = this._dateAdapter.getYear(this.activeDate);
        var selectedMonth = this._dateAdapter.getMonth(this.activeDate);
        return this._dateAdapter.createDate(selectedYear, selectedMonth, date);
    };
    MatMonthView.prototype._dateSelected = function (date) {
        var selectedDate = this._getDateInstanceFromSelectedDate(date);
        if (this.rangeMode) {
            this.selectedChange.emit(selectedDate);
        }
        else if (this._selectedDate != date) {
            this.selectedChange.emit(selectedDate);
            this._userSelection.emit();
        }
    };
    MatMonthView.prototype._init = function () {
        this.updateRangeSpecificValues();
        this.updateCollRangeSpecificValues();
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
        this._changeDetectorRef.markForCheck();
    };
    MatMonthView.prototype._createWeekCells = function () {
        var daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        var dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (var i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            var date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            var enabled = !this.dateFilter ||
                this.dateFilter(date);
            var ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    };
    MatMonthView.prototype._getDateInCurrentMonth = function (date) {
        return date && this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    };
    MatMonthView.prototype._hasSameMonthAndYear = function (d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    };
    MatMonthView.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    MatMonthView.prototype.updateRangeSpecificValues = function () {
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
    };
    MatMonthView.prototype.updateCollRangeSpecificValues = function () {
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
    };
    return MatMonthView;
}());
MatMonthView.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-month-view',
                template: "<table class=\"mat-calendar-table\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th></tr>\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate\"\n         [selectedValue]=\"_selectedDate\"\n         [begin]=\"_beginDateNumber\"\n         [end]=\"_endDateNumber\"\n         [collectionBegin]=\"_beginCollDateNumber\"\n         [collectionEnd]=\"_endCollDateNumber\"\n         [rangeFull]=\"_rangeFull\"\n         [rangeMode]=\"rangeMode\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         (selectedValueChange)=\"_dateSelected($event)\">\n  </tbody>\n</table>\n",
                exportAs: 'matMonthView',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatMonthView.ctorParameters = function () { return [
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.MAT_DATE_FORMATS,] },] },
    { type: core.ChangeDetectorRef, },
]; };
MatMonthView.propDecorators = {
    "activeDate": [{ type: core.Input },],
    "selected": [{ type: core.Input },],
    "beginDate": [{ type: core.Input },],
    "endDate": [{ type: core.Input },],
    "beginCollDate": [{ type: core.Input },],
    "endCollDate": [{ type: core.Input },],
    "rangeMode": [{ type: core.Input },],
    "dateFilter": [{ type: core.Input },],
    "selectedChange": [{ type: core.Output },],
    "_userSelection": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var yearsPerPage = 24;
var yearsPerRow = 4;
var MatMultiYearView = (function () {
    function MatMultiYearView(_dateAdapter, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._changeDetectorRef = _changeDetectorRef;
        this.selectedChange = new core.EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MatMultiYearView.prototype, "activeDate", {
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate =
                this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            if (Math.floor(this._dateAdapter.getYear(oldActiveDate) / yearsPerPage) !=
                Math.floor(this._dateAdapter.getYear(this._activeDate) / yearsPerPage)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMultiYearView.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._selectedYear = this._selected && this._dateAdapter.getYear(this._selected);
        },
        enumerable: true,
        configurable: true
    });
    MatMultiYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    MatMultiYearView.prototype._init = function () {
        var _this = this;
        this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
        var activeYear = this._dateAdapter.getYear(this._activeDate);
        var activeOffset = activeYear % yearsPerPage;
        this._years = [];
        for (var i = 0, row = []; i < yearsPerPage; i++) {
            row.push(activeYear - activeOffset + i);
            if (row.length == yearsPerRow) {
                this._years.push(row.map(function (year) { return _this._createCellForYear(year); }));
                row = [];
            }
        }
        this._changeDetectorRef.markForCheck();
    };
    MatMultiYearView.prototype._yearSelected = function (year) {
        var month = this._dateAdapter.getMonth(this.activeDate);
        var daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(year, month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    };
    MatMultiYearView.prototype._getActiveCell = function () {
        return this._dateAdapter.getYear(this.activeDate) % yearsPerPage;
    };
    MatMultiYearView.prototype._createCellForYear = function (year) {
        var yearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(year, 0, 1));
        return new MatCalendarCell(year, yearName, yearName, true);
    };
    MatMultiYearView.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatMultiYearView;
}());
MatMultiYearView.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-multi-year-view',
                template: "<table class=\"mat-calendar-table\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         allowDisabledSelection=\"true\"\n         [rows]=\"_years\"\n         [todayValue]=\"_todayYear\"\n         [selectedValue]=\"_selectedYear\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_getActiveCell()\"\n         (selectedValueChange)=\"_yearSelected($event)\">\n  </tbody>\n</table>\n",
                exportAs: 'matMultiYearView',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatMultiYearView.ctorParameters = function () { return [
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: core.ChangeDetectorRef, },
]; };
MatMultiYearView.propDecorators = {
    "activeDate": [{ type: core.Input },],
    "selected": [{ type: core.Input },],
    "dateFilter": [{ type: core.Input },],
    "selectedChange": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatYearView = (function () {
    function MatYearView(_dateAdapter, _dateFormats, _changeDetectorRef) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._changeDetectorRef = _changeDetectorRef;
        this.selectedChange = new core.EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MatYearView.prototype, "activeDate", {
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate =
                this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatYearView.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._selectedMonth = this._getMonthInCurrentYear(this._selected);
        },
        enumerable: true,
        configurable: true
    });
    MatYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    MatYearView.prototype._monthSelected = function (month) {
        var daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1));
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
    };
    MatYearView.prototype._init = function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var monthNames = this._dateAdapter.getMonthNames('short');
        this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
        this._changeDetectorRef.markForCheck();
    };
    MatYearView.prototype._getMonthInCurrentYear = function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    MatYearView.prototype._createCellForMonth = function (month, monthName) {
        var ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    MatYearView.prototype._isMonthEnabled = function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        for (var date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    MatYearView.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatYearView;
}());
MatYearView.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-year-view',
                template: "<table class=\"mat-calendar-table\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         allowDisabledSelection=\"true\"\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth\"\n         [selectedValue]=\"_selectedMonth\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_dateAdapter.getMonth(activeDate)\"\n         (selectedValueChange)=\"_monthSelected($event)\">\n  </tbody>\n</table>\n",
                exportAs: 'matYearView',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatYearView.ctorParameters = function () { return [
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.MAT_DATE_FORMATS,] },] },
    { type: core.ChangeDetectorRef, },
]; };
MatYearView.propDecorators = {
    "activeDate": [{ type: core.Input },],
    "selected": [{ type: core.Input },],
    "dateFilter": [{ type: core.Input },],
    "selectedChange": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatCalendar = (function () {
    function MatCalendar(_elementRef, _intl, _ngZone, mode, _dateAdapter, _dateFormats, changeDetectorRef, zone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this.mode = mode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.zone = zone;
        this.startView = 'month';
        this.rangeMode = false;
        this.selectedChange = new core.EventEmitter();
        this._userSelection = new core.EventEmitter();
        this.dateRangesChange = new core.EventEmitter();
        this._beginDateSelected = false;
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        this.selectMonthView = new core.EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatCalendar.prototype, "startAt", {
        get: function () { return this._startAt; },
        set: function (value) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "minDate", {
        get: function () { return this._minDate; },
        set: function (value) {
            this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "maxDate", {
        get: function () { return this._maxDate; },
        set: function (value) {
            this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "beginDate", {
        get: function () { return this._beginDate; },
        set: function (value) {
            this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "endDate", {
        get: function () { return this._endDate; },
        set: function (value) {
            this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "beginCollDate", {
        get: function () { return this._beginCollDate; },
        set: function (value) {
            this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "endCollDate", {
        get: function () { return this._endCollDate; },
        set: function (value) {
            this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_activeDate", {
        get: function () { return this._clampedActiveDate; },
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
            this.selectMonthView.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    MatCalendar.prototype.setActiveNextMonth = function (date) {
        var nextMonth = this._dateAdapter.addCalendarMonths(date, 1);
        this._clampedActiveDate = this._dateAdapter.clampDate(nextMonth, this.minDate, this.maxDate);
    };
    MatCalendar.prototype.setActivePreviousMonth = function (date) {
        var nextMonth = this._dateAdapter.addCalendarMonths(date, -1);
        this._clampedActiveDate = this._dateAdapter.clampDate(nextMonth, this.minDate, this.maxDate);
    };
    Object.defineProperty(MatCalendar.prototype, "_periodButtonText", {
        get: function () {
            if (this._currentView == 'month') {
                return this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase();
            }
            if (this._currentView == 'year') {
                return this._dateAdapter.getYearName(this._activeDate);
            }
            var activeYear = this._dateAdapter.getYear(this._activeDate);
            var firstYearInView = this._dateAdapter.getYearName(this._dateAdapter.createDate(activeYear - activeYear % 24, 0, 1));
            var lastYearInView = this._dateAdapter.getYearName(this._dateAdapter.createDate(activeYear + yearsPerPage - 1 - activeYear % 24, 0, 1));
            return firstYearInView + " \u2013 " + lastYearInView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_periodButtonLabel", {
        get: function () {
            return this._currentView == 'month' ?
                this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_prevButtonLabel", {
        get: function () {
            return {
                'month': this._intl.prevMonthLabel,
                'year': this._intl.prevYearLabel,
                'multi-year': this._intl.prevMultiYearLabel
            }[this._currentView];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatCalendar.prototype, "_nextButtonLabel", {
        get: function () {
            return {
                'month': this._intl.nextMonthLabel,
                'year': this._intl.nextYearLabel,
                'multi-year': this._intl.nextMultiYearLabel
            }[this._currentView];
        },
        enumerable: true,
        configurable: true
    });
    MatCalendar.prototype.ngAfterContentInit = function () {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._currentView = this.startView;
    };
    MatCalendar.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    MatCalendar.prototype.ngOnChanges = function (changes) {
        var change = changes["minDate"] || changes["maxDate"] || changes["dateFilter"];
        if (change && !change.firstChange) {
            var view = this.monthView || this.yearView || this.multiYearView;
            if (view) {
                view._init();
            }
        }
    };
    MatCalendar.prototype._dateSelected = function (date) {
        if (this.rangeMode) {
            this.dateRangesChange.emit(date);
        }
        else if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    MatCalendar.prototype._userSelected = function () {
        this._userSelection.emit();
    };
    MatCalendar.prototype._goToDateInView = function (date, view) {
        this._activeDate = date;
        this._currentView = view;
    };
    MatCalendar.prototype._currentPeriodClicked = function () {
        this._currentView = this._currentView == 'month' ? 'multi-year' : 'month';
    };
    MatCalendar.prototype._previousClicked = function () {
        this._activeDate = this._currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, this._currentView == 'year' ? -1 : -yearsPerPage);
    };
    MatCalendar.prototype._nextClicked = function () {
        this._activeDate = this._currentView == 'month' ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, this._currentView == 'year' ? 1 : yearsPerPage);
    };
    MatCalendar.prototype._previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    MatCalendar.prototype._nextEnabled = function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    MatCalendar.prototype._handleCalendarBodyKeydown = function (event) {
        if (this._currentView == 'month') {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else if (this._currentView == 'year') {
            this._handleCalendarBodyKeydownInYearView(event);
        }
        else {
            this._handleCalendarBodyKeydownInMultiYearView(event);
        }
    };
    MatCalendar.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._ngZone.onStable.asObservable().pipe(take.take(1)).subscribe(function () {
                _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active').focus();
            });
        });
    };
    MatCalendar.prototype._isSameView = function (date1, date2) {
        if (this._currentView == 'month') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
        }
        if (this._currentView == 'year') {
            return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
        }
        return Math.floor(this._dateAdapter.getYear(date1) / yearsPerPage) ==
            Math.floor(this._dateAdapter.getYear(date2) / yearsPerPage);
    };
    MatCalendar.prototype._handleCalendarBodyKeydownInMonthView = function (event) {
        switch (event.keyCode) {
            case keycodes.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case keycodes.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case keycodes.UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case keycodes.DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case keycodes.HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case keycodes.END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case keycodes.PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case keycodes.PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case keycodes.ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    if (this.rangeMode && !this._beginDateSelected) {
                        this._userSelected();
                    }
                    event.preventDefault();
                }
                return;
            default:
                return;
        }
        this._focusActiveCell();
        event.preventDefault();
    };
    MatCalendar.prototype._handleCalendarBodyKeydownInYearView = function (event) {
        switch (event.keyCode) {
            case keycodes.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case keycodes.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case keycodes.UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -4);
                break;
            case keycodes.DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 4);
                break;
            case keycodes.HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case keycodes.END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case keycodes.PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case keycodes.PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case keycodes.ENTER:
                this._goToDateInView(this._activeDate, 'month');
                break;
            default:
                return;
        }
        this._focusActiveCell();
        event.preventDefault();
    };
    MatCalendar.prototype._handleCalendarBodyKeydownInMultiYearView = function (event) {
        switch (event.keyCode) {
            case keycodes.LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -1);
                break;
            case keycodes.RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, 1);
                break;
            case keycodes.UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -yearsPerRow);
                break;
            case keycodes.DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerRow);
                break;
            case keycodes.HOME:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -this._dateAdapter.getYear(this._activeDate) % yearsPerPage);
                break;
            case keycodes.END:
                this._activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerPage - this._dateAdapter.getYear(this._activeDate) % yearsPerPage - 1);
                break;
            case keycodes.PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                break;
            case keycodes.PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                break;
            case keycodes.ENTER:
                this._goToDateInView(this._activeDate, 'year');
                break;
            default:
                return;
        }
        this._focusActiveCell();
        event.preventDefault();
    };
    MatCalendar.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatCalendar;
}());
MatCalendar.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-calendar',
                template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <button mat-icon-button class=\"mat-calendar-previous-button\"\n            [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\"\n            [attr.aria-label]=\"_prevButtonLabel\"\n            *ngIf=\"mode !== 'right'\">\n    </button>\n    <button mat-button class=\"mat-calendar-period-button\"\n            (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">\n      {{_periodButtonText}}\n      <div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"_currentView != 'month'\"></div>\n    </button>\n    <button mat-icon-button class=\"mat-calendar-next-button\"\n            style=\"float: right\"\n            [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\"\n            [attr.aria-label]=\"_nextButtonLabel\"\n            *ngIf=\"mode !== 'left'\">\n    </button>\n  </div>\n</div>\n<div class=\"mat-calendar-content\" (keydown)=\"_handleCalendarBodyKeydown($event)\"\n    [ngSwitch]=\"_currentView\" cdkMonitorSubtreeFocus>\n  <mat-month-view\n      *ngSwitchCase=\"'month'\"\n      [activeDate]=\"_activeDate\"\n      [selected]=\"selected\"\n      [beginDate]=\"beginDate\"\n      [endDate]=\"endDate\"\n      [beginCollDate]=\"beginCollDate\"\n      [endCollDate]=\"endCollDate\"\n      [rangeMode]=\"rangeMode\"\n      [dateFilter]=\"_dateFilterForViews\"\n      (selectedChange)=\"_dateSelected($event)\"\n      (_userSelection)=\"_userSelected()\">\n  </mat-month-view>\n  <mat-year-view\n      *ngSwitchCase=\"'year'\"\n      [activeDate]=\"_activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"_dateFilterForViews\"\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\n  </mat-year-view>\n  <mat-multi-year-view\n      *ngSwitchCase=\"'multi-year'\"\n      [activeDate]=\"_activeDate\"\n      [selected]=\"selected\"\n      [dateFilter]=\"_dateFilterForViews\"\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\n  </mat-multi-year-view>\n</div>\n",
                styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0}.mat-calendar-content{padding:0 8px 8px;outline:0}.mat-calendar-controls{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin:5% calc(33% / 7 - 16px)}.mat-calendar-spacer{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;margin:0 0 0 5px;vertical-align:middle}.mat-calendar-arrow.mat-calendar-invert{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir=rtl].mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-next-button,.mat-calendar-previous-button{position:relative}.mat-calendar-next-button::after,.mat-calendar-previous-button::after{top:0;left:0;right:0;bottom:0;position:absolute;content:'';margin:15.5px;border:0 solid currentColor;border-top-width:2px}[dir=rtl] .mat-calendar-next-button,[dir=rtl] .mat-calendar-previous-button{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.mat-calendar-previous-button::after{border-left-width:2px;-webkit-transform:translateX(2px) rotate(-45deg);transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button::after{border-right-width:2px;-webkit-transform:translateX(-2px) rotate(45deg);transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:'';position:absolute;top:0;left:-8px;right:-8px;height:1px}"],
                host: {
                    'class': 'mat-calendar',
                },
                exportAs: 'matCalendar',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.Default,
            },] },
];
MatCalendar.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: MatDatepickerIntl, },
    { type: core.NgZone, },
    { type: undefined, decorators: [{ type: core.Attribute, args: ['mode',] },] },
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.MAT_DATE_FORMATS,] },] },
    { type: core.ChangeDetectorRef, },
    { type: core.NgZone, },
]; };
MatCalendar.propDecorators = {
    "startAt": [{ type: core.Input },],
    "startView": [{ type: core.Input },],
    "selected": [{ type: core.Input },],
    "minDate": [{ type: core.Input },],
    "maxDate": [{ type: core.Input },],
    "beginDate": [{ type: core.Input },],
    "endDate": [{ type: core.Input },],
    "beginCollDate": [{ type: core.Input },],
    "endCollDate": [{ type: core.Input },],
    "rangeMode": [{ type: core.Input },],
    "dateFilter": [{ type: core.Input },],
    "selectedChange": [{ type: core.Output },],
    "_userSelection": [{ type: core.Output },],
    "dateRangesChange": [{ type: core.Output },],
    "monthView": [{ type: core.ViewChild, args: [MatMonthView,] },],
    "yearView": [{ type: core.ViewChild, args: [MatYearView,] },],
    "multiYearView": [{ type: core.ViewChild, args: [MatMultiYearView,] },],
    "selectMonthView": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var datepickerUid = 0;
var MAT_DATEPICKER_SCROLL_STRATEGY = new core.InjectionToken('mat-datepicker-scroll-strategy');
function MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay$$1) {
    return function () { return overlay$$1.scrollStrategies.reposition(); };
}
var MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [overlay.Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
var MatDatepickerContent = (function () {
    function MatDatepickerContent() {
    }
    MatDatepickerContent.prototype.ngAfterContentInit = function () {
        this._calendar._focusActiveCell();
    };
    return MatDatepickerContent;
}());
MatDatepickerContent.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker-content',
                template: "<table>\n  <tr>\n    <td>\n      <mat-calendar cdkTrapFocus\n                    [id]=\"datepicker.id\"\n                    [ngClass]=\"datepicker.panelClass\"\n                    [startAt]=\"datepicker.startAt\"\n                    [startView]=\"datepicker.startView\"\n                    [minDate]=\"datepicker._minDate\"\n                    [maxDate]=\"datepicker._maxDate\"\n                    [dateFilter]=\"datepicker._dateFilter\"\n                    [beginDate]=\"datepicker._beginDate\"\n                    [endDate]=\"datepicker._endDate\"\n                    [rangeMode]=\"datepicker.rangeMode\"\n                    [selected]=\"datepicker._selected\"\n                    (selectedChange)=\"datepicker._select($event)\"\n                    (dateRangesChange)=\"datepicker._selectRange($event)\"\n                    (_userSelection)=\"datepicker.close()\">\n      </mat-calendar>\n    </td>\n    <td>\n      <mat-calendar cdkTrapFocus\n                    [id]=\"datepicker.id\"\n                    [ngClass]=\"datepicker.panelClass\"\n                    [startAt]=\"datepicker.startAt\"\n                    [startView]=\"datepicker.startView\"\n                    [minDate]=\"datepicker._minDate\"\n                    [maxDate]=\"datepicker._maxDate\"\n                    [dateFilter]=\"datepicker._dateFilter\"\n                    [beginDate]=\"datepicker._beginDate\"\n                    [endDate]=\"datepicker._endDate\"\n                    [rangeMode]=\"datepicker.rangeMode\"\n                    [selected]=\"datepicker._selected\"\n                    (selectedChange)=\"datepicker._select($event)\"\n                    (dateRangesChange)=\"datepicker._selectRange($event)\"\n                    (_userSelection)=\"datepicker.close()\">\n      </mat-calendar>\n    </td>\n  </tr>\n</table>\n",
                styles: [".mat-datepicker-content{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content-touch{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation:landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation:portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}"],
                host: {
                    'class': 'mat-datepicker-content',
                    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                },
                exportAs: 'matDatepickerContent',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatDatepickerContent.ctorParameters = function () { return []; };
MatDatepickerContent.propDecorators = {
    "_calendar": [{ type: core.ViewChild, args: [MatCalendar,] },],
};
var MatDatepicker = (function () {
    function MatDatepicker(_dialog, _overlay, _ngZone, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        this.startView = 'month';
        this._touchUi = false;
        this.selectedChanged = new core.EventEmitter();
        this.openedStream = new core.EventEmitter();
        this.closedStream = new core.EventEmitter();
        this._opened = false;
        this.id = "mat-datepicker-" + datepickerUid++;
        this._validSelected = null;
        this._focusedElementBeforeOpen = null;
        this._inputSubscription = Subscription.Subscription.EMPTY;
        this._beginDateSelected = false;
        this._disabledChange = new Subject.Subject();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MatDatepicker.prototype, "startAt", {
        get: function () {
            if (this.rangeMode) {
                return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
                    ((this._datepickerInput.value)).begin : null);
            }
            return this._startAt || (this._datepickerInput ? (this._datepickerInput.value) : null);
        },
        set: function (date) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "rangeMode", {
        get: function () {
            return this._rangeMode;
        },
        set: function (mode) {
            this._rangeMode = mode;
            if (this.rangeMode) {
                this._validSelected = null;
            }
            else {
                this._beginDate = this._endDate = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "touchUi", {
        get: function () {
            return this._touchUi;
        },
        set: function (value) {
            this._touchUi = coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "disabled", {
        get: function () {
            return this._disabled === undefined && this._datepickerInput ?
                this._datepickerInput.disabled : !!this._disabled;
        },
        set: function (value) {
            var newValue = coercion.coerceBooleanProperty(value);
            if (newValue !== this._disabled) {
                this._disabled = newValue;
                this._disabledChange.next(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "opened", {
        get: function () { return this._opened; },
        set: function (shouldOpen) { shouldOpen ? this.open() : this.close(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_selected", {
        get: function () { return this._validSelected; },
        set: function (value) {
            this._beginDate = this._endDate = null;
            this._validSelected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "beginDate", {
        get: function () { return this._beginDate; },
        set: function (value) {
            this._validSelected = null;
            this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "endDate", {
        get: function () { return this._endDate; },
        set: function (value) {
            this._validSelected = null;
            this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_minDate", {
        get: function () {
            return this._datepickerInput && this._datepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_maxDate", {
        get: function () {
            return this._datepickerInput && this._datepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepicker.prototype, "_dateFilter", {
        get: function () {
            return this._datepickerInput && this._datepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    MatDatepicker.prototype.ngOnDestroy = function () {
        this.close();
        this._inputSubscription.unsubscribe();
        this._disabledChange.complete();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
    };
    MatDatepicker.prototype._select = function (date) {
        var oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    };
    MatDatepicker.prototype._selectRange = function (date) {
        if (!this._dateAdapter.sameDate(this.beginDate, date) ||
            !this._dateAdapter.sameDate(this.endDate, date)) {
            if (!this._beginDateSelected) {
                this._beginDateSelected = true;
                this._setDateRange({ begin: date, end: date });
            }
            else {
                this._beginDateSelected = false;
                if (this._dateAdapter.compareDate((this.beginDate), date) <= 0) {
                    this._setDateRange({ begin: (this.beginDate), end: date });
                }
                else {
                    this._setDateRange({ begin: date, end: (this.beginDate) });
                }
            }
        }
        this.selectedChanged.emit({ begin: this._beginDate, end: this._endDate });
    };
    MatDatepicker.prototype._setDateRange = function (dates) {
        this._beginDate = dates.begin;
        this._endDate = dates.end;
    };
    MatDatepicker.prototype._registerInput = function (input$$1) {
        var _this = this;
        if (this._datepickerInput) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input$$1;
        this._inputSubscription =
            this._datepickerInput._valueChange
                .subscribe(function (value) {
                if (value === null) {
                    _this.beginDate = _this.endDate = _this._selected = null;
                    return;
                }
                if (_this.rangeMode) {
                    value = (value);
                    if (value.begin && value.end &&
                        _this._dateAdapter.compareDate(value.begin, value.end) <= 0) {
                        _this.beginDate = value.begin;
                        _this.endDate = value.end;
                    }
                    else {
                        _this.beginDate = _this.endDate = null;
                    }
                }
                else {
                    _this._selected = (value);
                }
            });
    };
    MatDatepicker.prototype.open = function () {
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
    };
    MatDatepicker.prototype.close = function () {
        var _this = this;
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
        var completeClose = function () {
            if (_this._opened) {
                _this._opened = false;
                _this.closedStream.emit();
                _this._focusedElementBeforeOpen = null;
            }
        };
        if (this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    };
    MatDatepicker.prototype._openAsDialog = function () {
        var _this = this;
        this._dialogRef = this._dialog.open(MatDatepickerContent, {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            panelClass: 'mat-datepicker-dialog',
        });
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
        this._dialogRef.componentInstance.datepicker = this;
    };
    MatDatepicker.prototype._openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new portal.ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
            this._ngZone.onStable.asObservable().pipe(take.take(1)).subscribe(function () {
                _this._popupRef.updatePosition();
            });
        }
    };
    MatDatepicker.prototype._createPopup = function () {
        var _this = this;
        var overlayConfig = new overlay.OverlayConfig({
            positionStrategy: this._createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'mat-overlay-transparent-backdrop',
            direction: this._dir ? this._dir.value : 'ltr',
            scrollStrategy: this._scrollStrategy(),
            panelClass: 'mat-datepicker-popup',
        });
        this._popupRef = this._overlay.create(overlayConfig);
        merge.merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter.filter(function (event) { return event.keyCode === keycodes.ESCAPE; }))).subscribe(function () { return _this.close(); });
    };
    MatDatepicker.prototype._createPopupPositionStrategy = function () {
        var fallbackOffset = this._datepickerInput._getPopupFallbackOffset();
        return this._overlay.position()
            .connectedTo(this._datepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }, undefined, fallbackOffset)
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }, undefined, fallbackOffset);
    };
    MatDatepicker.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatDatepicker;
}());
MatDatepicker.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker',
                template: '',
                exportAs: 'matDatepicker',
                changeDetection: core.ChangeDetectionStrategy.OnPush,
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
MatDatepicker.ctorParameters = function () { return [
    { type: dialog.MatDialog, },
    { type: overlay.Overlay, },
    { type: core.NgZone, },
    { type: core.ViewContainerRef, },
    { type: undefined, decorators: [{ type: core.Inject, args: [MAT_DATEPICKER_SCROLL_STRATEGY,] },] },
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: bidi.Directionality, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [common.DOCUMENT,] },] },
]; };
MatDatepicker.propDecorators = {
    "startAt": [{ type: core.Input },],
    "rangeMode": [{ type: core.Input },],
    "startView": [{ type: core.Input },],
    "touchUi": [{ type: core.Input },],
    "disabled": [{ type: core.Input },],
    "selectedChanged": [{ type: core.Output },],
    "panelClass": [{ type: core.Input },],
    "openedStream": [{ type: core.Output, args: ['opened',] },],
    "closedStream": [{ type: core.Output, args: ['closed',] },],
    "opened": [{ type: core.Input },],
    "beginDate": [{ type: core.Input },],
    "endDate": [{ type: core.Input },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MAT_DATEPICKER_VALUE_ACCESSOR = {
    provide: forms.NG_VALUE_ACCESSOR,
    useExisting: core.forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
var MAT_DATEPICKER_VALIDATORS = {
    provide: forms.NG_VALIDATORS,
    useExisting: core.forwardRef(function () { return MatDatepickerInput; }),
    multi: true
};
var MatDatepickerInputEvent = (function () {
    function MatDatepickerInputEvent(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
    return MatDatepickerInputEvent;
}());
var MatDatepickerInput = (function () {
    function MatDatepickerInput(_elementRef, _dateAdapter, _dateFormats, _formField) {
        var _this = this;
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        this.dateChange = new core.EventEmitter();
        this.dateInput = new core.EventEmitter();
        this._valueChange = new core.EventEmitter();
        this._disabledChange = new core.EventEmitter();
        this._onTouched = function () { };
        this._cvaOnChange = function () { };
        this._validatorOnChange = function () { };
        this._datepickerSubscription = Subscription.Subscription.EMPTY;
        this._localeSubscription = Subscription.Subscription.EMPTY;
        this._parseValidator = function () {
            return _this._lastValueValid ?
                null : { 'matDatepickerParse': { 'text': _this._elementRef.nativeElement.value } };
        };
        this._minValidator = function (control) {
            if (_this._datepicker.rangeMode && control.value) {
                var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                if (_this.min) {
                    if (beginDate && _this._dateAdapter.compareDate(_this.min, beginDate) > 0) {
                        return { 'matDatepickerMin': { 'min': _this.min, 'actual': beginDate } };
                    }
                    if (endDate && _this._dateAdapter.compareDate(_this.min, endDate) > 0) {
                        return { 'matDatepickerMin': { 'min': _this.min, 'actual': endDate } };
                    }
                }
                return null;
            }
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return (!_this.min || !controlValue ||
                _this._dateAdapter.compareDate(_this.min, controlValue) <= 0) ?
                null : { 'matDatepickerMin': { 'min': _this.min, 'actual': controlValue } };
        };
        this._maxValidator = function (control) {
            if (_this._datepicker.rangeMode && control.value) {
                var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                if (_this.max) {
                    if (beginDate && _this._dateAdapter.compareDate(_this.max, beginDate) < 0) {
                        return { 'matDatepickerMax': { 'max': _this.max, 'actual': beginDate } };
                    }
                    if (endDate && _this._dateAdapter.compareDate(_this.max, endDate) < 0) {
                        return { 'matDatepickerMax': { 'max': _this.max, 'actual': endDate } };
                    }
                }
                return null;
            }
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return (!_this.max || !controlValue ||
                _this._dateAdapter.compareDate(_this.max, controlValue) >= 0) ?
                null : { 'matDatepickerMax': { 'max': _this.max, 'actual': controlValue } };
        };
        this._filterValidator = function (control) {
            if (_this._datepicker.rangeMode && control.value) {
                var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                return !_this._dateFilter || !beginDate && !endDate ||
                    _this._dateFilter(beginDate) && _this._dateFilter(endDate) ?
                    null : { 'matDatepickerFilter': true };
            }
            var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
            return !_this._dateFilter || !controlValue || _this._dateFilter(controlValue) ?
                null : { 'matDatepickerFilter': true };
        };
        this._rangeValidator = function (control) {
            if (_this._datepicker.rangeMode && control.value) {
                var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                return !beginDate || !endDate || _this._dateAdapter.compareDate(beginDate, endDate) <= 0 ?
                    null : { 'matDatepickerRange': true };
            }
            return null;
        };
        this._validator = forms.Validators.compose([this._parseValidator, this._minValidator, this._maxValidator,
            this._filterValidator, this._rangeValidator]);
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MAT_DATE_FORMATS');
        }
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(function () {
            _this.value = _this.value;
        });
    }
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepicker", {
        set: function (value) {
            this.registerDatepicker(value);
        },
        enumerable: true,
        configurable: true
    });
    MatDatepickerInput.prototype.registerDatepicker = function (value) {
        if (value) {
            this._datepicker = value;
            this._datepicker._registerInput(this);
        }
    };
    Object.defineProperty(MatDatepickerInput.prototype, "matDatepickerFilter", {
        set: function (filter$$1) {
            this._dateFilter = filter$$1;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (value && value.hasOwnProperty('begin') && value.hasOwnProperty('end')) {
                var rangeValue = (value);
                rangeValue.begin = this._dateAdapter.deserialize(rangeValue.begin);
                rangeValue.end = this._dateAdapter.deserialize(rangeValue.end);
                this._lastValueValid = !rangeValue.begin || !rangeValue.end ||
                    this._dateAdapter.isValid(rangeValue.begin) && this._dateAdapter.isValid(rangeValue.end);
                rangeValue.begin = this._getValidDateOrNull(rangeValue.begin);
                rangeValue.end = this._getValidDateOrNull(rangeValue.end);
                var oldDate = (this.value);
                this._elementRef.nativeElement.value =
                    rangeValue && rangeValue.begin && rangeValue.end
                        ? this._dateAdapter.format(rangeValue.begin, this._dateFormats.display.dateInput) +
                            ' - ' +
                            this._dateAdapter.format(rangeValue.end, this._dateFormats.display.dateInput)
                        : '';
                if (oldDate == null && rangeValue != null || oldDate != null && rangeValue == null ||
                    !this._dateAdapter.sameDate(((oldDate)).begin, rangeValue.begin) ||
                    !this._dateAdapter.sameDate(((oldDate)).end, rangeValue.end)) {
                    if (rangeValue.end && rangeValue.begin &&
                        this._dateAdapter
                            .compareDate(rangeValue.begin, rangeValue.end) > 0) {
                        value = null;
                    }
                    this._value = value;
                    this._valueChange.emit(value);
                }
            }
            else {
                value = this._dateAdapter.deserialize(value);
                this._lastValueValid = !value || this._dateAdapter.isValid(value);
                value = this._getValidDateOrNull(value);
                var oldDate = this.value;
                this._value = value;
                this._elementRef.nativeElement.value =
                    value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
                if (!this._dateAdapter.sameDate((oldDate), value)) {
                    this._valueChange.emit(value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "min", {
        get: function () { return this._min; },
        set: function (value) {
            this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "max", {
        get: function () { return this._max; },
        set: function (value) {
            this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDatepickerInput.prototype, "disabled", {
        get: function () { return !!this._disabled; },
        set: function (value) {
            var newValue = coercion.coerceBooleanProperty(value);
            if (this._disabled !== newValue) {
                this._disabled = newValue;
                this._disabledChange.emit(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    MatDatepickerInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._datepicker) {
            this._datepickerSubscription =
                this._datepicker.selectedChanged.subscribe(function (selected) {
                    _this.value = selected;
                    _this._cvaOnChange(selected);
                    _this._onTouched();
                    _this.dateInput.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                    _this.dateChange.emit(new MatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                });
        }
    };
    MatDatepickerInput.prototype.ngOnDestroy = function () {
        this._datepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    };
    MatDatepickerInput.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    MatDatepickerInput.prototype.validate = function (c) {
        return this._validator ? this._validator(c) : null;
    };
    MatDatepickerInput.prototype.getPopupConnectionElementRef = function () {
        return this._formField ? this._formField.underlineRef : this._elementRef;
    };
    MatDatepickerInput.prototype._getPopupFallbackOffset = function () {
        return this._formField ? -this._formField._inputContainerRef.nativeElement.clientHeight : 0;
    };
    MatDatepickerInput.prototype.writeValue = function (value) {
        this.value = value;
    };
    MatDatepickerInput.prototype.registerOnChange = function (fn) {
        this._cvaOnChange = fn;
    };
    MatDatepickerInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    MatDatepickerInput.prototype.setDisabledState = function (disabled) {
        this.disabled = disabled;
    };
    MatDatepickerInput.prototype._onKeydown = function (event) {
        if (event.altKey && event.keyCode === keycodes.DOWN_ARROW) {
            this._datepicker.open();
            event.preventDefault();
        }
    };
    MatDatepickerInput.prototype._onInput = function (value) {
        var date = null;
        if (this._datepicker.rangeMode) {
            var parts = value.split('-');
            if (parts.length > 1) {
                var position = Math.floor(parts.length / 2);
                var beginDateString = parts.slice(0, position).join('-');
                var endDateString = parts.slice(position).join('-');
                var beginDate = this._dateAdapter.parse(beginDateString, this._dateFormats.parse.dateInput);
                var endDate = this._dateAdapter.parse(endDateString, this._dateFormats.parse.dateInput);
                this._lastValueValid = !beginDate || !endDate || this._dateAdapter.isValid(beginDate) &&
                    this._dateAdapter.isValid(endDate);
                beginDate = this._getValidDateOrNull(beginDate);
                endDate = this._getValidDateOrNull(endDate);
                if (beginDate && endDate) {
                    date = ({ begin: beginDate, end: endDate });
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
    };
    MatDatepickerInput.prototype._onChange = function () {
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    };
    MatDatepickerInput.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatDatepickerInput;
}());
MatDatepickerInput.decorators = [
    { type: core.Directive, args: [{
                selector: 'input[matDatepicker]',
                providers: [
                    MAT_DATEPICKER_VALUE_ACCESSOR,
                    MAT_DATEPICKER_VALIDATORS,
                    { provide: input.MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatepickerInput },
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
MatDatepickerInput.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.MAT_DATE_FORMATS,] },] },
    { type: formField.MatFormField, decorators: [{ type: core.Optional },] },
]; };
MatDatepickerInput.propDecorators = {
    "matDatepicker": [{ type: core.Input },],
    "matDatepickerFilter": [{ type: core.Input },],
    "value": [{ type: core.Input },],
    "min": [{ type: core.Input },],
    "max": [{ type: core.Input },],
    "disabled": [{ type: core.Input },],
    "dateChange": [{ type: core.Output },],
    "dateInput": [{ type: core.Output },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatDatepickerToggle = (function () {
    function MatDatepickerToggle(_intl, _changeDetectorRef) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.Subscription.EMPTY;
    }
    Object.defineProperty(MatDatepickerToggle.prototype, "disabled", {
        get: function () {
            return this._disabled === undefined ? this.datepicker.disabled : !!this._disabled;
        },
        set: function (value) {
            this._disabled = coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    MatDatepickerToggle.prototype.ngOnChanges = function (changes) {
        if (changes["datepicker"]) {
            this._watchStateChanges();
        }
    };
    MatDatepickerToggle.prototype.ngOnDestroy = function () {
        this._stateChanges.unsubscribe();
    };
    MatDatepickerToggle.prototype.ngAfterContentInit = function () {
        this._watchStateChanges();
    };
    MatDatepickerToggle.prototype._open = function (event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    };
    MatDatepickerToggle.prototype._watchStateChanges = function () {
        var _this = this;
        var datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : of.of();
        var inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
            this.datepicker._datepickerInput._disabledChange : of.of();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge.merge(this._intl.changes, datepickerDisabled, inputDisabled)
            .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    };
    return MatDatepickerToggle;
}());
MatDatepickerToggle.decorators = [
    { type: core.Component, args: [{
                moduleId: module.id,
                selector: 'mat-datepicker-toggle',
                template: "<button mat-icon-button type=\"button\" [attr.aria-label]=\"_intl.openCalendarLabel\"\n        [disabled]=\"disabled\" (click)=\"_open($event)\">\n  <mat-icon>\n    <svg viewBox=\"0 0 24 24\" width=\"100%\" height=\"100%\" fill=\"currentColor\"\n        style=\"vertical-align: top\" focusable=\"false\">\n      <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n      <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n    </svg>\n  </mat-icon>\n</button>\n",
                host: {
                    'class': 'mat-datepicker-toggle',
                },
                exportAs: 'matDatepickerToggle',
                encapsulation: core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
MatDatepickerToggle.ctorParameters = function () { return [
    { type: MatDatepickerIntl, },
    { type: core.ChangeDetectorRef, },
]; };
MatDatepickerToggle.propDecorators = {
    "datepicker": [{ type: core.Input, args: ['for',] },],
    "disabled": [{ type: core.Input },],
};
var MatRangepickerInline = (function () {
    function MatRangepickerInline(_dateAdapter, _dateFormats, zone) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this.zone = zone;
        this.selectedChanged = new core.EventEmitter();
        this.selectedComparisonChanged = new core.EventEmitter();
        this.selectedCollectionChanged = new core.EventEmitter();
        this._validSelected = null;
        this._beginDateSelected = false;
        this._beginCollDateSelected = false;
        this._collSelectingMode = true;
        this.comparisonModel = '';
        this.collectionModel = '';
    }
    Object.defineProperty(MatRangepickerInline.prototype, "startAt", {
        get: function () {
            return this._startAt;
        },
        set: function (date) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(date));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "rangeMode", {
        get: function () {
            return this._rangeMode;
        },
        set: function (mode) {
            this._rangeMode = mode;
            if (this.rangeMode) {
                this._validSelected = null;
            }
            else {
                this._beginDate = this._endDate = this._beginCollDate = this._endCollDate = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "beginDate", {
        get: function () { return this._beginDate; },
        set: function (value) {
            this._validSelected = null;
            this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.collectionModel = this.prepareFormat(this._beginCollDate, this.endCollDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "endDate", {
        get: function () { return this._endDate; },
        set: function (value) {
            this._validSelected = null;
            this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.collectionModel = this.prepareFormat(this._beginCollDate, this.endCollDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "_selected", {
        get: function () { return this._validSelected; },
        set: function (value) {
            this._beginDate = this._endDate = null;
            this._validSelected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "beginCollDate", {
        get: function () { return this._beginCollDate; },
        set: function (value) {
            this._validSelected = null;
            this._beginCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatRangepickerInline.prototype, "endCollDate", {
        get: function () { return this._endCollDate; },
        set: function (value) {
            this._validSelected = null;
            this._endCollDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
        },
        enumerable: true,
        configurable: true
    });
    MatRangepickerInline.prototype._setRangeType = function (mode) {
        if (mode === void 0) { mode = false; }
        this._collSelectingMode = mode;
    };
    MatRangepickerInline.prototype._selectRange = function (date) {
        if (this._collSelectingMode) {
            this._selectCollRange(date);
            if (!this._beginCollDateSelected) {
                this.selectedComparisonChanged.emit({ begin: this._beginCollDate, end: this.endCollDate });
                this.collectionModel = this.prepareFormat(this._beginCollDate, this.endCollDate);
            }
        }
        else {
            this._selectCompRange(date);
            if (!this._beginDateSelected) {
                this.selectedCollectionChanged.emit({ begin: this._beginDate, end: this._endDate });
                this.comparisonModel = this.prepareFormat(this._beginDate, this._endDate);
            }
        }
        this.selectedChanged.emit({ begin: this._beginDate, end: this._endDate });
    };
    MatRangepickerInline.prototype.prepareFormat = function (begin, end) {
        if (this._getValidDateOrNull(begin) && this._getValidDateOrNull(end)) {
            var date1 = this._dateAdapter.format(begin, this._dateFormats.display.dateInput);
            var date2 = this._dateAdapter.format(end, this._dateFormats.display.dateInput);
            return date1 + " - " + date2;
        }
        return '';
    };
    MatRangepickerInline.prototype._selectCompRange = function (date) {
        if (!this._dateAdapter.sameDate(this.beginDate, date) ||
            !this._dateAdapter.sameDate(this.endDate, date)) {
            if (!this._beginDateSelected) {
                this._beginDateSelected = true;
                this._setCompDateRange({ begin: date, end: date });
            }
            else {
                this._beginDateSelected = false;
                if (this._dateAdapter.compareDate((this.beginDate), date) <= 0) {
                    this._setCompDateRange({ begin: (this.beginDate), end: date });
                }
                else {
                    this._setCompDateRange({ begin: date, end: (this.beginDate) });
                }
            }
        }
    };
    MatRangepickerInline.prototype._selectCollRange = function (date) {
        if (!this._dateAdapter.sameDate(this.beginCollDate, date) ||
            !this._dateAdapter.sameDate(this.endCollDate, date)) {
            if (!this._beginCollDateSelected) {
                this._beginCollDateSelected = true;
                this._setCollDateRange({ begin: date, end: date });
            }
            else {
                this._beginCollDateSelected = false;
                if (this._dateAdapter.compareDate((this.beginCollDate), date) <= 0) {
                    this._setCollDateRange({ begin: (this.beginCollDate), end: date });
                }
                else {
                    this._setCollDateRange({ begin: date, end: (this.beginCollDate) });
                }
            }
        }
    };
    MatRangepickerInline.prototype._setCompDateRange = function (dates) {
        this._beginDate = dates.begin;
        this._endDate = dates.end;
    };
    MatRangepickerInline.prototype._setCollDateRange = function (dates) {
        this._beginCollDate = dates.begin;
        this._endCollDate = dates.end;
    };
    MatRangepickerInline.prototype._getValidDateOrNull = function (obj) {
        return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
    };
    return MatRangepickerInline;
}());
MatRangepickerInline.decorators = [
    { type: core.Component, args: [{
                selector: 'mat-rangepicker-inline',
                exportAs: 'mat-rangepicker-inline',
                template: "<div>\n  <table>\n    <tr>\n      <td>\n        <mat-input-container [class.active]=\"_collSelectingMode\" class=\"active comp\">\n          <input matInput placeholder=\"Comparison period\" [ngModel]=\"collectionModel\" (focus)=\"_setRangeType(true)\">\n        </mat-input-container>\n      </td>\n      <td>\n        <mat-input-container class=\"coll\" [class.active]=\"!_collSelectingMode\">\n          <input matInput placeholder=\"Collection period\" [ngModel]=\"comparisonModel\" (focus)=\"_setRangeType()\">\n        </mat-input-container>\n      </td>\n    </tr>\n    <tr>\n      <td>\n        <mat-calendar #leftCalendar\n                      [rangeMode]=\"true\"\n                      [startAt]=\"_startAt\"\n                      [beginDate]=\"_beginDate\"\n                      [endDate]=\"_endDate\"\n                      [beginCollDate]=\"_beginCollDate\"\n                      [endCollDate]=\"_endCollDate\"\n                      (selectMonthView)=\"rightCalendar.setActiveNextMonth($event)\"\n                      (dateRangesChange)=\"_selectRange($event)\"\n                      mode=\"left\">\n        </mat-calendar>\n      </td>\n      <td>\n        <mat-calendar #rightCalendar\n                      [rangeMode]=\"true\"\n                      [beginDate]=\"_beginDate\"\n                      [endDate]=\"_endDate\"\n                      [beginCollDate]=\"_beginCollDate\"\n                      [endCollDate]=\"_endCollDate\"\n                      (selectMonthView)=\"leftCalendar.setActivePreviousMonth($event)\"\n                      (dateRangesChange)=\"_selectRange($event)\"\n                      mode=\"right\">\n        </mat-calendar>\n      </td>\n    </tr>\n  </table>\n</div>\n",
                styles: ["/deep/ :host{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}/deep/ .mat-calendar{width:296px;height:354px}/deep/ .mat-datepicker-content-touch{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;max-height:80vh;overflow:auto;margin:-24px}/deep/ .mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation:landscape){/deep/ .mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation:portrait){/deep/ .mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}", "/deep/ mat-input-container{width:100%;padding:0 8px;-webkit-box-sizing:border-box;box-sizing:border-box}mat-input-container.coll.active /deep/ .mat-input-underline,mat-input-container.comp.active /deep/ .mat-input-underline{height:2px}mat-input-container.coll /deep/ .mat-input-underline{background-color:#3f54af}mat-input-container /deep/ .mat-form-field-label{color:rgba(0,0,0,.54)!important}mat-input-container.comp.active /deep/ .mat-input-ripple{display:none!important}"],
                changeDetection: core.ChangeDetectionStrategy.Default
            },] },
];
MatRangepickerInline.ctorParameters = function () { return [
    { type: core$1.DateAdapter, decorators: [{ type: core.Optional },] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.MAT_DATE_FORMATS,] },] },
    { type: core.NgZone, },
]; };
MatRangepickerInline.propDecorators = {
    "startAt": [{ type: core.Input },],
    "rangeMode": [{ type: core.Input },],
    "selectedChanged": [{ type: core.Output },],
    "selectedComparisonChanged": [{ type: core.Output },],
    "selectedCollectionChanged": [{ type: core.Output },],
    "beginDate": [{ type: core.Input },],
    "endDate": [{ type: core.Input },],
    "beginCollDate": [{ type: core.Input },],
    "endCollDate": [{ type: core.Input },],
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatDatepickerModule = (function () {
    function MatDatepickerModule() {
    }
    return MatDatepickerModule;
}());
MatDatepickerModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    button.MatButtonModule,
                    forms.FormsModule,
                    material.MatInputModule,
                    dialog.MatDialogModule,
                    icon.MatIconModule,
                    overlay.OverlayModule,
                    a11y.A11yModule,
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
MatDatepickerModule.ctorParameters = function () { return []; };

exports.MatDatepickerModule = MatDatepickerModule;
exports.MatCalendar = MatCalendar;
exports.MatCalendarCell = MatCalendarCell;
exports.MatCalendarBody = MatCalendarBody;
exports.MAT_DATEPICKER_SCROLL_STRATEGY = MAT_DATEPICKER_SCROLL_STRATEGY;
exports.MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY = MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY;
exports.MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER = MAT_DATEPICKER_SCROLL_STRATEGY_PROVIDER;
exports.MatDatepickerContent = MatDatepickerContent;
exports.MatDatepicker = MatDatepicker;
exports.MAT_DATEPICKER_VALUE_ACCESSOR = MAT_DATEPICKER_VALUE_ACCESSOR;
exports.MAT_DATEPICKER_VALIDATORS = MAT_DATEPICKER_VALIDATORS;
exports.MatDatepickerInputEvent = MatDatepickerInputEvent;
exports.MatDatepickerInput = MatDatepickerInput;
exports.MatDatepickerIntl = MatDatepickerIntl;
exports.MatDatepickerToggle = MatDatepickerToggle;
exports.MatMonthView = MatMonthView;
exports.MatYearView = MatYearView;
exports.ɵa = MatMultiYearView;
exports.ɵb = MatRangepickerInline;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=saturn-datepicker.umd.js.map
