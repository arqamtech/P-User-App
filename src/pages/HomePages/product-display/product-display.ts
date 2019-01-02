import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { CartPage } from '../../MainTabs/cart/cart';



@IonicPage()
@Component({
  selector: 'page-product-display',
  templateUrl: 'product-display.html',
})
export class ProductDisplayPage {

  prod = this.navParams.get("prod");
  inC: boolean = false;

  cartVal: number = 0;

  prodQuan  :number = 0;

  cartRef = firebase.database().ref("User Data/User Cart").child(firebase.auth().currentUser.uid).child("CartValue");

  userProdRef = firebase.database().ref("User Data/User Cart/").child(firebase.auth().currentUser.uid).child("Products").child(this.prod.key);

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public loadingCtrl : LoadingController,
    public navParams: NavParams
  ) {
    this.getCartValue();
    this.getProdQuantity();
  }

  getCartValue() {
    this.cartRef.once("value", snip => {
      if (snip.exists()) {
        this.cartVal =snip.val();
      } else {
        this.cartRef.set(0);
      }
    })

  }
  getProdQuantity() {
    this.userProdRef.once("value", snip => {
      if (snip.exists()) {
        this.prodQuan =snip.val();
      } else {
      }
    })

  }

  atCart() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
    console.log(this.prodQuan);
    let tempi  : number = +this.prodQuan +1;

    this.userProdRef.set(tempi).then(() => {
      let temp  : number = +this.cartVal + parseInt(this.prod.Price);
      this.cartRef.set(temp).then(()=>{
        this.inC = true;
      }).then(()=>{
        loading.dismiss();
      })
    })
  }



  gtCart() {
    this.navCtrl.push(CartPage);
  }


}
