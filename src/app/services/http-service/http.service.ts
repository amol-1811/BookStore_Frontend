import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  BASE_URL: string = 'https://localhost:44365';

  getHeader(){
    const token = localStorage.getItem('authToken') || '';
    const header= new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return header;
  }

  getApi(endpoint: string, headers: HttpHeaders =new HttpHeaders()){

    return this.http.get(this.BASE_URL + endpoint, {headers});

  }

  postApi(endpoint: string, payload: any, headers: HttpHeaders =new HttpHeaders()){

    return this.http.post(this.BASE_URL + endpoint, payload, {headers});

  }

  putApi(endpoint: string, payload: any, headers: HttpHeaders =new HttpHeaders(), params?: HttpParams): Observable<any>{
    return this.http.put(this.BASE_URL + endpoint, payload, {headers, params});
  }

  put(endpoint: string, payload: string | null): Observable<any> {
    return this.http.put(this.BASE_URL + endpoint, payload);
  }

  deleteApi(endpoint: string, headers: HttpHeaders = new HttpHeaders()){
    return this.http.delete(this.BASE_URL + endpoint, {headers});
  }
}