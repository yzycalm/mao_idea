import { post } from '../../axios/tools';
import {BASE_URL} from '../../axios/config'
const host = BASE_URL

//获取专场管理列表
export const getFeaturedList = (data) => post({ url: `${host}/activity/monographic/getFeaturedList`, data: data });

//批量导入
export const mFItemImport = (data) => post({ url: `${host}/activity/monographic/mFItemImport`, data: data });

//获取活动列表（用于新增专场时使用）
export const getMFItem = (data) => post({ url: `${host}/activity/monographic/getMFItem`, data: data });

//新增/更新 专场
export const addOrUpdateFeatured = (data) => post({ url: `${host}/activity/monographic/addOrUpdateFeatured`, data: data });

//获取专场详情
export const getFeaturedDetail = (data) => post({ url: `${host}/activity/monographic/getFeaturedDetail`, data: data });

//删除专场
export const removeFeaturedById = (data) => post({ url: `${host}/activity/monographic/removeFeaturedById`, data: data });

//获取专场商品列表
export const getMFProductList = (data) => post({ url: `${host}/activity/monographic/getMFProductList`, data: data });

//删除专场商品
export const removeMFProduct = (data) => post({ url: `${host}/activity/monographic/removeMFProduct`, data: data });

//添加专场商品
export const addMonographicProduct = (data) => post({ url: `${host}/activity/monographic/addMonographicProduct`, data: data });

//更新专场商品排序
export const updateMFPSort = (data) => post({ url: `${host}/activity/monographic/updateMFPSort`, data: data });

//获取专场商品详情
export const getMFPDetail = (data) => post({ url: `${host}/activity/monographic/getMFPDetail`, data: data });

//更新专场商品
export const updateMonographicProduct = (data) => post({ url: `${host}/activity/monographic/updateMonographicProduct`, data: data });

//判断商品是否重复在同一个专场
export const isDuplicate = (data) => post({ url: `${host}/activity/monographic/isDuplicate`, data: data });

//检查优惠券链接是否有效,优惠券ID回填表单。
export const coupon = (data) => post({ url: `${host}/activity/monographic/check/coupon`, data: data });







