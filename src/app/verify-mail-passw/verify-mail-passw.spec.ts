import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMailPassw } from './verify-mail-passw';

describe('VerifyMailPassw', () => {
  let component: VerifyMailPassw;
  let fixture: ComponentFixture<VerifyMailPassw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyMailPassw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyMailPassw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
