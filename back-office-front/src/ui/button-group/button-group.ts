import { Component, inject } from '@angular/core';
import { AppContext } from '../../core/app-context/app-context';

@Component({
  imports: [],
  selector: 'app-button-group',
  styleUrl: './button-group.scss',
  template: `
    <div class="button-group" [class.mobile-floating]="isMobile()">
      <ng-content />
    </div>
  `,
})
export class ButtonGroup {
  readonly #appContext = inject(AppContext);
  protected readonly isMobile = this.#appContext.isMobile;
}
