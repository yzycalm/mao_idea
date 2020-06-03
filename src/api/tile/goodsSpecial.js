import {post} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取列表
export const getGoodsList = (data) => post({url: `${host}/home/topic/getHomeTopicList`, data: data});
// 删除
export const removeGoods = (data) => post({url: `${host}/home/topic/removeTopic`, data: data});
// 保存商品专题
export const saveOrEditGoods = (data) => post({url: `${host}/home/topic/saveOrUpdateTopic`, data: data});
// 获取商品专题详情
export const findGoodsById = (data) => post({url: `${host}/home/topic/getHomeTopic`, data: data});
// 修改商品专题状态
export const editGoodsStatus = (data) => post({url: `${host}/home/topic/changeTopicStatus`, data: data});
// 获取专题活动列表--用于关联活动
export const getGoodsActivity = (data) => post({url: `${host}/home/topic/getMFProductItem`, data: data});
// 修改权重
export const editSort = (data) => post({url: `${host}/home/topic/changeSort`, data: data});
