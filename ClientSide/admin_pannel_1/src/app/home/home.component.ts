import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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
