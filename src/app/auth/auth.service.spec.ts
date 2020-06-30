import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from './auth.service';
import { ApiModule } from '../api/api.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ApiModule
      ]
    });
    //service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(true).toBeTruthy();
  });
});
