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

  getReports() {
    this.isGettingReports =true

    this._service.__post("/start/collecting/reports", {}).subscribe(
      (response : any) => {
        console.log(response)
        setTimeout(() => {
          this.isGettingReports = false;
        }, 2000);
      },
      error => {
        console.log(error)
        this.isGettingReports = false
      }
    )
  }

}
