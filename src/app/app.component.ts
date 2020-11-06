import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let user = JSON.parse(localStorage.getItem('user'));
      this.user = user;
      if (this.user) {
        this.router.navigate(['home'])
      }
      else {
        this.router.navigate(['login'])
      }
    });
  }
  openPage(page) {
    this.router.navigate([page])
  }
  async logout() {
    await firebase.auth().signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);

  }
}
