import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAccount } from './info-account';

describe('InfoAccount', () => {
  let component: InfoAccount;
  let fixture: ComponentFixture<InfoAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
