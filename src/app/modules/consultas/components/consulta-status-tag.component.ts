import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ConsultaVehicleStatus } from '../models/consulta.types';

const STATUS_TOOLTIP: Record<ConsultaVehicleStatus, string> = {
  LIBERADO: 'Liberado — veículo sem restrições ativas',
  BLOQUEADO: 'Bloqueado — veículo com restrições ou impedimentos',
};

@Component({
  selector: 'app-consulta-status-tag',
  imports: [NgClass, MatIcon, MatTooltip],
  template: `
    <span
      class="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-default"
      [ngClass]="{
        'bg-green-100 text-green-700': status() === 'LIBERADO',
        'bg-red-100 text-red-700': status() === 'BLOQUEADO'
      }"
      [matTooltip]="tooltip()"
      matTooltipPosition="above"
    >
      <mat-icon class="icon-size-5" [svgIcon]="status() === 'LIBERADO' ? 'lucide:check-circle' : 'lucide:x-circle'"></mat-icon>
    </span>
  `,
})
export class ConsultaStatusTagComponent {
  status = input.required<ConsultaVehicleStatus>();
  protected tooltip = () => STATUS_TOOLTIP[this.status()] ?? this.status();
}
