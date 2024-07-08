import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrl: './sectors.component.css'
})
export class SectorsComponent implements OnInit {
  sectors: any[] = [];
  constructor(private _service: DataService) { }

  ngOnInit(): void {
    this.loadSector()
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
}
