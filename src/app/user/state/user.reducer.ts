import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../../state/app.state';
import { UserActions, UserActionTypes } from './user.actions';

export interface UserState {
    maskUserName: boolean;
}

export interface State extends fromRoot.State {
    users: UserState;
}

const initialState: UserState = {
    maskUserName: false
};

const getUserState = createFeatureSelector<UserState>('users');

export const getMaskUserName = createSelector(
    getUserState,
    state => state.maskUserName
);

export function reducer(state = initialState, action: UserActions) {
    switch (action.type) {
        case UserActionTypes.MaskUserName:
            return {
                ...state,
                maskUserName: action.payload
            };

        default:
            return state;
    }
}
