import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 我的选品库列表
export const getLibList = (data) => post({ url: `${host}/manage/group/findGroupByPage`, data: data });
// 删除选品库
export const deleteItem = (data) => post({ url: `${host}/manage/group/delete`, data: data });
// 查询详情
export const findDetail = (data) => post({ url: `${host}/manage/group/findGroupItemByPage`, data: data });
// 删除商品
export const deleteGoods = (data) => post({ url: `${host}/manage/group/removeGroupItem`, data: data });
// 查询商品库商品
export const getGoodsList = (data) => post({ url: `${host}/manage/item/findItemByPage`, data: data });
// 添加到选品组
export const addToLib = (data) => post({ url: `${host}/manage/group/addGroupItem`, data: data });
// 保存选品组
export const saveLib = (data) => post({ url: `${host}/manage/group/save`, data: data });
// 更新选品库
export const updateLib = (data) => post({ url: `${host}/manage/group/update`, data: data });
//红人装销售榜
export const getHrzList = (data) => post({ url: `${host}/manage/item/findRankByPage`, data: data });

