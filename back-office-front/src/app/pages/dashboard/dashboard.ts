import { Component, signal } from '@angular/core';
import { BackOfficePage } from '../../../ui/back-office-page/back-office-page';
import { form, FormField } from '@angular/forms/signals';
import { EqualFilter } from '../../../ui/chip-filters/equal-filter/equal-filter';
import { EqualField } from '../../../ui/chip-filters/equal-filter/equal-filter.interfaces';
import { LikeField } from '../../../ui/chip-filters/like-filter/like-filter.interfaces';
import { LikeFilter } from '../../../ui/chip-filters/like-filter/like-filter';
import { JsonPipe } from '@angular/common';
import { SelectFilter } from '../../../ui/chip-filters/select-filter/select-filter';
import { MatFormField } from '@angular/material/input';

@Component({
  imports: [
    BackOfficePage,
    EqualFilter,
    FormField,
    LikeFilter,
    JsonPipe,
    SelectFilter,
    MatFormField,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export default class Dashboard {
  listItem = this.loadItemsTest();
  filter = signal({
    exampleSelectEquals: <EqualField<number>>{
      type: 'equals',
      values: [],
    },
    exampleSelect: <number[]>[],
    exampleLike: <LikeField>{
      type: 'like',
      text: '',
    },
  });
  formFilter = form(this.filter);

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
}
