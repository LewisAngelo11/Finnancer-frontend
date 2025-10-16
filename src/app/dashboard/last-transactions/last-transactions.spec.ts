import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTransactions } from './last-transactions';

describe('LastTransactions', () => {
  let component: LastTransactions;
  let fixture: ComponentFixture<LastTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
