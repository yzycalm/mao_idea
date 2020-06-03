import {post, get} from '../../axios/tools';
import {BASE_URL} from '../../axios/config'

const host = BASE_URL
// 获取列表
export const getVideoList = (data) => post({url: `${host}/admin/activity/home/live/list`, data: data});
// 删除
export const removeVideo = (data) => post({url: `${host}/admin/activity/home/live/del`, data: data});
// 保存视频
export const saveOrEditVideo = (data) => post({url: `${host}/admin/activity/home/live/save`, data: data});
// 获取视频详情
export const findVideoById = (data) => post({url: `${host}/admin/activity/home/live/get/by/id`, data: data});
// 获取类目
export const getClassify = () => get({url: `${host}/admin/activity/home/live/type/list`});
// 修改视频状态
export const editVideoStatus = (data) => post({url: `${host}/admin/activity/home/live/modify/visible`, data: data});
// 修改视频权重
export const editVideoSort = (data) => post({url: `${host}/admin/activity/home/live/modify/weight`, data: data});
