import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layouts2',
  templateUrl: './layouts2.component.html',
  styleUrls: ['./layouts2.component.css']
})
export class Layouts2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onActivate() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
