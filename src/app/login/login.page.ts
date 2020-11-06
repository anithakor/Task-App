import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading: HTMLIonLoadingElement;

  constructor(public googlePlus: GooglePlus,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
    public router: Router,
    public alert: AlertController) { }

  ngOnInit() {
    this.menuCtrl.enable(false)
  }
  googleLogin() {
    this.googlePlus.login({
      'webClientId': '720100910059-bqc3j76r3rjdeep6s2giu0uvgvhc3g4b.apps.googleusercontent.com',
      'offline': true
    })
      .then(res => {
        const { idToken, accessToken } = res;
        this.onLoginSuccess(idToken, accessToken)
      })
      .catch(err => console.error(err));
  }

  onLoginSuccess(accessToken, accessSecret) {
    this.presentLoading();
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
        .credential(accessToken);
    firebase.auth().signInWithCredential(credential)
      .then((success) => {
        localStorage.setItem('user', JSON.stringify(success.user));
        this.dismissLoading();
        this.router.navigate(['home']);
      });
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'login_loading',
      message: 'Logging you...',
      mode: "ios"
    });
    await this.loading.present();
  }
  async dismissLoading() {
    if (this.loading) {
      await this.loadingController.dismiss();
    }
  }

}
