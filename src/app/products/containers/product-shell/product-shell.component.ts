import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromProduct from '../../state';
import * as productActions from '../../state/product.actions';
import { Product } from '../../product';
import { ProductService } from '../../product.service';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {

  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  selectedProduct$: Observable<Product>;
  displayCode$: Observable<boolean>;

  constructor(private store: Store<fromProduct.State>,
    private productService: ProductService) { }

  ngOnInit(): void {

    this.store.dispatch(new productActions.LoadProducts());

    this.products$ = this.store.pipe(select(fromProduct.getProducts));
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));
    this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProduct));
    this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCode));
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product) {
    this.store.dispatch(new productActions.DeleteProduct(product.id));
  }

  createProduct(product: Product) {
    this.store.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product) {
    this.store.dispatch(new productActions.UpdateProduct(product));
  }

  clearProduct() {
    this.store.dispatch(new productActions.ClearCurrentProduct());
  }

}
