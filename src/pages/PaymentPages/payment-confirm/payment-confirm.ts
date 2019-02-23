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

  disCom: number;
  disTrans: number;
  disGst: number;


  amount: number = 0;
  cartValueRef = this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`);
  cartVal: number = 0;

  comm: number;
  fAmount: number = 0;


  name: string = "User";
  mail: string = "user@samplemail.com";

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    console.log(this.prod);
    this.amount = parseInt(this.prod.Quantity) * parseInt(this.prod.Price);
    this.getCartValue();
    this.getComm();
    this.getUser();
  }

  // Commission 5%
  // Online transaction 3% 
  // GST on product 18%

  getCartValue() {
    this.cartValueRef.snapshotChanges().subscribe(snip => {
      this.cartVal = +snip.payload.val();
    })
  }

  getComm() {
    this.db.object(`Admin Data/Comission`).snapshotChanges().subscribe(snap => {
      let tt = snap.payload.val();
      this.comm = +tt;
      this.disCom = (this.comm * this.amount) / 100;
      this.disTrans = (3 * this.amount) / 100;
      this.disGst = (18 * this.amount) / 100;
      let xtra: number = ((this.comm + 21) / 100) + 1;
      this.fAmount = this.amount * xtra;
    })
  }




  pay() {



    let newCartVal: number = this.cartVal - this.amount;


    this.db.list(`Orders`).push({
      ProductKey: this.prod.key,
      Quantity: this.prod.Quantity,
      Price: this.prod.Price,
      Status: "Pending",
      Amount: this.amount,
      TimeStamp: moment().format()
    }).then((res) => {
      let tt = res.key;
      this.db.object(`Seller Data/Orders/${this.prod.StoreKey}/Pending/${res.key}`).set(true).then(() => {
        this.db.object(`User Data/User Orders/${firebase.auth().currentUser.uid}/${res.key}`).set(true).then(() => {
          this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/Products/${this.prod.key}`).remove().then(() => {
            this.db.object(`User Data/User Cart/${firebase.auth().currentUser.uid}/CartValue`).set(newCartVal).then(() => {
              this.payGate(tt);
            })
          })
        })
      })
    })

  }
  payGate(oKey) {
    var options = {
      description: "Posters Payment",
      image: this.prod.ImageUrl,
      currency: 'INR',
      key: 'rzp_test_Op4yX9FbJjMww0',
      amount: this.fAmount,
      name: this.prod.Name,
      prefill: {
        email: this.mail,
        contact: '',
        name: this.name,
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = function (payment_id) {
      firebase.database().ref("Orders").child(oKey).child("paymentId").set(payment_id).then(() => {
        firebase.database().ref("Orders").child(oKey).child("Status").set("Payment Successful");
      })
    };

    var cancelCallback = function (error) {
      firebase.database().ref("Orders").child(oKey).child("paymentId").set(error).then(() => {
        firebase.database().ref("Orders").child(oKey).child("Status").set("Payment Unsuccessful");
      })
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }


  gtPaymentGateway() {
    this.navCtrl.push(PaymentGatewayPage);
  }



  getUser() {
    firebase.database().ref("User Data/Users").child(firebase.auth().currentUser.uid).once("value", snap => {
      this.name = snap.val().Name;
      console.log(this.name);

    })
  }



}
