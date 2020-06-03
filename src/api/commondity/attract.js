import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
const order = ORDER_URL
// 精选商品列表
export const getGoodsList = (data) => post({ url: `${host}/activity/selectedFlows/findActivitySelectedFlowItemList`, data: data });
// 排序
export const sortGoodsList = (data) => post({ url: `${host}/activity/selectedFlows/activitySelectedFlowItemSort`, data: data });
// 批量删除/上架/下架/不通过 统一接口
export const commonHandle = (data) => post({ url: `${host}/activity/selectedFlows/activitySelectedFlowItemUpperOffShelvesOrDelete`, data: data });
// 招商结算接口
export const closeGoods = (data) => post({ url: `${host}/activity/selectedFlows/doBusinessItemSettlement`, data: data });
// 商品解析接口
export const doItemAnalyze = (data) => post({ url: `${host}/activity/selectedFlows/doItemAnalyze`, data: data });
// 添加修改精选商品
export const addGoods = (data) => post({ url: `${host}/activity/selectedFlows/saveOrUpdateActivitySelectedFlowItem`, data: data });
// 刷新优惠券
export const refreshCoupon = () => post({ url: `${host}/activity/selectedFlows/updateOverTimeItem`});
// 商品导出
export const exportGoods = (data) => post({ url: `${host}/activity/selectedFlows/selectedFlowItemExport`, data: data });
// 商品导入
export const toLeadGoods = (data) => post({ url: `${host}/activity/selectedFlows/selectedFlowItemImport`, 'Content-Type': 'multipart/x-www-form-urlencoded', data: data });
// 按ID查招商/运营商品
export const findGoods = (data) => post({ url: `${host}/activity/selectedFlows/findActivitySelectedFlowItemId`, data: data });
// 撤销
export const revocationGoods = (data) => post({ url: `${host}/activity/selectedFlows/activitySelectedFlowItemRevoke`, data: data });
// 获取商品各个状态汇总
export const collectGoods = (data) => post({ url: `${host}/activity/selectedFlows/doItemCount`, data: data });
// 自营商品列表
export const getScalpingList = (data) => post({ url: `${order}/v5/goods/index`, data: data });
// 自营商品上下架 || 批量下架
export const handleScalpingItem = (data) => post({ url: `${order}/v5/goods/sell`, data: data });
// 自营商品删除 || 批量删除
export const deleteScalpingItem = (data) => post({ url: `${order}/v5/goods/del`, data: data });
// 自营商品详情
export const getScalpingDetail = (id) => post({ url: `${order}/v5/goods/detail?id=${id}`});
// 新增自营商品
export const addScalpingItem = (data) => post({ url: `${order}/v5/goods/add`, data: data });
// 编辑自营商品
export const updateScalpingItem = (data) => post({ url: `${order}/v5/goods/update`, data: data });
// 自营商品标签
export const getScalpingLabel = () => post({ url: `${order}/v5/goods/label`});
// 商品名是否存在
export const getIsSameGoodName = (data) => post({ url: `${order}/v5/goods/name-exist`, data});

// 自营商品列表4.0
export const getScalpingList4 = (data) => post({ url: `${host}/goods/self/get/gslist`, data: data });
// 上架/下架/删除(逻辑删除)商品(支持批量)
export const handleScalpingItem4 = (data) => post({ url: `${host}/goods/self/upordownordel`, data: data });
// 自营商品详情
export const getScalpingDetail4 = (data) => post({ url: `${host}/goods/self/get/gsdetail`, data: data});
// 新增编辑自营商品
export const addScalpingItem4 = (data) => post({ url: `${host}/goods/self/addorupdategs`, data: data });

// 同步3.x精选商品到4.X
export const handleUpdateData = () => get({ url: `${host}/trans/php/goods/manage/synchro`});

//检查优惠券链接是否有效,优惠券ID回填表单。
export const coupon = (data) => post({ url: `${host}/activity/monographic/check/coupon`, data: data });
