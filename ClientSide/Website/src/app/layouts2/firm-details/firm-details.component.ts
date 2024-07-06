import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-firm-details',
  templateUrl: './firm-details.component.html',
  styleUrls: ['./firm-details.component.css']
})
export class FirmDetailsComponent implements OnInit {

  firmDetails: any = {
    reports: [],
    wordcloud: []
  }; 
  constructor(
    private activeRoute: ActivatedRoute,
    private _service: DataService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.getCompanyDetails({ _id : params['_id'] })
    })
  }


  async getCompanyDetails(condition = {}, options = {}) {

    this._service.__post("/get/firm/details", { condition, options: options }).subscribe(
      (response: any) => {
        this.firmDetails = response[0];
        this.firmDetails.reports = (response[0].data_link).split(',');
      },
      error => {
        console.log(error)
      }
    )
  }

  _getreportsName(company: string) {
    return company.substring(company.lastIndexOf('/') + 1);
  }

  getCloudName(imgUrl: string) {
    var name = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
    return name.split('.')[0].split('-')[1];
  }


  getLogo(logo: string): string {
    return (logo) ? environment.Logos_link + logo : '/assets/img/default.jpeg';
  }

  getPDFLink(pdf: string) {
    return environment.Data_link + pdf;
  }

  openPDF(pdf : string) {
    // window.open(environment.Data_link + pdf, '_blank');
  }

}
