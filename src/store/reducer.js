import { CHANGE_CURPAGE, CHANGE_PAGESIZE, SELECT_TIMEHORIZON, FIRST_INPUTFRAME, SECOND_INPUTFRAME, FIRST_SELECTFRAME, SECOND_SELECTFRAME, THIRD_SELECTFRAME, FOURTH_SELECTFRAME, SCROLL_TOP } from '../store/actionTypes'
import moment from "moment";
const defaultState = {
    curPage: 1,
    pageSize: 10,
    defaultScrollTop: 0,
    timeHorizon: [],
    firstInput: '',
    secondInput: '',
    firstSelect: "",
    secondSelect: "",
    thirdSelect: "",
    fourthSelect: "",
    iconFont: '//at.alicdn.com/t/font_1531095_7hnptswy11s.js',
    clientId: "hrz_admin" // 固定传递场景值
}
export default (state = defaultState,action)=>{
    let newState = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case CHANGE_CURPAGE:
            newState.curPage = action.value
            return newState
            break
        case CHANGE_PAGESIZE:
            newState.pageSize = action.value
            return newState
            break
        case SELECT_TIMEHORIZON:
            newState.timeHorizon = action.value
            return newState
            break
        case FIRST_INPUTFRAME:
            newState.firstInput = action.value
            return newState
            break
        case SECOND_INPUTFRAME:
            newState.secondInput = action.value
            return newState
            break
        case FIRST_SELECTFRAME:
            newState.firstSelect = action.value
            return newState
            break
        case SECOND_SELECTFRAME:
            newState.secondSelect = action.value
            return newState
            break
        case THIRD_SELECTFRAME:
            newState.thirdSelect = action.value
            return newState
            break
        case FOURTH_SELECTFRAME:
            newState.fourthSelect = action.value
            return newState
            break
        case SCROLL_TOP:
            newState.defaultScrollTop = action.value
            return newState
            break
        default:
            break
    }
    return state
}
