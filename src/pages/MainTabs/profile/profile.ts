import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { YourOrdersPage } from '../../ProfilePages/your-orders/your-orders';
import { ContactUsPage } from '../../ProfilePages/contact-us/contact-us';
import { FaqSPage } from '../../ProfilePages/faq-s/faq-s';
import { LoginSplashPage } from '../../Auths/login-splash/login-splash';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name: string;
  user;
  loading = this.loadingCtrl.create({
    spinner: 'crescent',
    showBackdrop: false,
  });


  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot(LoginSplashPage);
      }
    })

    this.getUser();
  }

  getUser() {
    firebase.database().ref("User Data/Users").child(firebase.auth().currentUser.uid).once("value", snap => {
      this.user = snap.val();
    })
  }

  signOutConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm logout ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    alert.present();
  }


  signOut() {
    this.loading.present();
    firebase.auth().signOut().then(() => {
      this.loading.dismiss();
    });
  }

  gtYourOrders() { this.navCtrl.push(YourOrdersPage) }
  gtContact() { this.navCtrl.push(ContactUsPage) }
  gtFaqs() { this.navCtrl.push(FaqSPage) }
}
