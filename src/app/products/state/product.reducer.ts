import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../../state/app.state';
import { Product } from '../product';
import { ProductActions, ProductActionTypes } from './product.actions';

export interface State extends fromRoot.State {
    products: ProductState;
}

export interface ProductState {
    showProductCode: boolean;
    currentProductId: number;
    products: Product[];
    error: string;
}

const initalState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
};

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
);

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        } else {
            return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export const getError = createSelector(
    getProductFeatureState,
    state => state.error
);

export function reducer(state = initalState, action: ProductActions): ProductState {
    switch (action.type) {
        case ProductActionTypes.ToggleProductCode:
            return {
                ...state,
                showProductCode: action.payload
            };

        case ProductActionTypes.SetCurrentProduct:
            return {
                ...state,
                currentProductId: action.payload.id
            };

        case ProductActionTypes.ClearCurrentProduct:
            return {
                ...state,
                currentProductId: null
            };

        case ProductActionTypes.InitializeCurrentProduct:
            return {
                ...state,
                currentProductId: 0
            };

        case ProductActionTypes.LoadSuccess:
            return {
                ...state,
                products: action.payload,
                error: ''
            };

        case ProductActionTypes.LoadFail:
            return {
                ...state,
                products: [],
                error: action.payload
            };

        case ProductActionTypes.CreateProductSuccess:
            return {
                ...state,
                products: [...state.products, action.payload],
                currentProductId: action.payload.id,
                error: ''
            };

        case ProductActionTypes.CreateProductFail:
            return {
                ...state,
                error: action.payload
            };

        case ProductActionTypes.UpdateProductSuccess:
            const updatedProducts = state.products.map(item => item.id === action.payload.id ? action.payload : item);
            return {
                ...state,
                products: updatedProducts,
                currentProductId: action.payload.id,
                error: ''
            };

        case ProductActionTypes.UpdateProductFail:
            return {
                ...state,
                error: action.payload
            };

        case ProductActionTypes.DeleteProductSuccess:
            const updateProducts = state.products.filter(item => item.id !== action.payload);
            return {
                ...state,
                products: updateProducts,
                currentProductId: null,
                error: ''
            };

        case ProductActionTypes.DeleteProductFail:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
}