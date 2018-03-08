import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  navLinks = [
    { name: 'Demo', route: 'demo', icon: 'adjust', desc: '' },  
  ];

  // isFixed: boolean = true;
  // @ViewChild('drawer') drawer: any;

  // constructor() { }

  // toggleDrawer() {
  //   this.drawer.open();
  // }
}