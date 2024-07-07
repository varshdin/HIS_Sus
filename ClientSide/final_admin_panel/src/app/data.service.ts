import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Replace with your Node.js API URL

  constructor(private http: HttpClient) { }
// Get all sector for dynamic drop down
  getAllsector(): Observable<any[]> {
    console.log("Call API Service");
    return this.http.get<any[]>(`${this.apiUrl}/sector`).pipe(
      catchError(this.handleError)
    );
  }

  //get all companies for grid
  getallCompanies (): Observable <any[]>
  {
    console.log("Call API Service for all comopany get");
    return this.http.get<any[]>(`${this.apiUrl}/view/companies`).pipe(
      catchError(this.handleError)
    );
  }

  //Insert Compnyies
  postCompany(companyData: any): Observable<any> {
    console.log('Call API Service for posting company data');
    return this.http.post<any>(`${this.apiUrl}/add/companies`, companyData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Server error:', error);
    return throwError('Something went wrong with the server; please try again later.');
  }
}
