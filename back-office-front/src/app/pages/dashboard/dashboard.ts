import { Component, signal } from '@angular/core';
import { of } from 'rxjs';
import { form } from '@angular/forms/signals';
import { ChipEqualField } from '../../../ui/chip-equals-filter/chip-equals-filter.interfaces';
import { Option, SearchQuery, SortField } from '../../../core/models/common-models';
import { BackOfficePage } from '../../../ui/back-office-page/back-office-page';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TableDatasource } from '../../../core/datasource/table-datasource';
import { AutoMobileTable } from '../../../core/table/auto-mobile-table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MultiSort } from '../../../core/sort/multi-sort';
import { MultiSortHeader } from '../../../core/sort/multi-sort-header';
import { MatPaginator } from '@angular/material/paginator';
import { PaginatorDatasource } from '../../../core/paginator/paginator-datasource';

@Component({
  imports: [
    BackOfficePage,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    AutoMobileTable,
    MatIconButton,
    MatIcon,
    MatFooterCellDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MultiSort,
    MultiSortHeader,
    MatPaginator,
    PaginatorDatasource,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export default class Dashboard {
  listItem = this.loadItemsTest();
  filter = signal({
    role: {
      type: 'equals',
      values: [],
    } as ChipEqualField<number>,
  });
  formFilter = form(this.filter);
  expandedElement?: Option<number>;
  isExpanded(option: Option<number>) {
    return option.value === this.expandedElement?.value;
  }
  toggle(option: Option<number>) {
    if (this.isExpanded(option)) {
      this.expandedElement = undefined;
    } else {
      this.expandedElement = option;
    }
  }

  filterFn = (query: SearchQuery<string>) => {
    console.log(query);
    const filteredListItems = this.listItem.filter((item) =>
      item.label.toLowerCase().includes((query.filters || '').toLowerCase()),
    );
    const start = (query.page - 1) * query.limit;
    const end = query.page * query.limit;

    const elements = filteredListItems.slice(start, end);

    return of({
      elements,
      totalElements: filteredListItems.length,
      totalPages: Math.ceil(filteredListItems.length / query.limit),
    });
  };

  datasource = new TableDatasource(this.filterFn, {
    limit: 10,
  });

  loadItemsTest() {
    const list = [];
    for (let i = 0; i < 100; i++) {
      list.push({
        label: `Item ${i}`,
        value: i,
      });
    }
    return list;
  }

  protected printSorts(event: SortField[]) {
    console.table(event);
  }
}
