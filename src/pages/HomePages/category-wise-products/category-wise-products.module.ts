import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryWiseProductsPage } from './category-wise-products';

@NgModule({
  declarations: [
    CategoryWiseProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryWiseProductsPage),
  ],
})
export class CategoryWiseProductsPageModule {}
