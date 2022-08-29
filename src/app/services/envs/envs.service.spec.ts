import { TestBed } from '@angular/core/testing';

import { EnvsService } from './envs.service';

describe('EnvsService', () => {
  let service: EnvsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
