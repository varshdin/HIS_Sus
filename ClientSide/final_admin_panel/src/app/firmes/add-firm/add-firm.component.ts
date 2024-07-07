import { Component } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-add-firm',
  templateUrl: './add-firm.component.html',
  styleUrl: './add-firm.component.css'
})
export class AddFirmComponent {
  sectors: any[] = [];
  companyData: any = {}; // Object to hold form data

  constructor(private apiService: DataService) { }

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
