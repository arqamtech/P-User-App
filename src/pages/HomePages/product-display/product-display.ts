import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { CartPage } from '../../MainTabs/cart/cart';
import { SellerProfilePage } from '../seller-profile/seller-profile';



@IonicPage()
@Component({
  selector: 'page-product-display',
  templateUrl: 'product-display.html',
})
export class ProductDisplayPage {

  prod = {
    BrandName: "Diseny",
    Category: "Bays&Kids",
    CategoryKey: "-LdJxZG5ncDzS2KZMo9K",
    Color: "Red",
    ImageUrl: "https://firebasestorage.googleapis.com/v0/b/posters-83a2e.appspot.com/o/Products%2FCd8TWhzPlRgsggwngrHq4QV1fT43%2FSimba%20LMB-RED%20Remote%20Control%20Car%20%20(Red)?alt=media&token=a04d1290-8584-4dc7-b809-639bd7b78cf8",
    Name: "Simba LMB-RED Remote Control Car  (Red)",
    Price: "350",
    Quantity: "4",
    Sales: "0",
    Size: "11.5 cm x 7 cm",
    Status: "Pending",
    StoreKey: "Cd8TWhzPlRgsggwngrHq4QV1fT43",
    StoreName: "seeya",
    SubCategory: { Name: "Toys", TimeStamp: "2019-04-25T20:17:06+05:30", key: "-LdJxjzf-LvXXLNXO4-1" },
    SubCategoryItem: { Name: "Remote Control Toys", TimeStamp: "2019-04-25T20:17:30+05:30", key: "-LdJxpx8hJVn7k4wfB3x" },
    SubCategoryItemKey: "-LdJxpx8hJVn7k4wfB3x",
    SubCategoryKey: "-LdJxjzf-LvXXLNXO4-1",
    TimeStamp: "2019-04-25T20:22:43+05:30",
    key: "-LdJz-kAtKoLOxgDf7qd",
  }
  // this.navParams.get("prod");
  inC: boolean = false;

  cartVal: number = 0;

  prodQuan: number = 0;

  cartRef = firebase.database().ref("User Data/User Cart").child(firebase.auth().currentUser.uid).child("CartValue");

  userProdRef = firebase.database().ref("User Data/User Cart/").child(firebase.auth().currentUser.uid).child("Products").child(this.prod.key);

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    console.log(this.prod);

    this.getCartValue();
    this.getProdQuantity();
  }

  getCartValue() {
    this.cartRef.once("value", snip => {
      if (snip.exists()) {
        this.cartVal = snip.val();
      } else {
        this.cartRef.set(0);
      }
    })

  }
  getProdQuantity() {
    this.userProdRef.once("value", snip => {
      if (snip.exists()) {
        this.prodQuan = snip.val();
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
    let tempi: number = +this.prodQuan + 1;

    this.userProdRef.set(tempi).then(() => {
      let temp: number = +this.cartVal + parseInt(this.prod.Price);
      this.cartRef.set(temp).then(() => {
        this.inC = true;
      }).then(() => {
        loading.dismiss();
      })
    })
  }



  gtCart() {
    this.navCtrl.push(CartPage);
  }

  gtSellerPage() {
    this.navCtrl.push(SellerProfilePage, { seller: this.prod })
  }
}
