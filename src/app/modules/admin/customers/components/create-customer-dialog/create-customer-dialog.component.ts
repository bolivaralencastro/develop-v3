import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Customer } from '../../customers.types';

@Component({
  selector: 'app-create-customer-dialog',
  templateUrl: './create-customer-dialog.component.html',
  styleUrls: ['./create-customer-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
})
export class CreateCustomerDialogComponent {
  form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    active: [true],
  });

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<CreateCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) customer: Customer,
  ) {
    if (customer) {
      this.form.patchValue(customer);
    }
  }

  onSubmit() {
    this._dialogRef.close(this.form.value);
  }
}
