import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesAccount } from './profiles-account';

describe('ProfilesAccount', () => {
  let component: ProfilesAccount;
  let fixture: ComponentFixture<ProfilesAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
