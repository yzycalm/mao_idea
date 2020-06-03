import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 消息通知列表
export const getNoticeList = (data) => post({ url: `${host}/push/accountmsg/getNoticeMsgSearch`, data: data });
// 添加或更新
export const addOrUpdateNotice = (data) => post({ url: `${host}/push/accountmsg/saveorupdate/noticeMsg`, data: data });
// 删除置顶
export const deleteNotice = (data) => post({ url: `${host}/push/accountmsg/delortop/noticeMsg`, data: data });
