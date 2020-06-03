import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 导航列表
export const getFootNavList = (data) => post({ url: `${host}/activity/maintab/getMainTabList`, data: data });
// 添加或更新
export const addOrUpdateFootNav = (data) => post({ url: `${host}/activity/maintab/addOrUpdateTabs`, data: data });
// 删除
export const deleteFootNav = (data) => post({ url: `${host}/activity/maintab/delTabs`, data: data });
