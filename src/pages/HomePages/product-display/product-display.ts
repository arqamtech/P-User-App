import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-product-display',
  templateUrl: 'product-display.html',
})
export class ProductDisplayPage {
  
  prod = this.navParams.get("prod");

  constructor(
    public navCtrl: NavController, 
    public db : AngularFireDatabase,
    public navParams: NavParams
    ) {
      console.log(this.prod)
    }
  

}
