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

  disCom : number;
  disTrans : number;
  disGst : number;


  amount : number = 0;
  cartValueRef = this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`);
  cartVal : number = 0;

  comm : number;
  fAmount : number = 0;
  constructor(
  public navCtrl: NavController, 
  public db : AngularFireDatabase,
  public navParams: NavParams
  ) {
    console.log(this.prod);
    this.amount = parseInt(this.prod.Quantity) * parseInt(this.prod.Price);
    this.getCartValue();
    this.getComm();
  }

// Commission 5%
// Online transaction 3% 
// GST on product 18%

  getCartValue() {
    this.cartValueRef.snapshotChanges().subscribe(snip => {
      this.cartVal = +snip.payload.val();
    })
  }

  getComm(){
    this.db.object(`Admin Data/Comission`).snapshotChanges().subscribe(snap=>{
      let tt = snap.payload.val();
      this.comm = +tt;
      this.disCom = (this.comm * this.amount)/100;
      this.disTrans = (3 * this.amount)/100;
      this.disGst = (18 * this.amount)/100;
      let xtra : number = ((this.comm+21)/100)+1;
      this.fAmount = this.amount*xtra;
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
