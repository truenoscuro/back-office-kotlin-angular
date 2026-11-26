import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { SelectionModel } from '@angular/cdk/collections';
import { Option } from '../../../core/models/common-models';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChipMenu } from '../../chip-selector/chip-menu/chip-menu';
import { ChipSelector } from '../../chip-selector/chip-selector';
import { MatButton } from '@angular/material/button';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatRipple } from '@angular/material/core';

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
  ],
  selector: 'app-select-filter',
  styleUrl: './select-filter.scss',
  templateUrl: './select-filter.html',
})
export class SelectFilter<T> implements FormValueControl<T[]> {
  value = model<T[]>([]);

  selection = new SelectionModel<Option<T>>(true);

  options = input<Option<T>[]>([]);
  protected readonly Math = Math;

  get length() {
    return this.selection.selected.length;
  }

  get first() {
    return this.length > 0 ? this.selection.selected[0] : undefined;
  }

  protected toggleSelected(item: Option<T>, checkbox: MatCheckbox) {
    checkbox.toggle();
    this.onCheckboxChange(item, checkbox);
  }

  protected onCheckboxChange(item: Option<T>, checkbox: MatCheckbox) {
    const checked = checkbox.checked;

    if (checked && !this.selection.isSelected(item)) {
      this.selection.select(item);
      this.value().push(item.value);
    }

    if (!checked) {
      this.selection.deselect(item);
      this.value().splice(this.value().indexOf(item.value), 1);
    }
  }

  protected clean() {
    this.selection.clear();
    this.value().length = 0;
  }
}
