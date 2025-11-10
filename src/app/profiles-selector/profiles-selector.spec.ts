import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesSelector } from './profiles-selector';

describe('ProfilesSelector', () => {
  let component: ProfilesSelector;
  let fixture: ComponentFixture<ProfilesSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
