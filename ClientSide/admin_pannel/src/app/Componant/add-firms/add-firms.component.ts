// add-firms.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-firms',
  templateUrl: './add-firms.component.html',
  styleUrls: ['./add-firms.component.css'],
})
export class AddFirmsComponent implements OnInit {
  sectors: any[] = [];
  companyData: any = {}; // Object to hold form data

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSector();
    console.log("Load Sector");
    
  }
  
  
  submitForm(companyData: any) {
    this.apiService.postCompany(companyData).subscribe(
      response => {
        console.log('Company added successfully:', response);
        alert('Company added successfully!');
        // Optionally reset form fields or perform other actions
      },
      error => {
        console.error('Error adding company:', error);
        alert('Failed to add company. Please try again.');
      }
    );
  }

  loadSector() {
    this.apiService.getAllsector().subscribe(
      (data) => {
        this.sectors = data;
      },
      (error) => {
        console.error('Error fetching sectors', error);
      }
    );
  }

  onSubmit() {
    this.submitForm(this.companyData);
    console.log('New Firm Added');
  }
}
