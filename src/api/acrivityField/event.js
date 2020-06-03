import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'

const host = BASE_URL

// 获取活动列表
export const getAcrivityList = (data) => post({ url: `${host}/activity/monographic/getMFList`, data: data });
// 新增/修改活动
export const addOrEditActivity = (data) => post({ url: `${host}/activity/monographic/addOrUpdateMonographicFeatured`, data: data });
// 删除
export const deleteActivity = (data) => post({ url: `${host}/activity/monographic/removeMonographicFeatured`, data: data });
// 禁用
export const stopActivity = (data) => post({ url: `${host}/activity/monographic/prohibitMonographicFeatured`, data: data });
// 查看详情
export const viewActivityDetail = (data) => post({ url: `${host}/activity/monographic/getMFDetailInfo`, data: data });
// 导出数据
export const exportActivityDetail = (data) => post({ url: `${host}/activity/monographic/export/featured/total`, data: data });
//检查优惠券链接是否有效,优惠券ID回填表单。
export const coupon = (data) => post({ url: `${host}/activity/monographic/check/coupon`, data: data });


