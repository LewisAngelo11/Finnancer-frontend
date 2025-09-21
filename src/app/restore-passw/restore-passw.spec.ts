import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePassw } from './restore-passw';

describe('RestorePassw', () => {
  let component: RestorePassw;
  let fixture: ComponentFixture<RestorePassw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestorePassw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestorePassw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
