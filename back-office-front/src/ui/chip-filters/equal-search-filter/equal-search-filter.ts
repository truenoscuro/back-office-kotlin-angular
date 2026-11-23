import { Component, computed, effect, input, model, signal, viewChild } from '@angular/core';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { FormValueControl } from '@angular/forms/signals';
import { EqualSearchField } from './equal-search-filter.interfaces';
import { Option } from '../../../core/models/common-models';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { InfiniteScrollDatasource } from '../../../core/datasource/infinite-scroll-datasource';
import { SelectableInfiniteDatasource } from '../../../core/datasource/selectable-infinite-datasource';
import { ChipSelector } from '../../chip-selector/chip-selector';
import { ChipMenu } from '../../chip-selector/chip-menu/chip-menu';

@Component({
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatDivider,
    MatButton,
    MatInput,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    MatList,
    MatListItem,
    MatCheckbox,
    MatRipple,
    ChipSelector,
    ChipMenu,
  ],
  selector: 'app-equals-search-filter',
  styleUrl: './equal-search-filter.scss',
  templateUrl: './equal-search-filter.html',
})
export class EqualSearchFilter<T> implements FormValueControl<EqualSearchField<T>> {
  selection = new SelectionModel<Option<T>>(true);
  value = model<EqualSearchField<T>>({
    type: 'equals',
    values: [],
  });

  //Input requerido
  datasource = input.required<InfiniteScrollDatasource<Option<T>, string>>();
  //Parte de la búsqueda
  textSearch = signal('');
  combinedDatasource = computed(() => {
    return new SelectableInfiniteDatasource(this.datasource(), this.selection);
  });
  protected readonly viewport = viewChild.required(CdkVirtualScrollViewport);
  protected readonly Math = Math;
  #changeText = effect(() => {
    this.datasource().filter = this.textSearch();
    this.combinedDatasource().syncPinnedSelection();
    this.viewport().scrollToIndex(0);
  });

  get length() {
    return this.selection.selected.length;
  }

  get first() {
    return this.length > 0 ? this.selection.selected[0] : undefined;
  }

  mode(type: 'equals' | 'notEquals') {
    return type === 'equals' ? '=' : '!=';
  }

  protected startSearch(input: HTMLInputElement) {
    const value = input.value || '';
    this.textSearch.set(value);
  }

  protected toggleSelected(item: Option<T>, isTopSelection: boolean, checkbox: MatCheckbox) {
    checkbox.toggle();
    this.onCheckboxChange(item, isTopSelection, checkbox);
  }

  protected onCheckboxChange(item: Option<T>, isTopSelection: boolean, checkbox: MatCheckbox) {
    const checked = checkbox.checked;

    if (checked && !this.selection.isSelected(item)) {
      this.selection.select(item);
      this.value().values.push(item.value);
    }

    if (!checked) {
      this.selection.deselect(item);
      this.value().values.splice(this.value().values.indexOf(item.value), 1);
    }
    if (!checked && isTopSelection) {
      this.combinedDatasource().syncPinnedSelection();
    }
  }

  protected clean() {
    this.selection.clear();
    this.value().values.length = 0;
    this.combinedDatasource().syncPinnedSelection();
  }
}
