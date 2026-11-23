import { booleanAttribute, Component, input, model } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { MatBadge } from '@angular/material/badge';

@Component({
  imports: [MatChip, CdkOverlayOrigin, CdkConnectedOverlay, MatBadge],
  selector: 'app-chip-selector',
  styleUrl: './chip-selector.scss',
  templateUrl: './chip-selector.html',
})
export class ChipSelector {
  highlighted = input(false, { transform: booleanAttribute });
  opened = model(false);
  badge = input('');
  badgeHidden = input(true);
}
