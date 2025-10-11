import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAccount } from './finance-account';

describe('FinanceAccount', () => {
  let component: FinanceAccount;
  let fixture: ComponentFixture<FinanceAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
