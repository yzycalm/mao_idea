import { post, get } from '../../axios/tools';
import { BASE_URL, ORDER_URL } from '../../axios/config'

const host = BASE_URL
const order = ORDER_URL

// 订单列表
export const getOrderList = (data) => post({ url: `${host}/order/list/page`, data: data });
// 找回订单列表
export const getBackOrderList = (data) => post({ url: `${host}/order/find/back/list`, data: data });
// 找回订单-录入
export const addBackOrder = (data) => post({ url: `${host}/order/find/back/add`, data: data });
// 找回订单-立即补单
export const bindBackOrder = (data) => post({ url: `${host}/order/find/back/bind`, data: data });
// 找回订单-更新状态
export const modifyBackOrder = (data) => post({ url: `${host}/order/find/back/modify`, data: data });
// 异步查询订单
export const findBackOrder = (data) => post({ url: `${host}/order/get/async`, data: data });
// 订单收益详情
export const getOrderDetail = (data) => post({ url: `${host}/settlement/single/order/list`, data: data });
// 根据手机获取用户信息
export const getInfoByPhone = (data) => post({ url: `${host}/account/get/by/phone`, data: data });
// 根据id获取用户信息
export const getInfoById = (data) => post({ url: `${host}/account/get/by/id`, data: data });
// 跳转商品链接
export const getProductUrl = (data) => post({ url: `${host}/product/admin/detail`, data: data})

//自营商品订单列表
export const getScalpingOrderList = (data) => post({url: `${order}/v5/order/index`,data:data})
// 自营商品订单详情
export const getScalpingOrderDetail = (id) => get({url: `${order}/v5/order/details?id=` + id})
// 关闭订单
export const closeScalpingOrder = (id) => get({url: `${order}/v5/order/close?id=` + id})
// 退款
export const refundScalpingOrder = (data) => post({url: `${order}/v5/order/refund`, data})
// 发货
export const sendScalpingOrder = (data) => post({url: `${order}/v5/order/send-logistics`, data})
// 导出
export const exportScalpingOrder = (id) => {return `${order}/v5/order/export?id=` + id}
// 导入
export const importScalpingOrder = (data) => post({url: `${order}/v5/order/import`, data})
// 明细
export const viewScalpingOrder = (id) => get({url: `${order}/v5/order/commission-detail?id=` + id})

//自营商品订单列表 4.0
export const getScalpingOrderList4 = (data) => post({url: `${host}/order/self/get/selforder/list`,data:data})
// 自营商品订单详情
export const getScalpingOrderDetail4 = (data) => post({url: `${host}/order/self/get/selforder/detail`, data})
// 关闭订单
export const closeScalpingOrder4 = (data) => post({url: `${host}/order/self/update/selforder/status`, data })
// 退款
export const refundScalpingOrder4 = (data) => post({url: `${host}/order/self/add/selforder/return`, data})
// 发货
export const sendScalpingOrder4 = (data) => post({url: `${host}/order/self/add/selforder/logistics`, data:data})
// 导出
export const exportScalpingOrder4 = (data) => post({url:`${host}/order/self/export/selforder/logistics`,data})
// 导入
export const importScalpingOrder4 = (data) => post({url: `${host}/order/self/import/selforder/logistics`, data})
// 明细
export const viewScalpingOrder4 = (data) => post({url: `${host}/settlement/self/sub/order/profit/list`,data})
