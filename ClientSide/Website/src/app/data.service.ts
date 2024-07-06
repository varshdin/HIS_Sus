import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Company {
  firm: String,
  stock_isin: String,
  sector: String,
  group: String,
  reports_page_link: String,
  description: String,
  web_link: String,
  dow_reports_link: Array<any>,
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  firms: Array<any> = [];
  constructor(private _http: HttpClient) {}


  apiUrl: string = (window.location.hostname == 'localhost' ? environment.localUrl : environment.liveUrl);

  _response(response: any) {

    if (response.code !== 200) {
      throw new Error(response.data)
    }

    return response.data

  }

  _hendleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      errorMessage = error.message || 'Oops! Something went wrong, Please try again.';
    }
    return errorMessage;
  }

  __post(url: string, data: any) {
    console.log(`${this.apiUrl}${url}`,data,this._getHeaders())

    return this._http.post(`${this.apiUrl}${url}`, data, { headers: this._getHeaders() })
      .pipe(
        map((response: any) => {
          return this._response(response)
        }),
        catchError((error: any) => {
          return throwError(this._hendleError(error))
        })
      )
  }

  _getHeaders() {
    var token = '';
    return new HttpHeaders({
      'Authorization': (token ? token : 'unAuth')
    });
  }

  // getAllFirms(pageNumber: number = 1, pageSize: number = 10, wantsNew = false): Observable<any>{
  //     if(this.firms.length !== 0 && !wantsNew) {
  //       return of(this.firms);
  //     }
  //     return this._http.post(`${this.apiUrl}${"/get/firms"}`, {}, { headers: this._getHeaders() })
  //     .pipe(
  //       map((response: any) => {
  //       this.firms = this._response(response);
  //         return this.firms;
  //       }),
  //       catchError((error: any) => {
  //         return throwError(this._hendleError(error))
  //       })
  //     )
  // }

  getAllFirms(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    const requestBody = {
      options: {
        limit: pageSize,
        skip: (pageNumber - 1) * pageSize // Calculate the skip value based on page number and page size
      }
    };
  
    return this._http.post(`${this.apiUrl}/get/firms`, requestBody, { headers: this._getHeaders() })
      .pipe(
        map((response: any) => {
          this.firms = this._response(response);
          return this.firms;
        }),
        catchError((error: any) => {
          return throwError(this._hendleError(error));
        })
      );
  }
  
}
