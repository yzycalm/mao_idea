import store from '../store'
import { CHANGE_CURPAGE, CHANGE_PAGESIZE, SELECT_TIMEHORIZON, FIRST_INPUTFRAME, SECOND_INPUTFRAME, FIRST_SELECTFRAME, SECOND_SELECTFRAME, THIRD_SELECTFRAME, FOURTH_SELECTFRAME, SCROLL_TOP } from '../store/actionTypes'
import moment from "moment";

export const changeCurPage = (val) => {
    const action ={
        type: CHANGE_CURPAGE,
        value: val
    }
    store.dispatch(action)
}

export const changePageSize = (val) => {
    const action ={
        type: CHANGE_PAGESIZE,
        value: val
    }
    store.dispatch(action)
}

export const selectTimeHorizon = (val) => {
    const action ={
        type: SELECT_TIMEHORIZON,
        value: val
    }
    store.dispatch(action)
}
export const inputFirstFrame = (val) => {
    const action ={
        type: FIRST_INPUTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const inputSecondFrame = (val) => {
    const action ={
        type: SECOND_INPUTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const selectFirstFrame = (val) => {
    const action ={
        type: FIRST_SELECTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const selectSecondFrame = (val) => {
    const action ={
        type: SECOND_SELECTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const selectThirdFrame = (val) => {
    const action ={
        type: THIRD_SELECTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const selectFourthFrame = (val) => {
    const action ={
        type: FOURTH_SELECTFRAME,
        value: val
    }
    store.dispatch(action)
}
export const scrollTopFrame = (val) => {
    const action ={
        type: SCROLL_TOP,
        value: val
    }
    store.dispatch(action)
}

// 重置所有值
const allType = [{type: CHANGE_CURPAGE, value: 1},{type: CHANGE_PAGESIZE, value: 10}, {type: SELECT_TIMEHORIZON, value: []},
    {type: FIRST_INPUTFRAME, value: ''}, {type: SECOND_INPUTFRAME, value: ''}, {type: FIRST_SELECTFRAME, value: ""},{type: SECOND_SELECTFRAME, value: ""}, {type: THIRD_SELECTFRAME, value: ''},
    { type: FOURTH_SELECTFRAME, value: ''}, { type: SCROLL_TOP, value: 0}]
export const resetAllValue = () => {
    allType.map(item => {
        store.dispatch(item)
    })

}
