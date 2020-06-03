import {post} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取列表
export const getCardList = (data) => post({url: `${host}/activity/tangram/admin/card/list`, data: data});
// 删除
export const removeCard = (data) => post({url: `${host}/activity/tangram/admin/card/delete`, data: data});
// 保存卡片
export const saveCard = (data) => post({url: `${host}/activity/tangram/admin/card/save`, data: data});
// 启用或停止
export const stopCard = (data) => post({url: `${host}/activity/tangram/admin/card/status/modify`, data: data});
// 获取卡片详情
export const findTileById = (data) => post({url: `${host}/activity/tangram/admin/card/find/one`, data: data});
// 修改卡片权重
export const editCardSort = (data) => post({url: `${host}/activity/tangram/admin/card/weight/modify`, data: data});
