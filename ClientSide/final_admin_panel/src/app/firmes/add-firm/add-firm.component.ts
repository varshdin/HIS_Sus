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
  isLoad: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private _service: DataService) { }

  ngOnInit(): void {
    this.loadSector();
    console.log("Load Sector");
    
  }
  
  
  submitForm(companyData: any) {
    // this.apiService.postCompany(companyData).subscribe(
    //   response => {
    //     console.log('Company added successfully:', response);
    //     alert('Company added successfully!');
    //     // Optionally reset form fields or perform other actions
    //   },
    //   error => {
    //     console.error('Error adding company:', error);
    //     alert('Failed to add company. Please try again.');
    //   }
    // );
  }

  loadSector() {
    // this.apiService.getAllsector().subscribe(
    //   (data) => {
    //     this.sectors = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching sectors', error);
    //   }
    // );

    this._service.__post("/get/sectors", { condition: {}, options: {}}).subscribe(
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

  onSubmit() {
    this.submitForm(this.companyData);
    console.log('New Firm Added');
  }

  _addFirm(form: any): any {
    this.isLoad = true;
    this.errorMessage = '';
    if (!form.valid) {
      this.isLoad = false;
      this.errorMessage = 'Oops! Please enter valid form fill and try again.';
      return false;
    }
    this._service.__post('/add/firm', form.value)
      .subscribe((response) => {
        this.successMessage = response;
        form.reset()
        this.isLoad = false;
      }, error => {
        this.errorMessage = error;
        this.isLoad = false;
        console.log(error)
      })
  }

  _reset(addFirm: any): void {
    addFirm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
