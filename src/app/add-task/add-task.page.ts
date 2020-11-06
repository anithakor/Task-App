import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {

  public name: string = "";
  public taskDate = new Date().toDateString();
  public priority = "";
  public isClick1 = false;
  public isClick2 = false;
  public isClick3 = false;
  public isClick4 = false;
  loading: any;
  constructor(public toast: ToastController,
    public loadingController: LoadingController,
    public firestore: AngularFirestore,
    public navParams: NavParams,
    public modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.taskDate = this.navParams.get('date');
  }
  changePriority(priority) {
    switch (priority) {
      case "high":
        this.isClick1 = true;
        this.isClick2 = false;
        this.isClick3 = false;
        this.isClick4 = false;
        this.priority = priority;
        break;
      case "medium":
        this.isClick1 = false;
        this.isClick2 = true;
        this.isClick3 = false;
        this.isClick4 = false;
        this.priority = priority;
        break;
      case "low":
        this.isClick1 = false;
        this.isClick2 = false;
        this.isClick3 = true;
        this.isClick4 = false;
        this.priority = priority;
        break;
      case "very low":
        this.isClick1 = false;
        this.isClick2 = false;
        this.isClick3 = false;
        this.isClick4 = true;
        this.priority = priority;
        break;
      default:
        this.isClick1 = false
        this.isClick2 = false
        this.isClick3 = false
        this.isClick4 = false
        break;
    }
  }
  async addTask() {
    if (this.name === "") {
      this.presentToast("Task name is required.")
    }
    else if (this.priority === "") {
      this.presentToast("Please select priority")
    }
    else {
      this.presentLoading();
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const form = {
          "priority": this.priority,
          "task_name": this.name,
          "task_date": new Date(this.taskDate).toDateString(),
          "completed": "0",
          "userId": user.uid,
          "created_at": new Date().getTime()
        }
        await firebase.firestore().collection('tasklist').doc(user.uid).collection(form.task_date).add(form).then((res) => {
          this.dismissLoading();
          this.modalCtrl.dismiss();
        })
      }

    }

  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
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
