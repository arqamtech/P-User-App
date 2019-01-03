import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-payment-gateway',
  templateUrl: 'payment-gateway.html',
})
export class PaymentGatewayPage {

  prod = this.navParams.get("prod");

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  ) {
  }


}
