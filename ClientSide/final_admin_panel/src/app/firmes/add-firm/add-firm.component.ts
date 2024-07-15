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
  fileValid: boolean = false;
  fileError: string = '';
  selectedFile: File | null = null;

  constructor(private _service: DataService) { }

  ngOnInit(): void {
    this.loadSector();
    console.log("Load Sector");
    
  }
  
  
  loadSector() {
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension !== 'png') {
        this.fileError = 'Only PNG files are allowed';
        this.fileValid = false;
        this.selectedFile = null;
      } else {
        this.fileError = '';
        this.fileValid = true;
        this.selectedFile = file;
      }
    } else {
      this.fileError = 'Please upload a file';
      this.fileValid = false;
      this.selectedFile = null;
    }
  }

  _addFirm(form: any): any {
    this.isLoad = true;
    this.errorMessage = '';
    if (!form.valid || !this.fileValid || !this.selectedFile) {
      this.isLoad = false;
      this.errorMessage = 'Oops! Please enter valid form fill and try again.';
      return false;
    }
    const formData = new FormData();
    formData.append('com_name', form.value.com_name);
    formData.append('com_ali_name', form.value.com_ali_name);
    formData.append('nace_Lev2_id', form.value.nace_Lev2_id);
    formData.append('company_URL', form.value.company_URL);
    formData.append('nace_Lev2_Id_Description', form.value.nace_Lev2_Id_Description);
    formData.append('sustainability_URL', form.value.sustainability_URL);
    formData.append('company_logo', form.value.company_logo);
    formData.append('description', form.value.description);
    formData.append('logo', this.selectedFile  as Blob);
    // Log FormData entries
    this._service.__post('/add/firm', formData)
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
