import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyDto } from '../../dtos/Company.dto';
import { CompaniesService } from '../../services/companies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'beta-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CompanyDetailsComponent {

  // @ts-ignore
  formGroup: FormGroup 
  emptyAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder, private companiesService :CompaniesService, private router: Router ) {
    this.createForm();
  }

  ngOnInit() {}
  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': [null, Validators.required],
      'alias': [null],
      'url': [null, Validators.required],
      'category': [null, Validators.required],
    });
  }
  onSubmit(post: CompanyDto) {
    this.post = post;
    this.companiesService.createCompany(this.post).subscribe((data)=>{
      if(data){
        this.router.navigateByUrl(this.router.url.split('/')[1]);
      }
    })
  }
}