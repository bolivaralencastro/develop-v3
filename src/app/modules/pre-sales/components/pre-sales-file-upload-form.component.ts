import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

const ALLOWED_FILE_TYPES: string[] = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const ALLOWED_FILE_EXTENSIONS = ['.xlsx'];

@Component({
  selector: 'app-pre-sales-file-upload-form',
  imports: [NgClass, MatIconButton, MatIcon, TranslocoModule],
  template: `
    <div
      class="border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 rounded-lg flex flex-col gap-2 select-none"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      [ngClass]="{ 'bg-primary-50 text-primary border-primary': applyStyles() }"
    >
      @if (!selectedFile()) {
        <p class="max-w-prose text-lg font-medium">{{ 'pre-sales.upload-form.select-file-label' | transloco }}</p>
        <p class="text-sm text-hint" [ngClass]="{ 'text-primary': applyStyles() }">
          {{ 'pre-sales.upload-form.supported-formats' | transloco }} {{ acceptedFileExtensionsLabel }}
        </p>
      } @else {
        <div class="flex gap-2 mx-auto items-center">
          <p class="max-w-prose text-lg font-medium">{{ selectedFile().name }}</p>
          <button mat-icon-button color="primary" (click)="removeCurrentFile($event)" [disabled]="uploading()">
            <mat-icon color="primary">close</mat-icon>
          </button>
        </div>
      }
      <input #fileInput type="file" [accept]="acceptedFileExtensions" (change)="onFileSelect($event)" hidden />
    </div>
  `,
})
export class PreSalesFileUploadFormComponent {
  protected readonly acceptedFileExtensions = ALLOWED_FILE_TYPES.join(', ');
  protected readonly acceptedFileExtensionsLabel = ALLOWED_FILE_EXTENSIONS.join(', ');
  protected readonly draggingOver = signal(false);
  protected readonly applyStyles = computed(() => !!this.selectedFile() || this.draggingOver());
  protected readonly uploading = input(false);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  public readonly selectedFile = signal<File | undefined>(undefined);

  removeCurrentFile(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.fileInput().nativeElement.value = '';
    this.selectedFile.set(undefined);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.set(true);
  }

  protected onDragLeave() {
    this.draggingOver.set(false);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.set(false);

    if (event.dataTransfer?.files?.length) {
      this.addFiles(event.dataTransfer.files.item(0));
    }
  }

  protected onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(input.files.item(0));
    }
  }

  private addFiles(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return;
    }
    this.selectedFile.set(file);
  }
}
