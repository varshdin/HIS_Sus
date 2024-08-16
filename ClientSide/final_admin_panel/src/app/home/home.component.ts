import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private _service: DataService ) {}

  isGettingReports: boolean = false;
  isSavingReports: boolean = false;
  isUpadteDownload: boolean = false;

  getReports() {
    this.isGettingReports =true

    this._service.__post("/start/process/automatic/reports/downloading", {}).subscribe(
      (response : any) => {
        console.log(response)
        this.isGettingReports = false;
      },
      error => {
        console.log(error)
        this.isGettingReports = false
      }
    )
  }
  saveReports() {
    this.isSavingReports =true

    this._service.__post("/save/reports", {}).subscribe(
      (response : any) => {
        console.log(response)
        this.isSavingReports = false;
      },
      error => {
        console.log(error)
        this.isSavingReports = false
      }
    )
  }
  updateDownloadTable(){
    this.isUpadteDownload=true

    this._service.__post("/Update/Download/Table", {}).subscribe(
      (response : any) => {
        console.log(response)
        this.isUpadteDownload= false;
      },
      error => {
        console.log(error)
        this.isUpadteDownload= false
      }
    )
  }
}
