import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpService) { }

  signUp(payload: any) {
    return this.http.postApi('/api/user', payload);
  }

  login(payload: any) {
    return this.http.postApi('/api/user/login', payload);
  }
}
