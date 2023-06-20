import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent implements OnInit, OnDestroy {
  dataList: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 50;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;
  rowsNumber: number = 4;
  cellsNumber: number = 5;
  searchFilter = new FormControl('');

  loadData$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();
  apiFetch$: Observable<any> = new Observable();

  get rowsArray(): number[] {
    return Array(this.rowsNumber);
  }

  get cellsArray(): number[] {
    return Array(this.cellsNumber);
  }

  ngOnInit() {
    this.loadData$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.apiFetch$),
        tap(({ data, total }) => {
          this.dataList = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadData();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.dataList = [];
    this.loadData$.next();
  }

  onChangePage(event: LazyLoadEvent) {
    this.page = event.first || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
      };
    } else {
      this.sort = null;
    }

    this.loadData();
  }
}
