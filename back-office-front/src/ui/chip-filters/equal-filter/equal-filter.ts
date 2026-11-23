import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { EqualField } from './equal-filter.interfaces';
import { Option } from '../../../core/models/common-models';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { ChipMenu } from '../../chip-selector/chip-menu/chip-menu';
import { ChipSelector } from '../../chip-selector/chip-selector';
import { MatButton } from '@angular/material/button';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatOption, MatRipple } from '@angular/material/core';
import { MatFormField } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

@Component({
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    ChipMenu,
    ChipSelector,
    MatButton,
    MatCheckbox,
    MatDivider,
    MatList,
    MatListItem,
    MatRipple,
    MatFormField,
    MatOption,
    MatSelect,
  ],
  selector: 'app-equal-filter',
  styleUrl: './equal-filter.scss',
  templateUrl: './equal-filter.html',
})
export class EqualFilter<T> implements FormValueControl<EqualField<T>> {
  selection = new SelectionModel<Option<T>>(true);

  value = model<EqualField<T>>({
    type: 'equals',
    values: [],
  });

  options = input<Option<T>[]>([]);

  protected readonly Math = Math;

  get length() {
    return this.selection.selected.length;
  }

  get first() {
    return this.length > 0 ? this.selection.selected[0] : undefined;
  }

  mode(type: 'equals' | 'notEquals') {
    return type === 'equals' ? '=' : '!=';
  }

  protected toggleSelected(item: Option<T>, checkbox: MatCheckbox) {
    checkbox.toggle();
    this.onCheckboxChange(item, checkbox);
  }

  protected onCheckboxChange(item: Option<T>, checkbox: MatCheckbox) {
    const checked = checkbox.checked;

    if (checked && !this.selection.isSelected(item)) {
      this.selection.select(item);
      this.value().values.push(item.value);
    }

    if (!checked) {
      this.selection.deselect(item);
      this.value().values.splice(this.value().values.indexOf(item.value), 1);
    }
  }

  protected clean() {
    this.selection.clear();
    this.value().values.length = 0;
  }
}
