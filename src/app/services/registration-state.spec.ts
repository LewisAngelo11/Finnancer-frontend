import { TestBed } from '@angular/core/testing';

import { RegistrationState } from './registration-state';

describe('RegistrationState', () => {
  let service: RegistrationState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
