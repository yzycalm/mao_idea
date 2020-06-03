import { post, get } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 活动坑位管理列表
export const findByList = (data) => post({ url: `${host}/activity/poster/list`, data: data });
// 操作坑位
export const handlePit = (data) => post({ url: `${host}/activity/poster/change/status`, data: data });
// 新建
export const savePit = (data) => post({ url: `${host}/activity/poster/addOrChange`, data: data });
// 排序
export const handleSort = (data) => post({ url: `${host}/activity/poster/change/sequence`, data: data });
// 查询
export const findInfo = (data) => post({ url: `${host}/activity/poster/detail`, data: data });
