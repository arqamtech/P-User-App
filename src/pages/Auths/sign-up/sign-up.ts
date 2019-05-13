import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { TabsPage } from '../../Supp/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  name: string;
  email: string;


  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
  ) {
    // firebase.auth().signOut();
  }

  checkData() {
    if (this.name) {
      if (this.email) {
        this.dataEnter();
      } else {
        this.presentToast("Enter email Id");
      }
    } else {
      this.presentToast("Enter your Name");
    }
  }
  dataEnter() {
    firebase.database().ref("User Data/Users").child(firebase.auth().currentUser.uid).set({
      Name: this.name,
      Email: this.email
    }).then(() => {
      this.navCtrl.setRoot(TabsPage);
    })

  }


  //Toast Function
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: "top",
      duration: 4000,
      showCloseButton: false,
    });
    toast.present();
  }

}

