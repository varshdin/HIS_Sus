import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyDto } from '../../dtos/Company.dto';
import { EsgResourceDto } from '../../dtos/EsgResource.dto';
import { CompaniesService } from '../../services/companies.service';
import { EsgResourceService } from '../../services/esg-resource.service';
@Component({
  selector: 'beta-company-resources',
  templateUrl: './company-resources.component.html',
  styleUrls: ['./company-resources.component.scss'],
})
export class CompanyResourcesComponent implements OnInit {
  // @ts-ignore
  resources: EsgResourceDto[]= [];
  dataSource = new MatTableDataSource<EsgResourceDto>();
  // @ts-ignore
  extractedLinks: Observable<any>

  private companyId = '';
  urlform: FormGroup;
  inputUrl: FormControl;
  // @ts-ignore
  
  companyName = '';
  // @ts-ignore
  public company: CompanyDto;
  // @ts-ignore
  resourceColumns: string[] = ['filename','url' ,'filelocation', 'extension', 'year','actions'];
  displayedColumns: string[] = ['Links', 'Actions'];
  constructor(
    private readonly router: Router,
    private readonly companiesService: CompaniesService,
    private readonly esgResourceService: EsgResourceService
  ) {
    this.companyId = String(router.url.split('/').pop());
    this.inputUrl = new FormControl('', [Validators.required, this.urlValidator.bind(this)]);
    this.urlform = new FormGroup({
      inputUrl: this.inputUrl
    });
    
  }
  ngOnInit(): void {

    this.companiesService.getCompanyById(this.companyId).subscribe((data) => {
      this.company = data;
      this.companyName = this.company.name;
    });

     this.reset()  

  }

  getUrlLists(form: FormGroup) {

    if (form.valid) {
      const url = form.value.inputUrl
      this.extractedLinks = this.esgResourceService.getResourceLinks(this.companyName, url);
  
    } else {
      console.log('not defined');
    }
  }

  downloadSingleFile(resourceLink: string, index: number) {
    this.esgResourceService
      .downloadSingleFile(resourceLink, this.companyName)
      .subscribe((data) => {
        console.log( data +":downloaded")
        this.reset()
      });
  }

  reset(){
      this.esgResourceService
      .getResourcebyCompanyId(this.companyId).subscribe((data:EsgResourceDto[] |any)=>{
        this.resources = data;
        this.dataSource = new MatTableDataSource<EsgResourceDto>(this.resources);
        this.dataSource.data = this.resources;
      });
  }

  deleteData(element:any){
    this.esgResourceService.deleteFile(element.id,element.filelocation).subscribe((x)=>{
      this.reset()
    })
  }

  urlValidator(control: FormControl) {
    const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return URL_REGEX.test(control.value) ? null : { invalidUrl: true };
  }
  async downloadAll(){
    let links: string[] = []
    try {
      links = await this.extractedLinks.toPromise();    
    } catch (error) {
      console.error(error);
    }
    this.esgResourceService.downloadMultipleFiles(links,this.companyName).subscribe((data)=>{
    this.reset()
   })

  }
}