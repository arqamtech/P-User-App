import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { ProductDisplayPage } from '../product-display/product-display';




@IonicPage()
@Component({
  selector: 'page-seller-profile',
  templateUrl: 'seller-profile.html',
})
export class SellerProfilePage {

  seller = this.navParams.get("seller")

  banner: string;
  products: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.getSeller();
    this.getProds();
  }

  getSeller() {
    firebase.database().ref("Seller Data/Sellers").child(this.seller.StoreKey).child("Banner").once("value", itemSnap => {
      this.banner = itemSnap.val();

    })
  }

  getProds() {
    firebase.database().ref("Seller Data").child("Products").child(this.seller.StoreKey).once("value", itemSnap => {
      // console.log(itemSnap.val());
      itemSnap.forEach(snap => {
        firebase.database().ref("Products").child(snap.key).once("value", iisnap => {
          let temp: any = iisnap.val();
          temp.key = iisnap.key;
          this.products.push(temp)


        })
      })
    })
  }
  displyProd(p){
    this.navCtrl.push(ProductDisplayPage,{prod : p})
  }


}
