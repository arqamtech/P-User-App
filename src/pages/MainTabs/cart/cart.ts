import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  items : Array<any> = [];

  cartRef = this.db.list(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products`)
  cartValueRef = this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`)


  cartVal : number = 0;

  constructor(
  public navCtrl: NavController, 
  public db : AngularFireDatabase,
  public navParams: NavParams
  ) {
    this.getCart();
    this.getCartValue();
  }

  getCartValue(){
    this.cartValueRef.snapshotChanges().subscribe(snip=>{
      this.cartVal = +snip.payload.val();
    })
  }


  getCart(){
    this.cartRef.snapshotChanges().subscribe(snap=>{
      this.items = [];
      snap.forEach(snip=>{
        let temp : any ;
        this.db.object(`Products/${snip.key}`).snapshotChanges().subscribe(isnap=>{
          temp = isnap.payload.val();
          temp.Quantity = snip.payload.val();
          this.items.push(temp);
        })
      })
    })
  }
}
