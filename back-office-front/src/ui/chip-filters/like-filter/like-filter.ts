import { Component, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { LikeField } from './like-filter.interfaces';
import { ChipMenu } from '../../chip-selector/chip-menu/chip-menu';
import { ChipSelector } from '../../chip-selector/chip-selector';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';

@Component({
  imports: [
    ChipMenu,
    ChipSelector,
    MatFormField,
    MatOption,
    MatSelect,
    MatInput,
    MatButton,
    MatDivider,
  ],
  selector: 'app-like-filter',
  styleUrl: './like-filter.scss',
  templateUrl: './like-filter.html',
})
export class LikeFilter implements FormValueControl<LikeField> {
  value = model<LikeField>({
    type: 'like',
    text: '',
  });

  mode(type: 'like' | 'notLike') {
    return type === 'like' ? '~' : '≁';
  }

  protected clean() {
    this.value().text = '';
  }
}
