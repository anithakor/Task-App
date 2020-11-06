import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { AddTaskPage } from '../add-task/add-task.page';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public date = new Date().toDateString();
  public segment = 'all';
  public tasklist = [];
  loading: any;
  sub
  completedTasks: any[];
  incompletedTasks: any[];
  constructor(public googlePlus: GooglePlus,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
    public alert: AlertController) { }

  menuOpen() {

    this.menuCtrl.open();
  }
  ngOnInit() {
    this.getTaskList();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true)
  }

  getTaskList() {
    this.presentLoading();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      firebase.firestore().collection('tasklist').doc(user.uid).collection(this.date).orderBy('created_at', 'desc').get().then((snapshot) => {
        this.tasklist = [];
        this.completedTasks = [];
        this.incompletedTasks = [];
        snapshot.forEach((task) => {
          const data = { ...task.data(), ...{ key: task.id } };
          this.tasklist.push(data);
          if (task.data().completed === "1") {
            this.completedTasks.push({ ...task.data(), ...{ key: task.id } })
          }
          else {
            this.incompletedTasks.push({ ...task.data(), ...{ key: task.id } })
          }
        })
        this.dismissLoading();
      })
    }
  }
  prevDate() {
    var day = new Date(this.date);
    day.setDate(day.getDate() - 1);
    this.date = day.toDateString();
  }
  nextDate() {
    var day = new Date(this.date);
    day.setDate(day.getDate() + 1);
    this.date = day.toDateString();
  }
  async addTaskModal() {
    const myModal = await this.modalController.create({
      component: AddTaskPage,
      componentProps: {
        "date": this.date
      },
      cssClass: 'my-custom-modal-css'
    });
    myModal.onDidDismiss().then(() => {
      this.getTaskList();
    })
    return await myModal.present();

  }
  statusChange(task: any) {
    if (task.completed === "0") {
      firebase.firestore().collection('tasklist').doc(task.userId).collection(this.date).doc(task.key).update({ "completed": "1" }).then(() => {
        this.getTaskList();
      })
    }
    else {
      firebase.firestore().collection('tasklist').doc(task.userId).collection(this.date).doc(task.key).update({ "completed": "0" }).then(() => {
        this.getTaskList();
      })
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'loading',
      message: 'Loading...',
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

