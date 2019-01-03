import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { PaymentGatewayPage } from '../../PaymentPages/payment-gateway/payment-gateway';
import { PaymentConfirmPage } from '../../PaymentPages/payment-confirm/payment-confirm';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  items: Array<any> = [];

  cartRef = this.db.list(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products`);
  cartValueRef = this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`);


  cartVal: number = 0;
  
  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl : LoadingController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    this.getCart();
    this.getCartValue();
  }

  getCartValue() {
    this.loading.present();
    this.cartValueRef.snapshotChanges().subscribe(snip => {
      this.cartVal = +snip.payload.val();
      this.loading.dismiss();
    })
  }


  getCart() {
    this.loading.present();
    this.cartRef.snapshotChanges().subscribe(snap => {
      this.items = [];
      snap.forEach(snip => {
        let temp: any;
        this.db.object(`Products/${snip.key}`).snapshotChanges().subscribe(isnap => {
          temp = isnap.payload.val();
          temp.key = isnap.key;
          temp.Quantity = snip.payload.val();
          this.items.push(temp);
          this.loading.dismiss();
        })
      })
    })
  }

  delItem(i) {
  
    this.loading.present();

    let temp: number = parseInt(i.Quantity) * parseInt(i.Price);
    let tCartVal = this.cartVal - temp;
    this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`).set(tCartVal).then(() => {
      this.db.list(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${i.key}`).remove().then(()=>{
        let tempMsg = i.Name + " " + "is removed";
        this.presentToast(tempMsg);
        this.loading.dismiss();
      });
    })
  }
  rmQuan(i) {
    this.loading.present();
    if(i.Quantity){
      let temp = parseInt(i.Quantity) - 1;
      let tCartVal = this.cartVal - parseInt(i.Price);
      this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${i.key}`).set(temp).then(() => {
        this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`).set(tCartVal);
        this.loading.dismiss();
      });
    }else{
      this.db.list(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${i.key}`).remove().then(()=>{
        let tempMsg = i.Name + " " + "is removed";
        this.presentToast(tempMsg);
        this.loading.dismiss();
        });
    }

  }
  addQuan(i) {
    this.loading.present();
    let temp = parseInt(i.Quantity) + 1;
    let tCartVal = this.cartVal + parseInt(i.Price);
    this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${i.key}`).set(temp).then(() => {
      this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`).set(tCartVal).then(()=>{
        this.loading.dismiss();
      });
    });
  }


  placeOrder(i){
    this.navCtrl.push(PaymentConfirmPage,{prod : i});
  }


  //Toast Function
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: "bottom",
      duration: 4000,
      showCloseButton: false,
    });
    toast.present();
  }


}
