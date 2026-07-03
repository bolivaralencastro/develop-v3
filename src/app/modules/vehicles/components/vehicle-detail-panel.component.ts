import { Component, computed, effect, inject, input, output, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { VehiclesDetailService } from '../services/vehicles-detail.service';
import { VEHICLE_INFO_CARDS, VEHICLE_TABS, VehicleDto } from '../models/vehicles.types';

@Component({
  selector: 'app-vehicle-detail-panel',
  imports: [MatIconButton, MatIcon],
  providers: [VehiclesDetailService],
  template: `
    @if (vehicleId()) {
      <!-- Header -->
      <div class="flex items-start justify-between px-5 pt-5 pb-4 border-b">
        <div>
          <h2 class="text-xl font-black tracking-tight">Detalhes do veículo</h2>
          <div class="flex items-center gap-1 mt-1 text-sm">
            <mat-icon class="header-icon text-hint">business</mat-icon>
            <span class="text-hint">Proprietário:</span>
            <span class="font-bold ml-1 text-sm line-clamp-1">{{ vehicle()?.owner || '--' }}</span>
          </div>
        </div>
        <div class="flex items-center -mr-2 mt-1">
          <button mat-icon-button (click)="navigateToVehicle()">
            <mat-icon>open_in_new</mat-icon>
          </button>
          <button mat-icon-button (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="grow overflow-y-auto">
        <!-- Info cards -->
        <div class="flex flex-col gap-3 px-5 py-4">
          @for (card of infoCards; track card.label) {
            <div class="flex items-center justify-between border rounded-xl p-3.5 gap-4">
              <div class="flex items-center gap-3">
                <div class="info-card-icon">
                  <mat-icon>{{ card.icon }}</mat-icon>
                </div>

                <span class="text-xs font-extrabold uppercase tracking-wider text-hint">{{ card.label }}</span>
              </div>
              <span class="font-bold text-md">{{ card.value }}</span>
            </div>
          }
        </div>

        <div class="mx-5 mb-5 border rounded-lg overflow-hidden">
          <!-- Tabs -->
          <div class="flex bg-[#fcfcfd] border-b">
            @for (tab of tabs; track tab.label; let i = $index) {
              <button
                class="flex-1 p-3 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2"
                [class.text-primary]="activeTab() === i"
                [class.border-primary]="activeTab() === i"
                [class.border-transparent]="activeTab() !== i"
                [class.text-hint]="activeTab() !== i"
                [class.opacity-40]="tab.disabled"
                [class.cursor-not-allowed]="tab.disabled ?? false"
                [disabled]="tab.disabled ?? false"
                (click)="!tab.disabled && activeTab.set(i)"
              >
                {{ tab.label }}
              </button>
            }
          </div>

          <!-- Tab content -->
          @if (activeTab() === 0) {
            <div class="flex flex-col p-5 gap-4">
              @for (item of featureItems(); track item.label) {
                <div class="flex flex-col gap-1.5">
                  <span class="text-hint font-extrabold select-none text-xs">{{ item.label }}</span>
                  <span class="font-bold text-sm">{{ item.value || '--' }}</span>
                </div>
              }
            </div>
          }
        </div>

        <!-- Ocorrências -->
        <div class="mx-5 mb-5">
          <div class="flex items-center gap-2 mb-3 text-hint">
            <mat-icon>warning</mat-icon>
            <span class="text-sm font-extrabold uppercase tracking-wider">
              {{ hasOccurrences() ? 'Atenção: Ocorrências Detectadas' : 'Sem ocorrências' }}
            </span>
          </div>

          @if (hasOccurrences()) {
            <div class="flex flex-col gap-3">
              @for (o of occurrences(); track o.title) {
                <div
                  class="flex items-start gap-3 rounded-xl border border-slate-200 p-4"
                  [class.border-t-4]="true"
                  [class.border-t-amber-400]="o.severity === 'warn'"
                  [class.border-t-red-500]="o.severity === 'crit'"
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    [class.bg-amber-50]="o.severity === 'warn'"
                    [class.text-amber-500]="o.severity === 'warn'"
                    [class.bg-red-50]="o.severity === 'crit'"
                    [class.text-red-500]="o.severity === 'crit'"
                  >
                    <mat-icon>{{ o.icon }}</mat-icon>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-extrabold">{{ o.title }}</span>
                    <span class="text-sm text-hint">{{ o.subtitle }}</span>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="border border-dashed rounded-xl p-4 text-sm text-hint">
              Nenhuma ocorrência encontrada para este veículo.
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      @apply bg-card flex flex-col h-full w-full overflow-hidden;
    }

    .header-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .info-card-icon {
      @apply h-9 w-9 flex items-center justify-center rounded-lg;

      background-color: #f1f5f9;
    }
  `,
})
export class VehicleDetailPanelComponent {
  readonly vehicleId = input<string | null>(null);
  readonly closePanel = output();

  private readonly vehicleService = inject(VehiclesDetailService);
  private readonly router = inject(Router);

  protected readonly vehicle: Signal<VehicleDto> = this.vehicleService.vehicle;
  protected readonly isLoading: Signal<boolean> = this.vehicleService.isLoading;

  protected readonly activeTab = signal(0);

  protected readonly tabs = VEHICLE_TABS;
  protected readonly infoCards = VEHICLE_INFO_CARDS;

  protected readonly occurrences = signal<
    { icon: string; title: string; subtitle: string; severity: 'warn' | 'crit' }[]
  >([
    {
      icon: 'account_balance',
      title: 'ALERTA DE GRAVAME ATIVO',
      subtitle: 'Restrição financeira pendente de baixa no sistema.',
      severity: 'warn',
    },
    { icon: 'build_circle', title: 'RECALL PENDENTE', subtitle: 'Convocações de fábrica pendentes.', severity: 'warn' },
    {
      icon: 'block',
      title: 'RESTRIÇÃO DE ICMS',
      subtitle: 'Impedimento de transferência por isenção vigente.',
      severity: 'crit',
    },
  ]);

  protected readonly hasOccurrences = computed(() => this.occurrences().length > 0);

  protected readonly featureItems = computed(() => {
    const v = this.vehicle();
    return [
      { label: 'PLACA', value: v?.numberPlate },
      { label: 'RENAVAM', value: v?.renavam },
      { label: 'CHASSI', value: v?.chassi },
      { label: 'ANO FABRICAÇÃO', value: v?.manufactureYear?.toString() },
      { label: 'ANO MODELO', value: v?.modelYear?.toString() },
      { label: 'COR', value: v?.color },
      { label: 'CIDADE', value: v?.city },
      { label: 'UF', value: v?.state },
      { label: 'COMBUSTÍVEL', value: v?.fuelType },
    ];
  });

  constructor() {
    effect(() => {
      const id = this.vehicleId();
      if (id) {
        this.vehicleService.loadDetails(id);
      }
    });
  }

  navigateToVehicle(): void {
    this.router.navigate(['/vehicles', this.vehicleId()]);
  }

  onClose(): void {
    this.closePanel.emit();
  }
}
