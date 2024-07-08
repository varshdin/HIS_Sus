import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { environment } from '../../env/env';

@Component({
  selector: 'app-firmes',
  templateUrl: './firmes.component.html',
  styleUrls: ['./firmes.component.css']
})
export class FirmesComponent implements OnInit {

  firmsLoader: boolean = false;
  isLoading: boolean = false;
  firms: Array<any> = [];
  notGetMoreFirm: Number = 0;

  constructor(private _service: DataService) { }

  ngOnInit(): void {
    this.getCompanies();
    this.getNewCompanies();
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
    this._service.__post("/get/firms", { condition: condition, options: options}).subscribe(
      (response : any) => {
        this.notGetMoreFirm = response.length;
        for (let index = 0; index < response.length; index++) {
          const firm = response[index];
          this.firms.push(firm);
        }
      },
      error => {
        console.log(error)
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
    return (window.location.hostname == 'localhost') ? (environment.localUrl + logo) : (environment.liveUrl + logo) ;
  }

  viewMore(): void {
    this.getCompanies();
  }

  getNewCompanies() {
    // this._service.getNewCompanies().subscribe((com) => {
    //   console.log(com);
    // } );
  }
}
