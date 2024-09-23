import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  sectors: any[] = [];
  firms: Array<any> = [];

  constructor(private _service: DataService ) {}

  isGettingReports: boolean = false;
  isSavingReports: boolean = false;
  isUpadteDownload: boolean = false;
  successMessageForRepDown: boolean = false;
  saveReportsSuccess: boolean = false;

  ngOnInit(): void {
    this.loadSector();
    this.getCompanies();
  }

  async loadSector(condition = {}, options = {}){
    if (this.sectors.length !== 0) {
      options = {
        skip: this.sectors.length
      }
    }

    this._service.__post("/get/sectors", { condition: condition, options: options}).subscribe(
      (response : any) => {
        for (let index = 0; index < response.length; index++) {
          const firm = response[index];
          this.sectors.push(firm);
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  async getCompanies(condition = {}, options = {}){
    this._service.__post("/get/firms", { condition: condition, options: options}).subscribe(
      (response : any) => {
        for (let index = 0; index < response.length; index++) {
          const firm = response[index];
          this.firms.push(firm);
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getReports() {
    this.isGettingReports =true

    this._service.__post("/start/process/automatic/reports/downloading", {}).subscribe(
      (response : any) => {
        console.log(response)
        this.isGettingReports = false;
        this.successMessageForRepDown = true;
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
        this.saveReportsSuccess = true;
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
