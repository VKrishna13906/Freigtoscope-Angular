import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const headers = { headers: new HttpHeaders({ 'content-type': 'application/json' }) }

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {
  constructor(private http: HttpClient) { }

  FetchDetails(flag: string, api: any): Observable<any[]> {
    let url = `${environment.ServerUrl}/${api}?Flag=${flag}`;
    return this.http.get<any>(url, headers).pipe();
  }
  StoreSelection(databody: any, api: any): Observable<any[]> {
    let url = `${environment.ServerUrl}${api}`;
    return this.http.post<any>(url, databody, headers).pipe();
  }

}
