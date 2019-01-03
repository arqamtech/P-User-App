import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { PaymentGatewayPage } from '../payment-gateway/payment-gateway';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-payment-confirm',
  templateUrl: 'payment-confirm.html',
})
export class PaymentConfirmPage {

  prod = this.navParams.get("prod");

  amount : number = 0;
  cartValueRef = this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`);
  cartVal : number = 0;
  constructor(
  public navCtrl: NavController, 
  public db : AngularFireDatabase,
  public navParams: NavParams
  ) {
    console.log(this.prod);
    this.amount = parseInt(this.prod.Quantity) * parseInt(this.prod.Price);
    this.getCartValue();
  }


  getCartValue() {
    this.cartValueRef.snapshotChanges().subscribe(snip => {
      this.cartVal = +snip.payload.val();
    })
  }



  pay(){

    let newCartVal : number =  this.cartVal-this.amount;
    
    this.db.list(`Orders`).push({
      ProductKey : this.prod.key,
      Quantity : this.prod.Quantity,
      Price : this.prod.Price,
      Status: "Pending",
      Amount : this.amount,
      TimeStamp : moment().format()
    }).then((res)=>{
       this.db.object(`Seller Data/Orders/${this.prod.StoreKey}/Pending/${res.key}`).set(true).then(()=>{
         this.db.object(`User Data/User Orders/${firebase.auth().currentUser.uid}/${res.key}`).set(true).then(()=>{
           this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${this.prod.key}`).remove().then(()=>{
             this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`).set(newCartVal)
           })
         })
       })
    })
  }


  gtPaymentGateway(){
    this.navCtrl.push(PaymentGatewayPage);
  }

}
