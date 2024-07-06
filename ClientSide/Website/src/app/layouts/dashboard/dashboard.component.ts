import { Component, OnInit } from '@angular/core';
import { faIndustry, faCloud, faWandMagicSparkles, faFileLines } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faIndustry = faIndustry;
  dataLinks : any = [
    {
      link: "/ind_analysis",
      name: "Industry Indicators Analysis",
      description: "",
      icon: faIndustry,
    },
    {
      link: "/env_analysis",
      name: "Firm Environmental Analysis",
      description: "",
      icon: faCloud,
    },
    {
      link: "/social_analysis",
      name: "Firm Social Analysis",
      description: "",
      icon: faWandMagicSparkles,
    },
    {
      link: "/textual_analysis",
      name: "Firm Textual Analysis",
      description: "",
      icon: faFileLines,
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
