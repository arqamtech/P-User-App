import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerProfilePage } from './seller-profile';

@NgModule({
  declarations: [
    SellerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SellerProfilePage),
  ],
})
export class SellerProfilePageModule {}
