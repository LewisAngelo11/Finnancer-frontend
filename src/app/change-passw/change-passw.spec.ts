import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassw } from './change-passw';

describe('ChangePassw', () => {
  let component: ChangePassw;
  let fixture: ComponentFixture<ChangePassw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePassw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
