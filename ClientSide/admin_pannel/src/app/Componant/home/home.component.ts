// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {AfterViewInit,  ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../api.service';


export interface PeriodicElement {
  company_id:string;
  company_name:string;
  company_alias:string;
  nace_lev2_id:string;
  nace_lev1_desc:string;
  company_url:string;
  sustainability_url:string;
  logo_link:string;
  company_description:string;
  }

@Component({
  selector: 'app-home',
  template: '',
})
export class HomeComponent implements OnInit{
  displayedColumns:string[] = ['company_id','company_name','company_alias','nace_lev2_id','nace_lev1_desc','company_url','sustainability_url','logo_link','company_description']
  dataSource: MatTableDataSource<PeriodicElement>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private apiservice:ApiService){
    this.dataSource = new MatTableDataSource<PeriodicElement>();
  }

  ngOnInit(): void {
    this.getAllfirms();
    throw new Error('Method not implemented.');
  }
  
  getAllfirms(): void {
    this.apiservice.getallCompanies().subscribe(
      (data: PeriodicElement[]) => {
        //console.log(data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Handle error here (e.g., show a user-friendly message)
      }
    );
  }

}
