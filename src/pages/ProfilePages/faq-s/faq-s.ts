import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-faq-s',
  templateUrl: 'faq-s.html',
})
export class FaqSPage {
  faqs: Array<any> = []

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    this.getFaqs();
  }

  getFaqs() {
    this.db.list(`Promotionals/FAQs/UserFaq`).snapshotChanges().subscribe(snap => {
      this.faqs = [];
      snap.forEach(snip => {
        var temp: any = snip.payload.val();
        temp.key = snip.key;
        this.faqs.push(temp);
      })
    })

  }

}
