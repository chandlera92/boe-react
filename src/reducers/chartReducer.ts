import data from "../data/data.json"
import {Category, ChartNavigationItem, ServiceActionTypes} from "../actions/chart.action";
import {cloneDeep} from 'lodash';


// todo: find way to typescript json file?
interface chartState {
    categories: Category[],
    checkedCategory: Category,
    activeCategories: [ChartNavigationItem, ChartNavigationItem, ChartNavigationItem, ChartNavigationItem],
    mobileOpen: boolean
}

const emptyCategory: Category = {
    header: '-',
    id: -1,
    points: [
        {value: 0.5, year: 1979},
        {value: 0.5, year: 1980},
        {value: 0.5, year: 1981},
        {value: 0.5, year: 1982},
        {value: 0.5, year: 1983},
        {value: 0.5, year: 1984},
        {value: 0.5, year: 1985},
        {value: 0.5, year: 1986},
        {value: 0.5, year: 1987},
        {value: 0.5, year: 1988},
        {value: 0.5, year: 1989},
        {value: 0.5, year: 1990},
        {value: 0.5, year: 1991},
        {value: 0.5, year: 1992},
        {value: 0.5, year: 1993},
        {value: 0.5, year: 1994},
        {value: 0.5, year: 1995},
        {value: 0.5, year: 1996},
        {value: 0.5, year: 1997},
        {value: 0.5, year: 1998},
        {value: 0.5, year: 1999},
        {value: 0.5, year: 2000},
        {value: 0.5, year: 2001},
        {value: 0.5, year: 2002},
        {value: 0.5, year: 2003},
        {value: 0.5, year: 2004},
        {value: 0.5, year: 2005},
        {value: 0.5, year: 2006},
        {value: 0.5, year: 2007},
        {value: 0.5, year: 2008},
        {value: 0.5, year: 2009},
        {value: 0.5, year: 2010},
        {value: 0.5, year: 2011},
        {value: 0.5, year: 2012},
        {value: 0.5, year: 2013},
        {value: 0.5, year: 2014},
        {value: 0.5, year: 2015},

    ],
    section: '-',
    title: '-',
    unit: '-'
};

const initCategory: any = {
    id: 0,
    color: '#2c7bb6',
    colorClass: 'blue',
    data: data[1],
    active: true
};

const INITIAL_STATE = {
    categories: data,
    checkedCategory: initCategory,
    activeCategories: [
        initCategory,
        {
            id: 1,
            color: '#abd9e9',
            colorClass: 'cyan',
            data: emptyCategory,
            active: false,
        },
        {
            id: 2,
            color: '#fdae61',
            colorClass: 'orange',
            data: emptyCategory,
            active: false
        },
        {
            id: 3,
            color: '#d7191c',
            colorClass: 'red',
            data: emptyCategory,
            active: false
        }
    ],
    mobileOpen: false,
    maxItemsWarning: false
};


export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case ServiceActionTypes.OPEN_ERROR_SNACK:
            return {...state, maxItemsWarning: true};
        case ServiceActionTypes.CLOSE_ERROR_SNACK:
            return {...state, maxItemsWarning: false};
        case ServiceActionTypes.SET_MOBILE:
            return {...state, mobileOpen: action.payload};
        case ServiceActionTypes.SET_CHECKED_CATEGORY:
            return {...state, checkedCategory: action.payload};
        case ServiceActionTypes.ADD_ACTIVE_CATEGORY:
            let clonedActiveCategories = cloneDeep(state.activeCategories);
            let availableItem = clonedActiveCategories.find((category: ChartNavigationItem) => {
                return category.active === false;
            });

            availableItem.data = action.payload;
            availableItem.active = true;

            return {...state, checkedCategory: availableItem, activeCategories: clonedActiveCategories};

        case ServiceActionTypes.REMOVE_ACTIVE_CATEGORY:
            let clonedCategories = cloneDeep(state.activeCategories);
            let removeItem = clonedCategories.find((category: ChartNavigationItem) => {
                return category.data.id === action.payload.id;
            });

            removeItem.data = emptyCategory;
            removeItem.active = false;

            let newState = {
                activeCategories: clonedCategories,
                checkedCategory: cloneDeep(state.checkedCategory)
            };

            if (removeItem.id === state.checkedCategory.id) {
                newState.checkedCategory = removeItem
                let getActiveItem = clonedCategories.find((category: ChartNavigationItem) => category.active);

                if (!getActiveItem) {
                    newState.checkedCategory = removeItem
                } else {
                    newState.checkedCategory = getActiveItem
                }
            }

            return {...state, ...newState};
        default:
            return state;
    }
}
