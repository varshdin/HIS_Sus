import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-firms',
  templateUrl: './firms.component.html',
  styleUrls: ['./firms.component.css']
})
export class FirmsComponent implements OnInit {

  firmsLoader: boolean = false;
  isLoading: boolean = false;
  firms: Array<any> = [];
  notGetMoreFirm: Number = 0;
  loading: boolean = false;//Inili... loading variable
  hasMoreFirms: boolean = true;
  
  pageSize: number = 10;

  

  constructor(private _service: DataService) { }

  ngOnInit(): void {
    this.getCompanies();
    
  }
 
  async getCompanies(condition = {}, options = {}){
    this.isLoading = true;
    if (this.firms.length !== 0) {
      options = {
        skip: this.firms.length
      }
    }

    // if (this.firms.length !== 0 || this.notGetMoreFirm == 0)
    //   return false;
  
    this._service.getAllFirms().subscribe(
      (response : any) => {
        this.notGetMoreFirm = response.length;
        for (let index = 1; index < response.length; index++) {
          const firm = response[index];
          this.firms.push(firm);
          
        }
      },
      error => {
        console.log(" From Website error message ")
      }
    )
      if (this.firms.length != 0) {
        this.firmsLoader = false;
      }
      if (this.firms.length == 0) {
        this.firmsLoader = false;
      }
      
      this.isLoading = false;
  }


  getLogo(logo : string) : string {
    return (logo) ? environment.Logos_link + logo : '/assets/img/default.jpeg';
  }

  
  loadFirms() {
    console.log(this.firms)
    if(this.pageSize <= this.firms.length){
      if(this.firms.length - this.pageSize < 10){
        this.pageSize=this.pageSize+(this.firms.length - this.pageSize)
      }
      else{
        this.pageSize=this.pageSize+10;
      }
    }
  }

  loadMore(){
   

    if(!this.hasMoreFirms)
      {
        return;
      }
  
    this.loadFirms();
  }



}
