import chartReducer from "./chartReducer";
import {combineReducers} from "redux";

export default combineReducers<any>({
    chart: chartReducer
});
