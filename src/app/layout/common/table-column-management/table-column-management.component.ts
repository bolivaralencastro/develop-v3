import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';

export interface TableColumnDef {
  key: string;
  label: string;
}

@Component({
  selector: 'table-column-management',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltip,
    MatCheckboxModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Colunas">
      <mat-icon>settings</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="rounded-xl min-w-48" overlapTrigger="false">
      @if (columnForm) {
        <div class="py-3 pl-3 pr-2 flex flex-col gap-2" (click)="$event.stopPropagation()">
          <form [formGroup]="columnForm" class="flex flex-col gap-1">
            @for (col of columns(); track col.key) {
              <mat-checkbox [formControlName]="col.key">{{ col.label | transloco }}</mat-checkbox>
            }
          </form>
        </div>
      }
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnManagementComponent implements OnInit {
  readonly storageKey = input.required<string>();
  readonly columns = input.required<TableColumnDef[]>();
  readonly visibleColumnsChange = output<string[]>();

  protected columnForm!: FormGroup;

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.columnForm = this.buildColumnForm();
    this.loadFromLocalStorage();
    this.listenToChanges();
    this.columnForm.updateValueAndValidity({ emitEvent: true });
  }

  private buildColumnForm(): FormGroup {
    return new FormGroup(Object.fromEntries(this.columns().map((col) => [col.key, new FormControl(true)])));
  }

  private loadFromLocalStorage(): void {
    const saved = localStorage.getItem(this.storageKey());

    if (!saved) {
      return;
    }

    const visibleKeys: string[] = JSON.parse(saved);
    const patch = Object.fromEntries(this.columns().map((col) => [col.key, visibleKeys.includes(col.key)]));
    this.columnForm.patchValue(patch, { emitEvent: false });
  }

  private listenToChanges(): void {
    this.columnForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const values = this.columnForm.getRawValue();
      const visible = this.columns()
        .filter((col) => values[col.key])
        .map((col) => col.key);
      localStorage.setItem(this.storageKey(), JSON.stringify(visible));
      this.visibleColumnsChange.emit(visible);
    });
  }
}
