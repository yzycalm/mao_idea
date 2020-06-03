import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL

// 查询爆款推荐和必发素材列表
export const getShareList = (data) => post({ url: `${host}/activity/burstingBetirCommon/findBurstingBetirList`, data: data });

// 根据Id删除爆款推荐和必发素材
export const deleteShareItem = (data) => post({ url: `${host}/activity/burstingBetirCommon/deleteBurstingBetirById`, data: data });

// 按ID查询爆款推荐和必发素材
export const findShareDetail = (data) => post({ url: `${host}/activity/burstingBetirCommon/findByBurstingBetirId`, data: data });

// 添加/修改爆款推荐和必发素材
export const saveOrEditShreItem = (data) => post({ url: `${host}/activity/burstingBetirCommon/saveOrUpdateBurstingBetir`, data: data });


