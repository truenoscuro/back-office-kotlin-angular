import {
  booleanAttribute,
  Component,
  computed,
  input,
  model,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
  imports: [MatDrawer, MatDrawerContainer, MatDrawerContent],
  selector: 'app-drawer-container',
  styleUrl: './drawer-container.scss',
  templateUrl: './drawer-container.html',
  host: {
    '(document:mouseup)': 'onMouseUp()',
    '(document:mousemove)': 'onMouseMove($event)',
  },
})
export class DrawerContainer {
  readonly minWidth = input(90, { transform: numberAttribute });
  readonly maxWidth = input(450, { transform: numberAttribute });
  readonly endDrawer = input<boolean>(false, { transform: booleanAttribute });
  position = computed(() => (this.endDrawer() ? 'end' : 'start'));
  readonly opened = input(false, { transform: booleanAttribute });
  // Considerem mode "només icones" quan baixa de 90px
  drawerWidth = model<number>(240);
  isResizing = signal(false);

  protected _drawer = viewChild.required(MatDrawer);
  public toggle() {
    this._drawer().toggle();
  }

  startResizing(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing.set(true);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing()) return;

    const newWidth = event.clientX;

    if (newWidth >= this.minWidth() && newWidth <= this.maxWidth()) {
      this.drawerWidth.set(newWidth);
    }
  }
  onMouseUp(): void {
    this.isResizing.set(false);
  }
}
