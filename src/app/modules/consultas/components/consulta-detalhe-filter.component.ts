import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TableColumnDef,
  TableColumnManagementComponent,
} from 'app/layout/common/table-column-management/table-column-management.component';
import { ConsultaDetalheFilter } from '../models/consulta.types';

export type SituacaoOption = { value: string; label: string };

@Component({
  selector: 'app-consulta-detalhe-filter',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatFormField,
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

      @if (situacaoOptions().length) {
        <mat-form-field subscriptSizing="dynamic" class="min-w-44">
          <mat-select formControlName="situacao" multiple [placeholder]="situacaoLabel()">
            @for (opt of situacaoOptions(); track opt.value) {
              <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
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
export class ConsultaDetalheFilterComponent {
  private readonly destroyRef = inject(DestroyRef);

  columns = input<TableColumnDef[]>([]);
  storageKey = input<string>('consulta-detalhe-columns');
  situacaoOptions = input<SituacaoOption[]>([]);
  situacaoLabel = input<string>('Situação');

  readonly filterChange = output<ConsultaDetalheFilter>();
  readonly visibleColumnsChange = output<string[]>();

  protected readonly form = new FormGroup({
    search: new FormControl(''),
    estado: new FormControl<string[]>([]),
    situacao: new FormControl<string[]>([]),
  });

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((v) =>
        this.filterChange.emit({
          search: v.search ?? '',
          estado: v.estado ?? [],
          situacao: v.situacao ?? [],
        }),
      );
  }
}
