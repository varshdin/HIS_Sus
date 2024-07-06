import { Component } from '@angular/core';
import{Title,Meta} from '@angular/platform-browser';
import { DataService } from './data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sustainability-monitor';

  constructor(
    private titleService:Title,
    private metaTagService:Meta,
    private dataservice:DataService
  ){}

  ngOnInit() {  
    this.titleService.setTitle("Sustainability Monitor - ESG Analysis of Firms | ESG Scores & Ratings");
    this.metaTagService.addTags([ 
      { name: 'keywords', content: 'Sustainability report, ESG, Analysis, Firms, ESG analysis, ESG scores,For corporate social responsibility, ESG ratings' },
      { name: 'description', content: 'Stay ahead of the curve with our ESG analysis of firms. Discover ESG scores and ratings to conclude  sustainable monitoring of the firms.' },
      { name: 'robots', content: 'index, follow' },  
      { name: 'author', content: 'Sustainability Monitor' },  
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'charset', content: 'UTF-8' }  
    ]);  
  }
}
