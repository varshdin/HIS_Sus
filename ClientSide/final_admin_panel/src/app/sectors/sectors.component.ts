import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrl: './sectors.component.css'
})
export class SectorsComponent implements OnInit {
  sectors: any[] = [];
  constructor(private apiService: DataService) { }

  ngOnInit(): void {
    this.loadSector()
  }

  loadSector() {
    this.apiService.getAllsector().subscribe(
      (data) => {
        this.sectors = data;
        console.log(this.sectors);
      },
      (error) => {
        console.error('Error fetching sectors', error);
      }
    );
  }

}
