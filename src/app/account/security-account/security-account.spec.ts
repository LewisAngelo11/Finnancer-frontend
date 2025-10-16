import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAccount } from './security-account';

describe('SecurityAccount', () => {
  let component: SecurityAccount;
  let fixture: ComponentFixture<SecurityAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
