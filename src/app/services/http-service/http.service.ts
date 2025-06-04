import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  BASE_URL: string = 'https://localhost:44365';

  getHeader() {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem('authToken') || '',
    });
    return header;
  }
  getApi(endpoint: string, headers: HttpHeaders = new HttpHeaders()) {
    return this.http.get(this.BASE_URL + endpoint, { headers });
  }

  postApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    return this.http.post(this.BASE_URL + endpoint, payload, { headers });
  }

  deleteApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    const options = {
      body: payload,
      headers: headers,
    };
    return this.http.delete(this.BASE_URL + endpoint, options);
  }

  putApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    return this.http.put(this.BASE_URL + endpoint, payload, { headers });
  }
}
