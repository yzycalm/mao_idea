import {post} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取列表
export const getTodayPushList = (data) => post({url: `${host}/activity/pushseckill/admin/get/musttoady/adv/list`, data: data});
//获取二级页广告位详情
export const getTodayPushDetail = (data) => post({url: `${host}/activity/pushseckill/admin/get/musttoady/adv/detail`, data: data});
//状态
export const statusorsort = (data) => post({url: `${host}/activity/pushseckill/admin/update/musttoady/adv/statusorsort`, data: data});
// 删除
export const removeCard = (data) => post({url: `${host}/activity/tangram/admin/card/delete`, data: data});
//添加/编辑今日必推广告
export const addOrEdit = (data) => post({url: `${host}/activity/pushseckill/admin/addorupdate/musttoady/adv`, data: data});
//获取二级页广告位类型列表
export const getTypeList = (data) => post({url: `${host}/activity/pushseckill/admin/get/secondadv/type/list`, data: data});


