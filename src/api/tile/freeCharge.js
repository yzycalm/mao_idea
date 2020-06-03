import {post, get} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取新人免单商品列表
export const getNewPersonList = (data) => post({url: `${host}/activity/new/free/list`, data: data});
// 保存新人免单
export const saveOrEditNewPerson = (data) => post({url: `${host}/activity/new/free/addOrChange`, data: data});
// 获取新人免单详情
export const findNewPersonById = (data) => post({url: `${host}/activity/new/free/item`, data: data});
// 修改新人免单状态  status 1删除 2下架
export const editNewPersonStatus = (data) => post({url: `${host}/activity/new/free/change/status`, data: data});
// 修改新人免单权重
export const editNewPersonSort = (data) => post({url: `${host}/activity/new/free/change/sorts`, data: data});
// 用于判断是否存在该商品
export const isExist = (data) => post({url: `${host}/activity/new/free/nonExist`, data: data});

