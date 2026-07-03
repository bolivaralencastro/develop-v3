import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';

@Component({
  selector: 'app-consulta-placeholder',
  imports: [MatIcon, PageTitleComponent],
  template: `
    <page-title [title]="title"></page-title>
    <div class="mx-4 mb-4 flex flex-col items-center justify-center bg-card rounded-lg shadow grow gap-4 py-16">
      <mat-icon class="w-16 h-16 text-gray-200" svgIcon="heroicons_outline:clipboard-document-check"></mat-icon>
      <p class="text-lg font-semibold text-gray-400">{{ title }}</p>
      <p class="text-sm text-gray-300">Em desenvolvimento</p>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
    }
  `,
})
export class ConsultaPlaceholderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected title = '';

  ngOnInit() {
    this.title = this.route.snapshot.data['title'] ?? 'Consultas';
  }
}
