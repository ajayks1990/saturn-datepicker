# Double calendar with double daterange Saturn datepicker

## install
```
npm i github:dluhhbiu/saturn-datepicker#master --save
```

```
import { MatDatepickerModule } from 'saturn-datepicker/dist';
```

```
<mat-rangepicker-inline></mat-rangepicker-inline>
```

```
[startAt] - focus calendar
[beginCollDate] - first period 
[endCollDate] - first period
[beginDate] - second period
[endDate] - second period
(selectedComparisonChanged) - first period changed 
(selectedCollectionChanged) - second period changed
```

```
:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-semi-selected),
.cdk-keyboard-focused .mat-calendar-body-active > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-semi-selected),
.cdk-program-focused .mat-calendar-body-active > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-semi-selected) {
  background-color: rgba(0, 0, 0, 0.04); }

:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-semi-selected,
.cdk-keyboard-focused .mat-calendar-body-active > .mat-calendar-body-semi-selected,
.cdk-program-focused .mat-calendar-body-active > .mat-calendar-body-semi-selected {
  background-color: #3f51b5;
  color: white; }

.mat-calendar-body-selected {
  background-color: #3f51b5;
  color: white; }

.mat-calendar-body-begin-range:not(.mat-calendar-body-end-range) {
  border-radius: 100% 0 0 100%;
  background-color: #e8eaf6;
}

.mat-calendar-body-end-range:not(.mat-calendar-body-begin-range) {
  border-radius: 0 100% 100% 0;
  background-color: #e8eaf6;
}

.mat-calendar-body-begin-collection-range:not(.mat-calendar-body-end-collection-range) {
  border-radius: 100% 0 0 100%;
  background-color: #e5e5e5;
}

.mat-calendar-body-end-collection-range:not(.mat-calendar-body-begin-collection-range) {
  border-radius: 0 100% 100% 0;
  background-color: #e5e5e5;
}

.mat-calendar-body-collection-selected {
  background-color: #9d9d9d;
  color: #fff;
}

.mat-calendar-cell-semi-collection-selected {
  background-color: #e5e5e5 !important;
}

.mat-calendar-body > tr .mat-calendar-cell-semi-selected ~ .mat-calendar-cell-semi-selected,
.mat-calendar-body > tr .mat-calendar-cell-semi-collection-selected ~ .mat-calendar-cell-semi-collection-selected {
  border-radius: 0;
}

.mat-calendar-cell-semi-selected {
  background-color: #e8eaf6;
}
```
