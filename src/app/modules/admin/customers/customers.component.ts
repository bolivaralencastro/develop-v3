import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslocoModule } from '@ngneat/transloco';
import { CustomersService } from './customers.service';
import { Customer } from './customers.types';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageMeta } from '@core/http';
import { debounceTime } from 'rxjs';
import { UserService } from '@core/user/user.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { CustomerStatusTagComponent } from './components/customer-status-tag.component';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomersService],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: scroll;
      height: 0;
      max-width: 100%;
    }

    .filter-bar {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: 0.25rem;
      padding: 1.25rem;
      background-color: #f8fafc;
    }

    .no-data-row {
      @apply flex flex-col justify-center items-center text-xl gap-2;

      height: calc(100% - var(--mat-header-row-height));
    }
  `,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    TranslocoModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgClass,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatNoDataRow,
    MatTooltip,
    PageTitleComponent,
    DatePipe,
    CustomerStatusTagComponent,
    MatFormField,
    MatSelect,
    MatOption,
  ],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['status', 'name', 'description', 'createdAt', 'menu'];
  private readonly destroyRef = inject(DestroyRef);

  protected readonly customers: Signal<Customer[]>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly pagination: Signal<PageMeta>;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  activeFilterControl: UntypedFormControl = new UntypedFormControl('all');
  protected readonly isAdmin: Signal<boolean>;

  constructor(
    private readonly customersService: CustomersService,
    private readonly userService: UserService,
  ) {
    this.customers = this.customersService.customers;
    this.isLoading = this.customersService.isLoading;
    this.pagination = this.customersService.pagination;
    this.isAdmin = this.userService.isAdmin;
  }

  ngOnInit() {
    this.registerSearchEvents();
    this.registerActiveFilterEvents();
  }

  createCustomer(): void {
    this.customersService.openNewCustomerDialog();
  }

  deleteCustomer(customer: Customer) {
    this.customersService.openDeleteConfirmationDialog(customer.id);
  }

  updateCustomer(customer: Customer) {
    this.customersService.openCustomerEditionDialog(customer);
  }

  private registerSearchEvents() {
    this.searchInputControl.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (value) => this.customersService.filterCustomers(value) });
  }

  private registerActiveFilterEvents() {
    const activeMap: Record<string, boolean | null> = { all: null, active: true, inactive: false };
    this.activeFilterControl.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (value) => this.customersService.filterByActive(activeMap[value]) });
  }

  onPageChange(event: PageEvent) {
    this.customersService.setPage(event.pageIndex + 1, event.pageSize);
  }

  switchTenant(customer: Customer) {
    this.customersService.switchTenant(customer);
  }
}
