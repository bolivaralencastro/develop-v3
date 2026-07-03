import { computed, DestroyRef, inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { Customer } from './customers.types';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomersApi } from './customers.api';
import { MatDialog } from '@angular/material/dialog';
import { CreateCustomerDialogComponent } from './components';
import { filter, switchMap, tap } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoService } from '@ngneat/transloco';
import { BaseFilter, PageDto, PageMeta } from '@core/http';
import { TenantService } from '@core/auth/services/tenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class CustomersService {
  private readonly filter = signal<BaseFilter<Customer>>({});
  private readonly customersResource: ResourceRef<PageDto<Customer>>;
  private readonly destroyRef = inject(DestroyRef);
  readonly isLoading: Signal<boolean>;
  readonly customers: Signal<Customer[]>;
  readonly pagination: Signal<PageMeta>;

  constructor(
    private readonly customersApi: CustomersApi,
    private readonly dialog: MatDialog,
    private readonly confirmationService: FuseConfirmationService,
    private readonly translationService: TranslocoService,
    private readonly tenantService: TenantService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.customersResource = this.createCustomersResource();
    this.isLoading = computed(() => this.customersResource.isLoading());
    this.customers = computed(() => this.customersResource.value()?.data);
    this.pagination = computed(() => this.customersResource.value()?.meta);
  }

  openNewCustomerDialog() {
    this.openCustomerCreationDialog()
      .pipe(
        filter((customer) => !!customer),
        switchMap((customer) => this.createCustomer(customer)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  openCustomerEditionDialog(customer: Customer) {
    this.openCustomerCreationDialog(customer)
      .pipe(
        filter((customer) => !!customer),
        switchMap((customerChanges) => this.updateCustomer({ ...customer, ...customerChanges })),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  filterCustomers(search: string) {
    this.filter.set({ search });
  }

  filterByActive(active: boolean | null) {
    this.filter.update(({ 'filter.active': _, ...rest }) => {
      if (active === null) {
        return rest;
      }
      
      return { ...rest, 'filter.active': [active] };
    });
  }

  setPage(pageIndex: number, pageSize: number) {
    this.filter.update((currentFilter) => ({ ...currentFilter, page: pageIndex, limit: pageSize }));
  }

  openDeleteConfirmationDialog(customerId: string) {
    const dialogRef = this.confirmationService.open({
      title: this.translationService.translate('confirm-remove-customer-title'),
      message: this.translationService.translate('confirm-remove-customer-message'),
      actions: {
        confirm: {
          label: this.translationService.translate('remove'),
        },
        cancel: {
          label: this.translationService.translate('cancel'),
        },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result === 'confirmed'),
        switchMap(() => this.deleteCustomer(customerId)),
      )
      .subscribe();
  }

  switchTenant(customer: Customer) {
    this.tenantService.setTenantId(customer.id);
    this.snackbar.open(`Alterou para: ${customer.name}.`, null, {
      duration: 3500,
      panelClass: 'success-snackbar',
    });
    this.router.navigate(['/pre-sales']);
  }

  private createCustomersResource() {
    return rxResource({
      request: () => ({ filter: this.filter() }),
      loader: ({ request }) => this.customersApi.list(request.filter),
    });
  }

  private createCustomer(customer: Partial<Customer>) {
    return this.customersApi.create(customer).pipe(
      tap({
        next: (customer) =>
          this.customersResource.update((resourceValue) => {
            return { ...resourceValue, data: [customer, ...resourceValue.data] };
          }),
      }),
    );
  }

  private updateCustomer(customer: Partial<Customer>) {
    const { id, name, description, active } = customer;
    return this.customersApi.update(id, { name, description, active }).pipe(
      tap({
        next: (updatedCustomer) =>
          this.customersResource.update((resourceValue) => {
            const currentCustomers = resourceValue.data;
            const customerIndex = currentCustomers.findIndex((arrCustomer) => arrCustomer.id === customer.id);
            currentCustomers.splice(customerIndex, 1, { ...customer, ...updatedCustomer });
            return { ...resourceValue, data: currentCustomers };
          }),
      }),
    );
  }

  private deleteCustomer(customerId: string) {
    return this.customersApi.delete(customerId).pipe(
      tap({
        next: () =>
          this.customersResource.update((resourceValue) => {
            const customers = resourceValue.data.filter((customer) => customer.id !== customerId);
            return { ...resourceValue, data: customers };
          }),
      }),
    );
  }

  private openCustomerCreationDialog(customerForEdition?: Customer) {
    const dialogRef = this.dialog.open<CreateCustomerDialogComponent, any, Partial<Customer>>(CreateCustomerDialogComponent, {
      minWidth: '500px',
      data: customerForEdition,
    });

    return dialogRef.afterClosed();
  }
}
