import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { SharedData } from './shared/shared-data'

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  template: `

  <div *ngIf="authState < 1" style='background-color: #455a64;width: 100%;height: auto;bottom: 0px;top: 0px;left: 0;position: absolute;'>    
  <div style='position: absolute;width: 100%;top: 40%;'>    
  <div style="background: radial-gradient(circle closest-side,#FFF 0%,#FFF 70%,#ffc107 70%,#ffc107 98%,rgba(0,0,0,0) 100%);">  
      <svg  style="margin-left:35%; margin-bottom: 1%; width:30%;height:30%;"
       viewBox="0 0 310.000000 310.000000"
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0.000000,310.000000) scale(0.100000,-0.100000)"
      fill="#000000" stroke="none">
      <path d="M1409 2968 c-12 -13 -310 -360 -662 -772 -353 -412 -650 -751 -660
      -754 -17 -4 -19 -11 -13 -66 54 -482 348 -900 779 -1107 l89 -42 79 12 c43 7
      104 21 136 32 31 10 58 18 59 16 2 -2 -17 -27 -43 -56 -26 -30 -42 -56 -37
      -61 12 -12 175 -40 232 -40 37 0 160 46 606 226 309 125 568 229 576 232 11 4
      10 -1 -4 -16 -11 -12 -17 -22 -14 -22 7 0 447 179 469 191 16 8 19 22 18 92 0
      78 -4 89 -63 227 -34 80 -68 144 -74 143 -17 -4 -26 45 -12 62 17 20 34 19 26
      -1 -6 -15 -3 -14 21 1 16 10 45 31 66 47 35 28 37 32 37 90 0 55 -3 64 -46
      119 -25 32 -48 59 -52 59 -10 0 -202 254 -202 267 0 6 6 16 14 22 22 19 29 66
      14 94 -7 14 -79 79 -159 146 -114 94 -150 129 -162 160 -17 40 -50 71 -77 71
      -9 0 -76 79 -150 176 -74 97 -145 185 -159 195 -32 26 -69 24 -112 -5 l-35
      -24 -187 154 c-179 147 -190 154 -232 154 -33 0 -50 -6 -66 -22z m510 -441
      c42 -35 142 -118 223 -185 l147 -122 -35 -51 c-45 -67 -67 -145 -66 -238 1
      -117 37 -205 120 -293 31 -32 33 -38 21 -55 -26 -37 -652 -764 -655 -761 -1 2
      3 41 9 86 31 240 -68 504 -255 677 -224 207 -539 281 -822 191 l-76 -24 58 67
      c31 36 182 213 336 393 l278 326 47 -29 c171 -109 430 -83 561 56 13 14 25 25
      28 25 2 0 38 -28 81 -63z m525 -1049 c-8 -74 10 -161 50 -241 l34 -67 -406
      -300 c-223 -164 -408 -297 -410 -295 -2 2 2 14 9 27 7 12 22 51 33 84 19 56
      55 101 355 453 184 215 336 391 338 391 2 0 0 -24 -3 -52z m-1641 -28 l48 -69
      -43 -22 c-23 -12 -68 -46 -100 -76 -83 -80 -98 -143 -42 -179 32 -22 56 -15
      202 59 108 54 131 62 192 65 80 5 134 -16 194 -74 50 -49 68 -89 74 -164 4
      -54 0 -77 -20 -128 l-25 -61 55 -49 56 -49 -44 -51 c-23 -29 -46 -52 -50 -52
      -5 0 -29 18 -56 40 l-48 39 -35 -30 c-57 -47 -153 -109 -170 -109 -13 0 -66
      65 -104 127 -5 9 10 21 51 42 148 75 234 209 172 271 -35 35 -83 27 -215 -40
      -66 -33 -142 -64 -170 -69 -102 -19 -199 25 -252 116 -24 41 -28 58 -28 123 0
      54 6 88 21 120 l20 45 -53 43 -53 43 47 54 c25 30 51 51 57 48 6 -4 29 -21 52
      -40 l41 -33 24 27 c23 25 136 103 148 103 3 0 28 -32 54 -70z m1655 -732 c6
      -15 8 -30 3 -32 -21 -14 -805 -326 -808 -322 -2 2 173 134 389 293 l393 290 6
      -101 c3 -56 11 -113 17 -128z"/>
      </g>
      </svg>
  </div>
  </div>
  </div>


    <div *ngIf="authState == 1">
      <app-toolbar></app-toolbar>
      <router-outlet></router-outlet>
      <!--<app-footer></app-footer>-->
    </div>
    <div class="login" *ngIf="authState == 0">    
      <img (click)="login()" src="assets/login_google.jpg" style="width: 70%"  />
      <p>Por favor, entre com sua conta Google.</p>
      <p style="font-size:10px">{{ version }}</p>
    </div>
  `,
})
export class AppComponent implements OnInit {

  //TODO: bug com signInWithPopup - alem de nao funcionar com cordova, da bug com PWA
  //TODO: fazer check de cordova
  //isCordova: boolean = false;
  authState: number = -1;

  version = SharedData.version;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    let user = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.setUser(user);
    }
  }

  login() {
    //if (this.isCordova)
      this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    // else
    //   this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginCordovaCallback() {
    this.afAuth.auth.getRedirectResult().then(result => {
      if (result.user) {        
        this.setUser(result.user);
      } else {
        this.authStateCheck();
      }
    });
  }
  
  authStateCheck() {
    this.afAuth.authState.subscribe(authState => {
      if (authState) {
        this.setUser(authState);
      } else {
        this.clearUser();
      }
    });
  }

  clearUser() {        
    SharedData.userLogged = {};
    localStorage.removeItem('user');
    this.authState = 0;
  }

  setUser(user) {    
    SharedData.userLogged.displayName = user.displayName;
    SharedData.userLogged.photoURL = user.photoURL;
    SharedData.userLogged.email = user.email;
    SharedData.userLogged.uid = user.uid;
    localStorage.setItem('user', JSON.stringify(user));
    this.authState = 1;
  }

  ngOnInit() {

    //if (this.isCordova)
      this.loginCordovaCallback();
    // else 
    //   this.authStateCheck();

    this.router.events.subscribe(event => {
      if (this.router.url !== '/' && !this.router.url.includes('/tab-demo')) {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}