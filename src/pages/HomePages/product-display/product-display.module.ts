import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDisplayPage } from './product-display';

@NgModule({
  declarations: [
    ProductDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDisplayPage),
  ],
})
export class ProductDisplayPageModule {}
