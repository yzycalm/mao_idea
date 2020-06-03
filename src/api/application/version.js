/*
 * @Author: your name
 * @Date: 2020-04-28 11:24:01
 * @LastEditTime: 2020-04-28 16:28:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Hrz_4.0frontend\src\api\application\edition.js
 */
import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 版本列表
export const feacthVersionList = (data) => post({ url: `${host}/admin/setting/sys/version/list`, data: data });
// 新增/编辑
export const handleVersionInfo = (data) => post({ url: `${host}/admin/setting/sys/version/save`, data: data });
// 查询版本信息
export const selectVersionInfo = (data) => post({ url: `${host}/admin/setting/sys/version/find/one`, data: data });
// 查询版本号信息
export const feacthVersionCodeList = () => get({url: `${host}/admin/setting/sys/version/codes`});


