import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { CategoryWiseProductsPage } from '../category-wise-products/category-wise-products';

@IonicPage()
@Component({
  selector: 'page-subcats-display',
  templateUrl: 'subcats-display.html',
})
export class SubcatsDisplayPage {

  cat = this.navParams.get("cat");

  subCats: Array<any> = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
  ) {
    this.getSubCats();
  }

  getSubCats() {
    this.db.list(`SubCatsIndex/${this.cat.key}`).snapshotChanges().subscribe(snap => {
      this.subCats = [];
      snap.forEach(snip => {
        firebase.database().ref("SubCategories").child(snip.key).once("value", ssnip => {
          var temp: any = ssnip.val();
          temp.key = ssnip.key;
          this.subCats.push(temp);
        })
      })
    })
  }

  showProds(c) {
    this.navCtrl.push(CategoryWiseProductsPage, { cat: c })
  }

}
