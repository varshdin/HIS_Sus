import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('stickyMenu') menuElement: ElementRef;
  sticky: boolean = false;
  elementPosition: any;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement?.nativeElement?.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll > this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  scrollToElement(elementId: string): void {
    setTimeout(() => {
      const element: any = document.getElementById(elementId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  }

}
