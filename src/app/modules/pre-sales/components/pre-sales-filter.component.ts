import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { PRE_SALE_QUERY_CATEGORY, PRE_SALE_QUERY_TYPE, PreSalesFilter } from '../models/pre-sales.types';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { MatOption, MatSelect } from '@angular/material/select';
import { QueryCategoryPipe } from '../pipes/query-category.pipe';
import { QueryTypePipe } from '../pipes/query-type.pipe';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';

type PreSaleFilterForm = {
  search: FormControl<string>;
  queryCategory: FormControl<PRE_SALE_QUERY_CATEGORY[]>;
  queryType: FormControl<PRE_SALE_QUERY_TYPE[]>;
};

@Component({
  selector: 'app-pre-sales-filter',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    TranslocoModule,
    MatSelect,
    MatOption,
    QueryCategoryPipe,
    QueryTypePipe,
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
        [storageKey]="storageKey()"
        [columns]="columns()"
        (visibleColumnsChange)="visibleColumnsChange.emit($event)"
      >
      </table-column-management>

      <!--Type-->
      <mat-form-field subscriptSizing="dynamic" class="min-w-36">
        <mat-select formControlName="queryType" multiple [placeholder]="'pre-sales.filter.type' | transloco">
          <mat-option [value]="TYPES.PRE_SALES">{{ TYPES.PRE_SALES | queryType | transloco }} </mat-option>
          <mat-option [value]="TYPES.QUARTERLY">{{ TYPES.QUARTERLY | queryType | transloco }} </mat-option>
          <mat-option [value]="TYPES.SPECIAL">{{ TYPES.SPECIAL | queryType | transloco }} </mat-option>
        </mat-select>
      </mat-form-field>

      <!--Category-->
      <mat-form-field subscriptSizing="dynamic" class="min-w-32">
        <mat-select formControlName="queryCategory" multiple [placeholder]="'pre-sales.filter.category' | transloco">
          <mat-option [value]="CATEGORIES.FLEET">{{ CATEGORIES.FLEET | queryCategory | transloco }} </mat-option>
          <mat-option [value]="CATEGORIES.RAC">{{ CATEGORIES.RAC | queryCategory | transloco }} </mat-option>
          <mat-option [value]="CATEGORIES.FREE">{{ CATEGORIES.FREE | queryCategory | transloco }} </mat-option>
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
export class PreSalesFilterComponent {
  CATEGORIES = PRE_SALE_QUERY_CATEGORY;
  TYPES = PRE_SALE_QUERY_TYPE;

  columns = input<TableColumnDef[]>([]);
  storageKey = input.required<string>();
  lockedQueryType = input<PRE_SALE_QUERY_TYPE | null>(null);
  filterChange = output<PreSalesFilter>();
  visibleColumnsChange = output<string[]>();

  protected form: FormGroup<PreSaleFilterForm>;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.buildForm();
    effect(() => this.applyLockedType());
    this.registerChangesListener();
  }

  private buildForm() {
    this.form = new FormGroup<PreSaleFilterForm>({
      search: new FormControl(),
      queryCategory: new FormControl(),
      queryType: new FormControl(),
    });
  }

  private registerChangesListener() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filterChange.emit(value));
  }

  private applyLockedType() {
    const lockedType = this.lockedQueryType();

    if (!lockedType) {
      return;
    }

    this.form.controls.queryType.setValue([lockedType], { emitEvent: false });
    this.form.controls.queryType.disable({ emitEvent: false });
  }
}
