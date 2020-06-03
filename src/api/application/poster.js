/*
 * @Author: mul
 * @Date: 2020-04-27 16:36:12
 * @LastEditTime: 2020-04-30 15:30:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Hrz_4.0frontend\src\api\application\poster.js
 */
import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 新增或保存海报
export const handlePosterInfo = (data) => post({ url: `${host}/admin/activity/promotion/poster/save`, data: data });
// 海报列表
export const feacthPosterInfo = (data) => post({ url: `${host}/admin/activity/promotion/poster/list`, data: data });
// 删除列表
export const delPosterInfo = (data) => post({ url: `${host}/admin/activity/promotion/poster/del`, data: data });

// 修改海报排序
export const updateSequence = (data) => post({ url: `${host}/admin/activity/promotion/poster/modify/sequence`, data: data });

// 停止海报展示
export const updatePosterStatus = (data) => post({ url: `${host}/admin/activity/promotion/poster/update/status`, data: data });

