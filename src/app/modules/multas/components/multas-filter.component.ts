import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MultaFilter } from '../models/multa.types';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';

@Component({
  selector: 'app-multas-filter',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    TableColumnManagementComponent,
  ],
  template: `
    <form [formGroup]="form" class="form">
      <div class="h-12 w-full flex items-center gap-3">
        <mat-icon class="icon-size-5 mt-0.5" svgIcon="heroicons_solid:magnifying-glass"></mat-icon>
        <input
          class="w-full"
          formControlName="search"
          matInput
          autocomplete="off"
          placeholder="Buscar por placa, chassi, renavam ou n° da multa..."
        />
      </div>

      <table-column-management
        class="self-center"
        [storageKey]="storageKey()"
        [columns]="columns()"
        (visibleColumnsChange)="visibleColumnsChange.emit($event)"
      />

      <mat-form-field subscriptSizing="dynamic" class="min-w-40">
        <mat-select formControlName="estado" multiple placeholder="Estado">
          <mat-option value="MG">Minas Gerais</mat-option>
          <mat-option value="PR">Paraná</mat-option>
          <mat-option value="RJ">Rio de Janeiro</mat-option>
          <mat-option value="RS">Rio Grande do Sul</mat-option>
          <mat-option value="SP">São Paulo</mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styles: `
    .form {
      @apply h-full flex flex-col sm:flex-row gap-1 sm:items-end p-5;
      background-color: #f8fafc;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultasFilterComponent {
  private readonly destroyRef = inject(DestroyRef);

  columns = input<TableColumnDef[]>([]);
  storageKey = input<string>('multas-table-columns');
  readonly filterChange = output<MultaFilter>();
  readonly visibleColumnsChange = output<string[]>();

  protected readonly form = new FormGroup({
    search: new FormControl<string>(null),
    estado: new FormControl<string[]>(null),
  });

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filterChange.emit(value));
  }
}
