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
        this.firmDetails = response['company'];
        this.firmDetails.reports = response['reports'];
      },
      error => {
        console.log(error)
      }
    )
  }

  getLogo(logo: string): string {
    return (logo) ? environment.Logos_link + logo : '/assets/img/default.jpeg';
  }

}
