import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerDialogComponent } from './create-customer-dialog.component';

describe('CreateCustomerDialogComponent', () => {
  let component: CreateCustomerDialogComponent;
  let fixture: ComponentFixture<CreateCustomerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCustomerDialogComponent]
    });
    fixture = TestBed.createComponent(CreateCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
