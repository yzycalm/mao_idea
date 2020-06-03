import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 横幅管理列表
export const bottomMsgList = (data) => post({ url: `${host}/push/adv/msg/page`, data: data });
// 删除
export const deleteBottom = (data) => post({ url: `${host}/push/adv/msg/delete`, data: data });
// 新建 and 编辑
export const saveoreditBottom= (data) => post({ url: `${host}/push/adv/msg/save`, data: data });
// 停止
export const stopBottom = (data) => post({ url: `${host}/push/adv/msg/stop`, data: data });
// 查询
export const findByRewardActivityIdBottom = (data) => post({ url: `${host}/push/adv/msg/get`, data: data });
