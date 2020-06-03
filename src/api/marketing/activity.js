import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 活动弹窗管理列表
export const getPopupList = (data) => post({ url: `${host}/activity/main/getPopupList`, data: data });
// 删除
export const removePopup = (data) => post({ url: `${host}/activity/main/removePopup`, data: data });
// 新建 and 编辑
export const addOrUpdatePopup = (data) => post({ url: `${host}/activity/main/addOrUpdatePopup`, data: data });
// 停止
export const stopPopup = (data) => post({ url: `${host}/activity/main/stopPopup`, data: data });
// 查询
export const findPopupById = (data) => post({ url: `${host}/activity/main/findPopupById`, data: data });
