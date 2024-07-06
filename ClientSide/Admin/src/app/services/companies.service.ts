import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CompanyDto } from '../dtos/Company.dto';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = 'http://localhost:3333/api/companies';
  constructor(private http: HttpClient) {}

  getCompanies() {
  
    const url = this.baseUrl +'/company-lists'
    return this.http.get<CompanyDto[]>(url)
  }

  getCompanyById(id:string){

    const url = this.baseUrl+ '/company'

    return this.http.get<CompanyDto>(url,{
      params: {
        id:id
      }
    })
  }
  
  createCompany(company: CompanyDto){
    console.log(company)
    const url = this.baseUrl+ '/create-company'
    return this.http.post<CompanyDto>(url,company)
  }

}