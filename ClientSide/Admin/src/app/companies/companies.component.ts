import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CompanyDto } from '../dtos/Company.dto';
import { CompaniesService } from '../services/companies.service';

@Component({
  selector: 'beta-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompaniesComponent implements OnInit {

  // @ts-ignore
  companyLists: Observable<CompanyDto[]>; 
  selectedCompany: CompanyDto | undefined
  tableHeadText = "No Data available"
  displayedColumns: string[] = ['position','name','url','category','actions'];
  dataSource = new MatTableDataSource<CompanyDto>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  searchInput:string = "";
  // @ts-ignore
  private subscription : Subscription

  constructor(private readonly companiesService: CompaniesService, private readonly router : Router){

  }
  ngOnInit(): void {
    this.companyLists = this.companiesService.getCompanies();
    this. subscription = this.companyLists.subscribe(data => {
      if(data.length > 0) {
        this.dataSource.data = data;
        this.tableHeadText = "Company List";
      } else {
        this.tableHeadText = "No data available.";
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  createCompany() {
    this.router.navigateByUrl(this.router.url + '/new-company');
  }
  viewResources(id:string) {
    this.router.navigateByUrl(this.router.url + `/resources/${id}`);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}