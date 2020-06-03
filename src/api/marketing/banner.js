import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 横幅管理列表
export const findRewardActivityList = (data) => post({ url: `${host}/activity/rewardActivity/findRewardActivityList`, data: data });
// 删除
export const deleteRewardActivityById = (data) => post({ url: `${host}/activity/rewardActivity/deleteRewardActivityById`, data: data });
// 新建 and 编辑
export const saveBannsaveOrUpdateRewardActivityerEntrance = (data) => post({ url: `${host}/activity/rewardActivity/saveOrUpdateRewardActivity`, data: data });
// 停止
export const stopShowRewardActivity = (data) => post({ url: `${host}/activity/rewardActivity/stopShowRewardActivity`, data: data });
// 查询
export const findByRewardActivityId = (data) => post({ url: `${host}/activity/rewardActivity/findByRewardActivityId`, data: data });
// 查询活动奖励信息
export const rewardActivityList = (data) => post({ url: `${host}/activity/rewardActivity/rewardActivityList`, data: data });
