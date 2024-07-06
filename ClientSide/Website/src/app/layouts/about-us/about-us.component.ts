import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      }
    },
    nav: false
  }
  sceneMediaCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
  teamLoader: boolean = false;
  isLoading: boolean = false;
  teams: Array<any> = [];
  sceneMedias: Array<any> = [
    "assets/img/scenes/10.jpeg",
    "assets/img/scenes/0.jpg",
    "assets/img/scenes/9.jpeg",
    "assets/img/scenes/11.jpeg",

    "assets/img/scenes/00.jpg",
    "assets/img/scenes/1.png",
    "assets/img/scenes/2.jpg",
    "assets/img/scenes/3.jpg",
    "assets/img/scenes/4.jpg",
    "assets/img/scenes/5.jpg",
    "assets/img/scenes/6.jpg",
    "assets/img/scenes/7.jpg",
    "assets/img/scenes/8.jpg",
    "assets/img/scenes/12.jpeg",
  ];

  constructor(
    private _service: DataService
  ) { }

  ngOnInit(): void {
    this.getTeams();
  }

  async getTeams(condition = {}, options = {}) {
    this.isLoading = true;
    this._service.__post("/get/members", { condition: condition, options: options }).subscribe(
      response => {
        this.teams = response;
      },
      error => {
        console.log(error)
      }
    )
    if (this.teams.length != 0) {
      this.teamLoader = false;
    }
    if (this.teams.length == 0) {
      this.teamLoader = false;
    }

    this.isLoading = false;
  }

  getProfile(img: string): string {
    return (window.location.hostname == 'localhost') ? (environment.localUrl + img) : (environment.localUrl + img);
  }
}
