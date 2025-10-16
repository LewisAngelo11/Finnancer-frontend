import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTransactions } from './history-transactions';

describe('HistoryTransactions', () => {
  let component: HistoryTransactions;
  let fixture: ComponentFixture<HistoryTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
