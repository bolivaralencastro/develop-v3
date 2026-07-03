import { Location } from '@angular/common';
import { Component, computed, DestroyRef, inject, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VEHICLE_INFO_CARDS, VEHICLE_TABS, VehicleDto } from '../models/vehicles.types';
import { VehiclesDetailService } from '../services/vehicles-detail.service';

@Component({
  selector: 'app-vehicle-details',
  imports: [MatIcon, MatIconButton],
  providers: [VehiclesDetailService],
  template: `
    <!-- Header -->
    <div class="flex items-center gap-3 mx-4 h-24 border-b">
      <button mat-icon-button (click)="onGoBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight leading-tight">{{ vehicle()?.brandModel || '--' }}</h1>
        <div class="flex items-center gap-3 mt-0.5">
          <div class="flex items-center gap-1 text-sm">
            <mat-icon class="header-icon text-hint">business</mat-icon>
            <span class="text-hint">Proprietário:</span>
            <span class="font-bold ml-1">{{ vehicle()?.owner || '--' }}</span>
          </div>
          <span class="text-hint text-sm">|</span>
          <div class="flex items-center gap-1 text-sm">
            <span class="text-hint">CNPJ:</span>
            <span class="ml-1">--</span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex flex-col flex-auto px-4 py-6 gap-6">
      <!-- Info cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (card of infoCards; track card.label) {
          <div class="flex items-center gap-4 border rounded-xl p-4 bg-card">
            <div class="info-card-icon">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-extrabold uppercase tracking-wider text-hint">{{ card.label }}</span>
              <span class="font-bold text-base">{{ card.value }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Tabs panel -->
      <div class="bg-card rounded-2xl border overflow-hidden">
        <!-- Tab bar -->
        <div class="flex bg-[#fcfcfd] border-b">
          @for (tab of tabs; track tab.label; let i = $index) {
            <button
              class="flex-1 p-4 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2"
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 p-6">
            @for (item of featureItems(); track item.label) {
              <div class="flex flex-col gap-1.5">
                <span class="text-hint font-extrabold select-none text-xs">{{ item.label }}</span>
                <span class="font-bold">{{ item.value || '--' }}</span>
              </div>
            }
          </div>
        }
      </div>

      <!-- Ocorrências -->
      <div>
        <div class="flex items-center gap-2 mb-4 text-hint">
          <mat-icon>warning</mat-icon>
          <span class="text-sm font-extrabold uppercase tracking-wider">
            {{ hasOccurrences() ? 'Atenção: Ocorrências Detectadas' : 'Sem ocorrências' }}
          </span>
        </div>

        @if (hasOccurrences()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (o of occurrences(); track o.title) {
              <div
                class="flex flex-col gap-3 rounded-xl border border-slate-200 p-5 bg-card"
                [class.border-t-4]="true"
                [class.border-t-amber-400]="o.severity === 'warn'"
                [class.border-t-red-500]="o.severity === 'crit'"
              >
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center"
                  [class.bg-amber-50]="o.severity === 'warn'"
                  [class.text-amber-500]="o.severity === 'warn'"
                  [class.bg-red-50]="o.severity === 'crit'"
                  [class.text-red-500]="o.severity === 'crit'"
                >
                  <mat-icon>{{ o.icon }}</mat-icon>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-extrabold">{{ o.title }}</span>
                  <span class="text-sm text-hint leading-relaxed">{{ o.subtitle }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="border border-dashed rounded-xl p-5 text-sm text-hint">
            Nenhuma ocorrência encontrada para este veículo.
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
    }

    .header-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .info-card-icon {
      @apply h-11 w-11 flex items-center justify-center rounded-lg flex-shrink-0;
      background-color: #f1f5f9;
    }
  `,
})
export class VehicleDetailsComponent {
  protected readonly vehicle: Signal<VehicleDto>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly activeTab = signal(0);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);

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
    {
      icon: 'build_circle',
      title: 'RECALL PENDENTE DE EXECUÇÃO',
      subtitle: 'O veículo possui convocações de fábrica pendentes.',
      severity: 'warn',
    },
    {
      icon: 'block',
      title: 'RESTRIÇÃO DE BENEFÍCIO DE ICMS',
      subtitle: 'Impedimento de transferência devido à isenção vigente.',
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

  constructor(
    private vehicleService: VehiclesDetailService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.vehicle = vehicleService.vehicle;
    this.isLoading = vehicleService.isLoading;
    this.registerRouteChangeListener();
  }

  private registerRouteChangeListener() {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (params) => this.handleParamChance(params) });
  }

  private handleParamChance(params: ParamMap) {
    const id = params.get('id');
    if (!id) {
      return;
    }
    this.vehicleService.loadDetails(id);
  }

  onGoBack() {
    this.location.back();
  }
}
