import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class EsgResourceService {
  private baseUrl = 'http://localhost:3333/api/esg-resource';
  constructor(private http: HttpClient) {}

  sendResourceToProcess(resourceLink : string, company: string) {
  
    const url = this.baseUrl + '/save-resources'
    
    return this.http.get(this.baseUrl, {
      params: {
        resourceLink,
        company
      }
    })
  }

  getResourcebyCompanyId(companyId:string){
    const url = this.baseUrl+ '/resource'
    return this.http.get(url, {
      params: {
        companyId
      }
    })
  }

  getResourceLinks(companyName:string,resourceUrl:string){
    const url = this.baseUrl +'/get-resource';

    return this.http.get<string[]>(url, {
      params:{
        resourceLink: resourceUrl,
        company:companyName
      }
    })
  }

  downloadSingleFile(resourceLink:string, companyName:string){
    const url = this.baseUrl +'/single';
    return this.http.get(url, {
      params:{
        resourceLink: resourceLink,
        company:companyName
      }
    })
  }
downloadMultipleFiles(resourceLinks: string[], companyName:string){
    const url = this.baseUrl +'/multiple';
    return this.http.get(url, {
      params:{
        resourceLinks: resourceLinks,
        company:companyName
      }
    })
  }

  deleteFile(id:string, s3Link:string){
    const url = this.baseUrl +'/remove-resource';

    return this.http.delete(url,{
      params:{
        id:id,
        s3Link:s3Link
      }
    })
  }

}