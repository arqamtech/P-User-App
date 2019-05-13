import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ProductDisplayPage } from '../../HomePages/product-display/product-display';

@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {

  orders: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    this.getOrders();
  }



  getOrders() {
    this.db.list(`User Data/User Orders/${firebase.auth().currentUser.uid}`).snapshotChanges().subscribe(snap => {
      snap.forEach(snip => {
        this.db.object(`Orders/${snip.key}`).snapshotChanges().subscribe(oSnap => {
          let temp: any;
          let veryTemp: any = oSnap.payload.val();
          this.orders = [];

          this.db.object(`Products/${veryTemp.ProductKey}`).snapshotChanges().subscribe(pSnap => {
            temp = pSnap.payload.val();
            temp.key = pSnap.key;
            temp.Amount = veryTemp.Amount;
            temp.Quantity = veryTemp.Quantity;
            temp.Status = veryTemp.Status;
            temp.TimeStamp = veryTemp.TimeStamp;
            this.orders.push(temp);
          })
        })
      })
    })
  }

  gtProductDisplay(p) {
    this.navCtrl.push(ProductDisplayPage), { prod: p };
  }


}
