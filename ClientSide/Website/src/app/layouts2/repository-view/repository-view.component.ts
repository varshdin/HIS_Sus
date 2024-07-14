import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { faThList, faThLarge, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-repository-view',
  templateUrl: './repository-view.component.html',
  styleUrls: ['./repository-view.component.css']
})
export class RepositoryViewComponent implements OnInit {

  companies: any = [];
  faThList = faThList;
  faThLarge = faThLarge;
  faFolder = faFolder;
  faFile = faFile;
  isLoading: boolean = true;
  firmsLoader: boolean = false; 
  notGetMoreFirm: Number = 0;
  selectedCompany: any = {
    name: String,
    description: String,
    reports: [],
    logo: "",
    sector: {},
    _id : ''
  };

  @HostListener('click', ['$event.target']) onClick() {
    this.openFolderSeeFile();
  }

  constructor(
    private _service: DataService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.directive_call();
    }, 500);
    this.getReports();
  }

  selectedFirm(company: any) {
    this.selectedCompany = company;
  }

  _getReportsName(company: string) {
    return company.substring(company.lastIndexOf('/') + 1);
  }

  directive_call() {
    var menuopener = $(this);
    // Grid or list selection
    $('#btn-grid').on('click', function () {
      $('#main-folders').removeClass('flex-column');
      $('#btn-list').removeClass('active')
      menuopener.addClass('active')
    });
    $('#btn-list').on('click', function () {
      $('#main-folders').addClass('flex-column');
      $('#btn-grid').removeClass('active')
      menuopener.addClass('active')
    });
    $('#btn-grid').on('click', function () {
      $('#main-files').removeClass('flex-column');
      $('#btn-list').removeClass('active')
      menuopener.addClass('active')
    });
    $('#btn-list').on('click', function () {
      $('#main-files').addClass('flex-column');
      $('#btn-grid').removeClass('active')
      menuopener.addClass('active')
    });
    this.openFolderSeeFile();
  }

  async getReports(condition = {}, options = {}) {
    if (this.companies.length !== 0) {
      options = {
        skip: this.companies.length
      }
    }

    // if (this.firms.length !== 0 || this.notGetMoreFirm == 0)
    //   return false;

    this._service.__post("/get/reports", { condition: condition, options: options }).subscribe(
      (response: any) => {
        console.log(response)
        this.notGetMoreFirm = response.length;
          this.companies = response;
        // for (let index = 0; index < response.length; index++) {
        //   const firm = response[index];
        //   firm.reports = (firm.data_link).split(',');
        //   this.companies.push(firm);
        // }
      },
      error => {
        console.log(error)
      }
    )
    if (this.companies.length != 0) {
      this.firmsLoader = false;
    }
    if (this.companies.length == 0) {
      this.firmsLoader = false;
    }

    this.isLoading = false;
  }

  viewMore(): void {
    this.getReports();
  }

  openFolderSeeFile(){
    // Open folder and see files
    $('button.folder-container').on('click', function () {
      $('#filesGroup').removeClass('d-none');
      $('#foldersGroup').addClass('d-none')
    });
    $('a#backToFolders').on('click', function () {
      $('#foldersGroup').removeClass('d-none');
      $('#filesGroup').addClass('d-none')
    });
  }
  openPDF(pdf: string) {
    // console.log(pdf)
    // window.open(pdf);
  }


  getLogo(logo: string): string {
    return (logo) ? environment.Logos_link + logo : '/assets/img/default.jpeg';
  }

  getPDFLink(pdf: string) {
    return environment.Data_link + pdf;
  }
}
