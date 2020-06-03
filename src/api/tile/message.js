import {post} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取列表
export const getMessageList = (data) => post({url: `${host}/admin/activity/home/notice/list`, data: data});
// 删除
export const removeMessage = (data) => post({url: `${host}/admin/activity/home/notice/del`, data: data});
// 保存消息
export const saveOrEditMessage = (data) => post({url: `${host}/admin/activity/home/notice/save`, data: data});
// 获取消息详情
export const findMessageById = (data) => post({url: `${host}/admin/activity/home/notice/get/by/id`, data: data});
// 获取当前样式
export const getCurrentStyle = (data) => post({url: `${host}/admin/activity/home/notice/style/get`, data: data});
// 样式设置
export const setCurrentStyle = (data) => post({url: `${host}/admin/activity/home/notice/style/save`, data: data});
// 修改公告状态
export const editMessageStatus = (data) => post({url: `${host}/admin/activity/home/notice/modify/status`, data: data});
// 修改公告权重
export const editMessageSort = (data) => post({url: `${host}/admin/activity/home/notice/modify/weight`, data: data});
