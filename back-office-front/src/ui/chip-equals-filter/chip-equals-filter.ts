import { Component, computed, effect, input, model, signal, viewChildren } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { FormValueControl } from '@angular/forms/signals';
import { ChipEqualField } from './chip-equals-filter.interfaces';
import { Option } from '../../core/models/common-models';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { InfiniteScrollDatasource } from '../../core/datasource/infinite-scroll-datasource';
import { SelectableInfiniteDatasource } from '../../core/datasource/selectable-infinite-datasource';

@Component({
  imports: [
    MatChip,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    MatFormField,
    MatSelect,
    MatOption,
    MatBadge,
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
  ],
  selector: 'app-chip-equals-filter',
  styleUrl: './chip-equals-filter.scss',
  templateUrl: './chip-equals-filter.html',
})
export class ChipEqualsFilter<T> implements FormValueControl<ChipEqualField<T>> {
  selection = new SelectionModel<Option<T>>(true);
  value = model<ChipEqualField<T>>({
    type: 'equals',
    values: [],
  });
  //Input requerido
  datasource = input.required<InfiniteScrollDatasource<Option<T>, string>>();
  mode = computed(() => (this.value().type === 'equals' ? '=' : '!='));
  isOpen = signal(false);
  //Parte de la búsqueda
  textSearch = signal('');
  combinedDatasource = computed(() => {
    return new SelectableInfiniteDatasource(this.datasource(), this.selection);
  });
  protected readonly viewports = viewChildren(CdkVirtualScrollViewport);
  protected readonly Math = Math;
  #changeText = effect(() => {
    this.datasource().filter = this.textSearch();
    this.combinedDatasource().syncPinnedSelection();
    for (const viewport of this.viewports()) {
      viewport.scrollToIndex(0);
    }
  });

  get length() {
    return this.selection.selected.length;
  }

  get first() {
    return this.length > 0 ? this.selection.selected[0] : undefined;
  }

  protected startSearch(input: HTMLInputElement) {
    const value = input.value || '';
    this.textSearch.set(value);
  }

  protected toggleMenu() {
    this.isOpen.update((isOpen) => !isOpen);
    this.textSearch.set('');
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
