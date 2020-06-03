import React from "react";
import {showConfirm} from "../utils"

/*分享管理公共模块*/
export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}
