import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EsgResourceService } from '../services/esg-resource.service';
import { CompaniesService } from '../services/companies.service';
import { CompanyDto } from '../dtos/Company.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'beta-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
 
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  public companyLists: CompanyDto[] = []; 
  constructor
  (
    private formBuilder: FormBuilder,
    private observer: BreakpointObserver, 
    private esgService:EsgResourceService,
    private companiesService: CompaniesService,
    private router: Router
  )
  { }
  ngOnInit(): void {
   console.log("initialized")
  }
 

 
}



