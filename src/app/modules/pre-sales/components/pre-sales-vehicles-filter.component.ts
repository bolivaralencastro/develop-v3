import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslocoModule } from '@ngneat/transloco';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS,
  PreSaleImportHistoryVehiclesFilter,
  VEHICLE_SITUATION,
} from '../models/pre-sales.types';
import { ImportHistoryVehicleStatusPipe } from '../pipes/import-history-vehicle-status.pipe';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';

type PreSaleVehicleFilterForm = {
  search: FormControl<string>;
  state: FormControl<string[]>;
  status: FormControl<PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS[]>;
  situation: FormControl<VEHICLE_SITUATION[]>;
};

@Component({
  selector: 'app-pre-sales-vehicles-filter',
  imports: [
    MatFormField,
    FormsModule,
    MatIcon,
    MatInput,
    TranslocoModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    ImportHistoryVehicleStatusPipe,
    TableColumnManagementComponent,
  ],
  styles: `
    .form {
      @apply h-full flex flex-col sm:flex-row gap-1 sm:items-end p-5;
      background-color: #f8fafc;
    }
  `,
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
        storageKey="vehicle-history-table-columns"
        [columns]="columns()"
        (visibleColumnsChange)="visibleColumnsChange.emit($event)"
      >
      </table-column-management>

      <!--Situação-->
      <!--<mat-form-field subscriptSizing="dynamic">
        <mat-label>{{ 'pre-sales.vehicle-history.situation' | transloco }}</mat-label>
        <mat-select formControlName="situation" multiple>
          <mat-option [value]="VEHICLE_SITUATION.UNBLOCKED">{{ 'pre-sales.situations.unblocked' | transloco }}
          </mat-option>
          <mat-option [value]="VEHICLE_SITUATION.ALERT">{{ 'pre-sales.situations.alert' | transloco }}</mat-option>
          <mat-option [value]="VEHICLE_SITUATION.BLOCKED">{{ 'pre-sales.situations.blocked' | transloco }}</mat-option>
        </mat-select>
      </mat-form-field>-->

      <!--Status-->
      <mat-form-field subscriptSizing="dynamic" class="min-w-40">
        <mat-select formControlName="status" multiple [placeholder]="'pre-sales.vehicle-history.status' | transloco">
          <mat-option [value]="STATUS.STARTED"
            >{{ STATUS.STARTED | importHistoryVehicleStatus | transloco }}
          </mat-option>
          <mat-option [value]="STATUS.PROCESSING"
            >{{ STATUS.PROCESSING | importHistoryVehicleStatus | transloco }}
          </mat-option>
          <mat-option [value]="STATUS.SUCCESS"
            >{{ STATUS.SUCCESS | importHistoryVehicleStatus | transloco }}
          </mat-option>
          <mat-option [value]="STATUS.ERROR">{{ STATUS.ERROR | importHistoryVehicleStatus | transloco }}</mat-option>
        </mat-select>
      </mat-form-field>

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreSalesVehiclesFilterComponent {
  STATUS = PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  VEHICLE_SITUATION = VEHICLE_SITUATION;

  columns = input<TableColumnDef[]>([]);
  filterChange = output<PreSaleImportHistoryVehiclesFilter>();
  visibleColumnsChange = output<string[]>();
  currentFilter = input<PreSaleImportHistoryVehiclesFilter>();
  protected form: FormGroup<PreSaleVehicleFilterForm>;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.buildForm();
    this.registerChangesListener();
    effect(() => {
      const currentFilter = this.currentFilter();
      if (currentFilter) {
        this.form.patchValue(currentFilter, { emitEvent: false });
      }
    });
  }

  private buildForm() {
    this.form = new FormGroup<PreSaleVehicleFilterForm>({
      search: new FormControl(),
      state: new FormControl(),
      status: new FormControl(),
      situation: new FormControl(),
    });
  }

  private registerChangesListener() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filterChange.emit(value));
  }
}
