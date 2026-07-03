import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConsultaFilter, ConsultaVehicleStatus } from '../models/consulta.types';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';

type ConsultaFilterForm = {
  search: FormControl<string>;
  estado: FormControl<string[]>;
  status: FormControl<ConsultaVehicleStatus[]>;
};

@Component({
  selector: 'app-consulta-filter',
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
          placeholder="Buscar por placa, chassi ou renavam..."
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

      <mat-form-field subscriptSizing="dynamic" class="min-w-40">
        <mat-select formControlName="status" multiple placeholder="Status">
          <mat-option value="LIBERADO"><mat-icon class="icon-size-4 text-green-600" svgIcon="lucide:check-circle"></mat-icon> Liberado</mat-option>
          <mat-option value="BLOQUEADO"><mat-icon class="icon-size-4 text-red-600" svgIcon="lucide:x-circle"></mat-icon> Bloqueado</mat-option>
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
export class ConsultaFilterComponent {
  private readonly destroyRef = inject(DestroyRef);

  columns = input<TableColumnDef[]>([]);
  storageKey = input<string>('consulta-table-columns');
  readonly filterChange = output<ConsultaFilter>();
  readonly visibleColumnsChange = output<string[]>();

  protected readonly form = new FormGroup<ConsultaFilterForm>({
    search: new FormControl(),
    estado: new FormControl(),
    status: new FormControl(),
  });

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filterChange.emit(value));
  }
}
