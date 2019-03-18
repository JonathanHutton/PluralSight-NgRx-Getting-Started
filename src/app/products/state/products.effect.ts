import { Injectable } from '@angular/core';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { ProductService } from '../product.service';
import * as productActions from '../state/product.actions';
import { of, Observable } from 'rxjs';

@Injectable()
export class ProductEffects {

    constructor(private actions$: Actions,
        private productService: ProductService) { }

    @Effect()
    loadProducts$ = this.actions$
        .pipe(
            ofType(productActions.ProductActionTypes.Load),
            mergeMap((action: productActions.LoadProducts) => this.productService.getProducts()
                .pipe(
                    map(products => new productActions.LoadProductsSuccess(products)),
                    catchError(err => of(new productActions.LoadProductsFail(err)))
                )
            )
        );

    @Effect()
    createProduct$ = this.actions$
        .pipe(
            ofType(productActions.ProductActionTypes.CreateProduct),
            mergeMap((action: productActions.CreateProduct) => this.productService.createProduct(action.payload)
                .pipe(
                    map(newProduct => new productActions.CreateProductSuccess(newProduct)),
                    catchError(err => of(new productActions.CreateProductFail(err)))
                )
            )
        );

    @Effect()
    updateProduct$ = this.actions$
        .pipe(
            ofType(productActions.ProductActionTypes.UpdateProduct),
            map((action: productActions.UpdateProduct) => action.payload),
            mergeMap(product => this.productService.updateProduct(product)
                .pipe(
                    map(updatedProduct => new productActions.UpdateProductSuccess(updatedProduct)),
                    catchError(err => of(new productActions.UpdateProductFail(err)))
                )
            )
        );

    @Effect()
    deleteProduct$ = this.actions$
        .pipe(
            ofType(productActions.ProductActionTypes.DeleteProduct),
            map((action: productActions.DeleteProduct) => action.payload),
            mergeMap(productId => this.productService.deleteProduct(productId)
                .pipe(
                    map(() => new productActions.DeleteProductSuccess(productId)),
                    catchError(err => of(new productActions.DeleteProductFail(err)))
                )
            )
        );
}
