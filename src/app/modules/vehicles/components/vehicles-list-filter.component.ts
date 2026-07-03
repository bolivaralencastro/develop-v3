import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehiclesFilter } from '../models/vehicles.types';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';

type VehicleFilterForm = {
  search: FormControl<string>;
  state: FormControl<string[]>;
};

@Component({
  selector: 'app-vehicles-list-filter',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    TranslocoModule,
    TableColumnManagementComponent,
  ],
  template: `
    <form [formGroup]="form" class="form">
      <!--Search-->
      <div class="h-12 w-full flex items-center gap-3">
        <mat-icon class="icon-size-5 mt-0.5" [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
        <input
          class="w-full"
          formControlName="search"
          matInput
          [autocomplete]="'off'"
          [placeholder]="'pre-sales.search' | transloco"
        />
      </div>

      <table-column-management
        class="self-center"
        storageKey="vehicles-table-columns"
        [columns]="columns()"
        (visibleColumnsChange)="visibleColumnsChange.emit($event)"
      >
      </table-column-management>

      <!--Estado-->
      <mat-form-field subscriptSizing="dynamic" class="min-w-40">
        <mat-select formControlName="state" multiple [placeholder]="'pre-sales.vehicle-history.state' | transloco">
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
export class VehiclesListFilterComponent {
  protected form: FormGroup<VehicleFilterForm>;
  private readonly destroyRef = inject(DestroyRef);

  columns = input<TableColumnDef[]>([]);
  readonly filterChange = output<VehiclesFilter>();
  readonly visibleColumnsChange = output<string[]>();

  constructor() {
    this.buildForm();
    this.registerChangesListener();
  }

  private buildForm() {
    this.form = new FormGroup<VehicleFilterForm>({
      search: new FormControl(),
      state: new FormControl(),
    });
  }

  private registerChangesListener() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filterChange.emit(value));
  }
}
