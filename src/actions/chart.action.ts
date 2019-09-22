import {Dispatch} from "redux";


export interface dataPoint {
    value: number,
    year: number
}

export interface Category {
    header: string,
    id: number,
    points: dataPoint[],
    section: string,
    title: string,
    unit: string
}

export interface ChartNavigationItem {
    id: number,
    color: string,
    colorClass: string,
    data: Category,
    active: boolean
}

export enum ServiceActionTypes {
    SET_CHECKED_CATEGORY = 'SET_CHECKED_CATEGORY',
    ADD_ACTIVE_CATEGORY = 'ADD_ACTIVE_CATEGORY',
    REMOVE_ACTIVE_CATEGORY = 'REMOVE_ACTIVE_CATEGORY',
    SET_MOBILE = 'SET_MOBILE',
    OPEN_ERROR_SNACK = 'SET_ERROR_SNACK',
    CLOSE_ERROR_SNACK = 'CLOSE_ERROR_SNACK'
}

export const openErrorSnack = () => (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.OPEN_ERROR_SNACK})
};

export const closeErrorSnack = () => (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.CLOSE_ERROR_SNACK})
};

export const setMobile = (mobileOpen: boolean) => (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.SET_MOBILE, payload: mobileOpen})
};

export const setCheckedCategory = (category: ChartNavigationItem) => async (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.SET_CHECKED_CATEGORY, payload: category})
};

export const addActiveCategory = (category: Category) => (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.ADD_ACTIVE_CATEGORY, payload: category})
};

export const removeActiveCategory = (category: Category) => (dispatch: Dispatch) => {
    dispatch({type: ServiceActionTypes.REMOVE_ACTIVE_CATEGORY, payload: category})
};
