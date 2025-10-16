import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostSpendings } from './most-spendings';

describe('MostSpendings', () => {
  let component: MostSpendings;
  let fixture: ComponentFixture<MostSpendings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostSpendings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostSpendings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
