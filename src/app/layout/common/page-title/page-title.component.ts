import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'page-title',
  template: `
    <div class="px-4 h-24 flex items-center gap-2">
      @if (hasBackButton()) {
        <button mat-icon-button (click)="onGoBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
      }

      <span class="text-3xl font-bold">{{ title() }}</span>

      <ng-content></ng-content>
    </div>
  `,
  imports: [MatIcon, MatIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {
  title = input.required<string>();
  hasBackButton = input<boolean>(false);
  goBack = output<void>();

  onGoBack() {
    this.goBack.emit();
  }
}
