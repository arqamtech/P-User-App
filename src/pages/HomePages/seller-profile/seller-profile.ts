import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { ProductDisplayPage } from '../product-display/product-display';
import { AngularFireDatabase } from 'angularfire2/database';




@IonicPage()
@Component({
  selector: 'page-seller-profile',
  templateUrl: 'seller-profile.html',
})
export class SellerProfilePage {

  seller = this.navParams.get("seller")

  banner: string;
  products: Array<any> = [];

  lat: string;
  lon: string;


  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    this.getSeller();
    this.getProds();
  }

  getSeller() {
    firebase.database().ref("Seller Data/Sellers").child(this.seller.StoreKey).once("value", itemSnap => {
      let temp: any = itemSnap.val();
      this.banner = temp.Banner;
      this.lon = temp.Longitude;
      this.lat = temp.Latitude;
    })
  }

  getProds() {
    this.db.list(`Seller Data/Products/${this.seller.StoreKey}`).snapshotChanges().subscribe(snap => {
      this.products = [];
      snap.forEach(snp => {
        this.db.object(`Products/${snp.key}`).snapshotChanges().subscribe(pSnap => {
          var temp: any = pSnap.payload.val();
          temp.key = pSnap.key;
          if (temp.Status == "Verified") {
            this.products.push(temp);
          }
        })
      })
    })




    // firebase.database().ref("Seller Data").child("Products").child(this.seller.StoreKey).once("value", itemSnap => {
    //   itemSnap.forEach(snap => {
    //     firebase.database().ref("Products").child(snap.key).once("value", iisnap => {
    //       let temp: any = iisnap.val();
    //       temp.key = iisnap.key;
    //       if (temp.Status == "Verified") {
    //         this.products.push(temp)
    //       }


    //     })
    //   })
    // })
  }
  displyProd(p) {
    this.navCtrl.push(ProductDisplayPage, { prod: p })
  }

  navigate() {
    console.log(this.lat);
    console.log(this.lon);

  }
}
